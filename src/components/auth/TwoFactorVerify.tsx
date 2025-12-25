import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTOTP } from '@/hooks/useTOTP';
import { toast } from 'sonner';
import { Shield, Loader2, Key } from 'lucide-react';
import { motion } from 'framer-motion';

interface TwoFactorVerifyProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const TwoFactorVerify = ({ onSuccess, onCancel }: TwoFactorVerifyProps) => {
  const { verify, verifyBackup, loading, error } = useTOTP();
  const [code, setCode] = useState('');
  const [useBackup, setUseBackup] = useState(false);

  const handleVerify = async () => {
    if (useBackup) {
      if (code.length < 9) {
        toast.error('Please enter a valid backup code');
        return;
      }
      const result = await verifyBackup(code);
      if (result.valid) {
        toast.success(`Verified! ${result.remainingCodes} backup codes remaining.`);
        onSuccess();
      } else {
        toast.error('Invalid backup code');
      }
    } else {
      if (code.length !== 6) {
        toast.error('Please enter a 6-digit code');
        return;
      }
      const valid = await verify(code);
      if (valid) {
        toast.success('Verified!');
        onSuccess();
      } else {
        toast.error('Invalid code. Please try again.');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Two-Factor Authentication
        </h3>
        <p className="text-muted-foreground text-sm">
          {useBackup 
            ? 'Enter one of your backup codes'
            : 'Enter the 6-digit code from your authenticator app'
          }
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="2fa-code">
          {useBackup ? 'Backup Code' : 'Verification Code'}
        </Label>
        <Input
          id="2fa-code"
          value={code}
          onChange={(e) => {
            if (useBackup) {
              setCode(e.target.value.toUpperCase());
            } else {
              setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={useBackup ? 'XXXX-XXXX' : '000000'}
          className={`text-center text-xl tracking-widest font-mono ${useBackup ? 'text-lg' : 'text-2xl'}`}
          maxLength={useBackup ? 9 : 6}
          autoFocus
        />
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <div className="space-y-2">
        <Button 
          onClick={handleVerify} 
          disabled={loading || (useBackup ? code.length < 9 : code.length !== 6)}
          className="w-full"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Verify'
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={onCancel}
          className="w-full"
        >
          Cancel
        </Button>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            setUseBackup(!useBackup);
            setCode('');
          }}
          className="text-sm text-primary hover:underline inline-flex items-center gap-1"
        >
          <Key className="h-3 w-3" />
          {useBackup ? 'Use authenticator app instead' : 'Use a backup code'}
        </button>
      </div>
    </motion.div>
  );
};
