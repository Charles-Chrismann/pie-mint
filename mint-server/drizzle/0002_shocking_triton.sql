ALTER TABLE "sub_events" ALTER COLUMN "event_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sub_events" ADD COLUMN "organization_id" integer;--> statement-breakpoint
ALTER TABLE "sub_events" ADD COLUMN "created_by_id" integer;--> statement-breakpoint
ALTER TABLE "sub_events" ADD CONSTRAINT "sub_events_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_events" ADD CONSTRAINT "sub_events_created_by_id_user_profiles_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_events" ADD CONSTRAINT "event_requires_org" CHECK (
      "sub_events"."event_id" IS NULL OR "sub_events"."organization_id" IS NOT NULL
    );--> statement-breakpoint
ALTER TABLE "sub_events" ADD CONSTRAINT "organizer_must_be_alone" CHECK (
      "sub_events"."created_by_id" IS NULL OR 
      ("sub_events"."event_id" IS NULL AND "sub_events"."organization_id" IS NULL)
    );