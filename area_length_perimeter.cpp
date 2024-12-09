#include <iostream>
#include <fstream>
#include <vector>
#include <cmath>
#include <algorithm>
#include "json.hpp" // Include the nlohmann/json header
#include <chrono>
#include "common.hpp"

using json = nlohmann::json;

const double EARTH_RADIUS = 6371.0; // Earth radius in kilometers
const double EARTH_RADIUS_M = 6371009;

double toRadians(double degree) {
    return degree * M_PI / 180.0;
}

double haversineDistance(const Coordinate& coord1, const Coordinate& coord2) {
    double lat1 = toRadians(coord1.latitude);
    double lon1 = toRadians(coord1.longitude);
    double lat2 = toRadians(coord2.latitude);
    double lon2 = toRadians(coord2.longitude);

    double dlat = lat2 - lat1;
    double dlon = lon2 - lon1;

    double a = sin(dlat / 2) * sin(dlat / 2) +
               cos(lat1) * cos(lat2) * sin(dlon / 2) * sin(dlon / 2);
    double c = 2 * atan2(sqrt(a), sqrt(1 - a));

    return EARTH_RADIUS * c;
}

double calculateSphericalExcess(const Coordinate& coord1, const Coordinate& coord2, const Coordinate& coord3) {
    double lat1 = toRadians(coord1.latitude);
    double lon1 = toRadians(coord1.longitude);
    double lat2 = toRadians(coord2.latitude);
    double lon2 = toRadians(coord2.longitude);
    double lat3 = toRadians(coord3.latitude);
    double lon3 = toRadians(coord3.longitude);

    double a = haversineDistance(coord1, coord2) / EARTH_RADIUS;
    double b = haversineDistance(coord2, coord3) / EARTH_RADIUS;
    double c = haversineDistance(coord3, coord1) / EARTH_RADIUS;

    double s = (a + b + c) / 2;
    double tanE4 = tan(s / 2) * tan((s - a) / 2) * tan((s - b) / 2) * tan((s - c) / 2);
    double excess = 4 * atan(sqrt(fabs(tanE4)));

    return excess;
}

std::vector<Feature> loadFeaturesFromJson(const std::string& filename) {
    std::ifstream file(filename);
    json root;
    file >> root;

    std::vector<Feature> features;
    for (const auto& feature : root["features"]) {
        Feature f;
        if (feature["properties"].contains("name")) {
            f.name = feature["properties"]["name"].get<std::string>();
        } else {
            f.name = "Unnamed Feature";
        }

        for (const auto& polygon : feature["geometry"]["coordinates"]) {
            for (const auto& ring : polygon) {
                if (ring.is_array() && ring.size() == 2) {
                    Coordinate c;
                    c.longitude = ring[0].get<double>();
                    c.latitude = ring[1].get<double>();
                    f.coordinates.push_back(c);

                }
            }
        }

        features.push_back(f);
    }

    return features;
}

double calculateArea(const std::vector<Coordinate>& coordinates) {
    double area = 0.0;
    size_t n = coordinates.size();
    for (size_t i = 0; i < n; ++i) {
        double lat1 = toRadians(coordinates[i].latitude);
        double lon1 = toRadians(coordinates[i].longitude);
        double lat2 = toRadians(coordinates[(i + 1) % n].latitude);
        double lon2 = toRadians(coordinates[(i + 1) % n].longitude);

        area += (lon2 - lon1) * (2 + sin(lat1) + sin(lat2));
    }
    area = fabs(area) * EARTH_RADIUS * EARTH_RADIUS / 2.0;
    return area;
}

double PolarTriangleArea(double tan1, double lng1, double tan2, double lng2)
{
    double deltaLng = lng1 - lng2;
    double t = tan1 * tan2;
    return 2 * atan2(t * sin(deltaLng), 1 + t * cos(deltaLng));
}

double ComputeSignedAreaRad(std::vector<Coordinate> path, double radius)
{
    int size = path.size();
    if (size < 3) { return 0; }
    double total = 0;
    Coordinate prev = path[size - 1];
    double prevTanLat = tan((M_PI / 2 - toRadians(prev.latitude)) / 2);
    double prevLng = toRadians(prev.longitude);

    for (const Coordinate& point : path)
    {
        double tanLat = tan((M_PI / 2 - toRadians(point.latitude)) / 2);
        double lng = toRadians(point.longitude);
        total += PolarTriangleArea(tanLat, lng, prevTanLat, prevLng);
        prevTanLat = tanLat;
        prevLng = lng;
    }
    return total * (radius * radius);
}

double ComputeSignedArea(std::vector<Coordinate> path)
{
    return ComputeSignedAreaRad(path, EARTH_RADIUS_M);
}

void findMinMaxLatLon(const std::vector<Coordinate>& coordinates, double& minLat, double& maxLat, double& minLon, double& maxLon,
    double& minLatLon, double& maxLatLon, double& minLonLat, double& maxLonLat  ) {
    if (coordinates.empty()) {
        return;
    }

    minLat = maxLat = minLonLat = maxLonLat = coordinates[0].latitude;
    minLon = maxLon = minLatLon = maxLatLon = coordinates[0].longitude;

    for (const auto& coord : coordinates) {
        if (coord.latitude < minLat) {
            minLat = coord.latitude;
            minLatLon = coord.longitude;
        }
        if (coord.latitude > maxLat) {
            maxLat = coord.latitude;
            maxLatLon = coord.longitude;
        }
        if (coord.longitude < minLon) {
            minLon = coord.longitude;
            minLonLat = coord.latitude;
        }
        if (coord.longitude > maxLon) {
            maxLon = coord.longitude;
            maxLonLat = coord.latitude;
        }
    }
}

double calculateTriangleArea(double a, double b, double c) {
    double s = (a + b + c) / 2;
    return sqrt(s * (s - a) * (s - b) * (s - c));
}

double calculateSignedArea(const std::vector<Coordinate>& coordinates) {
    double area = 0.0;
    size_t n = coordinates.size();
    for (size_t i = 0; i < n; ++i) {
        const Coordinate& coord1 = coordinates[i];
        const Coordinate& coord2 = coordinates[(i + 1) % n];
        area += (coord2.longitude - coord1.longitude) * (coord2.latitude + coord1.latitude);
    }
    return area / 2.0;
}

void calculatePerimetersAndAreas(std::vector<Feature>& features) {
    for (auto& feature : features) {
        double perimeter = 0.0;
        double area = 0.0;
                double width = 0.0;

        for (size_t i = 0; i < feature.coordinates.size(); ++i) {
            const Coordinate& coord1 = feature.coordinates[i];
            const Coordinate& coord2 = feature.coordinates[(i + 1) % feature.coordinates.size()];
            perimeter += haversineDistance(coord1, coord2);

/*
            if (i < feature.coordinates.size() - 2) {
                const Coordinate& coord3 = feature.coordinates[(i + 2) % feature.coordinates.size()];
                area += calculateSphericalExcess(coord1, coord2, coord3);
            }
*/            
        }


                // Calculate the width (maximum distance between any two points)
        for (size_t i = 0; i < feature.coordinates.size(); ++i) {
            for (size_t j = i + 1; j < feature.coordinates.size(); ++j) {
                double distance = haversineDistance(feature.coordinates[i], feature.coordinates[j]);
                if (distance > width) {
                    width = distance;
                }
            }
        }

        feature.width = width;

        feature.perimeter = perimeter;

        // get feature width and length
        findMinMaxLatLon(feature.coordinates, feature.minLat, feature.maxLat, feature.minLon, feature.maxLon, 
           feature.minLatLon, feature.maxLatLon, feature.minLonLat, feature.maxLonLat);

        const Coordinate& midPoint = { (feature.minLat + feature.maxLat) / 2, (feature.minLon + feature.maxLon) / 2 };

        area = 0.0;
        for (size_t i = 0; i < feature.coordinates.size(); ++i) {
            const Coordinate& coord1 = feature.coordinates[i];
            const Coordinate& coord2 = feature.coordinates[(i + 1) % feature.coordinates.size()];

            // add the area of the triangle formed by the midpoint and the two coordinates only if coordinates form counter clockwise triangle
            if (calculateSignedArea({coord1, coord2, midPoint}) > 0) {
                area += calculateTriangleArea(haversineDistance(coord1, midPoint), haversineDistance(coord2, midPoint), haversineDistance(coord1, coord2));
            } else {
                area -= calculateTriangleArea(haversineDistance(coord1, midPoint), haversineDistance(coord2, midPoint), haversineDistance(coord1, coord2));
            }
        }

        feature.area = area;


    }
}

int main() {
    // Load features from a JSON file
    std::vector<Feature> features = loadFeaturesFromJson("lv.json");

    // Print out the total count of loaded coordinates
    size_t totalCoordinates = 0;
    for (const auto& feature : features) {
        totalCoordinates += feature.coordinates.size();
    }
    std::cout << "Total count of loaded coordinates: " << totalCoordinates << std::endl;

    // Benchmark the calculatePerimetersAndAreas function
    auto start = std::chrono::high_resolution_clock::now();
    calculatePerimetersAndAreas(features);
    auto end = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double> duration = end - start;
    std::cout << "Time taken to calculate perimeters and areas: " << duration.count() << " seconds" << std::endl;


    // Sort features by perimeter in descending order
    std::sort(features.begin(), features.end(), [](const Feature& a, const Feature& b) {
        return a.area > b.area;
    });

    // Print out the names of the features with their perimeters and areas
    for (const auto& feature : features) {
        std::cout << "Feature Name: " << feature.name << ", Perimeter: " << feature.perimeter << " km, Area: " << feature.area << " km^2 " <<  feature.width << " width " << std::endl;
    }

    return 0;
}