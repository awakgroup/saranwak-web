import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

def generate_icons():
    W, H = 2048, 2048

    # 1. Background Gradient (Top-left #FF6339 to Bottom-right #841C05)
    y_coords, x_coords = np.mgrid[0:H, 0:W]
    t = (x_coords + y_coords) / (W + H)

    # Base diagonal gradient
    r = (255 - t * 123).astype(np.float32)
    g = (99 - t * 71).astype(np.float32)
    b = (57 - t * 52).astype(np.float32)

    # Radial satin glow in upper-middle
    dx = (x_coords - 1024) / 1024.0
    dy = (y_coords - 700) / 1024.0
    dist = np.sqrt(dx * dx + dy * dy)
    glow = np.clip(1.0 - dist * 1.0, 0, 1.0)
    
    r += glow * 18
    g += glow * 12
    b += glow * 6

    # Subtle bottom vignette
    vignette = np.clip((y_coords - 1200) / 848.0, 0, 1.0)
    r -= vignette * 20
    g -= vignette * 10
    b -= vignette * 5

    r = np.clip(r, 0, 255).astype(np.uint8)
    g = np.clip(g, 0, 255).astype(np.uint8)
    b = np.clip(b, 0, 255).astype(np.uint8)
    a = np.full((H, W), 255, dtype=np.uint8)

    rgba = np.dstack((r, g, b, a))
    base = Image.fromarray(rgba, 'RGBA')

    # 2. Draw Coffee Emblem Overlay
    S = 64  # scale factor for 24x24 Lucide coordinate grid
    # Lucide coffee icon center is approx x=10.5, y=12.0
    OX = W / 2.0 - 10.5 * S
    OY = H / 2.0 - 12.0 * S
    SW = int(2.2 * S)  # stroke width = 140px at 2048x2048
    r_cap = SW / 2.0

    def p(x, y):
        return (OX + x * S, OY + y * S)

    # Helper function to draw the emblem geometry onto any ImageDraw surface
    def draw_emblem_onto(draw_obj, stroke_color):
        # A. Three Steam lines at x=6, 10, 14, y from 2.5 to 5.0
        for sx in [6, 10, 14]:
            x1, y1 = p(sx, 2.5)
            x2, y2 = p(sx, 5.0)
            draw_obj.line([(x1, y1), (x2, y2)], fill=stroke_color, width=SW)
            draw_obj.ellipse([x1 - r_cap, y1 - r_cap, x1 + r_cap, y1 + r_cap], fill=stroke_color)
            draw_obj.ellipse([x2 - r_cap, y2 - r_cap, x2 + r_cap, y2 + r_cap], fill=stroke_color)

        # B. Handle on right (arc centered at x=17, y=12.5, radius = 4*S)
        hx = OX + 17.0 * S
        hy = OY + 12.5 * S
        hr = 4.0 * S
        draw_obj.arc([hx - hr, hy - hr, hx + hr, hy + hr], start=270, end=90, fill=stroke_color, width=SW)
        
        # Handle end cap / connection at bottom (17, 16.5) to (16, 16.5)
        h_bx, h_by = p(17.0, 16.5)
        draw_obj.ellipse([h_bx - r_cap, h_by - r_cap, h_bx + r_cap, h_by + r_cap], fill=stroke_color)

        # C. Cup Body
        # Top rim line
        x_tl, y_tl = p(4.0, 8.5)
        x_tr, y_tr = p(16.0, 8.5)
        draw_obj.line([p(3.5, 8.5), p(17.0, 8.5)], fill=stroke_color, width=SW)

        # Left wall
        draw_obj.line([p(3.0, 9.5), p(3.0, 16.5)], fill=stroke_color, width=SW)
        # Right wall
        draw_obj.line([p(17.0, 9.5), p(17.0, 16.5)], fill=stroke_color, width=SW)
        # Bottom wall
        draw_obj.line([p(7.0, 20.5), p(13.0, 20.5)], fill=stroke_color, width=SW)

        # Bottom-left corner arc: center at (7, 16.5), r = 4*S
        cx_bl, cy_bl = p(7.0, 16.5)
        cr = 4.0 * S
        draw_obj.arc([cx_bl - cr, cy_bl - cr, cx_bl + cr, cy_bl + cr], start=90, end=180, fill=stroke_color, width=SW)

        # Bottom-right corner arc: center at (13, 16.5), r = 4*S
        cx_br, cy_br = p(13.0, 16.5)
        draw_obj.arc([cx_br - cr, cy_br - cr, cx_br + cr, cy_br + cr], start=0, end=90, fill=stroke_color, width=SW)

        # Top-left corner arc (radius 1*S): center at (4, 9.5)
        tr = 1.0 * S
        draw_obj.arc([x_tl - tr, cy_bl - 7.0*S - tr, x_tl + tr, cy_bl - 7.0*S + tr], start=180, end=270, fill=stroke_color, width=SW)

        # Top-right corner arc (radius 1*S): center at (16, 9.5)
        draw_obj.arc([x_tr - tr, cy_bl - 7.0*S - tr, x_tr + tr, cy_bl - 7.0*S + tr], start=270, end=360, fill=stroke_color, width=SW)

        # Fill seamless circular joints at key vertices to prevent any hairline subpixel gaps
        for vx, vy in [
            (3.0, 9.5), (17.0, 9.5), (4.0, 8.5), (16.0, 8.5),
            (3.0, 16.5), (17.0, 16.5), (7.0, 20.5), (13.0, 20.5),
            (17.0, 8.5), (17.0, 16.5)
        ]:
            px, py = p(vx, vy)
            draw_obj.ellipse([px - r_cap, py - r_cap, px + r_cap, py + r_cap], fill=stroke_color)

    # 3. Create Drop Shadow Layer
    shadow_img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow_img)
    # Draw shadow in deep espresso #3B0D03 at 50% opacity
    draw_emblem_onto(shadow_draw, (55, 12, 3, 130))
    # Blur and offset shadow
    shadow_blurred = shadow_img.filter(ImageFilter.GaussianBlur(radius=28))
    # Offset shadow down by 24px
    shadow_offset = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    shadow_offset.paste(shadow_blurred, (0, 24))

    # 4. Create Pure White Emblem Layer
    emblem_img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    emblem_draw = ImageDraw.Draw(emblem_img)
    draw_emblem_onto(emblem_draw, (255, 255, 255, 255))

    # 5. Composite Layers
    final_master = Image.alpha_composite(base, shadow_offset)
    final_master = Image.alpha_composite(final_master, emblem_img)

    # 6. Export all required PWA, iOS, and Browser icons
    targets = [
        ("public/icon-512.png", 512),
        ("public/icon-192.png", 192),
        ("public/apple-touch-icon.png", 180),
        ("public/favicon.png", 64),
        ("app/apple-icon.png", 180),
        ("app/icon.png", 512),
    ]

    for rel_path, size in targets:
        resized = final_master.resize((size, size), Image.Resampling.LANCZOS)
        # Ensure RGB mode for apple-touch-icon (iOS likes solid PNGs without transparency)
        if "apple" in rel_path:
            resized_rgb = Image.new("RGB", (size, size), (216, 67, 31))
            resized_rgb.paste(resized, (0, 0), resized)
            resized_rgb.save(rel_path, "PNG", optimize=True)
        else:
            resized.save(rel_path, "PNG", optimize=True)
        print(f"Generated {rel_path} ({size}x{size})")

    # Also generate a multi-resolution favicon.ico
    fav_16 = final_master.resize((16, 16), Image.Resampling.LANCZOS)
    fav_32 = final_master.resize((32, 32), Image.Resampling.LANCZOS)
    fav_48 = final_master.resize((48, 48), Image.Resampling.LANCZOS)
    fav_48.save("public/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    fav_48.save("app/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    print("Generated favicon.ico (16, 32, 48)")

if __name__ == "__main__":
    generate_icons()
