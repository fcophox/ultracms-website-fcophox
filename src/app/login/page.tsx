"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Layers, Settings2, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <main className="fixed inset-0 z-[100] flex bg-black overflow-hidden font-sans">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 h-full bg-[#0c0c0e] flex flex-col relative">
        {/* Header / Logo */}
        <div className="absolute top-8 left-8 sm:top-12 sm:left-12 flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-zinc-800/50 flex items-center justify-center border border-zinc-700/50">
            <Layers className="text-white w-4 h-4" />
          </div>
          <span className="text-white font-light text-lg tracking-tight">fcoPhox CMS</span>
        </div>

        {/* Login Form Container */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-12">
          <div className="w-full max-w-[400px]">
            <h1 className="text-3xl font-light text-white mb-2">Welcome back</h1>
            <p className="text-zinc-400 text-sm mb-8">Sign in to your account</p>

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-[13px]">
                <AlertCircle size={16} />
                <p>{error}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label className="text-[13px] font-light text-zinc-300" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-12 bg-[#18181b] border border-transparent rounded-lg px-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-light text-zinc-300" htmlFor="password">
                    Password
                  </label>
                  <Link href="#" className="text-[13px] font-medium text-indigo-500 hover:text-indigo-400 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 bg-[#18181b] border border-transparent rounded-lg px-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all tracking-widest"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#4F46E5] hover:bg-[#4338ca] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm transition-colors mt-2 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-zinc-400 mt-8">
              Don't have an account?{" "}
              <Link href="#" className="text-white font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info left */}
        <div className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12">
          <p className="text-zinc-500 text-xs">
            By continuing, you agree to our{" "}
            <Link href="#" className="underline hover:text-zinc-300 transition-colors">Terms of Service</Link>
            {" "}and{" "}
            <Link href="#" className="underline hover:text-zinc-300 transition-colors">Privacy Policy</Link>.
          </p>
        </div>
      </div>

      {/* Right Side - Quote */}
      <div className="hidden lg:flex w-1/2 h-full bg-[#050505] flex-col items-center justify-center relative px-20">
        <div className="max-w-[540px]">
          <div className="w-14 h-14 rounded-full bg-zinc-900/80 flex items-center justify-center mb-10 border border-zinc-800/50">
            <Layers className="text-white w-6 h-6" />
          </div>

          <h2 className="text-3xl lg:text-4xl font-medium text-white leading-[1.3] tracking-tight mb-10">
            "Experience backed by knowledge. Designing with method, judgment, and impact vision to create digital products that connect."
          </h2>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 relative">
              <Image
                src="/brand/francisco-avatar.png?v=2"
                alt="Francisco Hormazabal"
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div>
              <div className="text-white font-light text-sm">Francisco Hormazabal</div>
              <div className="text-zinc-500 text-sm">@fcophox</div>
            </div>
          </div>
        </div>

        {/* Bottom right settings icon just like the design */}
        <div className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12">
          <button className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
