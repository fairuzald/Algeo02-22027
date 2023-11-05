import base64
from typing import Dict, List, Union
import cv2
from fastapi import UploadFile, HTTPException
import numpy as np
from PIL import Image
import io
from pydantic import BaseModel

import requests
class ImageProcessing:
    async def convert(self, file: UploadFile) -> Union[Dict[str, List[List[int]]], Dict[str, str]]:
        try:
            contents = await file.read()
            image = Image.open(io.BytesIO(contents))
            matrix = np.array(image)
            return {"matrix": matrix.tolist()}
        except FileNotFoundError:
            raise HTTPException(status_code=404, detail="Error: File not found")
        except ValueError:
            raise HTTPException(status_code=422, detail="Error: Invalid file format")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def convert_multiple(self, files: List[UploadFile]) -> Union[Dict[str, List[List[List[int]]]], Dict[str, str]]:
        matrices = []
        try:
            for uploaded_file in files:
                contents = await uploaded_file.read()
                image = Image.open(io.BytesIO(contents))
                matrix = np.array(image)
                matrices.append(matrix.tolist())
            return {"matrices": matrices}
        except FileNotFoundError:
            raise HTTPException(status_code=404, detail="Error: File not found")
        except ValueError:
            raise HTTPException(status_code=422, detail="Error: Invalid file format")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    class ImageUrls(BaseModel):
        urls: List[str]

    def url_to_matrix(self, url):
        response = requests.get(url, stream=True)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch image from URL")

        image_bytes = bytes()
        for chunk in response.iter_content(chunk_size=128):
            image_bytes += chunk

        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Ubah gambar ke dalam format matriks (array NumPy)
        if image is not None:
            matrix = image.tolist()
            return matrix
        else:
            raise HTTPException(status_code=400, detail="Failed to convert image to matrix")
        
    async def convert_camera(self, image_data: str) -> Dict[str, List[List[int]]]:
        try:
            if not image_data:
                raise HTTPException(status_code=400, detail="Image data is empty")

            if not image_data.startswith("data:image/png;base64,"):
                raise HTTPException(status_code=422, detail="Invalid image data format")

            img_str = image_data.split(",")[1]
            img_bytes = base64.b64decode(img_str)
            img = Image.open(io.BytesIO(img_bytes))
            img_matrix = np.array(img)

            return {"matrix": img_matrix.tolist()}
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))