ALTER TABLE "social_platforms" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "action_levels" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "action_levels" ADD CONSTRAINT "action_levels_name_unique" UNIQUE("name");