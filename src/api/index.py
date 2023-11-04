from fastapi import FastAPI, File, UploadFile, Query
from typing import List
from urllib.parse import urlparse, urlunparse
from api.scraper import ImageScraper
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import io

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

@app.post("/api/convert")
async def convert(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        matrix = np.array(image)
        print(len(matrix))
        return {"matrix": matrix.tolist()}
    except Exception as e:
        return {"error": str(e)}
    
@app.post("/api/convert-multiple")
async def convert(file: List[UploadFile] = File(...)):
    matrices = []
    try:
        for uploaded_file in file:
            contents = await uploaded_file.read()
            image = Image.open(io.BytesIO(contents))
            matrix = np.array(image)
            matrices.append(matrix.tolist())
        return {"matrices": matrices}
    except Exception as e:
        return {"error": str(e)}


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
