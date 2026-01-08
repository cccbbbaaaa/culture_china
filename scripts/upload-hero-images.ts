#!/usr/bin/env tsx

/**
 * 批量上传首页轮播图片到数据库
 * Batch upload hero carousel images to database
 */

import { readFileSync } from "fs";
import { join } from "path";

const API_BASE = process.env.API_BASE || "http://localhost:3000";
const UPLOAD_ENDPOINT = `${API_BASE}/api/admin/media/activity`;

interface ImageUpload {
  filePath: string;
  title: string;
  subtitle?: string;
  linkUrl?: string;
  sortOrder: number;
}

const images: ImageUpload[] = [
  {
    filePath: "public/images/events/annual/2025-group-photo.png",
    title: "浙江大学晨兴文化中国人才计划",
    subtitle: "Zhejiang University Morningside Cultural China Scholars Program",
    sortOrder: 1,
  },
  {
    filePath: "public/images/events/visits/2024-hk1.jpg",
    title: "以经典为骨，以世界为镜",
    subtitle: "以人文与学术的方式，培养具有全球视野的未来领袖。",
    sortOrder: 2,
  },
  {
    filePath: "public/images/events/course/bao-20251202.jpeg",
    title: "知行合一，笃行致远",
    subtitle: "认知 → 体验 → 反思 → 笃行",
    sortOrder: 3,
  },
  {
    filePath: "public/images/events/visits/2023-us2.jpg",
    title: "在世界现场，回到文化中国",
    subtitle: "以体验与反思连接传统与当代。",
    sortOrder: 4,
  },
  {
    filePath: "public/images/events/visits/2023-us.jpg",
    title: "海外访学交流",
    subtitle: "拓展国际视野，深化文化理解",
    sortOrder: 5,
  },
  {
    filePath: "public/images/events/course/yin-2022.png",
    title: "课程教学现场",
    subtitle: "传承经典，启迪智慧",
    sortOrder: 6,
  },
];

async function uploadImage(image: ImageUpload) {
  const projectRoot = process.cwd();
  const fullPath = join(projectRoot, image.filePath);

  console.log(`\n📤 上传图片 / Uploading: ${image.filePath}`);
  console.log(`   标题 / Title: ${image.title}`);

  try {
    const fileBuffer = readFileSync(fullPath);
    const fileName = image.filePath.split("/").pop() || "image";

    const formData = new FormData();
    const blob = new Blob([fileBuffer]);
    formData.append("image", blob, fileName);
    formData.append("slot_key", "home_hero");
    formData.append("title", image.title);
    if (image.subtitle) {
      formData.append("subtitle", image.subtitle);
    }
    if (image.linkUrl) {
      formData.append("link_url", image.linkUrl);
    }
    formData.append("sort_order", String(image.sortOrder));
    formData.append("is_active", "true");
    formData.append("submittedBy", "script-upload-hero");

    const response = await fetch(UPLOAD_ENDPOINT, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log(`   ✅ 成功 / Success: batchId=${result.batchId}, mediaId=${result.mediaId}`);
    return result;
  } catch (error) {
    console.error(`   ❌ 失败 / Failed:`, error instanceof Error ? error.message : String(error));
    throw error;
  }
}

async function main() {
  console.log("🚀 开始批量上传首页轮播图片 / Starting batch upload of hero carousel images");
  console.log(`📡 API 端点 / API Endpoint: ${UPLOAD_ENDPOINT}\n`);

  const results = [];
  const errors = [];

  for (const image of images) {
    try {
      const result = await uploadImage(image);
      results.push(result);
      // 避免请求过快 / Avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      errors.push({ image, error });
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(`📊 上传完成 / Upload Summary:`);
  console.log(`   ✅ 成功 / Success: ${results.length}`);
  console.log(`   ❌ 失败 / Failed: ${errors.length}`);

  if (errors.length > 0) {
    console.log("\n❌ 失败的图片 / Failed images:");
    errors.forEach(({ image, error }) => {
      console.log(`   - ${image.filePath}: ${error instanceof Error ? error.message : String(error)}`);
    });
    process.exit(1);
  }

  console.log("\n🎉 所有图片上传成功！/ All images uploaded successfully!");
}

main().catch((error) => {
  console.error("💥 脚本执行失败 / Script execution failed:", error);
  process.exit(1);
});




