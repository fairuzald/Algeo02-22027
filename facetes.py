import cv2

# Load Haar cascades model
face_cascade = cv2.CascadeClassifier("haarcascade_fullbody.xml")

# Load image
img = cv2.imread("tes.jpg")

# Convert the image to grayscale
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Detect faces in the image
faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

# Print the number of faces detected
print("Jumlah wajah terdeteksi:", len(faces))

# Loop over the faces
for (x, y, w, h) in faces:
    # Draw a rectangle around the face
    cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)

    # Crop the image based on the bounding box
    cropped_img = img[y:y+h, x:x+w]

    # Display the cropped image
    cv2.imshow("Cropped Face", cropped_img)
    cv2.waitKey(0)

# Close all windows
cv2.destroyAllWindows()
