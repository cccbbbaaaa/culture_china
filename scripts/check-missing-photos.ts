/**
 * 检查缺图的学员记录 / Check alumni records missing photos
 */

import { isNull } from "drizzle-orm";

import { db } from "@/lib/db";
import { alumniProfiles } from "@/db/schema";

const main = async () => {
  const missing = await db
    .select({
      id: alumniProfiles.id,
      name: alumniProfiles.name,
      email: alumniProfiles.email,
      cohort: alumniProfiles.cohort,
      submissionEmail: alumniProfiles.submissionEmail,
      submissionTs: alumniProfiles.submissionTs,
    })
    .from(alumniProfiles)
    .where(isNull(alumniProfiles.photoAssetId));

  console.log(`缺图记录数 / Missing photos count: ${missing.length}\n`);

  if (missing.length === 0) {
    console.log("所有记录都有照片 / All records have photos.");
    return;
  }

  console.log("缺图记录详情 / Missing photo details:\n");
  for (const record of missing) {
    console.log(`- ID: ${record.id}`);
    console.log(`  姓名: ${record.name}`);
    console.log(`  邮箱: ${record.email}`);
    console.log(`  期数: ${record.cohort ?? "未知"}`);
    console.log(`  提交邮箱: ${record.submissionEmail ?? "未知"}`);
    console.log(`  提交时间: ${record.submissionTs?.toISOString() ?? "未知"}`);
    console.log("");
  }

  // 同时检查原始 Excel 中这些记录的「个人照片」字段值
  console.log("\n提示：请检查原始 Excel 中这些记录的「个人照片」字段，确认文件名是否正确。");
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });



