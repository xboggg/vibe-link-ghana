-- Create a table to track follow-up emails sent to avoid duplicates
CREATE TABLE IF NOT EXISTS public.follow_up_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  follow_up_type TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT
);

-- Enable RLS
ALTER TABLE public.follow_up_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view follow-up logs
CREATE POLICY "Admins can view follow-up logs"
  ON public.follow_up_logs
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster lookups
CREATE INDEX idx_follow_up_logs_order_id ON public.follow_up_logs(order_id);
CREATE INDEX idx_follow_up_logs_type_sent ON public.follow_up_logs(follow_up_type, sent_at);