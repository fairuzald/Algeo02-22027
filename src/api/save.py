import os
import base64
from io import BytesIO
from typing import List
from PIL import Image
from fastapi import HTTPException
from fpdf import FPDF
import tempfile

class PDFCreator:
    def __init__(self):
        self.max_width_mm = 550  # Maximum width in millimeters
        self.max_height_mm = 550  # Maximum height in millimeters

    def _base64_to_file(self, data: str, filename: str) -> str:
        # Convert base64 image data to a file
        base64_string = data.split(",")[1]
        image_data = base64.b64decode(base64_string)
        image = Image.open(BytesIO(image_data))
        temp_dir = tempfile.mkdtemp()
        image_file_path = os.path.join(temp_dir, filename)
        image.save(image_file_path)
        return image_file_path

    def _process_image(self, image_data, filename):
        # Process image data and return image file path, width, and height
        image_file = self._base64_to_file(image_data, filename)
        image_obj = Image.open(image_file)
        img_w, img_h = image_obj.size
        return image_file, img_w, img_h
    
    def _watermark(self, pdf):
        # Add _watermark to the PDF
        pdf.set_text_color(200, 200, 200)  # Set gray color
        pdf.set_font("Arial", style='B', size=50)
        pdf.rotate(45)
        pdf.text(-pdf.w/4, pdf.h / 2, "CUKURUKUK")  # _Watermark position in the middle of the page
        pdf.rotate(-45)
        pdf.set_text_color(0, 0, 0)  # Reset to black color
        pdf.rotate(0)
        pdf.set_font("Arial", size=12)
        
    def _add_image_to_pdf(self, pdf, image_file, img_w, img_h):
        # Add image to the PDF with scaling
        max_width = self.max_width_mm / 25.4 * pdf.k
        max_height = self.max_height_mm / 25.4 * pdf.k
        scale_factor = min(max_width / img_w, max_height / img_h)
        img_w = int(img_w * scale_factor)
        img_h = int(img_h * scale_factor)
        pdf.image(image_file, x=10, y=pdf.get_y(), w=img_w, h=img_h)
        pdf.ln(img_h)
        return img_w, img_h

    def create_pdf(self, image_query: str, image_data_set: List[str], is_texture: bool, result_percentage_set: List[float], output_filename: str, elapsed_time: float):
        try:
            # Initialize PDF object
            pdf = FPDF()
            pdf.add_page()
            self._watermark(pdf)

            # Add title and method information
            metode = "Texture" if is_texture else "Color"
            pdf.set_font("Arial", style='B', size=28)
            pdf.cell(200, 25, txt=f"Report Cukurukuk CBIR", ln=True, align='C')
            pdf.set_font("Arial", style='B', size=20)
            pdf.cell(200, 10, txt=f"Method: {metode}", ln=True, align='C')
            pdf.cell(200, 10, txt="Image Query: ", ln=True, align='C')

            # Process and add image query to PDF
            image_query_file, img_w, img_h = self._process_image(image_query, "image_query.png")
            img_w, img_h = self._add_image_to_pdf(pdf, image_query_file, img_w, img_h)

            # Add results information
            pdf.set_font("Arial", style='B', size=14)
            pdf.multi_cell(200, 10, txt=f"{len(image_data_set)} Results with similarities in {elapsed_time} seconds:")

            # Add image data and similarity percentage to PDF
            pdf.set_font("Arial", size=12)
            for index, (image_data, result_percentage) in enumerate(zip(image_data_set, result_percentage_set)):
                    image_data_file, img_w, img_h = self._process_image(image_data, f"image_data_{index}.png")
                    img_w, img_h = self._add_image_to_pdf(pdf, image_data_file, img_w, img_h)
                    pdf.cell(200, 20, txt=f"Similarity percentage: {result_percentage}%", ln=True)

                    # Check if the page needs to be continued to the next page
                    if pdf.get_y() + img_h > pdf.page_break_trigger:
                        pdf.add_page()
                        self._watermark(pdf)
                    
            # Save the PDF file
            pdf_file_dir = "../test/output/"
            if not os.path.exists(pdf_file_dir):
                os.makedirs(pdf_file_dir)

            pdf_file_path = os.path.join(pdf_file_dir, f"{output_filename}.pdf")
            pdf.output(pdf_file_path)

            return {"file_path": pdf_file_path}
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
