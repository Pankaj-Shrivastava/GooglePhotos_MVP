import os
import json
import base64
import requests
import time
import sys
from datetime import datetime, timezone
from dotenv import load_dotenv
import glob

load_dotenv()
GROQ_API_KEY = os.getenv('GROQ_API_KEY')

OUTPUT_PATH = os.path.join("src", "data", "tags.json")

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
this photo unique — the sensory details someone would remember."""


def log(msg):
    """Print with immediate flush so logs are visible in real-time."""
    print(msg, flush=True)


def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')


def validate_tags(tags):
    """Validate that the AI response contains all required fields with correct types."""
    if not isinstance(tags, dict):
        return False
    
    for field in REQUIRED_FIELDS:
        if field not in tags:
            log(f"  ⚠️  Missing field: {field}")
            return False
    
    # Validate array fields
    array_fields = ["primary_subjects", "descriptive_tags", "sensory_cues",
                    "mood_and_tone", "dominant_colors"]
    for field in array_fields:
        if not isinstance(tags[field], list) or len(tags[field]) == 0:
            log(f"  ⚠️  Field '{field}' is not a non-empty list")
            return False
    
    # Validate string fields
    for field in ["alt_text", "micro_story"]:
        if not isinstance(tags[field], str) or len(tags[field].strip()) == 0:
            log(f"  ⚠️  Field '{field}' is not a non-empty string")
            return False
    
    return True


def load_existing_data():
    """Load existing tags.json to support resume capability."""
    if os.path.exists(OUTPUT_PATH):
        try:
            with open(OUTPUT_PATH, "r") as f:
                data = json.load(f)
                if "photos" in data and isinstance(data["photos"], list):
                    return data
        except (json.JSONDecodeError, IOError):
            pass
    return None


def save_data(output_data):
    """Save tags.json incrementally after each successful image."""
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    output_data["generated_at"] = datetime.now(timezone.utc).isoformat()
    output_data["total_photos"] = len(output_data["photos"])
    with open(OUTPUT_PATH, "w") as f:
        json.dump(output_data, f, indent=2)


def generate_tags_for_image(city, image_path):
    if not GROQ_API_KEY:
        log("Missing GROQ API KEY")
        return None
        
    base64_image = encode_image(image_path)
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "llama-3.2-11b-vision-instruct",
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": PROMPT.replace("{city}", city)},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
                ]
            }
        ],
        "response_format": {"type": "json_object"}
    }
    
    try:
        response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
        if response.status_code == 200:
            content = response.json()['choices'][0]['message']['content']
            return json.loads(content)
        else:
            log(f"  ❌ API error ({response.status_code}): {response.text[:200]}")
            return None
    except Exception as e:
        log(f"  ❌ Network error: {e}")
        return None


def main():
    photos_dir = os.path.join("public", "photos")
    
    # Resume: load existing data and find already-processed IDs
    existing_data = load_existing_data()
    if existing_data:
        output_data = existing_data
        processed_ids = {p["id"] for p in output_data["photos"]}
        log(f"📂 Resuming — {len(processed_ids)} photos already processed")
    else:
        output_data = {
            "generated_at": "",
            "model": "llama-3.2-11b-vision-instruct",
            "total_photos": 0,
            "photos": []
        }
        processed_ids = set()
        log("📂 Starting fresh — no existing tags.json found")
    
    # Collect all image paths first for progress tracking
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
    skipped = 0
    processed = 0
    failed = 0
    
    log(f"🖼️  Found {total} images across {len(set(c for c, *_ in all_images))} cities\n")
    
    for idx, (city_name, img_path, filename, photo_id) in enumerate(all_images, 1):
        # Skip already processed (resume support)
        if photo_id in processed_ids:
            skipped += 1
            continue
        
        log(f"[{idx}/{total}] Processing {filename} ({city_name})...")
        
        # Retry logic with exponential backoff
        tags = None
        for attempt in range(3):
            tags = generate_tags_for_image(city_name, img_path)
            if tags and validate_tags(tags):
                break
            if tags and not validate_tags(tags):
                log(f"  ⚠️  Invalid response structure, retrying...")
                tags = None
            log(f"  🔄 Retry {attempt + 1}/3 in {10 * (attempt + 1)}s...")
            time.sleep(10 * (attempt + 1))
        
        if tags and validate_tags(tags):
            # Only keep the expected fields (strip any extras from AI)
            clean_tags = {field: tags[field] for field in REQUIRED_FIELDS}
            photo_data = {
                "id": photo_id,
                "filename": filename,
                "city": city_name,
                **clean_tags
            }
            output_data["photos"].append(photo_data)
            processed += 1
            
            # Incremental save after every successful image
            save_data(output_data)
            log(f"  ✅ Saved ({processed} done, {total - idx - skipped} remaining)")
        else:
            failed += 1
            log(f"  ❌ Failed after 3 attempts — skipping {filename}")
        
        time.sleep(5)  # Rate limit prevention
    
    # Final summary
    log(f"\n{'='*50}")
    log(f"🏁 DONE!")
    log(f"   ✅ Processed: {processed}")
    log(f"   ⏭️  Skipped (already done): {skipped}")
    log(f"   ❌ Failed: {failed}")
    log(f"   📄 Total in tags.json: {len(output_data['photos'])}")
    log(f"   💾 Saved to: {OUTPUT_PATH}")
    log(f"{'='*50}")


if __name__ == "__main__":
    main()
