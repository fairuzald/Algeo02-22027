from fastapi import FastAPI,File, UploadFile
from typing import List
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