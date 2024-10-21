class M_Stick:
    def __init__(self):
        self.image_path = ""
    
    def m_stick(self, image_path):
        self.image_path = image_path

        #read from text file and convert to array of pixels
        # text file row is in format (r,g,b),(r,g,b),...,(r,g,b), where r,g,b are integers 
        with open(self.image_path) as f:
            lines = f.readlines()
            pixels = []
            x = 0
            y = 0
            width = 0
            height = 0
            for line in lines:
                line = line.strip()
                line = line[1:-2]
                aPixels = line.split("),(")
                for aPixel in aPixels:
                    r, g, b = aPixel.split(",")
                    pixels.append((x, y, int(r), int(g), int(b)))
                    x += 1
                y += 1
                width = x
                height = y
                x = 0


        print(f"Image size: {width}x{height}")

        return pixels, width, height
