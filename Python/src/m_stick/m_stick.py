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
        bad = [(80,63,56),(109,127,125),(172,141,138),(153,174,171),(153,173,171),(154,174,172),(155,176,173),(158,177,175),(154,173,171),(157,175,173),(168,187,185),(161,179,177),
               (52,94,116),(49,94,124),(48,93,123),(49,92,125),(44,87,120),(43,81,114),(51,89,122),(61,93,116)  ]
        good = [(152,156,146),(21,37,36),(0,0,0),(0,5,6),(2,9,10),(1,5,6),(0,3,4),(0,0,0),(0,0,0),(92,48,57),(101,8,27),(100,7,26),(121,0,23),(123,0,25),(128,0,26),(129,0,28),(108,13,34),(130,36,56),
                (150,166,168),(157,170,173),(158,171,174),(154,170,171),(153,168,169),(150,168,169),(154,171,171),(157,177,177),(153,174,174)]
        for (x, y), siblings in self.siblings.items():
            r, g, b = self.rgbs[(x, y)]
            if ((r, g, b) in bad):
                target.append(0)  
                pixels.append([c for rgb in siblings for c in rgb])
            elif ((r, g, b) in good):
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
        pixels = []
        for (x, y), siblings in self.siblings.items():
            X = pd.DataFrame([c for rgb in siblings for c in rgb]).T
            X.columns = self.columns
            target = self.regressor.predict(X)[0]
            if target < 0.5:
                pixels.append((x, y, 1, 1, 1))
            else:
                r, g, b = self.rgbs[(x, y)]
                pixels.append((x, y, r, g, b))
        return pixels        


