#include <iostream>
#include <cmath>
#include <limits>

int main() {
    const double PI = 3.14159265358979323846;
    double bestApproximation = 0.0;
    int bestNumerator = 0;
    int bestDenominator = 0;
    double smallestDifference = std::numeric_limits<double>::max();

    for (int numerator = 1; numerator < 256; ++numerator) {
        for (int denominator = 1; denominator < 256; ++denominator) {
            double approximation = static_cast<double>(numerator) / denominator;
            double difference = std::abs(PI - approximation);

            if (difference < smallestDifference) {
                smallestDifference = difference;
                bestApproximation = approximation;
                bestNumerator = numerator;
                bestDenominator = denominator;
            }
        }
    }

    std::cout << "Best approximation of PI with integers smaller than 30: "
              << bestNumerator << "/" << bestDenominator << " = " << bestApproximation << std::endl;
    std::cout << "Difference from actual PI: " << smallestDifference << std::endl;

    return 0;
}