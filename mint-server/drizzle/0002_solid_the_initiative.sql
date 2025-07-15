ALTER TABLE "media_contexts" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "media_formats" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "media_types" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "media_contexts" ADD CONSTRAINT "media_contexts_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "media_formats" ADD CONSTRAINT "media_formats_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "media_types" ADD CONSTRAINT "media_types_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "social_platforms" ADD CONSTRAINT "social_platforms_name_unique" UNIQUE("name");