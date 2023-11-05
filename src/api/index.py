import cv2
from fastapi import FastAPI, File, HTTPException, UploadFile
from typing import List
from urllib.parse import urlparse, urlunparse
import numpy as np

from pydantic import BaseModel
import requests
from api.scraper import ImageScraper
from fastapi.middleware.cors import CORSMiddleware
from api.image_processing import ImageProcessing

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
@app.post("/api/convert")
async def convert(file: UploadFile = File(...)):
    return imageProcessor.convert(file)

@app.post("/api/convert-multiple")
async def convert_multiple(files: List[UploadFile] = File(...)):
    return imageProcessor.convert_multiple(files)

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
