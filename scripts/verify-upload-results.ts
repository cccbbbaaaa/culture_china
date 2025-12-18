/**
 * 校验导入结果（DB 侧）/ Verify upload results (DB side)
 */

import { sql } from "drizzle-orm";

import { db } from "@/lib/db";

const main = async () => {
  const tables = [
    "upload_batches",
    "media_assets",
    "alumni_profiles",
    "alumni_educations",
    "alumni_experiences",
    "external_resources",
    "activity_media",
  ] as const;

  for (const table of tables) {
    // eslint-disable-next-line no-await-in-loop
    const result = await db.execute<{ count: number }>(sql`select count(*)::int as count from ${sql.raw(table)}`);
    const firstRow = Array.isArray(result) ? result[0] : (result as unknown as { rows?: { count: number }[] }).rows?.[0];
    console.log(`${table}:`, firstRow?.count ?? 0);
  }

  const withPhoto = await db.execute<{ count: number }>(
    sql`select count(*)::int as count from alumni_profiles where photo_asset_id is not null`,
  );
  const withPhotoRow = Array.isArray(withPhoto)
    ? withPhoto[0]
    : (withPhoto as unknown as { rows?: { count: number }[] }).rows?.[0];
  console.log("alumni_profiles(with photo_asset_id):", withPhotoRow?.count ?? 0);

  const totalBytes = await db.execute<{ bytes: number }>(sql`select coalesce(sum(filesize), 0)::bigint as bytes from media_assets`);
  const bytesRow = Array.isArray(totalBytes)
    ? totalBytes[0]
    : (totalBytes as unknown as { rows?: { bytes: number }[] }).rows?.[0];
  const mb = Number(bytesRow?.bytes ?? 0) / 1024 / 1024;
  console.log("media_assets(total filesize, MB):", mb.toFixed(2));
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


