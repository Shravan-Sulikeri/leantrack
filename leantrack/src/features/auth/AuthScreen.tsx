import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Dumbbell, Scale, Flame, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export function AuthScreen() {
  const { signInWithOtp, verifyOtp, enableDemoMode, isConfigured } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<'intro' | 'email' | 'otp'>('intro');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      icon: <Dumbbell className="w-8 h-8 text-[#FF7A2F]" />,
      title: 'Structured 4-Day Split',
      desc: 'Machine-based upper/lower workouts designed for steady fat loss and preserving lean muscle.',
    },
    {
      icon: <Scale className="w-8 h-8 text-[#347FEF]" />,
      title: 'Zero-Friction Logging',
      desc: 'Log weights, completed sets, and calories in seconds with offline-first persistence.',
    },
    {
      icon: <Flame className="w-8 h-8 text-[#50C48B]" />,
      title: 'Honest Weight Journey',
      desc: 'From 240 lb to 190 lb. 7-day rolling averages and milestone markers, no false spot-reduction claims.',
    },
  ];

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast({ type: 'error', message: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    const { error } = await signInWithOtp(email);
    setIsLoading(false);

    if (error) {
      showToast({ type: 'error', message: error.message || 'Failed to send code' });
    } else {
      showToast({ type: 'success', message: '6-digit sign-in code sent to your email' });
      setStep('otp');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || token.length < 6) {
      showToast({ type: 'error', message: 'Please enter the 6-digit code' });
      return;
    }

    setIsLoading(true);
    const { error } = await verifyOtp(email, token);
    setIsLoading(false);

    if (error) {
      showToast({ type: 'error', message: error.message || 'Invalid or expired code' });
    } else {
      showToast({ type: 'success', message: 'Welcome to LeanTrack!' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F6F7F9] flex flex-col justify-between p-6 max-w-md mx-auto">
      {/* Top Header */}
      <div className="pt-8 text-center flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-[#FF7A2F]/15 border border-[#FF7A2F]/30 flex items-center justify-center mb-4 shadow-[0_0_24px_rgba(255,122,47,0.2)]">
          <Dumbbell className="w-8 h-8 text-[#FF7A2F]" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#F6F7F9]">
          Lean<span className="text-[#FF7A2F]">Track</span>
        </h1>
        <p className="text-xs text-[#A5ADB8] mt-1 font-medium tracking-wide uppercase">
          iPhone-First Recomposition Tracker
        </p>
      </div>

      {/* Middle Carousel / Form */}
      <div className="my-8">
        {step === 'intro' && (
          <div className="flex flex-col gap-6">
            <Card variant="raised" className="p-6 border border-[#2B3038]">
              <div className="min-h-[160px] flex flex-col items-center text-center justify-center">
                <div className="mb-4 p-3 rounded-full bg-[#171A1F]">
                  {slides[activeSlide]?.icon}
                </div>
                <h3 className="text-lg font-bold text-[#F6F7F9] mb-2">
                  {slides[activeSlide]?.title}
                </h3>
                <p className="text-xs text-[#A5ADB8] leading-relaxed max-w-[280px]">
                  {slides[activeSlide]?.desc}
                </p>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-1.5 mt-4">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      activeSlide === i ? 'w-6 bg-[#FF7A2F]' : 'w-1.5 bg-[#343A43]'
                    }`}
                  />
                ))}
              </div>
            </Card>

            <div className="flex flex-col gap-3">
              {isConfigured ? (
                <Button
                  size="lg"
                  className="w-full text-base font-semibold"
                  onClick={() => setStep('email')}
                >
                  Sign in with Email Code <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <div className="p-3 bg-[#22262C] rounded-[16px] border border-[#343A43] text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-[#F0B35A] font-semibold mb-1">
                    <Sparkles className="w-4 h-4" /> Ready for Offline Use
                  </div>
                  <p className="text-[11px] text-[#A5ADB8]">
                    Supabase credentials optional. You can use full offline IndexedDB right away.
                  </p>
                </div>
              )}

              <Button
                variant={isConfigured ? 'secondary' : 'primary'}
                size="lg"
                className="w-full text-base font-semibold"
                onClick={enableDemoMode}
              >
                Start Local Workout Tracker
              </Button>
            </div>
          </div>
        )}

        {step === 'email' && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <Card variant="raised" className="p-6">
              <h2 className="text-lg font-bold text-[#F6F7F9] mb-1">Enter your email</h2>
              <p className="text-xs text-[#A5ADB8] mb-4">
                We will send a 6-digit one-time code to sign in directly from this iPhone screen.
              </p>

              <Input
                type="email"
                label="Email address"
                placeholder="athlete@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
              />

              <div className="mt-4 flex flex-col gap-2">
                <Button type="submit" size="lg" className="w-full" loading={isLoading}>
                  Send 6-Digit Code
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep('intro')}
                  className="w-full text-xs"
                >
                  Back
                </Button>
              </div>
            </Card>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <Card variant="raised" className="p-6">
              <h2 className="text-lg font-bold text-[#F6F7F9] mb-1">Check your inbox</h2>
              <p className="text-xs text-[#A5ADB8] mb-4">
                Enter the 6-digit code sent to <span className="text-[#F6F7F9] font-medium">{email}</span>.
              </p>

              <Input
                type="text"
                inputMode="numeric"
                label="6-Digit Verification Code"
                placeholder="123456"
                maxLength={6}
                value={token}
                onChange={(e) => setToken(e.target.value.trim())}
                autoFocus
                required
                className="text-center tracking-widest text-xl font-bold font-mono"
              />

              <div className="mt-4 flex flex-col gap-2">
                <Button type="submit" size="lg" className="w-full" loading={isLoading}>
                  Confirm & Enter
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep('email')}
                  className="w-full text-xs"
                >
                  Change Email
                </Button>
              </div>
            </Card>
          </form>
        )}
      </div>

      {/* Bottom Security Note */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-[#687383] text-center">
        <ShieldCheck className="w-4 h-4 shrink-0 text-[#50C48B]" />
        <span>Private & isolated with Row Level Security</span>
      </div>
    </div>
  );
}
