\# image2portrait



一个用于 \*\*批量生成半身人物海报图\*\* 的 Python 脚本。



功能：



\* 输入一个文件夹中的 \*\*单人人物图片\*\*

\* 自动抠图并裁剪为 \*\*半身像\*\*

\* 缩放并放置在 \*\*1200×800\*\* 画布中

\* 背景为 \*\*#FAFAF9 → #E5E7EB\*\* 的垂直渐变

\* 批量导出为 \*\*PNG\*\*



\## 项目结构



```text

portrait\_halfbody\_batch/

├── portrait\_halfbody.py   # 主脚本

├── requirements.txt       # Python 依赖

└── README.md              # 使用说明

```



\## 🚀 使用方法



```bash

pip install -r requirements.txt

python portrait\_halfbody.py input\_images output\_images

```



\* `input\_images/`：原始单人人物照片

\* `output\_images/`：生成的 1200×800 PNG 图像





