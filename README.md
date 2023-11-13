<p align="center">
  <a href="https://algeo02-22027.vercel.app">
    <img src="https://res.cloudinary.com/dkyq76c5w/image/upload/v1699860331/cuk-removebg-preview_y357nd.png" height="96">
    <h3 align="center">Next.js FastAPI Starter</h3>
  </a>
</p>

<p align="center">Simple Next.js boilerplate that uses <a href="https://fastapi.tiangolo.com/">FastAPI</a> as the API backend.</p>

<br/>
# Content-Based Image Retrieval (CBIR) Application

<p align="center">A Next.js and FastAPI Hybrid Application</p>

## Introduction

Welcome to the Content-Based Image Retrieval (CBIR) application! This project combines the power of Next.js for the frontend and FastAPI for the API backend. The application allows users to perform image searches based on content, utilizing both color and texture parameters. Additionally, it integrates an Object Detector based on YOLO (You Only Look Once) for automatic image cropping, enhancing the precision of search results.

## Demo

Check out the live demo: [CBIR Demo](https://nextjs-fastapi-starter.vercel.app/)

## Deploy Your Own

You can deploy your own instance with a single click using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdigitros%2Fnextjs-fastapi%2Ftree%2Fmain)

## Features

- **Cosine Similarity Search:** Evaluate the cosine similarities between a query image and the dataset, providing a quick assessment of image similarity.

- **Flexible Query Input:**

  - **Camera:** Capture an image using your device's camera.
  - **Upload File:** Upload an image file from your device.

- **Dataset Input Options:**

  - **Folder Uploads:** Organize your dataset in folder structures for easy management.
  - **Web Scraping:** Automatically collect a dataset from the web, offering flexibility in data gathering.

- **Object Detector Integration (YOLO):** Implement YOLO-based Object Detection for automatic image cropping, ensuring only relevant portions are used in similarity calculations.

- **Download Results in PDF Format:** Download search results, including cosine similarities, in PDF format for easy storage and sharing.

## Concept

### Content-Based Image Retrieval (CBIR)

CBIR involves representing images as pixel or grayscale matrices, transformed into feature vectors for comparison. The application employs cosine similarity to compare feature vectors of query and dataset images.

### CBIR with Color Parameter

CBIR with a color parameter involves converting images to the HSV format, performing color histogram searches (global and block), and utilizing cosine similarity to compare color feature vectors.

### CBIR with Texture Parameter

CBIR with a texture parameter involves grayscale conversion, co-occurrence matrix creation for texture extraction, and measuring similarity between texture feature vectors using cosine similarity.

The integration of color and texture parameters enhances CBIR accuracy and efficiency, reducing reliance on text-based or keyword searches and providing an intuitive image exploration experience.

## How to Use

1. **Access CBIR and Scrapping Page:**

   - Navigate to the "CBIR" page to perform Content-Based Image Retrieval with a dataset input file.
   - Visit the "Scrapping" page to input URLs and perform web scraping.

2. **Query Input Options:**

   - Choose query input options:
     - **Camera:** Use the device camera to capture an image.
     - **Upload File:** Upload an image file from device storage.

3. **Select CBIR Processing Type:**

   - After selecting a query, choose the desired CBIR processing type based on color or texture.

4. **Automated Processing with YOLO Detector:**

   - Uploaded images undergo automatic processing using the YOLO-based Object Detector for automated cropping.

5. **Search Process and Results Display:**

   - Click the "Search" button to initiate cosine similarity search between the query image and dataset.
   - View a set of similar images, sorted by similarity percentage.

6. **Additional Information:**

   - Obtain information on the number of displayed images and program execution time.

7. **Download Results in PDF:**
   - After completion, download the analysis results by pressing the "Download PDF" button.

## Development

To run the application locally:

1. Install dependencies:
   ```bash
   npm install
   ```
