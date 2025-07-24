ALTER TABLE "medias" ALTER COLUMN "media_type_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "medias" ALTER COLUMN "media_context_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "medias" ALTER COLUMN "user_profile_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "medias" ALTER COLUMN "organization_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "medias" ALTER COLUMN "event_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "medias" ALTER COLUMN "race_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "country_id" integer;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "avatar_media_id" integer;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "banner_media_id" integer;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_avatar_media_id_medias_id_fk" FOREIGN KEY ("avatar_media_id") REFERENCES "public"."medias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_banner_media_id_medias_id_fk" FOREIGN KEY ("banner_media_id") REFERENCES "public"."medias"("id") ON DELETE no action ON UPDATE no action;