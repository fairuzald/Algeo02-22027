import base64
import os
import cv2
from fastapi import FastAPI, File,  Request, UploadFile, APIRouter
from typing import List
from urllib.parse import urlparse, urlunparse
import numpy as np
from io import BytesIO
from PIL import Image
from pydantic import BaseModel
import requests
from api.scraper import ImageScraper
from fastapi.middleware.cors import CORSMiddleware
from api.image_processing import ImageProcessing
from fpdf import FPDF
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

@app.post("/api/create-pdf-file")
async def create_pdf(data: dict):
    image_query = data['image_query']
    image_data_set = data['image_data_set']

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    # Menambahkan judul dan gambar Image Query
    pdf.cell(200, 10, txt="Image Query", ln=True, align='C')
    pdf.ln(10)
    image_query_file = base64_to_file(image_query, "image_query.png")
    pdf.image(image_query_file, x=10, y=pdf.get_y(), w=100)

    # Menambahkan judul Data Set dan mapping dari image data set
    pdf.ln(60)
    pdf.cell(200, 10, txt="Data Set:", ln=True, align='C')
    pdf.ln(10)
    for index, image_data in enumerate(image_data_set):
        image_data_file = base64_to_file(image_data, f"image_data_{index}.png")
        pdf.image(image_data_file, x=10, y=pdf.get_y(), w=100)
        pdf.ln(60)

    # Membuat direktori jika belum ada
    pdf_file_dir = "../test/output/"
    if not os.path.exists(pdf_file_dir):
        os.makedirs(pdf_file_dir)

    # Menyimpan file PDF
    pdf_file_path = os.path.join(pdf_file_dir, "output.pdf")
    pdf.output(pdf_file_path)

    return {"file_path": pdf_file_path}


import tempfile

def base64_to_file(data: str, filename: str) -> str:
    # Menghapus prefix "data:image/png;base64," dari string base64
    base64_string = data.split(",")[1]
    # Mengonversi string base64 menjadi file gambar
    image_data = base64.b64decode(base64_string)
    image = Image.open(BytesIO(image_data))

    # Membuat direktori sementara
    temp_dir = tempfile.mkdtemp()
    # Menyimpan gambar ke direktori sementara
    image_file_path = os.path.join(temp_dir, filename)
    image.save(image_file_path)
    return image_file_path
