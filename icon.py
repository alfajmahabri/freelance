from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(text, output_path, size=(1024, 1024), bg_color="#0284c7", text_color="#ffffff"):
    # Create image
    img = Image.new('RGB', size, color=bg_color)
    d = ImageDraw.Draw(img)
    
    # Try to load a font, fall back to default if necessary
    try:
        # Try to find a sans-serif font
        font_path = "arial.ttf" 
        font = ImageFont.truetype(font_path, size[1] // 2)
    except IOError:
        # Fallback to default, though it might be small
        font = ImageFont.load_default()
        # If default is too small, we might just draw lines or rely on the simple default
        print("Warning: arial.ttf not found, using default font.")

    # Calculate text position to center it
    # getbbox returns (left, top, right, bottom)
    bbox = d.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (size[0] - text_width) / 2
    y = (size[1] - text_height) / 2 - (bbox[1]) # adjust for ascent

    d.text((x, y), text, fill=text_color, font=font)
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path)
    print(f"Icon saved to {output_path}")

if __name__ == "__main__":
    output_file = r"Frontend/skin-disease-app/assets/images/s_logo.png"
    create_icon("S", output_file)
