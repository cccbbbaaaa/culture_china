import sys
import numpy as np
from PIL import Image
from rembg import remove
import os

SUPPORTED_EXT = (".jpg", ".jpeg", ".png", ".webp")

OUTPUT_SIZE = (1200, 800)
TOP_COLOR = (250, 250, 249)   # #FAFAF9
BOTTOM_COLOR = (229, 231, 235)  # #E5E7EB


def create_vertical_gradient(size, top_color, bottom_color):
    """生成垂直渐变背景"""
    width, height = size
    gradient = np.zeros((height, width, 3), dtype=np.uint8)

    for y in range(height):
        t = y / (height - 1)
        gradient[y] = [
            int(top_color[i] * (1 - t) + bottom_color[i] * t)
            for i in range(3)
        ]

    return Image.fromarray(gradient)


def crop_half_body(image_rgba):
    """
    从抠图后的人物中裁剪半身像
    启发式：从顶部到人物高度的约 70%
    """
    alpha = image_rgba.split()[-1]
    bbox = alpha.getbbox()

    if not bbox:
        raise ValueError("未检测到人物区域")

    x1, y1, x2, y2 = bbox
    height = y2 - y1

    # 保留头部 + 上半身（约 70%）
    new_y2 = y1 + int(height * 0.7)

    return image_rgba.crop((x1, y1, x2, new_y2))


def resize_and_center(fg, bg_size):
    """缩放人物并居中放置"""
    bg_w, bg_h = bg_size
    fg_w, fg_h = fg.size

    scale = min(bg_w * 0.75 / fg_w, bg_h * 0.85 / fg_h)
    new_size = (int(fg_w * scale), int(fg_h * scale))
    fg = fg.resize(new_size, Image.LANCZOS)

    x = (bg_w - new_size[0]) // 2
    y = int(bg_h * 0.2)

    return fg, (x, y)


def main(input_path, output_path):
    # 读取原图
    img = Image.open(input_path).convert("RGBA")

    # 抠图
    fg = remove(img)

    # 裁剪半身
    fg = crop_half_body(fg)

    # 背景
    bg = create_vertical_gradient(OUTPUT_SIZE, TOP_COLOR, BOTTOM_COLOR).convert("RGBA")

    # 缩放 & 居中
    fg, pos = resize_and_center(fg, OUTPUT_SIZE)

    # 合成
    bg.paste(fg, pos, fg)

    # 输出
    bg.save(output_path, "PNG")
    print(f"✅ 已导出：{output_path}")

def main(input_dir, output_dir):
    if not os.path.isdir(input_dir):
        raise ValueError(f"输入路径不是文件夹：{input_dir}")

    os.makedirs(output_dir, exist_ok=True)

    files = [
        f for f in os.listdir(input_dir)
        if f.lower().endswith(SUPPORTED_EXT)
    ]

    if not files:
        print("⚠️ 未找到可处理的图片")
        return

    print(f"📂 共发现 {len(files)} 张图片，开始处理...\n")

    for idx, filename in enumerate(files, 1):
        input_path = os.path.join(input_dir, filename)
        name, _ = os.path.splitext(filename)
        output_path = os.path.join(output_dir, f"{name}.png")

        try:
            img = Image.open(input_path).convert("RGBA")
            fg = remove(img)
            fg = crop_half_body(fg)

            bg = create_vertical_gradient(
                OUTPUT_SIZE, TOP_COLOR, BOTTOM_COLOR
            ).convert("RGBA")

            fg, pos = resize_and_center(fg, OUTPUT_SIZE)
            bg.paste(fg, pos, fg)
            bg.save(output_path, "PNG")

            print(f"[{idx}/{len(files)}] ✅ {filename} → {output_path}")

        except Exception as e:
            print(f"[{idx}/{len(files)}] ❌ {filename} 处理失败：{e}")

    print("\n🎉 批处理完成")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("用法：python portrait_halfbody.py <input_dir> <output_dir>")
        sys.exit(1)

    main(sys.argv[1], sys.argv[2])

