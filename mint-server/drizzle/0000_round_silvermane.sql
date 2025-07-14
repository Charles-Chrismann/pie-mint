CREATE TABLE "user_profiles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_profiles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"firstname" varchar,
	"lastname" varchar,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar,
	"password" varchar,
	"refresh_token" varchar,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "visitors" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "visitors_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"code" varchar,
	"user_profiles_id" integer NOT NULL,
	CONSTRAINT "visitors_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "event_campaigns" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "event_campaigns_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(256) NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "events_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar,
	"is_auto_generated" boolean DEFAULT false,
	"description" varchar,
	"start_date" timestamp,
	"end_date" timestamp,
	"event_campaign_id" integer,
	"organization_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations__groups" (
	"organization_id" integer NOT NULL,
	"group_id" integer NOT NULL,
	CONSTRAINT "pk_organizations__groups" PRIMARY KEY("organization_id","group_id")
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "organizations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"is_auto_generated" boolean DEFAULT false,
	"media_avatar_id" integer,
	"media_banner_id" integer,
	"created_by_id" integer NOT NULL,
	"owner_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sponsors__events" (
	"sponsor_id" integer NOT NULL,
	"event_id" integer NOT NULL,
	CONSTRAINT "pk_sponsors__events" PRIMARY KEY("sponsor_id","event_id")
);
--> statement-breakpoint
CREATE TABLE "sponsors__organizations" (
	"sponsor_id" integer NOT NULL,
	"organization_id" integer NOT NULL,
	CONSTRAINT "pk_sponsors__organizations" PRIMARY KEY("sponsor_id","organization_id")
);
--> statement-breakpoint
CREATE TABLE "sponsors__user_profiles" (
	"sponsor_id" integer NOT NULL,
	"user_profile_id" integer NOT NULL,
	CONSTRAINT "pk_sponsors__user_profiles" PRIMARY KEY("sponsor_id","user_profile_id")
);
--> statement-breakpoint
CREATE TABLE "sponsors" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sponsors_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar,
	"media_avatar_id" integer NOT NULL,
	"media_banner_id" integer NOT NULL,
	"created_by_id" integer NOT NULL,
	"owner_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "race" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "race_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"start_date" timestamp NOT NULL,
	"distance" numeric(10, 3),
	"positive_elevation" numeric(10, 3),
	"standard_distance_id" integer,
	"track_id" integer,
	"race_discipline_id" integer NOT NULL,
	"event_id" integer,
	"organization_id" integer,
	"created_by_id" integer,
	"owner_id" integer,
	CONSTRAINT "event_requires_org" CHECK (
      "race"."event_id" IS NULL OR "race"."organization_id" IS NOT NULL
    ),
	CONSTRAINT "organizer_must_be_alone" CHECK (
  (
    "race"."created_by_id" IS NULL AND "race"."owner_id" IS NULL
  ) OR (
    "race"."created_by_id" IS NOT NULL AND 
    "race"."owner_id" IS NOT NULL AND 
    "race"."event_id" IS NULL AND 
    "race"."organization_id" IS NULL
  )
)
);
--> statement-breakpoint
CREATE TABLE "registrations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "registrations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"is_accepted" boolean DEFAULT false,
	"is_private" boolean,
	"bib_number" integer,
	"bib_alias" varchar,
	"user_profile_id" integer NOT NULL,
	"sub_event_id" integer,
	"sub_event_start_wave_id" integer
);
--> statement-breakpoint
CREATE TABLE "standard_distances" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "standard_distances_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"distance" numeric(10, 3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sub_event_positions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sub_event_positions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"created_at" timestamp,
	"lat" double precision,
	"lng" double precision,
	"alt" double precision,
	"user_profile_id" integer NOT NULL,
	"sub_event_id" integer
);
--> statement-breakpoint
CREATE TABLE "sub_event_start_waves" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sub_event_start_waves_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar,
	"start_time" timestamp NOT NULL,
	"wave_index" integer NOT NULL,
	"is_elite" boolean NOT NULL,
	"sub_event_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "time_barriers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "time_barriers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"is_end" boolean,
	"sub_event_id" integer,
	"position_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "track_segments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "track_segments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"track_id" integer,
	"segment" geometry(LINESTRINGZ,4326) NOT NULL,
	"segment_index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tracks" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tracks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar
);
--> statement-breakpoint
CREATE TABLE "groups__permissions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "groups__permissions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"group_id" integer,
	"permission_id" integer
);
--> statement-breakpoint
CREATE TABLE "groups__roles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "groups__roles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"group_id" integer,
	"permission_id" integer
);
--> statement-breakpoint
CREATE TABLE "groups__user_profiles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "groups__user_profiles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"group_id" integer,
	"user_profile_id" integer
);
--> statement-breakpoint
CREATE TABLE "groups" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "groups_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar,
	"is_single_permision_group" boolean,
	"is_system" boolean,
	"is_administration_group" boolean,
	"is_member_group" boolean,
	"action_level_id" integer
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "permissions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar,
	"description" text,
	"name_key" varchar,
	"description_key" varchar,
	"action_level_id" integer
);
--> statement-breakpoint
CREATE TABLE "roles__permissions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "roles__permissions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"role_id" integer,
	"permission_id" integer
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "roles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar,
	"is_system" boolean,
	"created_at" timestamp,
	"created_by_id" integer
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "countries_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"french_translation" varchar,
	"english_translation" varchar,
	"self_translation" varchar,
	"flag_emoji" varchar
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "languages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"french_translation" varchar,
	"english_translation" varchar,
	"self_translation" varchar,
	"bcp47" varchar,
	"country_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "translations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "translations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"key" varchar,
	"value" varchar,
	"language_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_contexts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "media_contexts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar
);
--> statement-breakpoint
CREATE TABLE "media_formats" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "media_formats_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar
);
--> statement-breakpoint
CREATE TABLE "media_types" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "media_types_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar,
	"mime_type" varchar,
	"media_format_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medias" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "medias_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"url" varchar,
	"is_system" boolean,
	"media_type_id" integer NOT NULL,
	"media_context_id" integer NOT NULL,
	"user_profile_id" integer NOT NULL,
	"organization_id" integer NOT NULL,
	"event_id" integer NOT NULL,
	"sub_event_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "custom_settings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "custom_settings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"value" varchar,
	"user_profile_id" integer NOT NULL,
	"sponsor_id" integer NOT NULL,
	"organization_id" integer NOT NULL,
	"event_id" integer NOT NULL,
	"sub_event_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "setting_categories" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "setting_categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"is_global" boolean,
	"name_key" varchar,
	"description_key" varchar,
	"action_level_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "setting_keys" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "setting_keys_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"label_key" varchar,
	"description_key" varchar,
	"default_value" varchar,
	"setting_category_id" integer NOT NULL,
	"setting_type_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "setting_multiple_options" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "setting_multiple_options_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"value_key" varchar,
	"selected_by_default" boolean,
	"setting_key_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "setting_selected_options" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "setting_selected_options_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"setting_multiple_option_id" integer NOT NULL,
	"setting_key_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "setting_types" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "setting_types_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar
);
--> statement-breakpoint
CREATE TABLE "profile_links" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "profile_links_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"url" varchar,
	"social_platform_id" integer,
	"user_profile_id" integer,
	"organization_id" integer,
	"event_id" integer,
	"sub_event_id" integer
);
--> statement-breakpoint
CREATE TABLE "social_platforms" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "social_platforms_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar,
	"media_icon_id" integer
);
--> statement-breakpoint
CREATE TABLE "badge_levels" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "badge_levels_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"level" integer,
	"description_key" varchar,
	"start" integer,
	"end" integer,
	"badge_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "badge_progressions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "badge_progressions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"progress" integer,
	"completed_at" timestamp,
	"badge_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "badges" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "badges_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name_key" varchar,
	"description_key" varchar,
	"is_leveled" boolean,
	"media_id" integer NOT NULL,
	"user_profile_id" integer NOT NULL,
	"organization_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "action_levels" (
	"id" integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "action_levels_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(256)
);
--> statement-breakpoint
CREATE TABLE "race_discipline_categories" (
	"id" integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "race_discipline_categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(256)
);
--> statement-breakpoint
CREATE TABLE "race_discipline" (
	"id" integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "race_discipline_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(256),
	"race_discipline_category_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_user_profiles_id_user_profiles_id_fk" FOREIGN KEY ("user_profiles_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_event_campaign_id_event_campaigns_id_fk" FOREIGN KEY ("event_campaign_id") REFERENCES "public"."event_campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations__groups" ADD CONSTRAINT "organizations__groups_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations__groups" ADD CONSTRAINT "organizations__groups_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_media_avatar_id_medias_id_fk" FOREIGN KEY ("media_avatar_id") REFERENCES "public"."medias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_media_banner_id_medias_id_fk" FOREIGN KEY ("media_banner_id") REFERENCES "public"."medias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_created_by_id_user_profiles_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_owner_id_user_profiles_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsors__events" ADD CONSTRAINT "sponsors__events_sponsor_id_sponsors_id_fk" FOREIGN KEY ("sponsor_id") REFERENCES "public"."sponsors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsors__events" ADD CONSTRAINT "sponsors__events_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsors__organizations" ADD CONSTRAINT "sponsors__organizations_sponsor_id_sponsors_id_fk" FOREIGN KEY ("sponsor_id") REFERENCES "public"."sponsors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsors__organizations" ADD CONSTRAINT "sponsors__organizations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsors__user_profiles" ADD CONSTRAINT "sponsors__user_profiles_sponsor_id_sponsors_id_fk" FOREIGN KEY ("sponsor_id") REFERENCES "public"."sponsors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsors__user_profiles" ADD CONSTRAINT "sponsors__user_profiles_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_media_avatar_id_medias_id_fk" FOREIGN KEY ("media_avatar_id") REFERENCES "public"."medias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_media_banner_id_medias_id_fk" FOREIGN KEY ("media_banner_id") REFERENCES "public"."medias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_created_by_id_user_profiles_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_owner_id_user_profiles_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "race" ADD CONSTRAINT "race_standard_distance_id_standard_distances_id_fk" FOREIGN KEY ("standard_distance_id") REFERENCES "public"."standard_distances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "race" ADD CONSTRAINT "race_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "race" ADD CONSTRAINT "race_race_discipline_id_race_discipline_id_fk" FOREIGN KEY ("race_discipline_id") REFERENCES "public"."race_discipline"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "race" ADD CONSTRAINT "race_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "race" ADD CONSTRAINT "race_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "race" ADD CONSTRAINT "race_created_by_id_user_profiles_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "race" ADD CONSTRAINT "race_owner_id_user_profiles_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_sub_event_id_race_id_fk" FOREIGN KEY ("sub_event_id") REFERENCES "public"."race"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_sub_event_start_wave_id_sub_event_start_waves_id_fk" FOREIGN KEY ("sub_event_start_wave_id") REFERENCES "public"."sub_event_start_waves"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_event_positions" ADD CONSTRAINT "sub_event_positions_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_event_positions" ADD CONSTRAINT "sub_event_positions_sub_event_id_registrations_id_fk" FOREIGN KEY ("sub_event_id") REFERENCES "public"."registrations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_event_start_waves" ADD CONSTRAINT "sub_event_start_waves_sub_event_id_race_id_fk" FOREIGN KEY ("sub_event_id") REFERENCES "public"."race"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_barriers" ADD CONSTRAINT "time_barriers_sub_event_id_race_id_fk" FOREIGN KEY ("sub_event_id") REFERENCES "public"."race"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track_segments" ADD CONSTRAINT "track_segments_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups__permissions" ADD CONSTRAINT "groups__permissions_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups__permissions" ADD CONSTRAINT "groups__permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups__roles" ADD CONSTRAINT "groups__roles_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups__roles" ADD CONSTRAINT "groups__roles_permission_id_roles_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups__user_profiles" ADD CONSTRAINT "groups__user_profiles_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups__user_profiles" ADD CONSTRAINT "groups__user_profiles_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_action_level_id_action_levels_id_fk" FOREIGN KEY ("action_level_id") REFERENCES "public"."action_levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_action_level_id_action_levels_id_fk" FOREIGN KEY ("action_level_id") REFERENCES "public"."action_levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles__permissions" ADD CONSTRAINT "roles__permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles__permissions" ADD CONSTRAINT "roles__permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_created_by_id_user_profiles_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "languages" ADD CONSTRAINT "languages_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translations" ADD CONSTRAINT "translations_language_id_languages_id_fk" FOREIGN KEY ("language_id") REFERENCES "public"."languages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_types" ADD CONSTRAINT "media_types_media_format_id_media_formats_id_fk" FOREIGN KEY ("media_format_id") REFERENCES "public"."media_formats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medias" ADD CONSTRAINT "medias_media_type_id_media_types_id_fk" FOREIGN KEY ("media_type_id") REFERENCES "public"."media_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medias" ADD CONSTRAINT "medias_media_context_id_media_contexts_id_fk" FOREIGN KEY ("media_context_id") REFERENCES "public"."media_contexts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medias" ADD CONSTRAINT "medias_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medias" ADD CONSTRAINT "medias_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medias" ADD CONSTRAINT "medias_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medias" ADD CONSTRAINT "medias_sub_event_id_race_id_fk" FOREIGN KEY ("sub_event_id") REFERENCES "public"."race"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_settings" ADD CONSTRAINT "custom_settings_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_settings" ADD CONSTRAINT "custom_settings_sponsor_id_sponsors_id_fk" FOREIGN KEY ("sponsor_id") REFERENCES "public"."sponsors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_settings" ADD CONSTRAINT "custom_settings_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_settings" ADD CONSTRAINT "custom_settings_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_settings" ADD CONSTRAINT "custom_settings_sub_event_id_race_id_fk" FOREIGN KEY ("sub_event_id") REFERENCES "public"."race"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "setting_categories" ADD CONSTRAINT "setting_categories_action_level_id_action_levels_id_fk" FOREIGN KEY ("action_level_id") REFERENCES "public"."action_levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "setting_keys" ADD CONSTRAINT "setting_keys_setting_category_id_setting_categories_id_fk" FOREIGN KEY ("setting_category_id") REFERENCES "public"."setting_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "setting_keys" ADD CONSTRAINT "setting_keys_setting_type_id_setting_types_id_fk" FOREIGN KEY ("setting_type_id") REFERENCES "public"."setting_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "setting_multiple_options" ADD CONSTRAINT "setting_multiple_options_setting_key_id_setting_keys_id_fk" FOREIGN KEY ("setting_key_id") REFERENCES "public"."setting_keys"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "setting_selected_options" ADD CONSTRAINT "setting_selected_options_setting_multiple_option_id_setting_multiple_options_id_fk" FOREIGN KEY ("setting_multiple_option_id") REFERENCES "public"."setting_multiple_options"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "setting_selected_options" ADD CONSTRAINT "setting_selected_options_setting_key_id_user_profiles_id_fk" FOREIGN KEY ("setting_key_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_links" ADD CONSTRAINT "profile_links_social_platform_id_social_platforms_id_fk" FOREIGN KEY ("social_platform_id") REFERENCES "public"."social_platforms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_links" ADD CONSTRAINT "profile_links_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_links" ADD CONSTRAINT "profile_links_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_links" ADD CONSTRAINT "profile_links_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_links" ADD CONSTRAINT "profile_links_sub_event_id_race_id_fk" FOREIGN KEY ("sub_event_id") REFERENCES "public"."race"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_platforms" ADD CONSTRAINT "social_platforms_media_icon_id_medias_id_fk" FOREIGN KEY ("media_icon_id") REFERENCES "public"."medias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "badge_levels" ADD CONSTRAINT "badge_levels_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "badge_progressions" ADD CONSTRAINT "badge_progressions_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "badge_progressions" ADD CONSTRAINT "badge_progressions_badge_id_badge_levels_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badge_levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "badge_progressions" ADD CONSTRAINT "badge_progressions_badge_id_user_profiles_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "badges" ADD CONSTRAINT "badges_media_id_medias_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."medias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "badges" ADD CONSTRAINT "badges_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "badges" ADD CONSTRAINT "badges_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "race_discipline" ADD CONSTRAINT "race_discipline_race_discipline_category_id_race_discipline_categories_id_fk" FOREIGN KEY ("race_discipline_category_id") REFERENCES "public"."race_discipline_categories"("id") ON DELETE no action ON UPDATE no action;