-- Create rate limit logs table to track requests
CREATE TABLE IF NOT EXISTS public.rate_limit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_ip text NOT NULL,
  function_name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index for efficient querying
CREATE INDEX idx_rate_limit_logs_lookup 
ON public.rate_limit_logs (client_ip, function_name, created_at DESC);

-- Enable RLS
ALTER TABLE public.rate_limit_logs ENABLE ROW LEVEL SECURITY;

-- Only service role can access (edge functions use service role)
CREATE POLICY "Service role only" ON public.rate_limit_logs
FOR ALL USING (false);

-- Create the rate limit check function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_function_name text,
  p_client_ip text,
  p_max_requests integer,
  p_window_minutes integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_count integer;
  window_start timestamp with time zone;
BEGIN
  -- Calculate window start time
  window_start := now() - (p_window_minutes || ' minutes')::interval;
  
  -- Count requests in the window
  SELECT COUNT(*)
  INTO request_count
  FROM public.rate_limit_logs
  WHERE client_ip = p_client_ip
    AND function_name = p_function_name
    AND created_at >= window_start;
  
  -- If under limit, log the request and return true
  IF request_count < p_max_requests THEN
    INSERT INTO public.rate_limit_logs (client_ip, function_name)
    VALUES (p_client_ip, p_function_name);
    RETURN true;
  END IF;
  
  -- Rate limit exceeded
  RETURN false;
END;
$$;

-- Clean up old rate limit logs (keep only last 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_rate_limit_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.rate_limit_logs
  WHERE created_at < now() - interval '24 hours';
END;
$$;