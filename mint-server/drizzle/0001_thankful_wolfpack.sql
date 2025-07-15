DROP INDEX "unique_name_distance";--> statement-breakpoint
ALTER TABLE "standard_distances" ADD CONSTRAINT "standard_distances_name_unique" UNIQUE("name");