-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create custom types
CREATE TYPE user_role AS ENUM ('resident', 'business_owner', 'admin', 'moderator');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected', 'expired');
CREATE TYPE post_category AS ENUM ('general', 'safety', 'event', 'recommendation', 'question', 'announcement');
CREATE TYPE post_visibility AS ENUM ('block', 'street', 'neighborhood', 'public');
CREATE TYPE event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE rsvp_status AS ENUM ('going', 'maybe', 'not_going');
CREATE TYPE marketplace_status AS ENUM ('available', 'pending', 'sold', 'expired');
CREATE TYPE marketplace_category AS ENUM ('furniture', 'electronics', 'clothing', 'books', 'toys', 'tools', 'garden', 'free', 'other');
CREATE TYPE business_category AS ENUM ('restaurant', 'retail', 'services', 'healthcare', 'education', 'automotive', 'home_services', 'professional', 'other');
CREATE TYPE group_privacy AS ENUM ('public', 'private', 'secret');
CREATE TYPE safety_alert_type AS ENUM ('crime', 'weather', 'traffic', 'emergency', 'utility', 'other');
CREATE TYPE safety_alert_severity AS ENUM ('info', 'warning', 'critical');
CREATE TYPE notification_type AS ENUM ('post_comment', 'post_reaction', 'event_reminder', 'event_update', 'safety_alert', 'message', 'marketplace_inquiry', 'group_invite', 'system');

-- Create indexes for PostGIS
-- Note: These will be created automatically by TypeORM with the @Index decorators

-- Sample initial data (optional)
-- This can be used to seed the database with test neighborhoods

COMMENT ON DATABASE neighborhood_social IS 'Local Neighborhood Social Network Database';
