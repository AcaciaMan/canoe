import potrace
from PIL import Image
import svgwrite
import os

# Define the absolute path to the image
image_path = os.path.join(os.path.dirname(__file__), "water.png")

# Load the PNG image
image = Image.open(image_path).convert("L")  # Convert to grayscale

# Convert the image to a bitmap
bitmap = potrace.Bitmap(image)

# Trace the bitmap to a path
path = bitmap.trace()

# Create an SVG drawing
dwg = svgwrite.Drawing("water_stylized.svg", profile="tiny")

# Function to convert a curve to SVG path data
def curve_to_svg_path(curve):
    path_data = []
    start_point = curve.start_point
    path_data.append(f"M {start_point.x} {start_point.y}")
    for segment in curve.segments:
        if segment.is_corner:
            path_data.append(f"L {segment.end_point.x} {segment.end_point.y}")
        else:
            path_data.append(f"C {segment.c1.x} {segment.c1.y} {segment.c2.x} {segment.c2.y} {segment.end_point.x} {segment.end_point.y}")
    path_data.append("Z")
    return " ".join(path_data)

# Add the traced path to the SVG drawing
for curve in path:
    svg_path_data = curve_to_svg_path(curve)
    dwg.add(dwg.path(d=svg_path_data, fill="blue"))

# Save the SVG file
dwg.save()

print("Stylized SVG file created successfully.")