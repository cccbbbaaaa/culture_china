# 视觉基调与美术设计方案 (Visual Design System)

> **设计愿景** ：构建一个“东方气韵与现代学术并重”的数字化空间。既保留百年学府的厚重感，又具备国际顶尖智库的现代审美。

## 1. 核心设计关键词 (Design Keywords)

* **Scholarly (书卷气)** : 沉静、理性，避免商业化的喧闹。
* **Heritage (传承)** : 使用经典元素（衬线体、传统色），但以现代构成方式呈现。
* **Breathable (呼吸感)** : 大量的留白，打破旧版网站的紧凑压抑感。
* **Refined (雅致)** : 细节处见真章，使用细线条、微投影和磨砂质感。

## 2. 色彩体系 (Color Palette)

采用了 **60:30:10** 的配色原则，避免大面积使用高饱和度颜色导致视觉疲劳。

public/images/branding/logo.png为该项目的logo

### 2.1 主色调 (Brand Colors)

* **Primary: 晨兴红 (Morning Red)**
  * Hex: `#962E2A`
  * *应用场景* : 核心按钮、Logo、选中状态、关键标题下划线。
  * *设计意图* : 象征学术的庄重与热忱，源自旧版但更克制。
* **Accent: 典雅金 (Elegant Gold)**
  * Hex: `#E2BA3E`
  * *应用场景* : 细分割线、徽章图标、hover 动效、数字高亮。
  * *设计意图* : 点睛之笔，提升尊贵感，避免红色过于沉闷。

### 2.2 中性色/背景色 (Neutrals)

* **Canvas: 宣纸白 (Rice Paper)**
  * Hex: `#FAFAF9` (Warm White) 或 `#FFFFFF`
  * *应用场景* : 全局背景。避免使用刺眼的纯白，使用带一点点暖调的白，模仿纸张质感。
* **Ink: 墨灰 (Ink Grey)**
  * Hex: `#1F2937` (Gray-800)
  * *应用场景* : 正文文字。避免纯黑 (`#000000`)，使用深灰色更护眼且更有质感。
* **Stone: 碑石灰 (Stone Grey)**
  * Hex: `#E5E7EB` (Gray-200)
  * *应用场景* : 边框、未激活状态、次要分割线。

## 3. 排版系统 (Typography)

采用 **“中西合璧”** 的字体策略。

### 3.1 字体家族 (Font Family)

* **Headings (标题)** : `Noto Serif SC` (思源宋体) 或 `Playfair Display` (英文)。
* *风格* : 有衬线，传递历史感和权威感。
* **Body (正文)** : `Inter` + `Noto Sans SC` (思源黑体)。
* *风格* : 无衬线，确保在任何屏幕上的高可读性。

### 3.2 字号与层级 (Scale)

* **Hero Title** : `text-4xl` to `text-5xl`, Serif, Bold.
* **Section Title** : `text-2xl`, Serif, Semi-bold.
* **Body Text** : `text-base` (16px), Sans, Relaxed line-height (1.75).
* *特别处理* : 给中文段落增加 `tracking-wide` (字间距)，营造疏朗的阅读体验
