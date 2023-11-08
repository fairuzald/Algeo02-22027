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
    urls: List[str]

@app.post("/api/convert-image-to-base64")
async def convert_image_to_base64(request: ConvertImageToBase64Request):
    return await imageProcessor.url_to_base64(request.urls)
    
@app.post("/api/convert")
async def convert(file: UploadFile = File(...)):
    return await imageProcessor.convert(file)

@app.post("/api/convert-multiple")
async def convert_multiple(files: List[UploadFile] = File(...)):
    return await imageProcessor.convert_multiple(files)

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
