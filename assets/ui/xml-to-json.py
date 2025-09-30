# uv run ./public/assets/ui/xml-to-json.py
import xml.etree.ElementTree as ET
import json

filename = "kbm"

# Load your XML from a file or paste it as a string
with open(f"{filename}.xml", "r") as file:
    xml_data = file.read()

# Parse XML
root = ET.fromstring(xml_data)
image_path = root.attrib["imagePath"]
frames = {}

for sub_texture in root.findall("SubTexture"):
    name = sub_texture.attrib["name"]
    x = int(sub_texture.attrib["x"])
    y = int(sub_texture.attrib["y"])
    w = int(sub_texture.attrib["width"])
    h = int(sub_texture.attrib["height"])
    frames[name] = {
        "frame": { "x": x, "y": y, "w": w, "h": h }
    }

# Optional: Calculate the image size (Phaser doesn't require exact values here)
max_x = max(frame["frame"]["x"] + frame["frame"]["w"] for frame in frames.values())
max_y = max(frame["frame"]["y"] + frame["frame"]["h"] for frame in frames.values())


for frame in frames:
    frames[frame]["frame"]["y"] = max_y - frames[frame]["frame"]["y"] - frames[frame]["frame"]["w"]


# Final JSON format for Phaser
atlas_json = {
    "frames": frames,
    "meta": {
        "image": image_path,
        "size": { "w": max_x, "h": max_y },
        "scale": "1"
    }
}

# Save to file
with open(f"{filename}.json", "w") as json_file:
    json.dump(atlas_json, json_file, indent=2)

print(f"✅ JSON atlas saved as {filename}.json")
