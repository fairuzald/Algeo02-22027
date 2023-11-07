from PIL import Image
import numpy as np

def convert_to_grayscale(image_path):
    # Membuka gambar
    img = Image.open(image_path)
    
    # Mengubah gambar menjadi array numpy
    img_array = np.array(img)
    
    # Mengambil komponen R, G, dan B dari gambar
    R, G, B = img_array[:,:,0], img_array[:,:,1], img_array[:,:,2]
    
    # Menghitung grayscale
    grayscale = 0.29 * R + 0.587 * G + 0.114 * B
    
    # Mengubah grayscale menjadi integer
    grayscale = grayscale.astype(np.uint8)
    
    # Membuat gambar baru dari array grayscale
    grayscale_image = Image.fromarray(grayscale)
    
    return grayscale_image

def quantize_grayscale(image_path, levels=256):

    # Mengubah gambar menjadi grayscale
    img = convert_to_grayscale(image_path)
    
    # Mengubah gambar menjadi array numpy
    img_array = np.array(img)
    
    # Melakukan kuantisasi nilai grayscale (0-255, unsigned int)
    img_quantized = (img_array * levels / 256).astype(np.uint8) * (256 // levels)
    
    # Mengubah array yang telah dikuantisasi kembali menjadi gambar
    img_quantized = Image.fromarray(img_quantized)
    
    return img_quantized

def create_glcm(image, distance= 1):

    img = np.array(image)

    glcm = np.zeros((256, 256), dtype=int)

    first = img[distance:, :]
    second = img[:-distance, :]
    for i, j in zip(first.ravel(), second.ravel()):
        glcm[i, j] += 1
        
    return glcm

def normalize(matrix):
    symetric = matrix+matrix.T
    return symetric/symetric.sum()

def calculate_contrast(matrix):
    contrast = 0
    for i in range(256):
        for j in range(256):
            contrast += ((i - j) ** 2) * matrix[i][j]
    return contrast

def calculate_entropy(matrix):
    entropy = 0
    for i in range(256):
        for j in range(256):
            if matrix[i][j] > 0:
                entropy += matrix[i][j] * np.log(matrix[i][j])
    return -entropy

def calculate_homogeneity(matrix):
    homogeneity = 0
    for i in range(256):
        for j in range(256):
            homogeneity += matrix[i][j] / (1 + (i - j)**2)
    return homogeneity

def cosine_similarity(vec1, vec2):
    return np.dot(vec1, vec2)/(np.linalg.norm(vec1) * np.linalg.norm(vec2))