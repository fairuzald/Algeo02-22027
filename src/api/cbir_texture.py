import numpy as np

# NB : SEMUA FUNGSI DISINI PARAMETERNYA HARUS IMAGE YANG SUDAH DICONVERT KE BENTUK MATRIXNYA BUKAN PATH DARI IMAGENYA
class ImageComparatorByTexture:
    def __init__(self, distance=1, levels=256):
        self.distance = distance
        self.levels = levels

    def convert_to_grayscale(self, img_matrix):
        img_matrix = np.array(img_matrix)  # Convert to NumPy array
        R, G, B = img_matrix[:,:,0], img_matrix[:,:,1], img_matrix[:,:,2]
        grayscale = 0.29 * R + 0.587 * G + 0.114 * B
        grayscale = grayscale.astype(np.uint8)
        return grayscale

    def quantize_grayscale(self, img_matrix):
        img = self.convert_to_grayscale(img_matrix)
        img_quantized = (img * self.levels / 256).astype(np.uint8) * (256 // self.levels)
        return img_quantized

    def create_glcm(self, img_matrix):
        glcm = np.zeros((256, 256), dtype=int)
        first = img_matrix[self.distance:, :]
        second = img_matrix[:-self.distance, :]
        for i, j in zip(first.ravel(), second.ravel()):
            glcm[i, j] += 1
        return glcm

    def normalize(self, img_matrix):
        symetric = img_matrix+img_matrix.T
        return symetric/symetric.sum()

    def calculate_contrast(self, img_matrix):
        contrast = 0
        for i in range(256):
            for j in range(256):
                contrast += ((i - j) ** 2) * img_matrix[i][j]
        return contrast

    def calculate_entropy(self, img_matrix):
        entropy = 0
        for i in range(256):
            for j in range(256):
                if img_matrix[i][j] > 0:
                    entropy += img_matrix[i][j] * np.log(img_matrix[i][j])
        return -entropy

    def calculate_homogeneity(self, img_matrix):
        homogeneity = 0
        for i in range(256):
            for j in range(256):
                homogeneity += img_matrix[i][j] / (1 + (i - j)**2)
        return homogeneity

    def cosine_similarity(self, vec1, vec2):
        return np.dot(vec1, vec2)/(np.linalg.norm(vec1) * np.linalg.norm(vec2))

    def process_image(self, img_matrix):
        img_quantized = self.quantize_grayscale(img_matrix)
        glcm = self.create_glcm(img_quantized)
        norm_glcm = self.normalize(glcm)
        contrast = self.calculate_contrast(norm_glcm)
        entropy = self.calculate_entropy(norm_glcm)
        homogeneity = self.calculate_homogeneity(norm_glcm)
        return contrast, entropy, homogeneity

    def compare_with_dataset(self, query_img, dataset):
        query_contrast, query_entropy, query_homogeneity = self.process_image(query_img)
        similarities = []
        for image in dataset:
            contrast, entropy, homogeneity = self.process_image(image)
            similarity = self.cosine_similarity([query_contrast, query_entropy, query_homogeneity], [contrast, entropy, homogeneity])
            similarities.append(similarity*100)
        return similarities


