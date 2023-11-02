from fastapi import FastAPI, File, UploadFile, Query
from typing import List

import requests
from bs4 import BeautifulSoup

app = FastAPI()

@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}

@app.post("/api/uploadfiles/")
async def create_upload_files(files: List[UploadFile] = File(...)):
    for file in files:
        with open(f"{file.filename}", "wb") as f:
            f.write(file.file.read())
    return {"filenames": [file.filename for file in files]}

@app.post("/api/scrape")
def scrape_website(url: str = Query(..., alias="url")):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    image_tags = soup.find_all('img')
    for image in image_tags:
        print(image['src'])
    return {'image_urls': [image['src'] for image in image_tags]}