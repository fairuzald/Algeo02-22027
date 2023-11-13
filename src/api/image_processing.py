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

            # Save PIL Image to memory as bytes with PNG format
            img_bytes_io = io.BytesIO()
            Image.fromarray(cropped_img).save(img_bytes_io, format='PNG')
            img_bytes = img_bytes_io.getvalue()

            return {"matrix": cropped_img.tolist(), "base64": f'data:image/png;base64,{base64.b64encode(img_bytes).decode("utf-8")}'}

        except FileNotFoundError:
            raise HTTPException(status_code=404, detail="Error: File not found")
        except ValueError:
            raise HTTPException(status_code=422, detail="Error: Invalid file format")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def convertWithoutYolo(self, file: UploadFile) -> Union[Dict[str, List[List[int]]], Dict[str, str]]:
        try:
            contents = await file.read()
            
            image = Image.open(io.BytesIO(contents))
            matrix = np.array(image)

            # Save PIL Image to memory as bytes with PNG format
            img_bytes_io = io.BytesIO()
            image.save(img_bytes_io, format='PNG')  # Save the image to the BytesIO object
            img_bytes = img_bytes_io.getvalue()  # Get the value of the BytesIO object

            # Convert bytes to base64
            base64_img = base64.b64encode(img_bytes).decode('utf-8')

            return {"matrix": matrix.tolist(), "base64": 'data:image/png;base64,'+base64_img}
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
                # Read file contents
                contents = await uploaded_file.read()

                # Process image and convert to matrix
                image = Image.open(io.BytesIO(contents))
                matrix = np.array(image)

                # Detect and crop the image
                cropped_img = detector.detect_and_crop(matrix)

                # Convert the cropped image to base64
                pil_img = Image.fromarray(cropped_img)
                img_bytes_io = io.BytesIO()
                pil_img.save(img_bytes_io, format='PNG')
                img_bytes = img_bytes_io.getvalue()
                base64_img = base64.b64encode(img_bytes).decode('utf-8')

                # Append results to lists
                matrices.append(cropped_img.tolist())
                base64_images.append(f"data:image/png;base64,{base64_img}")

            # Return the result as a dictionary
            return {"matrices": matrices, "base64_images": base64_images}

        except FileNotFoundError:
            raise HTTPException(status_code=404, detail="Error: File not found")
        except ValueError:
            raise HTTPException(status_code=422, detail="Error: Invalid file format")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    # Nested class for Pydantic model
    class ImageUrls(BaseModel):
        urls: List[str]

    def url_to_matrix(self, url: str) -> List[List[int]]:
        try:
            response = requests.get(url, stream=True)
            if response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to fetch image from URL")

            image_bytes = bytes()
            for chunk in response.iter_content(chunk_size=128):
                image_bytes += chunk

            nparr = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            # Convert image to matrix (NumPy array)
            if image is not None:
                matrix = image.tolist()
                return matrix
            else:
                raise HTTPException(status_code=400, detail="Failed to convert image to matrix")
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        
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

            # Detect and crop the image
            cropped_img = detector.detect_and_crop(img_matrix)
            
            # Convert the cropped image to base64
            pil_img = Image.fromarray(cropped_img)
            
            # Save PIL Image to memory as bytes with PNG format
            img_bytes_io = io.BytesIO()
            pil_img.save(img_bytes_io, format='PNG')
            img_bytes = img_bytes_io.getvalue()

            # Convert bytes to base64
            base64_img = base64.b64encode(img_bytes).decode('utf-8')

            # Encode the response data using the custom encoder
            return {"matrix": cropped_img.tolist(), "base64": 'data:image/png;base64,' + base64_img}
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        
    async def url_to_base64(self, urls: List[str]) -> List[str]:
        result = []
        try:
            for url in urls:
                response = requests.get(url)
                if response.status_code == 200:
                    content_type = response.headers['Content-Type']
                    image_format = content_type.split('/')[-1]
                    base64_string = base64.b64encode(response.content).decode('utf-8')
                    base64_result = f'data:image/{image_format};base64,{base64_string}'
                    result.append(base64_result)
                else:
                    raise HTTPException(status_code=400, detail="Failed to fetch image from URL")
            return result
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
