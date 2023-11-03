from typing import Dict, List
import requests
from urllib.parse import urljoin
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

class ImageScraper:
    def _get_page(self, url: str) -> BeautifulSoup:
        # Make a GET request to the URL and parse the page content
        page = requests.get(url)
        soup = BeautifulSoup(page.content, "html.parser")
        return soup

    def _get_page_driver(self, url: str) -> BeautifulSoup:
        # Set up Chrome options for headless browsing
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        # Initialize the Chrome webdriver
        driver = webdriver.Chrome(options=chrome_options)
        # Navigate to the URL
        driver.get(url)

        # Wait until all elements in the DOM are loaded
        WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.XPATH, "//body/*"))
        )

        # Parse the page content with BeautifulSoup
        soup = BeautifulSoup(driver.page_source, "html.parser")
        # Close the webdriver
        driver.quit()
        return soup

    def get_image(self, url: str, limits: int = 0) -> List[Dict[str, str]]:
        base_url = url
        # Get the parsed page content
        page = self._get_page(base_url)
        # Find all image elements on the page, limited by the specified limits
        raw_image = page.find_all("img", limit=limits)
        
        if(len(raw_image)==0):
            # If no images are found, try using the Selenium webdriver
            page = self._get_page_driver(base_url)
            raw_image = page.find_all("img", limit=limits)
            
        # Initialize an empty list to store the image data
        lists = []
        # Initialize a counter for image titles without alt text
        counter = 0
        for event in raw_image:
            # Get the relative URL of the image
            relative_url = event.get("src")
            # Get the alt text of the image
            alt_text = event.get("alt")
            # If the alt text is empty, generate a default title
            if alt_text == "":
                counter += 1
                alt_text = f"Image {counter}"
            # If the relative URL is not empty, generate the absolute URL
            if relative_url:
                if relative_url.startswith(("http", "https")):
                    absolute_url = relative_url
                else:
                    absolute_url = urljoin(base_url, relative_url)
                # Append the image data to the list
                lists.append({"url": absolute_url, "title": alt_text})
        return lists
