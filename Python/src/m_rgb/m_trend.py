import os
from matplotlib.pylab import rand
from requests import get
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
            self.u150 = np.uint8(150)
            self.u75 = np.uint8(75)
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
        # randomize the residual component assigning each pixel a random value
        # Randomize the residual component assigning each pixel a random value
        tr_shape = self.tr[:, :, 2].shape
        tg_shape = self.tg[:, :, 2].shape
        tb_shape = self.tb[:, :, 2].shape

        tr_random = np.random.rand(*tr_shape)
        tg_random = np.random.rand(*tg_shape)
        tb_random = np.random.rand(*tb_shape)

        tr = self.tr[:, :, 2] * tr_random
        tg = self.tg[:, :, 2] * tg_random
        tb = self.tb[:, :, 2] * tb_random

        #tr = self.tr[:, :, 2]*rand()
        #tg = self.tg[:, :, 2]*rand()
        #tb = self.tb[:, :, 2]*rand()
        


        # Use numpy vectorized operations to speed up the process
        tr_combined = np.clip(self.tr[:, :, 0] + self.tr[:, :, 1] + tr, 0, 255)
        tg_combined = np.clip(self.tg[:, :, 0] + self.tg[:, :, 1] + tg, 0, 255)
        tb_combined = np.clip(self.tb[:, :, 0] + self.tb[:, :, 1] + tb, 0, 255)

        # Convert to uint8 directly
        tr_combined = tr_combined.astype(np.uint8)
        tg_combined = tg_combined.astype(np.uint8)
        tb_combined = tb_combined.astype(np.uint8)

        # Flatten the arrays and interleave the RGB components
        self.image[0::3] = tr_combined.flatten()
        self.image[1::3] = tg_combined.flatten()
        self.image[2::3] = tb_combined.flatten()

        return self.image, self.width, self.height
    


    
