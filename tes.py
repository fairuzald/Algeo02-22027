import cv2
import numpy as np
import time

start = time.time()
# Load YOLO model
net = cv2.dnn.readNet("yolo7.weights", "yolo7.cfg")

# Load image
img = cv2.imread("28.jpg")


# Get the image dimensions
height, width = img.shape[:2]

# Create a blob from the image
blob = cv2.dnn.blobFromImage(img, 1/255.0, (416, 416), swapRB=True, crop=False)

# Set the blob as input to the network
net.setInput(blob)

# Get the output layer names
output_layer_names = net.getUnconnectedOutLayersNames()

# Perform forward pass and get the output
outputs = net.forward(output_layer_names)

# Initialize a flag to indicate whether any detections were made
detections_made = False

detections = []
    # Loop over the output
for output in outputs:
    for detection in output:
        # Get the scores and class id
        scores = detection[5:]
        class_id = np.argmax(scores)
        confidence = scores[class_id]
         # Check if confidence is above a threshold
        if confidence > 0.2:  # Lower the confidence threshold
            # Get the bounding box coordinates
            center_x = int(detection[0] * width)
            center_y = int(detection[1] * height)
            w = int(detection[2] * width)
            h = int(detection[3] * height)
            x = int(center_x - w / 2)
            y = int(center_y - h / 2)
            
            min_size = 50  # Minimal size for the bounding box
            if w > min_size and h > min_size:
                # Append the detection to the list of detections
                detections.append((x, y, x+w, y+h, confidence, class_id))

            # Crop the image based on the bounding box
            cropped_img = img[y:y+h, x:x+w]

            # Display the cropped image
            # cv2.imshow("Cropped Image", cropped_img)
            # cv2.waitKey(0)

            # Set the flag to True
            detections_made = True
          

# Perform Non-Maximum Suppression
nms_threshold = 0.3
indices = cv2.dnn.NMSBoxes([box[:4] for box in detections],
   [score[4] for score in detections],
   0.2,  # Confidence threshold
   nms_threshold)

for i in range(len(indices)):
    i = indices[i]
    box = detections[i]
    x, y, w, h, confidence, class_id = box

    # Draw a rectangle around the detected object
    cv2.rectangle(img, (x, y), (w, h), (0, 255, 0), 2)

    # Set the flag to True
    detections_made = True
            

# If no detections were made, print an error message
if not detections_made:
    print("Tidak ada deteksi yang berhasil dilakukan!")
end = time.time()
print(end-start)
# Close all windows
cv2.destroyAllWindows()
