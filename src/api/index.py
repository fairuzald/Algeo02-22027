import base64
from typing import Dict
from typing import Union
import io
import cv2
from fastapi import FastAPI, File,  Request, UploadFile
from typing import List
from urllib.parse import urlparse, urlunparse
from fastapi.responses import StreamingResponse
import numpy as np
from pydantic import BaseModel
from api.object_detector import ObjectDetector
from api.scraper import ImageScraper
from fastapi.middleware.cors import CORSMiddleware
from api.image_processing import ImageProcessing
from api.save import PDFCreator
from PIL import Image

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
    url: str

@app.post("/api/convert-image-to-base64")
async def convert_image_to_base64(request: ConvertImageToBase64Request):
    return imageProcessor.url_to_base64(request.url)
    
@app.post("/api/convert")
async def convert(file: UploadFile = File(...)):
    return await imageProcessor.convert(file)

@app.post("/api/convert-multiple")
async def convert_multiple(files: List[UploadFile] = File(...)):
    return await imageProcessor.convert_multiple(files)

detector = ObjectDetector()

# Endpoint API untuk mendeteksi dan memotong objek

# Inisialisasi object detector
detector = ObjectDetector()

# Endpoint untuk mengolah gambar yang di-upload
@app.post("/api/process_image")
async def process_image(file: UploadFile = File(...)) -> Dict[str, Union[List[List[int]], str]]:
    # Baca file yang di-upload
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    image_matrix = np.array(image)

    # Deteksi objek dan crop gambar jika mungkin
    cropped_image = detector.detect_and_crop(image_matrix)

    if cropped_image is not None:
        # Jika berhasil crop, konversi hasilnya ke matriks dan base64
        cropped_matrix = cropped_image.tolist()
        _, buffer = cv2.imencode('.png', cropped_image)
        image_base64 = base64.b64encode(buffer).decode('utf-8')
        return {"matrix": cropped_matrix, "base64": image_base64}
    else:
        # Jika tidak bisa crop, kembalikan matriks dan base64 dari gambar asli
        original_matrix = image_matrix.tolist()
        _, buffer = cv2.imencode('.png', image_matrix)
        image_base64 = base64.b64encode(buffer).decode('utf-8')
        return {"matrix": original_matrix, "base64": image_base64}

@app.post("/api/convert-camera")
async def convert_camera(request: Request):
    body = await request.json()
    image_data = body.get("image_data")
    return await imageProcessor.convert_camera(image_data)
    
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

class Data(BaseModel):
    image_query: str
    image_data_set: list[str]
    is_texture: bool
    result_percentage_set: list[float]
    output_filename: str

@app.post("/api/create-pdf-file")
async def create_pdf_file(data: Data):
    result = pdf_creator.create_pdf(data.model_dump())
    return result
