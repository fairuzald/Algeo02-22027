import base64
import io
from typing import List
import numpy as np
from PIL import Image

class ImageComparator:
    def __init__(self, base64_dataset: List[str]):
        self.base64_dataset = base64_dataset
        self.dataset_histograms = []

    def process_base64_image(self, base64_string: str):
        # Pisahkan metadata dan data base64 sebenarnya
        _, base64_data = base64_string.split(",")
        try:
            image_data = base64.b64decode(base64_data)
            image = Image.open(io.BytesIO(image_data))
            image_matrix = np.array(image)
            return image_matrix
        except Exception as e:
            print(f"Error processing image: {e}")
            return None

    def rgb_to_hsv(self, r, g, b):
        # Convert RGB to HSV color space
        r, g, b = r / 255.0, g / 255.0, b / 255.0
        cmax = np.maximum(np.maximum(r, g), b)
        cmin = np.minimum(np.minimum(r, g), b)
        diff = cmax - cmin + np.finfo(float).eps

        h = np.where(cmax == cmin, 0,
                     np.where(cmax == r, (60 * ((g - b) / diff % 6)),
                              np.where(cmax == g, (60 * ((b - r) / diff + 2)),
                                       (60 * (((r - g) / diff) + 4)))))

        s = np.where(cmax == 0, 0, diff / (cmax + np.finfo(float).eps))
        v = cmax

        return h, s, v

    def compute_global_color_histogram_hsv(self, image_matrix):
        # Convert RGB values to HSV color space
        hsv = np.stack(self.rgb_to_hsv(image_matrix[..., 0], image_matrix[..., 1], image_matrix[..., 2]), axis=-1)

        # Define bin edges for histogram calculation
        h_bins = [0, 1, 25.5, 40.5, 120.5, 190.5, 270.5, 295.5, 316.5, 360]
        s_bins = [0, 0.2, 0.7, 1]
        v_bins = [0, 0.2, 0.7, 1]

        # Compute histogram in HSV color space
        hist, _ = np.histogramdd(hsv.reshape(-1, 3), bins=(h_bins, s_bins, v_bins))

        return hist

    def _cosine_similarity(self, vec1, vec2):
        # Compute cosine similarity between two vectors
        return np.dot(vec1, vec2)/(np.linalg.norm(vec1) * np.linalg.norm(vec2))

    def load_dataset_histograms(self):
        # Convert base64 strings to matrices and compute histograms
        for base64_image in self.base64_dataset:
            image_matrix = self.process_base64_image(base64_image)
            dataset_histogram = self.compute_global_color_histogram_hsv(image_matrix)
            self.dataset_histograms.append(dataset_histogram)

    def compare_images(self, input_histogram):
        # Flatten input histogram
        input_histogram = input_histogram.flatten()
        
        # Flatten histograms for all images in the dataset
        dataset_histograms = [hist.flatten() for hist in self.dataset_histograms]

        # Compute cosine similarity between input histogram and each dataset histogram
        similarities = [self._cosine_similarity(input_histogram, hist) * 100 for hist in dataset_histograms]

        return similarities
