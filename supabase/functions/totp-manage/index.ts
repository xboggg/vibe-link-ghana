import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple TOTP implementation
function generateSecret(length = 20): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);
  for (let i = 0; i < length; i++) {
    secret += chars[randomBytes[i] % chars.length];
  }
  return secret;
}

function base32Decode(encoded: string): Uint8Array {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const cleanInput = encoded.toUpperCase().replace(/=+$/, '');
  
  let bits = '';
  for (const char of cleanInput) {
    const val = alphabet.indexOf(char);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, '0');
  }
  
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.slice(i * 8, (i + 1) * 8), 2);
  }
  return bytes;
}

async function hmacSha1(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key.buffer as ArrayBuffer,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, data.buffer as ArrayBuffer);
  return new Uint8Array(signature);
}

async function generateTOTP(secret: string, timeStep = 30): Promise<string> {
  const key = base32Decode(secret);
  const time = Math.floor(Date.now() / 1000 / timeStep);
  
  const timeBytes = new Uint8Array(8);
  let t = time;
  for (let i = 7; i >= 0; i--) {
    timeBytes[i] = t & 0xff;
    t = Math.floor(t / 256);
  }
  
  const hmac = await hmacSha1(key, timeBytes);
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code = (
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)
  ) % 1000000;
  
  return code.toString().padStart(6, '0');
}

async function verifyTOTP(secret: string, token: string, window = 1): Promise<boolean> {
  const timeStep = 30;
  const currentTime = Math.floor(Date.now() / 1000 / timeStep);
  
  for (let i = -window; i <= window; i++) {
    const key = base32Decode(secret);
    const time = currentTime + i;
    
    const timeBytes = new Uint8Array(8);
    let t = time;
    for (let j = 7; j >= 0; j--) {
      timeBytes[j] = t & 0xff;
      t = Math.floor(t / 256);
    }
    
    const hmac = await hmacSha1(key, timeBytes);
    const offset = hmac[hmac.length - 1] & 0x0f;
    const code = (
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff)
    ) % 1000000;
    
    if (code.toString().padStart(6, '0') === token) {
      return true;
    }
  }
  return false;
}

function generateBackupCodes(count = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);
    const code = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    codes.push(code.slice(0, 4) + '-' + code.slice(4, 8));
  }
  return codes;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, token } = await req.json();

    switch (action) {
      case "setup": {
        // Generate new secret and backup codes
        const secret = generateSecret();
        const backupCodes = generateBackupCodes();
        
        // Check if user already has TOTP setup
        const { data: existing } = await supabase
          .from("user_totp_secrets")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (existing) {
          await supabase
            .from("user_totp_secrets")
            .update({ 
              encrypted_secret: secret, 
              backup_codes: backupCodes,
              is_enabled: false 
            })
            .eq("user_id", user.id);
        } else {
          await supabase
            .from("user_totp_secrets")
            .insert({ 
              user_id: user.id, 
              encrypted_secret: secret, 
              backup_codes: backupCodes,
              is_enabled: false 
            });
        }

        const otpauthUrl = `otpauth://totp/JCCreativeStudios:${user.email}?secret=${secret}&issuer=JCCreativeStudios&algorithm=SHA1&digits=6&period=30`;

        return new Response(JSON.stringify({ 
          secret, 
          otpauthUrl,
          backupCodes 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "verify": {
        // Get user's secret
        const { data: totpData, error: fetchError } = await supabase
          .from("user_totp_secrets")
          .select("encrypted_secret, is_enabled")
          .eq("user_id", user.id)
          .single();

        if (fetchError || !totpData) {
          return new Response(JSON.stringify({ error: "2FA not set up" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const isValid = await verifyTOTP(totpData.encrypted_secret, token);

        if (!isValid) {
          return new Response(JSON.stringify({ error: "Invalid code", valid: false }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // If this is first verification, enable 2FA
        if (!totpData.is_enabled) {
          await supabase
            .from("user_totp_secrets")
            .update({ is_enabled: true })
            .eq("user_id", user.id);
        }

        return new Response(JSON.stringify({ valid: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "disable": {
        // Verify token before disabling
        const { data: totpData } = await supabase
          .from("user_totp_secrets")
          .select("encrypted_secret")
          .eq("user_id", user.id)
          .single();

        if (!totpData) {
          return new Response(JSON.stringify({ error: "2FA not set up" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const isValid = await verifyTOTP(totpData.encrypted_secret, token);
        if (!isValid) {
          return new Response(JSON.stringify({ error: "Invalid code" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        await supabase
          .from("user_totp_secrets")
          .delete()
          .eq("user_id", user.id);

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "status": {
        const { data: totpData } = await supabase
          .from("user_totp_secrets")
          .select("is_enabled")
          .eq("user_id", user.id)
          .single();

        return new Response(JSON.stringify({ 
          enabled: totpData?.is_enabled ?? false,
          hasSetup: !!totpData
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "verify-backup": {
        const { data: totpData } = await supabase
          .from("user_totp_secrets")
          .select("backup_codes")
          .eq("user_id", user.id)
          .single();

        if (!totpData || !totpData.backup_codes) {
          return new Response(JSON.stringify({ error: "No backup codes found" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const normalizedToken = token.toUpperCase().replace(/[^A-Z0-9-]/g, '');
        const codeIndex = totpData.backup_codes.findIndex(
          (code: string) => code === normalizedToken
        );

        if (codeIndex === -1) {
          return new Response(JSON.stringify({ error: "Invalid backup code", valid: false }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Remove used backup code
        const newCodes = [...totpData.backup_codes];
        newCodes.splice(codeIndex, 1);

        await supabase
          .from("user_totp_secrets")
          .update({ backup_codes: newCodes })
          .eq("user_id", user.id);

        return new Response(JSON.stringify({ valid: true, remainingCodes: newCodes.length }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error: unknown) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
