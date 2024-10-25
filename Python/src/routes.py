import os
from flask import jsonify, render_template
import numpy as np
from m_rgb.m_trend import M_Trend
from m_stick.m_stick import M_Stick

def stick():
    return render_template('stick.html')

def stick_image():
    filename = "stick_14_0_1_8.txt"
    if filename:
        image_path = os.path.join('uploads', filename)
        
        mStick = M_Stick()
        pixels, width, height = mStick.m_stick(image_path)

        mStick.get_siblings()
        mStick.get_df()
        mStick.train_model_regressor()
        pixels = mStick.predict()

        
        
        # Convert the array to dictionary with strings
        pixel_dict_str_keys = {f"{x},{y}": (r, g, b) for (x, y, r, g, b) in pixels}

        return jsonify({"message": "Image processed successfully", "width": width, "height": height, "pixels": pixel_dict_str_keys})
    return jsonify({"message": "No file uploaded"}), 400


def trend():
    return render_template('trend.html')

def trend_image():

    mTrend = M_Trend()
    mTrend.load_image("gates.png")
    pixels, width, height = mTrend.m_trend()
    print(f"Image size: {width}x{height}")

    # return binary array of pixels rgb
    aPixels = []
    i=0
    for y in range(height):
        for x in range(width):
            aPixels.append(pixels[i][0])
            aPixels.append(pixels[i][1])
            aPixels.append(pixels[i][2])
            i += 1
    # return uint8 array of pixels rgb
    aPixels = np.array(aPixels, dtype=np.uint8)
    return aPixels.tobytes()        


    
