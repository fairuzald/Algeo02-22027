from PIL import Image
import numpy as np
import os

def convert_to_grayscale(img_array):
    # Mengambil komponen R, G, dan B dari gambar
    R, G, B = img_array[:,:,0], img_array[:,:,1], img_array[:,:,2]
    
    # Menghitung grayscale
    grayscale = 0.29 * R + 0.587 * G + 0.114 * B
    
    # Mengubah grayscale menjadi integer
    grayscale = grayscale.astype(np.uint8)
    
    return grayscale

def quantize_grayscale(img_array, levels=256):
    # Mengubah gambar menjadi grayscale
    img = convert_to_grayscale(img_array)
    
    # Melakukan kuantisasi nilai grayscale (0-255, unsigned int)
    img_quantized = (img * levels / 256).astype(np.uint8) * (256 // levels)
    
    return img_quantized

def create_glcm(img_array, distance= 1):
    # Inisialisasi matriks kosong
    glcm = np.zeros((256, 256), dtype=int)

    # Isi matriks
    first = img_array[distance:, :]
    second = img_array[:-distance, :]
    for i, j in zip(first.ravel(), second.ravel()):
        glcm[i, j] += 1
        
    return glcm

def normalize(matrix):
    # Normalisasi matriks
    symetric = matrix+matrix.T
    return symetric/symetric.sum()

def calculate_contrast(matrix):
    contrast = 0
    # Hitung kontras
    for i in range(256):
        for j in range(256):
            contrast += ((i - j) ** 2) * matrix[i][j]
    return contrast

def calculate_entropy(matrix):
    entropy = 0
    # Menghitung entropy
    for i in range(256):
        for j in range(256):
            if matrix[i][j] > 0:
                entropy += matrix[i][j] * np.log(matrix[i][j])
    return -entropy

def calculate_homogeneity(matrix):
    homogeneity = 0
    # Menghitung homogenitas
    for i in range(256):
        for j in range(256):
            homogeneity += matrix[i][j] / (1 + (i - j)**2)
    return homogeneity

def cosine_similarity(vec1, vec2):
    # Menghitung cosine similarity
    return np.dot(vec1, vec2)/(np.linalg.norm(vec1) * np.linalg.norm(vec2)) * 100

def process_image(img_array, distance=1, levels=256):
    # Mengubah gambar menjadi grayscale dan melakukan kuantisasi
    img_quantized = quantize_grayscale(img_array, levels)

    # Membuat GLCM
    glcm = create_glcm(img_quantized, distance)

    # Normalisasi matriks
    norm_glcm = normalize(glcm)

    # Menghitung kontras, entropi, dan homogenitas
    contrast = calculate_contrast(norm_glcm)
    entropy = calculate_entropy(norm_glcm)
    homogeneity = calculate_homogeneity(norm_glcm)

    return contrast, entropy, homogeneity

# # Testing fungsi
# img1 = Image.open('./image/1.jpg')
# contrast1, entropy1, homogeneity1 = process_image(np.array(img1))
# directory = './image/'
# for filename in os.listdir(directory):
#     # Baca file gambar 
#     if filename.endswith('.jpg'):
#         # Buat path file
#         filepath = os.path.join(directory, filename)
#         # Proses gambar
#         img2 = Image.open(filepath)
#         contrast2,entropy2,homogeneity2 = process_image(np.array(img2))
#         # Hitung tingkat kemiripan
#         cosine_similarity_value = cosine_similarity([contrast1, entropy1, homogeneity1], [contrast2, entropy2, homogeneity2])
#         print('Tingkat kemiripan dengan image {}: {:.3f}'.format(filepath, cosine_similarity_value))

