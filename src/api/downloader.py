
import base64
import os
import re


class Downloader:
    def __init__(self):
        # Dummy data: daftar base64 encoded images
        self.base64_images = []

    def download_all_images(self, data: dict, output_file_name: str):
        file_dir = f"../test/output/{output_file_name}"
        if not os.path.exists(file_dir):
            os.makedirs(file_dir)

        for i, image in enumerate(data.get('data', [])):
            base64_image = image.get('url', '').split(",")[1]
            # Add padding to the Base64 string if necessary
            base64_image_padded = base64_image + "=" * (4 - (len(base64_image) % 4))
            image_data_binary = base64.b64decode(base64_image_padded)
            title = image.get('title', f"image_{i}")

            # Sanitize the title to remove invalid characters
            sanitized_title = re.sub(r'[^\w\s.-]', '', title)
            
            
            file_path = os.path.join(file_dir, f"{sanitized_title}.png")

            with open(file_path, "wb") as f:
                f.write(image_data_binary)

        return {"message": "Images downloaded successfully"}
