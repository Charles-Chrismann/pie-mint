ALTER TABLE "countries" ALTER COLUMN "french_translation" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "languages" ALTER COLUMN "french_translation" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "setting_types" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "race_discipline_categories" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "race_discipline" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "countries" ADD CONSTRAINT "countries_french_translation_unique" UNIQUE("french_translation");--> statement-breakpoint
ALTER TABLE "languages" ADD CONSTRAINT "languages_french_translation_unique" UNIQUE("french_translation");--> statement-breakpoint
ALTER TABLE "setting_types" ADD CONSTRAINT "setting_types_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "race_discipline_categories" ADD CONSTRAINT "race_discipline_categories_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "race_discipline" ADD CONSTRAINT "race_discipline_name_unique" UNIQUE("name");