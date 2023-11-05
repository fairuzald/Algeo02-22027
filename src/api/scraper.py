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
            status_code = e.response.status_code
            if status_code == 404:
                raise HTTPException(status_code=404, detail="Page not found")
            elif status_code == 500:
                raise HTTPException(status_code=500, detail="Something went wrong")
            else:
                raise HTTPException(status_code=422, detail=str(e))

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
                # Find all image elements on the page, limited by the specified limits
                raw_image = page.find_all("img", limit=limits)

                if (len(raw_image) == 0 or raw_image is None or raw_image == []):
                    # If no images are found, try using the Selenium webdriver
                    page = self._get_page_driver(base_url)
                    raw_image = page.find_all("img", limit=limits)
                    print("Using Selenium webdriver")

                lists = []
                for event in raw_image:
                    # Get the relative URL of the image
                    relative_url = event.get("src")
                    # Get the alt text of the image
                    alt_text = event.get("alt")
                    if alt_text == "":
                        alt_text = relative_url.split("/")[-1].split(".")[0]
                    # If the relative URL is not empty, generate the absolute URL
                    if relative_url:
                        if relative_url.startswith(("http", "https")):
                            absolute_url = relative_url
                        else:
                            absolute_url = urljoin(base_url, relative_url)
                        url_parts = urlsplit(absolute_url)
                        path = url_parts.path
                        print(path)
                        file_extension = path.split(".")[-1].lower()
                        # Check if the file extension is allowed
                        if file_extension in {'jpeg', 'jpg', 'png', 'gif', 'bmp', 'tiff', 'webp'}:
                            matrix = imageProcessor.url_to_matrix(absolute_url)
                            lists.append({"url": absolute_url, "title": alt_text,"matrix":matrix})
                return lists

            except HTTPException as e:
                raise e
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
