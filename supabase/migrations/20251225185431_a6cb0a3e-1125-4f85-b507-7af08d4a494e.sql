-- Add preference columns to newsletter_subscribers
ALTER TABLE public.newsletter_subscribers 
ADD COLUMN IF NOT EXISTS frequency text NOT NULL DEFAULT 'all',
ADD COLUMN IF NOT EXISTS topics text[] NOT NULL DEFAULT '{}',
ADD COLUMN IF NOT EXISTS preferences_token text;

-- Create index for token lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_token ON public.newsletter_subscribers(preferences_token);

-- Add RLS policy for preference updates via token (service role handles this)
COMMENT ON COLUMN public.newsletter_subscribers.frequency IS 'Email frequency: all, weekly, monthly';
COMMENT ON COLUMN public.newsletter_subscribers.topics IS 'Subscribed topics: announcements, promotions, events, tips';
COMMENT ON COLUMN public.newsletter_subscribers.preferences_token IS 'Secure token for preference management';