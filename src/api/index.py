import time
from fastapi import FastAPI, File, HTTPException,  Request, UploadFile
from typing import List
from urllib.parse import urlparse, urlunparse
import numpy as np
from pydantic import BaseModel
from api.scraper import ImageScraper
from api.cbir_color import ImageComparator
from fastapi.middleware.cors import CORSMiddleware
from api.image_processing import ImageProcessing
from api.save import PDFCreator
from api.cbir_texture import ImageComparatorByTexture

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/api/python")

def hello_world():
    return {"message": "Hello World"}

imageProcessor = ImageProcessing()
class ConvertImageToBase64Request(BaseModel):
    urls: List[str]

@app.post("/api/convert-image-to-base64")
async def convert_image_to_base64(request: ConvertImageToBase64Request):
    return await imageProcessor.url_to_base64(request.urls)
    
@app.post("/api/convert")
async def convert(file: UploadFile = File(...)):
    return await imageProcessor.convert(file)

@app.post("/api/convert-no-yolo")
async def convert(file: UploadFile = File(...)):
    return await imageProcessor.convertWithoutYolo(file)

@app.post("/api/convert-multiple")
async def convert_multiple(files: List[UploadFile] = File(...)):
    return await imageProcessor.convert_multiple(files)

@app.post("/api/convert-camera")
async def convert_camera(request: Request):
    body = await request.json()
    image_data = body.get("image_data")
    return await imageProcessor.convert_camera(image_data)

@app.post("/api/cbir-color")
async def compare_images(matrix_query: List[List[List[int]]], matrix_data_set: List[List[List[List[int]]]]):
    try:
        start_time = time.time()
        image_comparator = ImageComparator(matrix_data_set)
        image_comparator.load_dataset_histograms()
        input_histogram = image_comparator.compute_global_color_histogram_hsv(matrix_query)
        similarities = image_comparator.compare_images(input_histogram)
        elapsed_time = time.time() - start_time
        return {"similarities": similarities, "elapsed_time": elapsed_time}
    except Exception as e:
        print(f"Error in compare_images: {e}")
        raise
    
@app.post("/api/cbir-texture")
async def compare_images(matrix_query: List[List[List[int]]], matrix_data_set: List[List[List[List[int]]]]):
    try:
    #    Prosessing di bagian ini
    # ini ya
        start_time = time.time()
        image_comparator = ImageComparatorByTexture()
        similarities = image_comparator.compare_with_dataset(matrix_query,matrix_data_set)
        elapsed_time = time.time() - start_time
        return {"similarities": similarities, "elapsed_time": elapsed_time}
    except Exception as e:
        print(f"Error in compare_images: {e}")
        raise

    
scraper = ImageScraper()
@app.get("/api/scrape")
async def get_image_scrape(url: str, limits: int):
    # Parse the URL query parameter
    parsed_url = urlparse(url)
    # Reconstruct the full URL
    full_url = urlunparse(
        (
            parsed_url.scheme,
            parsed_url.netloc,
            parsed_url.path,
            parsed_url.params,
            parsed_url.query,
            parsed_url.fragment,
        )
    )
    return scraper.get_image(full_url, limits)

pdf_creator = PDFCreator()
@app.post("/api/create-pdf-file")
async def create_pdf_file(data: dict):
        print(data["elapsed_time"])
        result = pdf_creator.create_pdf(
            data["image_query"],
            data["image_data_set"],
            data["is_texture"],
            data["result_percentage_set"],
            data["output_filename"],
            data["elapsed_time"],
        )
        return result
