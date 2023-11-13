import os
import cv2
import numpy as np
from fastapi import HTTPException

class ObjectDetector:
    def __init__(self):
        try:
            # Get the current directory
            current_dir = os.path.dirname(os.path.abspath(__file__))
            weights_path = os.path.join(current_dir, "yolo7.weights")
            cfg_path = os.path.join(current_dir, "yolo7.cfg")

            # Check if file exists
            if not os.path.exists(weights_path) or not os.path.exists(cfg_path): 
                raise HTTPException(status_code=404, detail="Error: YOLO file not found")
            

            # Load YOLO model using OpenCV
            self.net = cv2.dnn.readNet(weights_path, cfg_path)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def _preprocess_image(self, img):
        try:
            # Convert image to BGR if it has an alpha channel
            if img.shape[2] == 4:
                img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)
            
            # Get image dimensions and create a blob for YOLO input
            height, width = img.shape[:2]
            blob = cv2.dnn.blobFromImage(img, 1/255.0, (416, 416), swapRB=True, crop=False)
            return blob, height, width
        except Exception as e:
            # Raise HTTPException with a 500 status code for exceptions
            raise HTTPException(status_code=500, detail=str(e))

    def _detect_objects(self, blob, height, width):
        try:
            # Set the input blob for YOLO model
            self.net.setInput(blob)
            
            # Get the names of the unconnected output layers
            output_layer_names = self.net.getUnconnectedOutLayersNames()
            
            # Forward pass to get the output from the YOLO model
            outputs = self.net.forward(output_layer_names)

            # Initialize variables to track the best detection
            best_confidence = 0
            best_box = None

            # Iterate through the output layers and detections
            for output in outputs:
                for detection in output:
                    scores = detection[5:]
                    class_id = np.argmax(scores)
                    confidence = scores[class_id]

                    # Check if the confidence is above a threshold
                    if confidence > 0.2:
                        # Calculate bounding box coordinates
                        center_x = int(detection[0] * width)
                        center_y = int(detection[1] * height)
                        w = int(detection[2] * width)
                        h = int(detection[3] * height)
                        x = int(center_x - w / 2)
                        y = int(center_y - h / 2)
                        min_size = 50

                        # Check if bounding box dimensions meet the minimum size criteria
                        if w > min_size and h > min_size:
                            # Update the best detection if the current one has higher confidence
                            if confidence > best_confidence:
                                best_confidence = confidence
                                best_box = (x, y, w, h)

            # Return the best bounding box
            return best_box
        except Exception as e:
            # Raise HTTPException with a 500 status code for exceptions
            raise HTTPException(status_code=500, detail=str(e))
    
    def detect_and_crop(self, img_matrix):
        try:
            # Preprocess the input image
            blob, height, width = self._preprocess_image(img_matrix)
            
            # Detect objects in the image and get the bounding box
            best_box = self._detect_objects(blob, height, width)

            if best_box is not None:
                # Unpack bounding box coordinates
                x, y, w, h = best_box
                
                # Ensure bounding box coordinates are within image boundaries
                x = max(0, x)
                y = max(0, y)
                w = min(width - x, w)
                h = min(height - y, h)
                
                # Crop the image using the bounding box coordinates
                cropped_img = img_matrix[y:y+h, x:x+w]
                return cropped_img
            else:
                # If no valid detection, return the original image
                return img_matrix
        except Exception as e:
            # Raise HTTPException with a 500 status code for exceptions
            raise HTTPException(status_code=500, detail=str(e))
