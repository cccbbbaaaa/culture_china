import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/**
 * 外部资源表 - 用于存储外部文章链接/新闻/活动
 * Resources table - for storing external article links/news/activities
 */
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  category: text("category").notNull(), // 'news', 'activity', 'course', 'story'
  isFeatured: boolean("is_featured").default(false),
  isPinned: boolean("is_pinned").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * 学员表 - 用于存储学员信息
 * Alumni table - for storing alumni information
 */
export const alumni = pgTable("alumni", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cohort: integer("cohort").notNull(), // 期数，如 1, 2, 3...
  major: text("major"),
  graduationYear: integer("graduation_year"),
  currentPosition: text("current_position"),
  bio: text("bio"),
  avatar: text("avatar"), // 头像 URL
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * 师资表 - 用于存储师资信息
 * Faculty table - for storing faculty information
 */
export const faculty = pgTable("faculty", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title"), // 职位/头衔
  affiliation: text("affiliation"), // 所属机构
  bio: text("bio"),
  avatar: text("avatar"), // 头像 URL
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 导出类型 / Export types
export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;

export type Alumni = typeof alumni.$inferSelect;
export type NewAlumni = typeof alumni.$inferInsert;

export type Faculty = typeof faculty.$inferSelect;
export type NewFaculty = typeof faculty.$inferInsert;


