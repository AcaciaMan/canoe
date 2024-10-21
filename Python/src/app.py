from flask import Flask, request, jsonify, render_template
from PIL import Image
import pandas as pd
import os

from m_rgb.m_dec_tree import M_DecTree

app = Flask(__name__)

class M_RGB:
    def __init__(self):
        self.image_path = ""
        self.mDecTree = M_DecTree()
    
    def m_rgb(self, image_path):
        self.image_path = image_path
        image = Image.open(self.image_path).convert("RGB")

        # Get the pixel data
        pixels = image.load()

        # Get the dimensions of the image
        width, height = image.size
        print(f"Image size: {width}x{height}")

        # Create a dictionary with tuple keys (x, y) and values (r, g, b)
        pixel_dict = {}
        for y in range(height):
            for x in range(width):
                r, g, b = pixels[x, y]
                pixel_dict[(x, y)] = (r, g, b)

        return pixel_dict, width, height

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process_image', methods=['POST'])
def process_image():
    file = request.files['image']
    if file:
        image_path = os.path.join('uploads', file.filename)
        file.save(image_path)
        
        m_rgb = M_RGB()
        pixel_dict, width, height = m_rgb.m_rgb(image_path)
        
        # Convert the dictionary to a list of tuples
        pixels = [(x, y, r, g, b) for (x, y), (r, g, b) in pixel_dict.items()]
        
        # Create a DataFrame from the list of tuples
        df = pd.DataFrame(pixels, columns=["x", "y", "r", "g", "b"])

        # Convert columns to appropriate data types
        df["x"] = df["x"].astype("int32")
        df["y"] = df["y"].astype("int32")
        df["r"] = df["r"].astype("uint8")
        df["g"] = df["g"].astype("uint8")
        df["b"] = df["b"].astype("uint8")

        # Set (x, y) as the multi-index
        df.set_index(["x", "y"], inplace=True)

        df.to_pickle(os.path.join("c:/work/photo", "pixels.pkl"))
        print("Pixels saved to pixels.pkl successfully.")

        # Calculate the differences between adjacent pixels
        m_rgb.mDecTree.calc_rgb_diffs(df)
        m_rgb.mDecTree.print_out_max_diffs()

        return jsonify({"message": "Image processed successfully", "width": width, "height": height})
    return jsonify({"message": "No file uploaded"}), 400

if __name__ == "__main__":
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(debug=True)