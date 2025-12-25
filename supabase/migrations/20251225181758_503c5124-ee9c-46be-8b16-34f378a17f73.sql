-- Create newsletter_campaigns table for tracking scheduled newsletters and campaigns
CREATE TABLE public.newsletter_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create newsletter_tracking table for open/click tracking
CREATE TABLE public.newsletter_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.newsletter_campaigns(id) ON DELETE CASCADE,
  subscriber_email TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('sent', 'opened', 'clicked')),
  link_url TEXT,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_newsletter_campaigns_status ON public.newsletter_campaigns(status);
CREATE INDEX idx_newsletter_campaigns_scheduled ON public.newsletter_campaigns(scheduled_at) WHERE status = 'scheduled';
CREATE INDEX idx_newsletter_tracking_campaign ON public.newsletter_tracking(campaign_id);
CREATE INDEX idx_newsletter_tracking_email ON public.newsletter_tracking(subscriber_email);

-- Enable RLS
ALTER TABLE public.newsletter_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_tracking ENABLE ROW LEVEL SECURITY;

-- RLS policies for newsletter_campaigns
CREATE POLICY "Admins can view all campaigns" ON public.newsletter_campaigns
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create campaigns" ON public.newsletter_campaigns
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update campaigns" ON public.newsletter_campaigns
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete campaigns" ON public.newsletter_campaigns
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for newsletter_tracking (public insert for tracking, admin read)
CREATE POLICY "Admins can view tracking data" ON public.newsletter_tracking
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow public insert for tracking pixel/link clicks (no auth required)
CREATE POLICY "Anyone can insert tracking events" ON public.newsletter_tracking
  FOR INSERT WITH CHECK (true);

-- Create updated_at trigger for campaigns
CREATE TRIGGER update_newsletter_campaigns_updated_at
  BEFORE UPDATE ON public.newsletter_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();