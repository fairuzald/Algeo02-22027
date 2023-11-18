import base64
from typing import Dict, List, Union
import cv2
from fastapi import UploadFile, HTTPException
import numpy as np
from pydantic import BaseModel

import requests

from api.object_detector import ObjectDetector
detector = ObjectDetector()

class ImageProcessing:
    async def convert(self, file: UploadFile) -> Union[Dict[str, List[List[int]]], Dict[str, str]]:
        try:
            contents = await file.read()
            matrix = cv2.imdecode(np.frombuffer(contents, np.uint8), -1)

            # Detect and crop the image
            cropped_img = detector.detect_and_crop(matrix) if len(matrix.shape) == 3 else matrix

            # Save PIL Image to memory as bytes with PNG format
            _, img_bytes = cv2.imencode('.png', cropped_img)
            base64_img = base64.b64encode(img_bytes).decode("utf-8")

            return {"base64": f'data:image/png;base64,{base64_img}'}

        except FileNotFoundError:
            raise HTTPException(status_code=404, detail="Error: File not found")
        except ValueError:
            raise HTTPException(status_code=422, detail="Error: Invalid file format")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def convertWithoutYolo(self, file: UploadFile) -> Union[Dict[str, List[List[int]]], Dict[str, str]]:
        try:
            contents = await file.read()
            base64_image = base64.b64encode(contents).decode("utf-8")

            return {"base64": f'data:image/png;base64,{base64_image}'}
        except FileNotFoundError:
            raise HTTPException(status_code=404, detail="Error: File not found")
        except ValueError:
            raise HTTPException(status_code=422, detail="Error: Invalid file format")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def convert_multiple(self, files: List[UploadFile]) -> Union[Dict[str, List[List[List[int]]]], Dict[str, str]]:
        base64_images = []

        try:
            for uploaded_file in files:
                # Read file contents
                contents = await uploaded_file.read()

                # Process image and convert to matrix
                matrix = cv2.imdecode(np.frombuffer(contents, np.uint8), -1)

            # Detect and crop the image
                cropped_img = None
                cropped_img = detector.detect_and_crop(matrix) if len(matrix.shape) == 3 else matrix

            # Save PIL Image to memory as bytes with PNG format
                _, img_bytes = cv2.imencode('.png', cropped_img)
                base64_img = base64.b64encode(img_bytes).decode("utf-8")

                # Append results to lists
                base64_images.append(f"data:image/png;base64,{base64_img}")

            # Return the result as a dictionary
            return {"base64_images": base64_images}

        except FileNotFoundError:
            raise HTTPException(status_code=404, detail="Error: File not found")
        except ValueError:
            raise HTTPException(status_code=422, detail="Error: Invalid file format")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    # Nested class for Pydantic model
    class ImageUrls(BaseModel):
        urls: List[str]
        
    async def convert_camera(self, image_data: str) -> Dict[str, List[List[int]]]:
        try:
            if not image_data.startswith("data:image/png;base64,"):
                raise HTTPException(status_code=422, detail="Invalid image data format")

            img_str = image_data.split(",")[1]
            img_bytes = base64.b64decode(img_str)
            matrix = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), -1)

            cropped_img = detector.detect_and_crop(matrix) if len(matrix.shape) == 3 else matrix

            # Save PIL Image to memory as bytes with PNG format
            _, img_bytes = cv2.imencode('.png', cropped_img)
            base64_img = base64.b64encode(img_bytes).decode("utf-8")

            return {"base64": 'data:image/png;base64,' + base64_img}
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        
    def url_to_base64(self, url: str) -> str:
        try:
            response = requests.get(url)
            response.raise_for_status()
            image_content = response.content
            base64_image = base64.b64encode(image_content).decode("utf-8")
            return 'data:image/png;base64,'+base64_image
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
