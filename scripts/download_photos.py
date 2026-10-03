import os
import requests
from dotenv import load_dotenv
import time

load_dotenv()

UNSPLASH_KEY = os.getenv('UNSPLASH_ACCESS_KEY')
PEXELS_KEY = os.getenv('PEXELS_API_KEY')
PIXABAY_KEY = os.getenv('PIXABAY_API_KEY')

QUERIES = {
    'Udaipur': ['City Palace Udaipur', 'Lake Pichola', 'Jag Mandir', 'Udaipur haveli', 'Rajasthani food dal baati', 'Udaipur sunset', 'Udaipur market'],
    'Manali': ['Rohtang Pass', 'Solang Valley snow', 'Manali pine forest', 'Old Manali cafe', 'Hidimba Temple', 'Manali river rafting', 'momos street food India'],
    'Hampi': ['Virupaksha Temple Hampi', 'Hampi stone chariot', 'Hampi boulders', 'Tungabhadra River', 'Hampi sunrise ruins', 'Hampi coracle ride'],
    'Goa': ['Palolem beach Goa', 'Anjuna beach', 'Basilica Bom Jesus Goa', 'Goa beach shack', 'Goa seafood', 'Fort Aguada'],
    'Travel_Utility': ['boarding pass', 'hotel booking confirmation', 'train ticket India', 'airport terminal sign', 'restaurant bill receipt', 'Google Maps navigation']
}

def download_image(url, filepath):
    try:
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            return True
    except Exception as e:
        print(f"Failed to download {url}: {e}")
    return False

def search_unsplash(query, per_page=5):
    if not UNSPLASH_KEY: return []
    url = f"https://api.unsplash.com/search/photos?query={query}&per_page={per_page}&client_id={UNSPLASH_KEY}"
    res = requests.get(url)
    if res.status_code == 200:
        return [item['urls']['regular'] for item in res.json().get('results', [])]
    return []

# Placeholder for Pexels and Pixabay fallbacks
def search_pexels(query, per_page=5):
    if not PEXELS_KEY: return []
    url = f"https://api.pexels.com/v1/search?query={query}&per_page={per_page}"
    res = requests.get(url, headers={"Authorization": PEXELS_KEY})
    if res.status_code == 200:
        return [item['src']['large'] for item in res.json().get('photos', [])]
    return []

def main():
    base_dir = os.path.join("public", "photos")
    
    for city, terms in QUERIES.items():
        city_dir = os.path.join(base_dir, city)
        os.makedirs(city_dir, exist_ok=True)
        count = 1
        
        for term in terms:
            print(f"Searching for {term} in {city}...")
            urls = search_unsplash(term)
            if not urls:
                urls = search_pexels(term)
                
            for url in urls:
                filename = f"{city.lower()}_{count:03d}.jpg"
                filepath = os.path.join(city_dir, filename)
                if download_image(url, filepath):
                    print(f"Downloaded {filename}")
                    count += 1
            time.sleep(1) # rate limit prevention

if __name__ == "__main__":
    main()
