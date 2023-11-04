from typing import Dict, List
import requests
from urllib.parse import urljoin
import os
import cv2
import numpy as np

class ImageProcessing:
    def upload_files(self, files: List[str]):
        valid_extensions = ['.jpg', '.png', '.jpeg']
        uploaded_files = []

        for file in files:
            file_extension = os.path.splitext(file)[1].lower()
            if file_extension in valid_extensions:
                file_path = os.path.join(self.folder_path, file)
                uploaded_files.append(file_path)
                with open(file_path, 'wb') as f:
                    f.write(files[file].read())
        
        return uploaded_files

    def convert_images_to_matrix(self, image_files: List[str]) -> np.ndarray:
        images = []

        for image_file in image_files:
            image = cv2.imread(image_file)
            images.append(image)

        return np.array(images)
