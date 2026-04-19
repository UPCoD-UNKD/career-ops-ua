'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Briefcase, Mail, ArrowRight, ShieldCheck, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [token, setToken] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (!email) {
      router.push('/signup');
    }
  }, [email, router]);

  const handleInput = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newToken = [...token];
    newToken[index] = value;
    setToken(newToken);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !token[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const finalToken = token.join('');
    if (finalToken.length < 6) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: finalToken })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Verification failed');

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login?verified=true');
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-submit when 6 digits are entered
  useEffect(() => {
    if (token.every(t => t !== '')) {
      handleSubmit();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[150px]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 bg-amber-500 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.2)] mb-4">
            <Mail className="h-6 w-6 text-black" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Check your email</h1>
          <p className="text-white/40 text-sm">We've sent a 6-digit code to <span className="text-white font-medium">{email}</span></p>
        </div>

        <div className="bg-white/[0.02] border border-white/10 backdrop-blur-3xl rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="h-20 w-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Email Verified</h2>
                <p className="text-white/40 mb-8">Account activated successfully. Taking you to login...</p>
              </motion.div>
            ) : (
              <motion.div key="form">
                <div className="flex justify-between gap-2 mb-8">
                  {token.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleInput(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      autoFocus={i === 0}
                      className="w-12 h-14 bg-black/40 border border-white/10 rounded-xl text-center text-xl font-bold focus:border-amber-500/50 outline-none transition-all"
                    />
                  ))}
                </div>

                {error && (
                  <div className="text-red-400 text-xs font-bold text-center bg-red-500/10 py-2 rounded-xl border border-red-500/20 mb-6">
                    {error}
                  </div>
                )}

                <button 
                  onClick={() => handleSubmit()}
                  disabled={isLoading || token.some(t => !t)}
                  className="w-full bg-amber-500 text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-amber-400 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                    <>
                      Verify Account
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <div className="mt-6 text-center">
                  <button 
                    disabled={resendCooldown > 0}
                    className="text-white/40 text-xs hover:text-white transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    <RefreshCw size={12} className={resendCooldown > 0 ? 'animate-spin' : ''} />
                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend verification code'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-8 text-center text-white/40 text-sm">
          Entered the wrong email?{' '}
          <Link href="/signup" className="text-amber-500 font-bold hover:text-amber-400 transition-colors">
            Back to signup
          </Link>
        </p>

        <div className="mt-8 flex items-center justify-center gap-2 text-white/10">
          <ShieldCheck size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Enterprise Security v2.0</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Loader2 className="animate-spin text-amber-500" /></div>}>
      <VerifyContent />
    </Suspense>
  );
}
