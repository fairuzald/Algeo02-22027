import os
import base64
from io import BytesIO
from PIL import Image
from fpdf import FPDF
import tempfile

class PDFCreator:
    def __init__(self):
        self.max_width_mm = 550  # Batas lebar dalam milimeter
        self.max_height_mm = 550  # Batas tinggi dalam milimeter

    def base64_to_file(self, data: str, filename: str) -> str:
        base64_string = data.split(",")[1]
        image_data = base64.b64decode(base64_string)
        image = Image.open(BytesIO(image_data))
        temp_dir = tempfile.mkdtemp()
        image_file_path = os.path.join(temp_dir, filename)
        image.save(image_file_path)
        return image_file_path

    def process_image(self, image_data, filename):
        image_file = self.base64_to_file(image_data, filename)
        image_obj = Image.open(image_file)
        img_w, img_h = image_obj.size
        return image_file, img_w, img_h
    def watermark(self, pdf):
        pdf.set_text_color(200, 200, 200)  # Setel warna abu-abu
        pdf.set_font("Arial", style='B', size=50)
        pdf.rotate(45)
        pdf.text(0, pdf.h / 2, "CUKURUKUK")  # Posisi watermark di tengah halaman
        pdf.rotate(-45)
        pdf.set_text_color(0, 0, 0)  # Kembalikan ke warna hitam
        pdf.rotate(0)
        pdf.set_font("Arial", size=12)
        
        
    def add_image_to_pdf(self, pdf, image_file, img_w, img_h):
        max_width = self.max_width_mm / 25.4 * pdf.k
        max_height = self.max_height_mm / 25.4 * pdf.k
        scale_factor = min(max_width / img_w, max_height / img_h)
        img_w = int(img_w * scale_factor)
        img_h = int(img_h * scale_factor)
        pdf.image(image_file, x=10, y=pdf.get_y(), w=img_w, h=img_h)
        pdf.ln(img_h + 10)
        return img_w, img_h

    def create_pdf(self, data: dict):
        image_query = data['image_query']
        image_data_set = data['image_data_set']
        is_texture = data['is_texture']
        result_percentage_set = data['result_percentage_set']
        output_filename = data['output_filename']
        pdf = FPDF()
        pdf.add_page()
        self.watermark(pdf)

        # Menambahkan metode
        metode = "Texture" if is_texture else "Color"
        pdf.cell(200, 10, txt=f"Metode: {metode}", ln=True, align='C')
        pdf.ln(10)

        pdf.cell(200, 10, txt="Image Query", ln=True, align='C')
        pdf.ln(10)

        image_query_file, img_w, img_h = self.process_image(image_query, "image_query.png")
        img_w, img_h = self.add_image_to_pdf(pdf, image_query_file, img_w, img_h)

        pdf.cell(200, 10, txt="Data Set:", ln=True, align='C')
        pdf.ln(10)
        for index, (image_data, result_percentage) in enumerate(zip(image_data_set, result_percentage_set)):
            image_data_file, img_w, img_h = self.process_image(image_data, f"image_data_{index}.png")
            img_w, img_h = self.add_image_to_pdf(pdf, image_data_file, img_w, img_h)
            pdf.cell(200, 10, txt=f"Persentase: {result_percentage}%", ln=True)

            if pdf.get_y() + img_h > pdf.page_break_trigger:
                pdf.add_page()
                self.watermark(pdf)

        pdf_file_dir = "../test/output/"
        if not os.path.exists(pdf_file_dir):
            os.makedirs(pdf_file_dir)

        pdf_file_path = os.path.join(pdf_file_dir, f"{output_filename}.pdf")
        pdf.output(pdf_file_path)

        return {"file_path": pdf_file_path}