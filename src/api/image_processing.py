import base64
from typing import Dict, List, Union
import cv2
from fastapi import UploadFile, HTTPException
import numpy as np
from PIL import Image
import io
from pydantic import BaseModel

import requests

from api.object_detector import ObjectDetector
detector = ObjectDetector()
class ImageProcessing:
    async def convert(self, file: UploadFile) -> Union[Dict[str, List[List[int]]], Dict[str, str]]:
        try:
            contents = await file.read()
            
            image = Image.open(io.BytesIO(contents))
            matrix = np.array(image)

            # Detect and crop the image
            cropped_img = detector.detect_and_crop(matrix)
            
            # Convert the cropped image to base64
            pil_img = Image.fromarray(cropped_img)

            # Simpan PIL Image ke dalam memory sebagai bytes dengan format PNG
            img_bytes_io = io.BytesIO()
            pil_img.save(img_bytes_io, format='PNG')
            img_bytes = img_bytes_io.getvalue()

            # Konversi bytes ke base64
            base64_img = base64.b64encode(img_bytes).decode('utf-8')

            return {"matrix": cropped_img.tolist(), "base64": base64_img}
        except FileNotFoundError:
            raise HTTPException(status_code=404, detail="Error: File not found")
        except ValueError:
            raise HTTPException(status_code=422, detail="Error: Invalid file format")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def convert_multiple(self, files: List[UploadFile]) -> Union[Dict[str, List[List[List[int]]]], Dict[str, str]]:
        matrices = []
        base64_images = []
        try:
            for uploaded_file in files:
                contents = await uploaded_file.read()
                image = Image.open(io.BytesIO(contents))
                matrix = np.array(image)

            # Detect and crop the image
                cropped_img = detector.detect_and_crop(matrix)
            
            # Convert the cropped image to base64
                pil_img = Image.fromarray(cropped_img)
               

            # Simpan PIL Image ke dalam memory sebagai bytes dengan format PNG
                img_bytes_io = io.BytesIO()
                pil_img.save(img_bytes_io, format='PNG')
                img_bytes = img_bytes_io.getvalue()

            # Konversi bytes ke base64
                base64_img = base64.b64encode(img_bytes).decode('utf-8')
                base64_images.append(f"data:image/png;base64,{base64_img}")
                matrices.append(matrix.tolist())
            return {"matrices": matrices, "base64_images": base64_images}
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
        
    def url_to_base64(self, url):
        response = requests.get(url)
        if response.status_code == 200:
            # If the request is successful, determine the image format
            content_type = response.headers['Content-Type']
            image_format = content_type.split('/')[-1]
            
            # Encode the binary content to base64
            base64_string = base64.b64encode(response.content).decode('utf-8')
            
            # Return the base64 string with the format prefix
            return f'data:image/{image_format};base64,{base64_string}'
        else:
            # If the request fails, return None or handle the error as desired
            return None
