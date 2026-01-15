"use client";
import { FaLock, FaBolt, FaPaintBrush } from "react-icons/fa";

export default function SignInPage() {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/authentication/google`;
  };

  return (
    <main className="relative min-h-dvh w-full flex items-center justify-center px-4 text-white overflow-hidden">
      {/* Multiple ambient glows for depth */}
      <div
        className="absolute left-1/4 top-1/3 w-150 h-150 bg-cyan-400/15 blur-[120px] rounded-full pointer-events-none animate-pulse"
        style={{ animationDuration: "4s" }}
      />
      <div
        className="absolute right-1/4 bottom-1/3 w-125 h-125 bg-purple-400/10 blur-[100px] rounded-full pointer-events-none animate-pulse"
        style={{ animationDuration: "6s" }}
      />

      {/* Central focused container */}
      <div className="relative w-full max-w-5xl">
        {/* Main glass container - centered focus */}
        <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-4xl shadow-[0_0_80px_rgba(34,211,238,0.2)] overflow-hidden">
          {/* Top decorative bar */}
          <div className="h-1 bg-linear-to-r from-transparent via-cyan-400/50 to-transparent" />

          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-0">
            {/* LEFT: Hero content */}
            <div className="relative p-8 sm:p-12 lg:p-16">
              {/* Hero text */}
              <div className="space-y-6">
                <div className="inline-block">
                  <div className="text-xs font-semibold tracking-widest text-cyan-300 mb-4 uppercase flex items-center gap-2">
                    <div className="w-8 h-px bg-linear-to-r from-cyan-400 to-transparent" />
                    Welcome
                  </div>
                </div>

                <h1 className="text-4xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                  Your own
                  <br />
                  <span className="bg-linear-to-r from-cyan-300 via-cyan-200 to-purple-300 bg-clip-text text-transparent">
                    cloud universe
                  </span>
                </h1>

                <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-md hidden lg:block">
                  Store, organize, and access your digital files in a secure,
                  space-inspired environment built for creators and teams.
                </p>
              </div>

              {/* Feature pills - hidden on mobile */}
              <div className="mt-10 hidden lg:flex flex-wrap gap-3">
                {[
                  { icon: FaLock, text: "Secure" },
                  { icon: FaBolt, text: "Fast" },
                  { icon: FaPaintBrush, text: "Beautiful" },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="
                        backdrop-blur-xl bg-white/5
                        border border-white/10
                        rounded-full
                        px-4 py-2
                        text-sm
                        flex items-center gap-2
                        shadow-[0_0_20px_rgba(34,211,238,0.15)]
                      "
                  >
                    <Icon className="text-cyan-300 text-sm" />
                    <span className="text-gray-300">{text}</span>
                  </div>
                ))}
              </div>

              {/* Stats - desktop only */}
              <div className="hidden lg:grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/5">
                {[
                  { label: "Encryption", value: "AES-256" },
                  { label: "Uptime", value: "99.9%" },
                  { label: "Privacy", value: "First" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-cyan-300">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Auth section */}
            <div className="relative p-8 sm:p-12 lg:p-16 flex flex-col justify-center border-l border-white/5 bg-white/2">
              {/* Decorative corner glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 blur-[60px] rounded-full pointer-events-none" />

              <div className="relative space-y-8">
                {/* Nebula branding */}
                <div className="flex items-center gap-3 pb-6 border-b border-white/5">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-cyan-400/30 to-purple-400/30 border border-cyan-300/30 shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center justify-center">
                    <span className="text-lg font-bold bg-linear-to-br from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                      N
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Nebula</div>
                    <div className="text-xs text-gray-400">Personal Cloud</div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-semibold mb-2">
                    Enter Nebula
                  </h2>
                  <p className="text-sm text-gray-400">
                    Sign in to your personal cloud workspace
                  </p>
                </div>

                {/* Google Sign In Button */}
                <button
                  onClick={handleGoogleLogin}
                  className="
                          w-full py-3 sm:py-4 rounded-xl
                          bg-cyan-400/20
                          hover:bg-cyan-400/30
                          border border-cyan-300/40
                          transition-all duration-300
                          font-medium
                          shadow-[0_0_20px_rgba(34,211,238,0.4)]
                          hover:shadow-[0_0_30px_rgba(34,211,238,0.7)]
                          flex items-center justify-center gap-3 cursor-pointer"
                >
                  {/* Google Icon */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Security badge */}
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                    Secure OAuth
                  </div>
                  <div className="w-px h-3 bg-white/10" />
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                    End-to-End Encrypted
                  </div>
                </div>

                {/* Additional info - desktop */}
                <div className="hidden lg:block pt-6 border-t border-white/5">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    By signing in, you agree to our Terms of Service and Privacy
                    Policy. Your data is encrypted and stored securely.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
