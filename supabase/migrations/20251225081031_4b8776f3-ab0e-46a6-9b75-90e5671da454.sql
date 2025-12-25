-- Create table for follow-up email settings (schedules and templates)
CREATE TABLE public.follow_up_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follow_up_type text NOT NULL UNIQUE,
  enabled boolean NOT NULL DEFAULT true,
  days_after integer NOT NULL DEFAULT 3,
  email_subject text NOT NULL,
  email_template text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.follow_up_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can view settings
CREATE POLICY "Admins can view follow-up settings"
ON public.follow_up_settings
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update settings
CREATE POLICY "Admins can update follow-up settings"
ON public.follow_up_settings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can insert settings
CREATE POLICY "Admins can insert follow-up settings"
ON public.follow_up_settings
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_follow_up_settings_updated_at
BEFORE UPDATE ON public.follow_up_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings for each follow-up type
INSERT INTO public.follow_up_settings (follow_up_type, enabled, days_after, email_subject, email_template) VALUES
('payment_reminder_3_days', true, 3, '💳 Payment Reminder - Your Order is Waiting', '<h2>Hello {{client_name}},</h2><p>This is a friendly reminder that your order <strong>{{order_id}}</strong> for <strong>{{event_title}}</strong> is awaiting payment.</p><p><strong>Amount Due:</strong> ₦{{total_price}}</p><p>Please complete your payment to proceed with your order.</p><p>If you have any questions, feel free to reach out!</p><p>Best regards,<br>The JC Creative Studios Team</p>'),
('payment_reminder_7_days', true, 7, '⏰ Final Payment Reminder - Action Required', '<h2>Hello {{client_name}},</h2><p>We noticed that payment for your order <strong>{{order_id}}</strong> is still pending after 7 days.</p><p><strong>Event:</strong> {{event_title}}<br><strong>Amount Due:</strong> ₦{{total_price}}</p><p>To avoid any delays with your order, please complete the payment as soon as possible.</p><p>Need help? We are here for you!</p><p>Best regards,<br>The JC Creative Studios Team</p>'),
('draft_review_reminder', true, 2, '🎨 Your Draft is Ready for Review!', '<h2>Hello {{client_name}},</h2><p>Great news! The draft for your order <strong>{{order_id}}</strong> is ready and waiting for your review.</p><p><strong>Event:</strong> {{event_title}}</p><p>Please take a moment to review the draft and let us know if you would like any changes.</p><p>We are excited to hear your feedback!</p><p>Best regards,<br>The JC Creative Studios Team</p>'),
('completion_thank_you', true, 1, '🎉 Thank You for Choosing JC Creative Studios!', '<h2>Hello {{client_name}},</h2><p>Thank you for choosing JC Creative Studios for your <strong>{{event_title}}</strong>!</p><p>We hope you loved the final result. Your satisfaction means the world to us.</p><p>If you enjoyed our service, we would love it if you could share your experience with others!</p><p>Best regards,<br>The JC Creative Studios Team</p>');