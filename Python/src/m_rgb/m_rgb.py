from PIL import Image

# create class M_RGB
class M_RGB:
    def __init__(self):
        self.image_path = ""
    
    def m_rgb(self, image_path):
        self.image_path = image_path
        image = Image.open(self.image_path).convert("RGB")

        # Get the pixel data
        pixels = image.load()

        # Get the dimensions of the image
        width, height = image.size
        print(f"Image size: {width}x{height}")

        # Iterate over the pixels
        #for y in range(height):
        #    for x in range(width):
        #        r, g, b = pixels[x, y]
                #print(f"Pixel at ({x}, {y}): R={r}, G={g}, B={b}")

        # return array of pixels, r, g, b
        aPixels = []
        for y in range(height):
            for x in range(width):
                r, g, b = pixels[x, y]
                aPixels.append([r, g, b])

        return aPixels, width, height        
                
