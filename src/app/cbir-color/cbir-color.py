from PIL import Image
import numpy as np
import time
from skimage.color import rgb2hsv

def rgb_to_hsv(r, g, b):
    r, g, b = r / 255.0, g / 255.0, b / 255.0
    cmax = np.maximum(np.maximum(r, g), b)
    cmin = np.minimum(np.minimum(r, g), b)
    diff = cmax - cmin + np.finfo(float).eps  # add a small constant to avoid division by zero

    h = np.where(cmax == cmin, 0,
                 np.where(cmax == r, (60 * ((g - b) / diff % 6)),
                          np.where(cmax == g, (60 * ((b - r) / diff + 2)),
                                   (60 * (((r - g) / diff) + 4)))))

    s = np.where(cmax == 0, 0, diff / (cmax + np.finfo(float).eps))
    v = cmax

    return h, s, v

def compute_global_color_histogram_hsv(image, num_bins=8):
    # konversi image ke NumPy array
    image_np = np.array(image)

    # konversi RGB ke HSV
    hsv = np.stack(rgb_to_hsv(image_np[..., 0], image_np[..., 1], image_np[..., 2]), axis=-1)

    # define bin edges
    h_bins = [0, 1, 25.5, 40.5, 120.5, 190.5, 270.5, 295.5, 316.5, 360]
    s_bins = [0, 0.2, 0.7, 1]
    v_bins = [0, 0.2, 0.7, 1]

    # hitung histogram
    hist, _ = np.histogramdd(hsv.reshape(-1, 3), bins=(h_bins, s_bins, v_bins))

    return hist

def cosine_similarity_custom(vec1, vec2):
    return np.dot(vec1, vec2)/(np.linalg.norm(vec1) * np.linalg.norm(vec2))

def compare_images(input_histogram, dataset_histograms):
    # Flatten the input histogram
    input_histogram = input_histogram.flatten()

    # Flatten the dataset histograms
    dataset_histograms = [hist.flatten() for hist in dataset_histograms]

    # Calculate cosine similarity
    similarities = [cosine_similarity_custom(input_histogram, hist) for hist in dataset_histograms]

    # Display results
    for i, similarity in enumerate(similarities):
        print(f"Similarity with image {i + 1}: {float(similarity):.2f}")

def main():
    # inisialisasi waktu awal
    start_time = time.time()
    # input gambar
    input_image_path = "0.jpg"
    input_image = Image.open(input_image_path)

    # hitung histogram warna global gambar
    input_histogram = compute_global_color_histogram_hsv(input_image)

    # dataset gambar
    dataset_folder_path = "img"
    num_dataset_images = 500
    dataset_image_paths = [f"{dataset_folder_path}/{i}.jpg" for i in range(0, num_dataset_images + 1)]
    dataset_histograms = []

    for dataset_image_path in dataset_image_paths:
        dataset_image = Image.open(dataset_image_path)
        dataset_histogram = compute_global_color_histogram_hsv(dataset_image)
        dataset_histograms.append(dataset_histogram)


    # bandingkan input gambar dengan dataset
    compare_images(input_histogram, dataset_histograms)

    # waktu yang dibutuhkan untuk seluruh perbandingan
    total_elapsed_time = time.time() - start_time
    print(f"Total time taken to compare all images: {total_elapsed_time:.4f} seconds")

if __name__ == "__main__":
    main()

