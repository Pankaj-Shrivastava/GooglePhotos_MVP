import os
import json
import base64
import requests
import time
from datetime import datetime, timezone
from dotenv import load_dotenv
import glob

load_dotenv()
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
OUTPUT_PATH = os.path.join("src", "data", "tags.json")
BATCH_SIZE = 5  # Save to file every 5 photos

REQUIRED_FIELDS = [
    "primary_subjects", "descriptive_tags", "sensory_cues",
    "mood_and_tone", "dominant_colors", "alt_text", "micro_story"
]

PROMPT = """You are analyzing a travel photo from a trip to {city}, India. 
Extract the following metadata as a JSON object:

{
  "primary_subjects": [...],     // 3-5 core objects/entities
  "descriptive_tags": [...],     // 4-6 rich visual descriptions  
  "sensory_cues": [...],         // 4-6 textures, temperatures, sounds, feelings
  "mood_and_tone": [...],        // 2-3 emotional descriptors
  "dominant_colors": [...],      // 3-5 prominent colors
  "alt_text": "...",             // One descriptive sentence
  "micro_story": "..."          // 1-2 sentence narrative from the perspective 
                                 // of a 28-year-old traveler named Priya
}

Be specific and evocative. Avoid generic tags. Focus on what makes 
this photo unique -- the sensory details someone would remember."""


def log(msg):
    """Print with immediate flush so logs are visible in real-time."""
    safe_msg = msg.encode('ascii', 'replace').decode('ascii')
    print(safe_msg, flush=True)


def encode_image(image_path):
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode('utf-8')


def validate_tags(tags):
    if not isinstance(tags, dict): return False
    for field in REQUIRED_FIELDS:
        if field not in tags: return False
    return True


def load_existing_data():
    if os.path.exists(OUTPUT_PATH):
        try:
            with open(OUTPUT_PATH, "r") as f:
                data = json.load(f)
                if "photos" in data and isinstance(data["photos"], list):
                    return data
        except Exception:
            pass
    return None


def save_data(output_data):
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    output_data["generated_at"] = datetime.now(timezone.utc).isoformat()
    output_data["total_photos"] = len(output_data["photos"])
    with open(OUTPUT_PATH, "w") as f:
        json.dump(output_data, f, indent=2)
    log(f"  [SAVED] tags.json updated on disk with {output_data['total_photos']} photos.")


MODELS = [
    "gemini-3.5-flash",
    "gemini-3.1-flash",
    "gemini-flash-latest",
    "gemini-pro-latest"
]

def generate_tags_for_image(city, image_path, model_name):
    if not GEMINI_API_KEY:
        log("Missing GEMINI_API_KEY")
        return None
        
    img_data = encode_image(image_path)
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={GEMINI_API_KEY}"
    
    payload = {
        "contents": [{
            "parts": [
                {"text": PROMPT.replace("{city}", city)},
                {"inline_data": {"mime_type": "image/jpeg", "data": img_data}}
            ]
        }],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }
    
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            content = response.json().get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            content = content.strip()
            if content.startswith("```json"): content = content[7:]
            if content.startswith("```"): content = content[3:]
            if content.endswith("```"): content = content[:-3]
            
            return json.loads(content)
        else:
            log(f"  API Error ({response.status_code}) with {model_name}: {response.text[:200]}")
            return None
    except Exception as e:
        log(f"  Network error with {model_name}: {e}")
        return None


def main():
    photos_dir = os.path.join("public", "photos")
    
    existing_data = load_existing_data()
    if existing_data:
        output_data = existing_data
        processed_ids = {p["id"] for p in output_data["photos"]}
        log(f"Resuming - {len(processed_ids)} photos already in tags.json")
    else:
        output_data = {
            "generated_at": "",
            "model": "gemini-multi-fallback",
            "total_photos": 0,
            "photos": []
        }
        processed_ids = set()
        log("Starting fresh - no tags.json found")
    
    all_images = []
    for city_folder in sorted(os.listdir(photos_dir)):
        city_path = os.path.join(photos_dir, city_folder)
        if os.path.isdir(city_path):
            city_name = city_folder.replace("_", " ").title()
            for img_path in sorted(glob.glob(os.path.join(city_path, "*.jpg"))):
                filename = os.path.basename(img_path)
                photo_id = filename.split(".")[0]
                all_images.append((city_name, img_path, filename, photo_id))
    
    total = len(all_images)
    skipped, processed, failed = 0, 0, 0
    batch_counter = 0
    
    log(f"Found {total} images to process.\n")
    
    for idx, (city_name, img_path, filename, photo_id) in enumerate(all_images, 1):
        if photo_id in processed_ids:
            skipped += 1
            continue
            
        log(f"[{idx}/{total}] Processing {filename}...")
        
        tags = None
        model_idx = 0
        max_attempts = len(MODELS) * 2  # Try each model twice in rotation
        
        for attempt in range(max_attempts):
            model_name = MODELS[model_idx % len(MODELS)]
            log(f"  Trying {model_name} (Attempt {attempt + 1}/{max_attempts})...")
            
            tags = generate_tags_for_image(city_name, img_path, model_name)
            if tags and validate_tags(tags): 
                break
            
            log(f"  Failed with {model_name}. Retrying in 5s...")
            time.sleep(5)
            model_idx += 1
            
        if tags and validate_tags(tags):
            clean_tags = {field: tags[field] for field in REQUIRED_FIELDS}
            output_data["photos"].append({"id": photo_id, "filename": filename, "city": city_name, **clean_tags})
            processed += 1
            batch_counter += 1
            
            # Batch saving logic
            if batch_counter >= BATCH_SIZE:
                save_data(output_data)
                batch_counter = 0
        else:
            failed += 1
            log(f"  Failed after 3 attempts.")
            
        time.sleep(4)  # 15 requests per minute limit = 1 every 4s
        
    # Final save for any remaining unbatched photos
    if batch_counter > 0:
        save_data(output_data)
        
    log(f"\nDONE! Processed: {processed}, Skipped: {skipped}, Failed: {failed}")

if __name__ == "__main__":
    main()
