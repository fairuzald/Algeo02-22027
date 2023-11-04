import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics.pairwise import cosine_similarity

def convert_to_gray(image):
    # Ini adalah cara untuk mendapatkan tinggi (height) dan lebar (width) gambar asli (image) dari properti shape. Gambar RGB memiliki tiga saluran warna (R, G, B), dan oleh karena itu, kita mengabaikan saluran ketiga dengan _.
    height, width, _ = image.shape

    # Membuat array kosong untuk gambar grayscale, uint8 mengindikasikan bahwa nilai-nilai grayscale akan berada dalam rentang 0 hingga 255.
    gray_image = np.zeros((height, width), dtype=np.uint8)

    # Iterasi melalui setiap piksel dalam gambar
    for i in range(height):
        for j in range(width):
            # Mendapatkan nilai RGB dari piksel (tiap elemen dalam matrix image adalah array yang berisi nilai-nilai RGB)
            r, g, b = image[i, j]

            # Menghitung nilai grayscale menggunakan rumus yang diberikan
            gray = int(0.29*r + 0.587*g + 0.114*b)

            # Menetapkan nilai grayscale ke piksel yang sesuai dalam gambar grayscale
            gray_image[i, j] = gray

    return gray_image


def glcm(gray_image, d=(1, 0)):
    # Mendapatkan ukuran gambar
    height, width = gray_image.shape

    # Mendapatkan nilai maksimum dalam gambar grayscale
    max_val = gray_image.max()

    # Membuat matriks co-occurrence
    matrix = np.zeros((max_val+1, max_val+1), dtype=np.uint8)

    # Iterasi melalui setiap piksel dalam gambar grayscale
    for i in range(height - d[0]):
        for j in range(width - d[1]):
            # Mendapatkan nilai piksel dan piksel tetangganya
            val = gray_image[i, j]
            val_d = gray_image[i+d[0], j+d[1]]

            # Menambahkan kejadian pasangan piksel ke matriks co-occurrence
            matrix[val, val_d] += 1

    return matrix

def symmetric_glcm(matrix):
    # Mengembalikan matriks co-occurrence simetris
    return matrix + matrix.T

def normalize(matrix):
    # Mengembalikan matriks co-occurrence yang dinormalisasi
    return matrix/matrix.sum()


def calculate_contrast(matrix):
    # Menghitung nilai kontras dari matriks normalized co-occurrence
    contrast = 0
    for i in range(matrix.shape[0]):
        for j in range(matrix.shape[1]):
            contrast += ((i-j)**2)*matrix[i, j]
    return contrast

def calculate_entropy(matrix):
    # Menghitung nilai entropi dari matriks normalized co-occurrence
    entropy = 0
    for i in range(matrix.shape[0]):
        for j in range(matrix.shape[1]):
            if matrix[i, j] > 0:
                entropy += matrix[i, j]*np.log(matrix[i, j])
    return -entropy

def calculate_homogeneity(matrix):
    # Menghitung nilai homogenitas dari matriks normalized co-occurrence
    homogeneity = 0
    for i in range(matrix.shape[0]):
        for j in range(matrix.shape[1]):
            homogeneity += matrix[i, j]/(1+((i-j)**2))
    return homogeneity

def cosine_similarity(a, b):
    # Menghitung cosine similarity dari dua vektor
    dot_product = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    return dot_product / (norm_a * norm_b)


def calculate_texture_features(image_path):
    try:
        # Misalkan kita memiliki gambar RGB
        image = plt.imread(image_path)

        # Konversi gambar ke grayscale
        gray_image = convert_to_gray(image)
        glcm_matrix = glcm(gray_image)
        symmetric_glcm_matrix = symmetric_glcm(glcm_matrix)
        normalized_glcm_matrix = normalize(symmetric_glcm_matrix)

        contrast = calculate_contrast(normalized_glcm_matrix)
        entropy = calculate_entropy(normalized_glcm_matrix)
        homogeneity = calculate_homogeneity(normalized_glcm_matrix)

        return contrast, entropy, homogeneity
    except Exception as e:
        print(f"Ada kesalahan dalam memproses citra: {str(e)}")
        return None

image_path1 = './image/1.jpg'
texture_features1 = calculate_texture_features(image_path1)
# Bikin error handling untuk mengatasi error yang terjadi
if texture_features1 is not None:
    contrast1, entropy1, homogeneity1 = texture_features1
    print(f'Contrast citra {image_path1}: {contrast1}')
    print(f'Entropy citra {image_path1}: {entropy1}')
    print(f'Homogeneity citra {image_path1}: {homogeneity1}')

image_path2 = './image/white2.jpg'
texture_features2 = calculate_texture_features(image_path2)
# Bikin error handling untuk mengatasi error yang terjadi
if texture_features2 is not None:
    contrast2, entropy2, homogeneity2 = texture_features2
    print(f'Contrast citra {image_path2}: {contrast2}')
    print(f'Entropy cira {image_path2}: {entropy2}')
    print(f'Homogeneity citra {image_path2}: {homogeneity2}')

    # Buat vektor untuk kedua citra
    vector_a = np.array([contrast1, homogeneity1, entropy1])
    vector_b = np.array([contrast2, homogeneity2, entropy2])

    # Mengukur kemiripan antara dua gambar menggunakan cosine similarity
    similarity = cosine_similarity(vector_a, vector_b)

    if np.isnan(similarity):
        similarity = 0  # Ganti NaN dengan 0

    print(f'Cosine Similarity antara {image_path1} dan {image_path2}: {similarity}')
