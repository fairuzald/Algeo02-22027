import base64
import io
import numpy as np
from PIL import Image
class ImageComparatorByTexture:
    def __init__(self, distance=1, levels=256):
        self.distance = distance
        self.levels = levels

    @staticmethod
    def process_base64_image(base64_string: str):
        _, base64_data = base64_string.split(",")

        try:
            image_data = base64.b64decode(base64_data)
            image = Image.open(io.BytesIO(image_data))
            image_matrix = np.array(image)
            return image_matrix
        except Exception as e:
            print(f"Error processing image: {e}")
            return None

    def _convert_to_grayscale(self,img_matrix):
        R, G, B = img_matrix[:, :, 0], img_matrix[:, :, 1], img_matrix[:, :, 2]
        grayscale = 0.29 * R + 0.587 * G + 0.114 * B
        return grayscale.astype(np.uint8)

    def _quantize_grayscale(self, img_matrix):
        img = self._convert_to_grayscale(img_matrix)
        img_quantized = (img * self.levels / 256).astype(np.uint8) * (256 // self.levels)
        return img_quantized

    def _create_glcm(self,img_matrix):
        glcm = np.zeros((256, 256), dtype=int)
        first = img_matrix[self.distance:, :]
        second = img_matrix[:-self.distance, :]
        for i, j in zip(first.ravel(), second.ravel()):
            glcm[i, j] += 1
        return glcm

    @staticmethod
    def _normalize(img_matrix):
        symetric = img_matrix + img_matrix.T
        return symetric / symetric.sum()

    @staticmethod
    def _calculate_contrast(img_matrix):
        return np.sum(((np.arange(256) - np.arange(256)[:, np.newaxis]) ** 2) * img_matrix)

    @staticmethod
    def _calculate_entropy(img_matrix):
        non_zero_elements = img_matrix[img_matrix > 0]
        entropy = -np.sum(non_zero_elements * np.log(non_zero_elements))
        return entropy

    @staticmethod
    def calculate_homogeneity(img_matrix):
        homogeneity = np.sum(img_matrix / (1 + (np.arange(256) - np.arange(256)[:, np.newaxis]) ** 2))
        return homogeneity

    @staticmethod
    def _cosine_similarity(vec1, vec2):
        return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

    def process_image(self, img_matrix):
        img_quantized = self._quantize_grayscale(img_matrix)
        glcm = self._create_glcm(img_quantized)
        norm_glcm = self._normalize(glcm)
        contrast = self._calculate_contrast(norm_glcm)
        entropy = self._calculate_entropy(norm_glcm)
        homogeneity = self.calculate_homogeneity(norm_glcm)
        return contrast, entropy, homogeneity

    def compare_with_dataset(self, query_img, dataset):
        query_contrast, query_entropy, query_homogeneity = self.process_image(query_img)
        similarities = [
            self._cosine_similarity([query_contrast, query_entropy, query_homogeneity],
                                    self.process_image(image))
            for image in dataset
        ]
        return [similarity * 100 for similarity in similarities]