import tkinter as tk
from tkinter import filedialog

import pandas as pd
import os

from m_rgb.m_rgb import M_RGB
from PIL import Image, ImageTk

class RGBApp:
    def __init__(self, root):
        self.root = root
        self.root.title("RGB Pixel Viewer")
        
        self.m_rgb = M_RGB()
        
        self.label = tk.Label(root, text="Enter Image Path:")
        self.label.pack()

        self.entry = tk.Entry(root, width=50)
        self.entry.pack()

        self.browse_button = tk.Button(root, text="Browse", command=self.browse_image)
        self.browse_button.pack()

        self.process_button = tk.Button(root, text="Process Image", command=self.process_image)
        self.process_button.pack()

        self.canvas = tk.Canvas(root, width=1800, height=600)
        self.canvas.pack()

    def browse_image(self):
        file_path = filedialog.askopenfilename(filetypes=[("Image files", "*.png;*.jpg;*.jpeg")])
        self.entry.delete(0, tk.END)
        self.entry.insert(0, file_path)

    def process_image(self):
        image_path = self.entry.get()
        if image_path:
            pixels, width, height = self.m_rgb.m_rgb(image_path)
            print("Image processed successfully.", len(pixels))
            self.display_pixels(pixels, width, height)
            self.save_pixels(pixels)

    def display_pixels(self, pixels, width, height):
        self.canvas.delete("all")
        # Create a new image from the RGB pixels array
        image = Image.new("RGB", (width, height))
        for pixel in pixels:
            x, y, r, g, b = pixel
            image.putpixel((x, y), (r, g, b))
        
        # Convert the PIL image to a PhotoImage object
        photo = ImageTk.PhotoImage(image)
        
        # Display the PhotoImage object on the canvas
        self.canvas.create_image(0, 0, anchor=tk.NW, image=photo)
        self.canvas.image = photo  # Keep a reference to avoid garbage collection

    # create a pandas dataframe from the pixels array and save it to a pickle file in c:/work/photo folder
    def save_pixels(self, pixels):

        
        df = pd.DataFrame(pixels, columns=["x", "y", "r", "g", "b"])
        df.to_pickle(os.path.join("c:/work/photo", "pixels.pkl"))
        print("Pixels saved to pixels.pkl successfully.")   


if __name__ == "__main__":
    root = tk.Tk()
    app = RGBApp(root)
    root.mainloop()