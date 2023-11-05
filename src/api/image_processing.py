from typing import Dict, List, Union
from fastapi import UploadFile, HTTPException
import numpy as np
from PIL import Image
import io

class ImageProcessing:
    def convert(self, file: UploadFile) -> Union[Dict[str, List[List[int]]], Dict[str, str]]:
        try:
            contents = file.file.read()
            image = Image.open(io.BytesIO(contents))
            matrix = np.array(image)
            return {"matrix": matrix.tolist()}
        except FileNotFoundError:
            raise HTTPException(status_code=404, detail="Error: File not found")
        except ValueError:
            raise HTTPException(status_code=422, detail="Error: Invalid file format")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def convert_multiple(self, files: List[UploadFile]) -> Union[Dict[str, List[List[List[int]]]], Dict[str, str]]:
        matrices = []
        try:
            for uploaded_file in files:
                contents = uploaded_file.file.read()
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
