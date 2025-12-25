import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TOTPSetupData {
  secret: string;
  otpauthUrl: string;
  backupCodes: string[];
}

interface TOTPStatus {
  enabled: boolean;
  hasSetup: boolean;
}

export const useTOTP = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSession = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }, []);

  const setup = useCallback(async (): Promise<TOTPSetupData | null> => {
    setLoading(true);
    setError(null);
    try {
      const session = await getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('totp-manage', {
        body: { action: 'setup' },
      });

      if (response.error) throw new Error(response.error.message);
      return response.data as TOTPSetupData;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getSession]);

  const verify = useCallback(async (token: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const session = await getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('totp-manage', {
        body: { action: 'verify', token },
      });

      if (response.error || response.data?.error) {
        setError(response.data?.error || response.error?.message);
        return false;
      }
      return response.data?.valid ?? false;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [getSession]);

  const verifyBackup = useCallback(async (code: string): Promise<{ valid: boolean; remainingCodes?: number }> => {
    setLoading(true);
    setError(null);
    try {
      const session = await getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('totp-manage', {
        body: { action: 'verify-backup', token: code },
      });

      if (response.error || response.data?.error) {
        setError(response.data?.error || response.error?.message);
        return { valid: false };
      }
      return { valid: response.data?.valid ?? false, remainingCodes: response.data?.remainingCodes };
    } catch (err: any) {
      setError(err.message);
      return { valid: false };
    } finally {
      setLoading(false);
    }
  }, [getSession]);

  const disable = useCallback(async (token: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const session = await getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('totp-manage', {
        body: { action: 'disable', token },
      });

      if (response.error || response.data?.error) {
        setError(response.data?.error || response.error?.message);
        return false;
      }
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [getSession]);

  const getStatus = useCallback(async (): Promise<TOTPStatus> => {
    setLoading(true);
    setError(null);
    try {
      const session = await getSession();
      if (!session) return { enabled: false, hasSetup: false };

      const response = await supabase.functions.invoke('totp-manage', {
        body: { action: 'status' },
      });

      if (response.error) {
        return { enabled: false, hasSetup: false };
      }
      return response.data as TOTPStatus;
    } catch (err: any) {
      return { enabled: false, hasSetup: false };
    } finally {
      setLoading(false);
    }
  }, [getSession]);

  return {
    loading,
    error,
    setup,
    verify,
    verifyBackup,
    disable,
    getStatus,
  };
};
