from PIL import Image
import numpy as np

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

def compute_global_color_histogram_hsv(image, num_bins=8):
    width, height = image.size
    hist = np.zeros((8, 3, 3))

    for y in range(height):
        for x in range(width):
            # nilai piksel dalam tuple RGB
            pixel = image.getpixel((x, y))
            
            # konversi RGB ke HSV
            hsv = rgb_to_hsv(*pixel[:3])

            # initialize bin_s, bin_h, bin_v with default values
            bin_s, bin_h, bin_v = 0, 0, 0

            # hitung bin untuk komponen H
            if 1 <= hsv[0] < 25.5:
                bin_h = 1
            elif 25.5 <= hsv[0] < 40.5:
                bin_h = 2
            elif 40.5 <= hsv[0] < 120.5:
                bin_h = 3
            elif 120.5 <= hsv[0] < 190.5:
                bin_h = 4
            elif 190.5 <= hsv[0] < 270.5:
                bin_h = 5
            elif 270.5 <= hsv[0] < 295.5:
                bin_h = 6
            elif 295.5 <= hsv[0] < 316.5:
                bin_h = 7
            elif 316.5 <= hsv[0] < 360:
                bin_h = 0

            # hitung bin untuk komponen S
            if 0 <= hsv[1] < 0.2:
                bin_s = 0
            elif 0.2 <= hsv[1] < 0.7:
                bin_s = 1
            elif 0.7 <= hsv[1] <= 1:
                bin_s = 2

            # hitung bin untuk komponen V
            if 0 <= hsv[2] < 0.2:
                bin_v = 0
            elif 0.2 <= hsv[2] < 0.7:
                bin_v = 1
            elif 0.7 <= hsv[2] <= 1:
                bin_v = 2

            # tambahkan ke histogram
            hist[bin_h][bin_s][bin_v] += 1

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

        if float(similarity) >= 0.6:
            print(f"Similarity with image {i + 1}: {float(similarity):.2f} (Good Image)")
        else:
            print(f"Similarity with image {i + 1}: {float(similarity):.2f} (Not Good)")

def main():
    # input gambar
    input_image_path = "0.jpg"
    input_image = Image.open(input_image_path)

    # hitung histogram warna global gambar
    input_histogram = compute_global_color_histogram_hsv(input_image)

    # dataset gambar
    dataset_folder_path = "img"
    num_dataset_images = 100
    dataset_image_paths = [f"{dataset_folder_path}/{i}.jpg" for i in range(0, num_dataset_images + 1)]
    dataset_histograms = []

    for dataset_image_path in dataset_image_paths:
        dataset_image = Image.open(dataset_image_path)
        dataset_histogram = compute_global_color_histogram_hsv(dataset_image)
        dataset_histograms.append(dataset_histogram)

    # bandingkan input gambar dengan dataset
    compare_images(input_histogram, dataset_histograms)

if __name__ == "__main__":
    main()

