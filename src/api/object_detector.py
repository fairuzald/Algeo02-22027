import os
import cv2
import numpy as np
import io
import base64
from fastapi import HTTPException, UploadFile
from PIL import Image
from typing import List, Dict, Union

class ObjectDetector:
    def __init__(self):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        weights_path = os.path.join(current_dir, "yolo7.weights")
        cfg_path = os.path.join(current_dir, "yolo7.cfg")
        self.net = cv2.dnn.readNet(weights_path, cfg_path)
    
    def _preprocess_image(self, img):
        # Convert image to BGR if it has an alpha channel
        if img.shape[2] == 4:
            img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)
        
        height, width = img.shape[:2]
        blob = cv2.dnn.blobFromImage(img, 1/255.0, (416, 416), swapRB=True, crop=False)
        return blob, height, width
    
    def _detect_objects(self, blob, height, width):
        self.net.setInput(blob)
        output_layer_names = self.net.getUnconnectedOutLayersNames()
        outputs = self.net.forward(output_layer_names)

        best_confidence = 0
        best_box = None

        for output in outputs:
            for detection in output:
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]

                if confidence > 0.2:
                    center_x = int(detection[0] * width)
                    center_y = int(detection[1] * height)
                    w = int(detection[2] * width)
                    h = int(detection[3] * height)
                    x = int(center_x - w / 2)
                    y = int(center_y - h / 2)
                    min_size = 50

                    if w > min_size and h > min_size:
                        if confidence > best_confidence:
                            best_confidence = confidence
                            best_box = (x, y, w, h)

        return best_box
    
    def detect_and_crop(self, img_matrix):
        blob, height, width = self._preprocess_image(img_matrix)
        best_box = self._detect_objects(blob, height, width)

        if best_box is not None:
            x, y, w, h = best_box
            # Ensure bounding box coordinates are within image boundaries
            x = max(0, x)
            y = max(0, y)
            w = min(width - x, w)
            h = min(height - y, h)
            cropped_img = img_matrix[y:y+h, x:x+w]
            return cropped_img
        else:
            return img_matrix