#include <iostream>
#include <fstream>
#include <vector>
#include <cmath>
#include <algorithm>
#include "json.hpp" // Include the nlohmann/json header
#include <chrono>

using json = nlohmann::json;

struct Coordinate {
    double latitude;
    double longitude;
};

struct Feature {
    std::string name;
    std::vector<Coordinate> coordinates;
    double perimeter;
    double area;
    double width;
};

const double EARTH_RADIUS = 6371.0; // Earth radius in kilometers

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

void calculatePerimetersAndAreas(std::vector<Feature>& features) {
    for (auto& feature : features) {
        double perimeter = 0.0;
        double area = 0.0;
                double width = 0.0;

        for (size_t i = 0; i < feature.coordinates.size(); ++i) {
            const Coordinate& coord1 = feature.coordinates[i];
            const Coordinate& coord2 = feature.coordinates[(i + 1) % feature.coordinates.size()];
            perimeter += haversineDistance(coord1, coord2);

            if (i < feature.coordinates.size() - 2) {
                const Coordinate& coord3 = feature.coordinates[(i + 2) % feature.coordinates.size()];
                area += calculateSphericalExcess(coord1, coord2, coord3);
            }
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

        feature.perimeter = perimeter;
        feature.area = fabs(area) * EARTH_RADIUS * EARTH_RADIUS;
        feature.width = width;
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