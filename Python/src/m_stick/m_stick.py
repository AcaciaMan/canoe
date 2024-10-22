import pandas as pd
from sklearn.tree import DecisionTreeRegressor

class M_Stick:
    def __init__(self):
        self.image_path = ""
        self.pixels = []
        self.width = 0
        self.height = 0
        self.rgbs = {}
        self.siblings = {}
        self.df = None
        self.columns = [f"r{i}" for i in range(171)]
        self.regressor = DecisionTreeRegressor(random_state=42)

    
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
                    self.rgbs[(x, y)] = (int(r), int(g), int(b))
                    x += 1
                y += 1
                width = x
                height = y
                x = 0

        self.pixels = pixels
        self.width = width
        self.height = height


        print(f"Image size: {width}x{height}")

        return pixels, width, height
    
    def get_siblings(self):
        # get the siblings of each pixel
        for i in range(len(self.pixels)):
            x, y, r, g, b = self.pixels[i]
            siblings = [(r, g, b)]
            for k in range(1, 8):
                for j in range(1, 9):
                    if j == 1:
                        x1, y1 = x-k, y-k
                    if j == 2:
                        x1, y1 = x, y-k
                    if j == 3:
                        x1, y1 = x+k, y-k
                    if j == 4:
                        x1, y1 = x-k, y
                    if j == 5:
                        x1, y1 = x+k, y
                    if j == 6:
                        x1, y1 = x-k, y+k
                    if j == 7:
                        x1, y1 = x, y+k
                    if j == 8:
                        x1, y1 = x+k, y+k
                    try:
                        siblings.append(self.rgbs[(x1, y1)])
                    except KeyError:
                        siblings.append((1, 1, 1))

            self.siblings[(x, y)] = siblings

    def get_df(self):
        # create a DataFrame for some pixels
        # the DataFrame will have columns r0, g0, b0, r1, g1, b1, ..., r56, g56, b56 for some pixel (x, y) from the self.siblings
        pixels = []
        target = []
        #bad = [(15,26),(16,26),(17,26),(18,26),(19,26),(6,328),(7,328),(8,328),(9,328),(10,328),(14,21),(15,21),(16,21),(2,172),(3,172),(4,172),(5,172),(17,85),(18,85),(19,85)  ]
        bad = [(0,31),(1,31),(2,31),(10,31),(11,31),(12,31),(13,31),(14,31),(15,31),(16,31),(17,31),(18,31),(19,31),(20,31),(21,31),(22,31),(23,31),
               (0,90),(1,90),(2,90),(3,90),(15,90),(16,90),(17,90),(18,90),(19,90),(20,90),(21,90),(22,90),(23,90),
               (0,308),(1,308),(2,308),(3,308),(4,308),(5,308),(6,308),(7,308),(8,308),(19,308),(20,308),(21,308),(22,308),(23,308)
               ]
        #bad = []
        good = [(3,31),(4,31),(5,31),(6,31),(7,31),(8,31),(9,31),
                (4,90),(5,90),(6,90),(7,90),(8,90),(9,90),(10,90),(11,90),(12,90),(13,90),(14,90),
                (9,308),(10,308),(11,308),(12,308),(13,308),(14,308),(15,308),(16,308),(17,308),(18,308)
                ]

        for p in bad:
            x, y = p
            siblings = self.siblings[(x, y)]
            target.append(0)  
            pixels.append([c for rgb in siblings for c in rgb])

        for p in good:
            x, y = p
            siblings = self.siblings[(x, y)]
            target.append(1)  
            pixels.append([c for rgb in siblings for c in rgb])

        df = pd.DataFrame(pixels, columns=self.columns)
        df["target"] = target  

        self.df = df

    def train_model_regressor(self):
        # train a regressor model

        X = self.df[self.columns]
        y = self.df["target"]

        self.regressor = DecisionTreeRegressor(random_state=42)
        self.regressor.fit(X, y)


    def predict(self):
        # predict the target for the siblings of each pixel
        sibpixels = []
        pixels = []
        for (x, y), siblings in self.siblings.items():
            sibpixels.append([c for rgb in siblings for c in rgb])

        X = pd.DataFrame(sibpixels, columns=self.columns)
        target = self.regressor.predict(X)
        for i in range(len(target)):
            if target[i] < 0.5:
                x, y, r, g, b = self.pixels[i]
                pixels.append((x, y, 1, 1, 1))
            else:
                x, y, r, g, b = self.pixels[i]
                pixels.append((x, y, r, g, b))

        return pixels        


