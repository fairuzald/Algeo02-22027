from fastapi import FastAPI, File, UploadFile, Query
from typing import List
from urllib.parse import urlparse, urlunparse
from api.scraper import ImageScraper
from fastapi.middleware.cors import CORSMiddleware

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


@app.post("/api/uploadfiles/")
async def create_upload_files(files: List[UploadFile] = File(...)):
    for file in files:
        with open(f"{file.filename}", "wb") as f:
            f.write(file.file.read())
    return {"filenames": [file.filename for file in files]}


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
