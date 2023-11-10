import cv2
import numpy as np

# Load YOLO model
net = cv2.dnn.readNet("yolo7.weights", "yolo7.cfg")

# Open the camera
cap = cv2.VideoCapture(0)

while True:
    # Read the frame from the camera
    ret, img = cap.read()

    if not ret:
        break

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

    # Store the detections
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

                # Cek apakah bounding box cukup besar
                min_size = 50  # Minimal size for the bounding box
                if w > min_size and h > min_size:
                    # Append the detection to the list of detections
                    detections.append((x, y, x+w, y+h, confidence, class_id))

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

    # Display the original image with the rectangles
    cv2.imshow("Detected Objects", img)
    cv2.waitKey(1)

    # Break the loop if 'q' key is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the camera and close all windows
cap.release()
cv2.destroyAllWindows()
