import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTOTP } from '@/hooks/useTOTP';
import { toast } from 'sonner';
import { Shield, Copy, Check, Loader2, Key, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TwoFactorSetupProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export const TwoFactorSetup = ({ onComplete, onSkip }: TwoFactorSetupProps) => {
  const { setup, verify, loading, error } = useTOTP();
  const [step, setStep] = useState<'intro' | 'qr' | 'verify' | 'backup'>('intro');
  const [setupData, setSetupData] = useState<{
    secret: string;
    otpauthUrl: string;
    backupCodes: string[];
  } | null>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);

  const handleSetup = async () => {
    const data = await setup();
    if (data) {
      setSetupData(data);
      setStep('qr');
    } else {
      toast.error('Failed to set up 2FA');
    }
  };

  const handleVerify = async () => {
    if (verifyCode.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }
    
    const valid = await verify(verifyCode);
    if (valid) {
      toast.success('Two-factor authentication enabled!');
      setStep('backup');
    } else {
      toast.error('Invalid code. Please try again.');
    }
  };

  const copySecret = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
      toast.success('Secret copied to clipboard');
    }
  };

  const copyBackupCodes = () => {
    if (setupData?.backupCodes) {
      navigator.clipboard.writeText(setupData.backupCodes.join('\n'));
      setCopiedBackup(true);
      setTimeout(() => setCopiedBackup(false), 2000);
      toast.success('Backup codes copied to clipboard');
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center space-y-4"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Secure Your Account
            </h3>
            <p className="text-muted-foreground text-sm">
              Add an extra layer of security with two-factor authentication. 
              You'll need an authenticator app like Google Authenticator or Authy.
            </p>
            <div className="flex flex-col gap-2 pt-4">
              <Button onClick={handleSetup} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Set Up 2FA
                  </>
                )}
              </Button>
              {onSkip && (
                <Button variant="ghost" onClick={onSkip}>
                  Skip for now
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {step === 'qr' && setupData && (
          <motion.div
            key="qr"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Scan QR Code
              </h3>
              <p className="text-muted-foreground text-sm">
                Scan this QR code with your authenticator app
              </p>
            </div>

            <div className="flex justify-center p-4 bg-background rounded-lg border border-border">
              <QRCodeSVG 
                value={setupData.otpauthUrl} 
                size={180}
                level="M"
                includeMargin
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Or enter this secret manually:
              </Label>
              <div className="flex gap-2">
                <Input 
                  value={setupData.secret} 
                  readOnly 
                  className="font-mono text-xs"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={copySecret}
                >
                  {copiedSecret ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={() => setStep('verify')}
            >
              Continue to Verify
            </Button>
          </motion.div>
        )}

        {step === 'verify' && (
          <motion.div
            key="verify"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Verify Setup
              </h3>
              <p className="text-muted-foreground text-sm">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totp-code">Verification Code</Label>
              <Input
                id="totp-code"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="text-center text-2xl tracking-widest font-mono"
                maxLength={6}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setStep('qr')}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleVerify} 
                disabled={loading || verifyCode.length !== 6}
                className="flex-1"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Verify'
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'backup' && setupData && (
          <motion.div
            key="backup"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center mb-3">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Save Backup Codes
              </h3>
              <p className="text-muted-foreground text-sm">
                Store these codes safely. You can use them to access your account if you lose your authenticator device.
              </p>
            </div>

            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {setupData.backupCodes.map((code, i) => (
                  <div 
                    key={i}
                    className="font-mono text-sm bg-background rounded px-2 py-1 text-center"
                  >
                    {code}
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full mt-2"
                onClick={copyBackupCodes}
              >
                {copiedBackup ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy All Codes
                  </>
                )}
              </Button>
            </div>

            <Button className="w-full" onClick={onComplete}>
              <Key className="mr-2 h-4 w-4" />
              Done
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
