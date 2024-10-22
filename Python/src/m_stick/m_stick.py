import os
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

    def is_point_in_quadrilateral(self, px, py, vertices):
        def cross_product(x1, y1, x2, y2):
            return x1 * y2 - y1 * x2

        def is_point_in_triangle(px, py, v1, v2, v3):
            d1 = cross_product(px - v1[0], py - v1[1], v2[0] - v1[0], v2[1] - v1[1])
            d2 = cross_product(px - v2[0], py - v2[1], v3[0] - v2[0], v3[1] - v2[1])
            d3 = cross_product(px - v3[0], py - v3[1], v1[0] - v3[0], v1[1] - v3[1])
            has_neg = (d1 < 0) or (d2 < 0) or (d3 < 0)
            has_pos = (d1 > 0) or (d2 > 0) or (d3 > 0)
            return not (has_neg and has_pos)

        v1, v2, v3, v4 = vertices
        return is_point_in_triangle(px, py, v1, v2, v3) or is_point_in_triangle(px, py, v1, v3, v4)        

    def get_df(self):

        # append from saved file the pixels
        df = pd.read_pickle(os.path.join("c:/work/canoe_tree", 'stick_13_0_2_5.pkl'))
        s='stick_14_0_1_8.pkl'
        df1 = pd.read_pickle(os.path.join("c:/work/canoe_tree", s))
        df = pd.concat([df, df1], ignore_index=True)


        # create a DataFrame for some pixels
        # the DataFrame will have columns r0, g0, b0, r1, g1, b1, ..., r56, g56, b56 for some pixel (x, y) from the self.siblings
        pixels = []  # noqa: F841
        target = []  # noqa: F841
        
        # Define the vertices of the quadrilateral
        vertices = [(2, 2), (8, 3), (4, 283), (10, 283)]  # noqa: F841

        # good is between x=0, y=3 and x=11, y=3 and x=11, y=391 and x=22, y=391
        # bad is everything else
        good = []  # noqa: F841
        bad = []  # noqa: F841
        s='''
        for i in range(len(self.pixels)):
            x, y, r, g, b = self.pixels[i]
            if self.is_point_in_quadrilateral(x, y, vertices):
                good.append((x, y))
            else:
                # append at random each 10th pixel
                if i % 7 == 0:
                    bad.append((x, y))
        

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
        df.to_pickle(os.path.join("c:/work/canoe_tree", "stick_13_0_2_5.pkl"))
        '''

        self.df = df


    def train_model_regressor(self):
        # train a regressor model

        X = self.df[self.columns]
        y = self.df["target"]

        self.regressor = DecisionTreeRegressor(random_state=42, min_samples_leaf=5)
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


