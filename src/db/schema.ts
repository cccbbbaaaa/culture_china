import { boolean, date, doublePrecision, integer, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

/**
 * 上传批次记录
 */
export const uploadBatches = pgTable("upload_batches", {
  id: serial("id").primaryKey(),
  batchType: text("batch_type").notNull(),
  sourceFilename: text("source_filename"),
  submittedBy: text("submitted_by"),
  totalRows: integer("total_rows").default(0),
  acceptedRows: integer("accepted_rows").default(0),
  status: text("status").default("pending"),
  notes: text("notes"),
  startedAt: timestamp("started_at").defaultNow(),
  finishedAt: timestamp("finished_at"),
});

/**
 * 上传后的媒体资源（统一管理图片）
 */
export const mediaAssets = pgTable("media_assets", {
  id: serial("id").primaryKey(),
  storagePath: text("storage_path").notNull(),
  width: integer("width"),
  height: integer("height"),
  fileSize: integer("filesize"),
  ratio: doublePrecision("ratio"),
  usage: text("usage").notNull(),
  batchId: integer("batch_id").references(() => uploadBatches.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * 学员档案
 */
export const alumniProfiles = pgTable(
  "alumni_profiles",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    cohort: integer("cohort"),
    gender: text("gender"),
    major: text("major"),
    email: text("email").notNull(),
    city: text("city"),
    industry: text("industry"),
    occupation: text("occupation"),
    bioZh: text("bio_zh"),
    bioEn: text("bio_en"),
    allowBio: boolean("allow_bio").default(false).notNull(),
    allowPhoto: boolean("allow_photo").default(false).notNull(),
    websiteUrl: text("website_url"),
    photoAssetId: integer("photo_asset_id").references(() => mediaAssets.id),
    submissionEmail: text("submission_email"),
    submissionTs: timestamp("submission_ts", { withTimezone: true }),
    batchId: integer("batch_id").references(() => uploadBatches.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    isArchived: boolean("is_archived").default(false).notNull(),
  },
  (table) => ({
    emailSubmissionUnique: uniqueIndex("alumni_email_submission_idx").on(table.email, table.submissionTs),
  }),
);

/**
 * 学员教育经历
 */
export const alumniEducations = pgTable("alumni_educations", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id")
    .notNull()
    .references(() => alumniProfiles.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  description: text("description").notNull(),
});

/**
 * 学员工作经历
 */
export const alumniExperiences = pgTable("alumni_experiences", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id")
    .notNull()
    .references(() => alumniProfiles.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  description: text("description").notNull(),
});

/**
 * 外部资源 - 公众号推文等
 */
export const externalResources = pgTable(
  "external_resources",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    type: text("type").notNull(),
    summary: text("summary"),
    url: text("url").notNull(),
    publishedAt: date("published_at", { mode: "date" }),
    year: integer("year"),
    isFeatured: boolean("is_featured").default(false).notNull(),
    isPinned: boolean("is_pinned").default(false).notNull(),
    batchId: integer("batch_id").references(() => uploadBatches.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    urlUnique: uniqueIndex("external_resources_url_idx").on(table.url),
  }),
);

/**
 * 轮播/活动媒体配置
 */
export const activityMedia = pgTable("activity_media", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  linkUrl: text("link_url"),
  mediaId: integer("media_id")
    .notNull()
    .references(() => mediaAssets.id, { onDelete: "cascade" }),
  slotKey: text("slot_key").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * 师资表 - 仍保留当前结构
 */
export const faculty = pgTable("faculty", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title"),
  affiliation: text("affiliation"),
  bio: text("bio"),
  avatar: text("avatar"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 导出类型 / Export types
export type UploadBatch = typeof uploadBatches.$inferSelect;
export type NewUploadBatch = typeof uploadBatches.$inferInsert;

export type MediaAsset = typeof mediaAssets.$inferSelect;
export type NewMediaAsset = typeof mediaAssets.$inferInsert;

export type AlumniProfile = typeof alumniProfiles.$inferSelect;
export type NewAlumniProfile = typeof alumniProfiles.$inferInsert;

export type AlumniEducation = typeof alumniEducations.$inferSelect;
export type NewAlumniEducation = typeof alumniEducations.$inferInsert;

export type AlumniExperience = typeof alumniExperiences.$inferSelect;
export type NewAlumniExperience = typeof alumniExperiences.$inferInsert;

export type ExternalResource = typeof externalResources.$inferSelect;
export type NewExternalResource = typeof externalResources.$inferInsert;

export type ActivityMedia = typeof activityMedia.$inferSelect;
export type NewActivityMedia = typeof activityMedia.$inferInsert;

export type Faculty = typeof faculty.$inferSelect;
export type NewFaculty = typeof faculty.$inferInsert;

