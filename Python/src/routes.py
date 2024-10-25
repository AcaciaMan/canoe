import os
from flask import jsonify, render_template
from m_rgb.m_trend import M_Trend
from m_stick.m_stick import M_Stick
from time import time

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
    # benchmark
    start_time = time()
    mTrend.load_image("gates.png")
    end_time1 = time()
    elapsed_time1 = end_time1 - start_time
    print(f"Image load time: {elapsed_time1:.4f} seconds")

    pixels, width, height = mTrend.m_trend()
    end_time2 = time()
    elapsed_time2 = end_time2 - end_time1
    print(f"Image process time: {elapsed_time2:.4f} seconds")

    print(f"Image size: {width}x{height}")

    return pixels.tobytes()  


    
