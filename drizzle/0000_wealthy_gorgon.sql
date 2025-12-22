CREATE TABLE IF NOT EXISTS "alumni" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"cohort" integer NOT NULL,
	"major" text,
	"graduation_year" integer,
	"current_position" text,
	"bio" text,
	"avatar" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "faculty" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"title" text,
	"affiliation" text,
	"bio" text,
	"avatar" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resources" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"is_featured" boolean DEFAULT false,
	"is_pinned" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
