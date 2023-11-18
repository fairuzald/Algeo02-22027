import time
from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from typing import List
from urllib.parse import urlparse, urlunparse
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
async def compare_images(data: dict):
    try:
        base64_query = data.get("base64_query", "")
        base64_dataset = data.get("base64_dataset", [])

        start_time = time.time()
        image_comparator = ImageComparator(base64_dataset)
        image_comparator.load_dataset_histograms()

        # Process query image
        query_image_matrix = image_comparator.process_base64_image(base64_query)
        input_histogram = image_comparator.compute_global_color_histogram_hsv(query_image_matrix)

        similarities = image_comparator.compare_images(input_histogram)
        elapsed_time = time.time() - start_time

        return {"similarities": similarities, "elapsed_time": elapsed_time}
    except Exception:
        raise HTTPException(status_code=500, detail="Internal Server Error")
@app.post("/api/cbir-texture")
async def compare_images(data: dict):
    try:
        base64_query = data.get("base64_query", "")
        base64_dataset = data.get("base64_dataset", [])

        start_time = time.time()
        image_comparator = ImageComparatorByTexture()

        # Proses gambar query
        query_matrix = image_comparator.process_base64_image(base64_query)

        # Proses gambar dataset
        dataset_matrices = [image_comparator.process_base64_image(base64_data) for base64_data in base64_dataset]

        # Hitung kesamaan
        similarities = image_comparator.compare_with_dataset(query_matrix, dataset_matrices)

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
        result = pdf_creator.create_pdf(
            data["image_query"],
            data["image_data_set"],
            data["is_texture"],
            data["result_percentage_set"],
            data["output_filename"],
            data["elapsed_time"],
        )
        return result
