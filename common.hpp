#ifndef COMMON_HPP
#define COMMON_HPP

#include <string>
#include <vector>

struct Coordinate {
    double latitude;
    double longitude;
};

struct UTMCoordinate {
    double easting;
    double northing;
    int zone;
    char hemisphere;
};

struct Feature {
    std::string name;
    std::vector<Coordinate> coordinates;
    std::vector<UTMCoordinate> utmCoordinates;
    double minLat;
    double minLatLon;
    double maxLat;
    double maxLatLon;
    double minLon;
    double minLonLat;
    double maxLon;
    double maxLonLat;
    double perimeter;
    double area;
    double width;
    double length;
};

#endif // COMMON_HPP