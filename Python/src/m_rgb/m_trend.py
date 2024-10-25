import os
from matplotlib.pylab import rand
import statsmodels.api as sm

from m_rgb.m_rgb import M_RGB
import numpy as np

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
            # byte array of image rgb
            self.image = None



            self.decompose_params = {'model': 'additive', 'period':50, 'extrapolate_trend':'freq'}
            self.initialized = True

    def load_image(self, filename):
        print(self.bFirst)
        if self.bFirst:
            if filename:
                self.image_path = os.path.join('uploads', filename)
                
                mRgb = M_RGB()
                self.pixels, self.width, self.height = mRgb.m_rgb(self.image_path)

                # make byte array of image rgb
                self.image = np.zeros(self.width * self.height * 3, dtype=np.uint8)

                # make 2 dimensional arrays for each color
                yr = [[] for i in range(self.height)]
                yg = [[] for i in range(self.height)]
                yb = [[] for i in range(self.height)]

                # make 3 dimensional arrays for each color
                self.tr = np.zeros((self.height, self.width, 3))
                self.tg = np.zeros((self.height, self.width, 3))
                self.tb = np.zeros((self.height, self.width, 3))

                for i in range(len(self.pixels)):
                    y = i // self.width
                    yr[y].append(self.pixels[i][0])
                    yg[y].append(self.pixels[i][1])
                    yb[y].append(self.pixels[i][2])

                # calculate the trend, seasonality and residual for each yr element
                k=0
                for i in range(len(yr)):
                    tr = sm.tsa.seasonal_decompose(yr[i], **self.decompose_params)
                    tg = sm.tsa.seasonal_decompose(yg[i], **self.decompose_params)
                    tb = sm.tsa.seasonal_decompose(yb[i], **self.decompose_params)

                    for j in range(self.width):
                        self.tr[i,j,0  ] = tr.trend[j]
                        self.tg[i,j,0 ] = tg.trend[j]
                        self.tb[i,j,0 ] = tb.trend[j]

                        self.tr[i,j,1  ] = tr.seasonal[j]
                        self.tg[i,j,1  ] = tg.seasonal[j]
                        self.tb[i,j,1  ] = tb.seasonal[j]

                        self.tr[i,j,2  ] = tr.resid[j]
                        self.tg[i,j,2  ] = tg.resid[j]
                        self.tb[i,j,2  ] = tb.resid[j]

                        k += 1

                self.bFirst = False



    
    def m_trend(self):

        k=0
        for i in range(self.height):
            for j in range(self.width):

                self.image[k] = self.tr[i,j,0] + self.tr[i,j,1]

                k += 1
                self.image[k] = self.tg[i,j,0] + self.tg[i,j,1]

                k += 1
                self.image[k] = self.tb[i,j,0] +   self.tb[i,j,1]

                k += 1


        return self.image, self.width, self.height