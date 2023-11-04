from PIL import Image
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def rgb_to_hsv(r, g, b):
    # konversi RGB ke rentang 0-1
    r, g, b = r / 255.0, g / 255.0, b / 255.0
    cmax, cmin = max(r, max(g, b)), min(r, min(g, b))
    diff = cmax - cmin
    
    # hitung nilai HSV
    if cmax == cmin:
        h = 0
    elif cmax == r:
        h = 60 * ((g - b) / diff % 6)
    elif cmax == g:
        h = 60 * ((b - r) / diff + 2)
    elif cmax == b:
        h = 60 * ((r - g) / diff + 4)

    if cmax == 0:
        s = 0
    else:
        s = diff / cmax
    
    v = cmax

    return h, s, v

def compute_global_color_histogram_hsv(image, num_bins=72):
    width, height = image.size
    hist_h = np.zeros((num_bins,))
    hist_s = np.zeros((num_bins,))
    hist_v = np.zeros((num_bins,))

    for y in range(height):
        for x in range(width):
            # nilai piksel dalam tuple RGB
            pixel = image.getpixel((x, y))
            
            # konversi RGB ke HSV
            hsv = rgb_to_hsv(*pixel[:3])

            # hitung bin untuk setiap komponen HSV
            bin_h = int(hsv[0] / 360 * num_bins)
            bin_s = int(hsv[1] * (num_bins - 1))
            bin_v = int(hsv[2] * (num_bins - 1))

            # tambahkan ke histogram
            hist_h[bin_h] += 1
            hist_s[bin_s] += 1
            hist_v[bin_v] += 1

    # gabung histogram menjadi satu vektor
    hist = np.concatenate([hist_h, hist_s, hist_v])
    
    # normalisasi histogram
    hist = hist / np.sum(hist)

    return hist

def compare_images(input_histogram, dataset_histograms, threshold=0.7):
    # reshape input histogram menjadi 2D array
    input_histogram = input_histogram.reshape(1, -1)

    # hitung cosine similarity antara input histogram dengan dataset histogram
    similarities = cosine_similarity(input_histogram, dataset_histograms)

    # tampilkan hasil
    for i, similarity in enumerate(similarities[0]):
        print(f"Kemiripan dengan gambar {i + 1}: {similarity * 100:.2f} %")

def main():
    # input gambar
    input_image_path = "0.jpg"
    input_image = Image.open(input_image_path)

    # hitung histogram warna global gambar
    input_histogram = compute_global_color_histogram_hsv(input_image)

    # dataset gambar
    dataset_image_paths = ["0_1.jpg", "0_2.jpg", "0_3.jpg", "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "black-color.jpg", "blue-color.jpg", "11(1).jpg", "dummy_image.png"]
    dataset_histograms = []

    for dataset_image_path in dataset_image_paths:
        dataset_image = Image.open(dataset_image_path)
        dataset_histogram = compute_global_color_histogram_hsv(dataset_image)
        dataset_histograms.append(dataset_histogram)

    # bandingkan input gambar dengan dataset
    compare_images(input_histogram, np.array(dataset_histograms), threshold=0.7)

if __name__ == "__main__":
    main()

