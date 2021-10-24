from flask import Flask,render_template,request
from flask_socketio import SocketIO
import json
import numpy as np
from PIL import Image
import tensorflow as tf
import time
import cv2
from yolo import YOLO

app = Flask(__name__)
#load = tf.keras.models.load_model('checkpoint')
#label =["David","Wayne","other"]
yolo = YOLO()
mode = "predict"
def detect(img):
    if mode == "predict":
        return yolo.detect_image(img)
        # label, top, left, bottom, right = yolo.detect_image(image)
        # return (label, top, left, bottom, right)
        # r_image = yolo.detect_image(image)
        # r_image.show()


@app.route("/",methods=['POST','GET'])
def index():
    return render_template('index.html')
@app.route('/img',methods=['POST','GET'])
def send():
    data = request.get_data()
    arr = np.array(json.loads(data))
    img = Image.fromarray(arr.astype(np.uint8))
    bbox = yolo.detect_image(img)
    print(bbox)
    # pre = np.argmax(load.predict(arr), axis=-1)
    # predict = label[int(pre)]
    # print(label[int(pre)])
    return json.dumps(bbox)

if __name__ == "__main__":
	app.run(debug=True)