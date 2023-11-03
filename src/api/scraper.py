# image_scraper.py
from typing import List
import requests as _requests
from urllib.parse import urljoin
import bs4 as _bs4

class ImageScraper:
    def _get_page(self, url: str) -> _bs4.BeautifulSoup:
        page = _requests.get(url)
        soup = _bs4.BeautifulSoup(page.content, "html.parser")
        return soup

    def image_of_the_day(self, url: str) -> List[str]:
        base_url = url
        page = self._get_page(base_url)
        raw_image = page.find_all("img")
        lists = []
        for event in raw_image:
            # Get the relative URL from the "src" attribute
            relative_url = event.get("src")
            # Check if the relative URL already contains "http" or "https"
            if relative_url.startswith(("http", "https")):
                absolute_url = relative_url
            else:
                # Combine the base URL with the relative URL to get the absolute URL
                absolute_url = urljoin(base_url, relative_url)
            lists.append(absolute_url)
        return lists
