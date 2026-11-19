import os
from PIL import Image

def generate_icons():
    src_path = os.path.join(os.getcwd(), "public", "images", "saranwak-icon.png")
    if not os.path.exists(src_path):
        print(f"Source icon not found at {src_path}")
        return

    master = Image.open(src_path).convert("RGBA")
    brand_orange = (255, 92, 53)  # #FF5C35

    targets = [
        ("public/icon-512.png", 512),
        ("public/icon-192.png", 192),
        ("public/apple-touch-icon.png", 180),
        ("public/favicon.png", 64),
        ("app/apple-icon.png", 180),
        ("app/icon.png", 512),
    ]

    for rel_path, size in targets:
        resized = master.resize((size, size), Image.Resampling.LANCZOS)
        if "apple" in rel_path:
            bg = Image.new("RGB", (size, size), brand_orange)
            bg.paste(resized, (0, 0), resized)
            bg.save(rel_path, "PNG", optimize=True)
        else:
            resized.save(rel_path, "PNG", optimize=True)
        print(f"Generated {rel_path} ({size}x{size})")

    # Multi-resolution favicon.ico
    fav_48 = master.resize((48, 48), Image.Resampling.LANCZOS)
    fav_48.save("public/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    fav_48.save("app/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    print("Generated favicon.ico (16, 32, 48)")

if __name__ == "__main__":
    generate_icons()
