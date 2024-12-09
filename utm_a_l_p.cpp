#include <iostream>
#include <fstream>
#include <vector>
#include <cmath>
#include <algorithm>
#include "json.hpp" // Include the nlohmann/json header
#include <chrono>
#include "common.hpp"
#include <set>

using json = nlohmann::json;

const double EARTH_RADIUS = 6371.0; // Earth radius in kilometers
const double EARTH_RADIUS_M = 6371009;

//const double WGS84_A = 6378137.0; // Major axis
const double WGS84_A = 6371009.0; // Major axis
const double WGS84_E2 = 0.00669437999014; // Eccentricity squared

double toRadians(double degree) {
    return degree * M_PI / 180.0;
}

UTMCoordinate wgs84ToUTM(const Coordinate& coord) {
    UTMCoordinate utm;

    // Determine the UTM zone
    utm.zone = static_cast<int>((coord.longitude + 180) / 6) + 1;

    // Determine the hemisphere
    utm.hemisphere = (coord.latitude >= 0) ? 'N' : 'S';

    // Calculate the central meridian of the zone
    double lonOrigin = (utm.zone - 1) * 6 - 180 + 3;
    double lonOriginRad = toRadians(lonOrigin);

    // Convert latitude and longitude to radians
    double latRad = toRadians(coord.latitude);
    double lonRad = toRadians(coord.longitude);

    // Calculate UTM coordinates
    double N = WGS84_A / sqrt(1 - WGS84_E2 * sin(latRad) * sin(latRad));
    double T = tan(latRad) * tan(latRad);
    double C = WGS84_E2 / (1 - WGS84_E2) * cos(latRad) * cos(latRad);
    double A = cos(latRad) * (lonRad - lonOriginRad);

    double M = WGS84_A * ((1 - WGS84_E2 / 4 - 3 * WGS84_E2 * WGS84_E2 / 64 - 5 * WGS84_E2 * WGS84_E2 * WGS84_E2 / 256) * latRad
        - (3 * WGS84_E2 / 8 + 3 * WGS84_E2 * WGS84_E2 / 32 + 45 * WGS84_E2 * WGS84_E2 * WGS84_E2 / 1024) * sin(2 * latRad)
        + (15 * WGS84_E2 * WGS84_E2 / 256 + 45 * WGS84_E2 * WGS84_E2 * WGS84_E2 / 1024) * sin(4 * latRad)
        - (35 * WGS84_E2 * WGS84_E2 * WGS84_E2 / 3072) * sin(6 * latRad));

    utm.easting = (N * (A + (1 - T + C) * A * A * A / 6
        + (5 - 18 * T + T * T + 72 * C - 58 * WGS84_E2 / (1 - WGS84_E2)) * A * A * A * A * A / 120) + 500000.0);

    utm.northing = (N * (A * tan(latRad) / 2 + (5 - T + 9 * C + 4 * C * C) * A * A * A * tan(latRad) / 24
        + (61 - 58 * T + T * T + 600 * C - 330 * WGS84_E2 / (1 - WGS84_E2)) * A * A * A * A * A * tan(latRad) / 720) + M);

    if (coord.latitude < 0) {
        utm.northing += 10000000.0; // Add 10,000,000 meters for southern hemisphere
    }

    return utm;
}


double euclideanDistance(const UTMCoordinate& coord1, const UTMCoordinate& coord2) {
    try
    {
        double dx = coord1.easting - coord2.easting;
    double dy = coord1.northing - coord2.northing;
    
    // Calculate the Euclidean distance between two UTM coordinates in kilometers
  if (coord1.zone != coord2.zone)
  {
     return 0.0;
  }
  

    return sqrt(dx * dx + dy * dy) / 1000.0;

    }
    catch(const std::exception& e)
    {
        std::cerr << e.what() << '\n';
        return -1;
    }

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

                } else {
                    for (const auto& coord : ring) {
                        if (coord.is_array() && coord.size() == 2) {
                            Coordinate c;
                            c.longitude = coord[0].get<double>();
                            c.latitude = coord[1].get<double>();
                            f.coordinates.push_back(c);
                        } else {
                            for (const auto& point : coord) {
                                if (point.is_array() && point.size() == 2) {
                                    Coordinate c;
                                    c.longitude = point[0].get<double>();
                                    c.latitude = point[1].get<double>();
                                    f.coordinates.push_back(c);
                                }
                            }
                        }
                    }
                }
            }
        }

        features.push_back(f);
    }

    return features;
}

double calculateTriangleArea(double a, double b, double c) {
    if(a + b <= c || a + c <= b || b + c <= a) {
        return 0.0;
    }
    double s = (a + b + c) / 2;
    return sqrt(s * (s - a) * (s - b) * (s - c));
}

double calculateSignedArea(const std::vector<UTMCoordinate>& coordinates) {
    double area = 0.0;
    size_t n = coordinates.size();

    for (size_t i = 0; i < n; ++i) {
        const UTMCoordinate& p1 = coordinates[i];
        const UTMCoordinate& p2 = coordinates[(i + 1) % n];
        if (p1.zone == p2.zone) {
            area += p1.easting * p2.northing - p2.easting * p1.northing;
        } else {
            // Convert both coordinates to a common zone
            double centralMeridian1 = (p1.zone - 1) * 6 - 180 + 3;
            double centralMeridian2 = (p2.zone - 1) * 6 - 180 + 3;
            double lonDiff = toRadians(centralMeridian2 - centralMeridian1);

            double eastingOffset = lonDiff * EARTH_RADIUS_M * cos(toRadians(p1.northing / EARTH_RADIUS_M));
            if (p1.zone < p2.zone) {
                area += (p1.easting + eastingOffset) * p2.northing - p2.easting * p1.northing;
            } else {
                area += p1.easting * p2.northing - (p2.easting + eastingOffset) * p1.northing;
            }
        }
    }

    return area / 2.0;
}

void calculatePerimetersAndAreas(std::vector<Feature>& features) {
    for (auto& feature : features) {
        std::cout << "Feature Name: " << feature.name << std::endl;
        double perimeter = 0.0;
        double area = 0.0;
                double width = 0.0;

        for (size_t i = 0; i < feature.utmCoordinates.size(); ++i) {
            const UTMCoordinate& coord1 = feature.utmCoordinates[i];
            const UTMCoordinate& coord2 = feature.utmCoordinates[(i + 1) % feature.utmCoordinates.size()];
            perimeter += euclideanDistance(coord1, coord2);
        }


                // Calculate the width (maximum distance between any two points)
        for (size_t i = 0; i < feature.utmCoordinates.size(); ++i) {
            for (size_t j = i + 1; j < feature.utmCoordinates.size(); ++j) {
                double distance = euclideanDistance(feature.utmCoordinates[i], feature.utmCoordinates[j]);
                if (distance > width) {
                    width = distance;
                }
            }
        }

        feature.width = width;

        feature.perimeter = perimeter;
        feature.area = area;

        // get feature midpoint in utm coordinates with correct zone
        if(feature.utmCoordinates.size() == 0) {
            continue;
        }
        UTMCoordinate midPoint = feature.utmCoordinates[0];


        area = 0.0;
        for (size_t i = 0; i < feature.utmCoordinates.size(); ++i) {
            const UTMCoordinate& coord1 = feature.utmCoordinates[i];
            const UTMCoordinate& coord2 = feature.utmCoordinates[(i + 1) % feature.utmCoordinates.size()];

            //area += calculateTriangleArea(euclideanDistance(coord1, midPoint), euclideanDistance(coord2, midPoint), euclideanDistance(coord1, coord2));

            // add the area of the triangle formed by the midpoint and the two coordinates only if coordinates form counter clockwise triangle

            if (calculateSignedArea({coord1, coord2, midPoint}) < 0) {
                area += calculateTriangleArea(euclideanDistance(coord1, midPoint), euclideanDistance(coord2, midPoint), euclideanDistance(coord1, coord2));
            } else {
                area -= calculateTriangleArea(euclideanDistance(coord1, midPoint), euclideanDistance(coord2, midPoint), euclideanDistance(coord1, coord2));
            }

        }

        feature.area = area;


    }
}

int main() {
    try {
    // Load features from a JSON file
    std::vector<Feature> features = loadFeaturesFromJson("lv.json");

    // Print out the total count of loaded coordinates
    size_t totalCoordinates = 0;
    for (const auto& feature : features) {
        totalCoordinates += feature.coordinates.size();
    }
    std::cout << "Total count of loaded coordinates: " << totalCoordinates << std::endl;


    // Convert WGS84 coordinates to UTM coordinates
    for (auto& feature : features) {
        for (const auto& coord : feature.coordinates) {
            feature.utmCoordinates.push_back(wgs84ToUTM(coord));
        }
    }
    std::cout << "Total count of converted UTM coordinates: " << totalCoordinates << std::endl;

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
    std::cout << "Total count of sorted features: " << features.size() << std::endl;

    // Print out the names of the features with their perimeters and areas
    for (const auto& feature : features) {
        std::cout << "Feature Name: " << feature.name << ", Perimeter: " << feature.perimeter << " km, Area: " << feature.area << " km^2 " <<  feature.width << " width " << std::endl;
    }
    } catch (const std::exception& e) {
        std::cerr << e.what() << std::endl;
    }

    return 0;
}