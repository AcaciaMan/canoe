import os
from matplotlib.pylab import rand
import statsmodels.api as sm

from m_rgb.m_rgb import M_RGB

class M_Trend:

    # singleton
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(M_Trend, cls).__new__(cls)
            return cls._instance
        return cls._instance

    def __init__(self):

        if not hasattr(self, 'initialized'):
            self.image_path = ""
            self.bFirst = True
            self.tr = None
            self.tg = None
            self.tb = None
            self.width = 0
            self.height = 0
            self.pixels = None
            self.decompose_params = {'model': 'additive', 'period':50, 'extrapolate_trend':'freq'}
            self.initialized = True

    def load_image(self, filename):
        print(self.bFirst)
        if self.bFirst:
            if filename:
                self.image_path = os.path.join('uploads', filename)
                
                mRgb = M_RGB()
                self.pixels, self.width, self.height = mRgb.m_rgb(self.image_path)

                # make 2 dimensional arrays for each color
                yr = [[] for i in range(self.height)]
                yg = [[] for i in range(self.height)]
                yb = [[] for i in range(self.height)]

                # make 2 dimensional arrays for each color
                self.tr = [[] for i in range(self.height)]
                self.tg = [[] for i in range(self.height)]
                self.tb = [[] for i in range(self.height)]

                for i in range(len(self.pixels)):
                    y = i // self.width
                    yr[y].append(self.pixels[i][0])
                    yg[y].append(self.pixels[i][1])
                    yb[y].append(self.pixels[i][2])

                # calculate the trend, seasonality and residual for each yr element
                for i in range(len(yr)):
                    self.tr[i] = sm.tsa.seasonal_decompose(yr[i], **self.decompose_params)
                    self.tg[i] = sm.tsa.seasonal_decompose(yg[i], **self.decompose_params)
                    self.tb[i] = sm.tsa.seasonal_decompose(yb[i], **self.decompose_params)

                self.bFirst = False



    
    def m_trend(self):

        for i in range(len(self.tr)):
            for j in range(len(self.tr[i].trend)):
                # random number between 0 and tr.resid[j]
                random_number = rand()*self.tr[i].resid[j]
                red_color = self.tr[i].trend[j]+self.tr[i].seasonal[j]+random_number
                if red_color > 255:
                    red_color = 255
                if red_color < 0:
                    red_color = 0
                self.pixels[i*self.width+j][0] = red_color

                random_number = rand()*self.tg[i].resid[j]
                green_color = self.tg[i].trend[j]+self.tg[i].seasonal[j]+random_number
                if green_color > 255:
                    green_color = 255
                if green_color < 0:
                    green_color = 0
                self.pixels[i*self.width+j][1] = green_color

                random_number = rand()*self.tb[i].resid[j]
                blue_color = self.tb[i].trend[j]+self.tb[i].seasonal[j]+random_number
                if blue_color > 255:
                    blue_color = 255
                if blue_color < 0:
                    blue_color = 0
                self.pixels[i*self.width+j][2] = blue_color


        return self.pixels, self.width, self.height