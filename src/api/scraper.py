from typing import Dict, List
from fastapi import HTTPException
import requests
from urllib.parse import urljoin, urlsplit
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from api.image_processing import ImageProcessing

# Initialize ImageProcessing object
imageProcessor = ImageProcessing()


class ImageScraper:
    def _get_page(self, url: str) -> BeautifulSoup:
        try:
            # Make a GET request to the URL and parse the page content
            page = requests.get(url)
            page.raise_for_status()  # Raise HTTPError for bad responses (4xx and 5xx)
            soup = BeautifulSoup(page.content, "html.parser")
            return soup
        except requests.HTTPError as e:
            raise HTTPException(status_code=e.response.status_code, detail=str(e))

    def _get_page_driver(self, url: str) -> BeautifulSoup:
        try:
            chrome_options = Options()
            chrome_options.add_argument("--headless")
            driver = webdriver.Chrome(options=chrome_options)
            # Navigate to the URL
            driver.get(url)

            # Wait until all elements in the DOM are loaded
            WebDriverWait(driver, 3).until(
                EC.presence_of_all_elements_located((By.XPATH, "//body/*"))
            )

            # Parse the page content with BeautifulSoup
            soup = BeautifulSoup(driver.page_source, "html.parser")
            return soup

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

        finally:
            # Close the webdriver
            driver.quit()

    def get_image(self, url: str, limits: int = 0) -> List[Dict[str, str]]:
        try:
            base_url = url
            page = self._get_page(base_url)
            
            if not (raw_image := page.find_all("img", limit=limits)):
                page = self._get_page_driver(base_url)
                raw_image = page.find_all("img", limit=limits)
                print("Using Selenium webdriver")

            lists = []
            for event in raw_image:
                relative_url = event.get("src")
                alt_text = event.get("alt", "")
                if not alt_text:
                    alt_text = relative_url.split("/")[-1].split(".")[0]
                if relative_url:
                    absolute_url = urljoin(base_url, relative_url)
                    file_extension = absolute_url.rsplit(".", 1)[-1].lower()
                    if file_extension in {'jpeg', 'jpg', 'png', 'gif', 'bmp', 'tiff', 'webp'}:
                        # Convert image to base64 using ImageProcessing
                        base64_image = imageProcessor.url_to_base64(absolute_url)
                        lists.append({"url": base64_image, "title": alt_text})
            return lists

        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))