import numpy as np

# NB : SEMUA FUNGSI DISINI PARAMETERNYA HARUS IMAGE YANG SUDAH DICONVERT KE BENTUK MATRIXNYA BUKAN PATH DARI IMAGENYA
class ImageComparatorByTexture:
    def __init__(self, distance=1, levels=256):
        self.distance = distance
        self.levels = levels

    def _convert_to_grayscale(self, img_matrix):
        # Convert RGB image to grayscale
        img_matrix = np.array(img_matrix)  # Convert to NumPy array
        R, G, B = img_matrix[:,:,0], img_matrix[:,:,1], img_matrix[:,:,2]
        grayscale = 0.29 * R + 0.587 * G + 0.114 * B
        grayscale = grayscale.astype(np.uint8)
        return grayscale

    def _quantize_grayscale(self, img_matrix):
        # Quantize grayscale image
        img = self._convert_to_grayscale(img_matrix)
        img_quantized = (img * self.levels / 256).astype(np.uint8) * (256 // self.levels)
        return img_quantized

    def _create_glcm(self, img_matrix):
        # Create Gray-Level Co-occurrence Matrix (GLCM)
        glcm = np.zeros((256, 256), dtype=int)
        first = img_matrix[self.distance:, :]
        second = img_matrix[:-self.distance, :]
        for i, j in zip(first.ravel(), second.ravel()):
            glcm[i, j] += 1
        return glcm

    def _normalize(self, img_matrix):
        # _Normalize GLCM for better feature extraction
        symetric = img_matrix + img_matrix.T
        return symetric / symetric.sum()

    def _calculate_contrast(self, img_matrix):
        # Calculate contrast feature
        contrast = 0
        for i in range(256):
            for j in range(256):
                contrast += ((i - j) ** 2) * img_matrix[i][j]
        return contrast

    def _calculate_entropy(self, img_matrix):
        # Calculate entropy feature
        entropy = 0
        for i in range(256):
            for j in range(256):
                if img_matrix[i][j] > 0:
                    entropy += img_matrix[i][j] * np.log(img_matrix[i][j])
        return -entropy

    def calculate_homogeneity(self, img_matrix):
        # Calculate homogeneity feature
        homogeneity = 0
        for i in range(256):
            for j in range(256):
                homogeneity += img_matrix[i][j] / (1 + (i - j)**2)
        return homogeneity

    def _cosine_similarity(self, vec1, vec2):
        # Compute cosine similarity between two vectors
        return np.dot(vec1, vec2)/(np.linalg.norm(vec1) * np.linalg.norm(vec2))

    def process_image(self, img_matrix):
        # Process the image and extract texture features
        img_quantized = self._quantize_grayscale(img_matrix)
        glcm = self._create_glcm(img_quantized)
        norm_glcm = self._normalize(glcm)
        contrast = self._calculate_contrast(norm_glcm)
        entropy = self._calculate_entropy(norm_glcm)
        homogeneity = self.calculate_homogeneity(norm_glcm)
        return contrast, entropy, homogeneity

    def compare_with_dataset(self, query_img, dataset):
        # Compare the query image with a dataset of images based on texture features
        query_contrast, query_entropy, query_homogeneity = self.process_image(query_img)
        similarities = []
        for image in dataset:
            contrast, entropy, homogeneity = self.process_image(image)
            similarity = self._cosine_similarity([query_contrast, query_entropy, query_homogeneity],
                                                [contrast, entropy, homogeneity])
            similarities.append(similarity * 100)
        return similarities
