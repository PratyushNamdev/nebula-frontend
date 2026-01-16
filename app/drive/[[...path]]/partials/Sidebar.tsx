"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Star, Trash2, Crown } from "lucide-react";
import { useGetProfile } from "@/services/profile";
import { useGetFolderTree } from "@/services/folders";
import { FolderTree } from "@/components/atoms";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const { data: profile } = useGetProfile();
  const { data: tree } = useGetFolderTree();
  const pathname = usePathname();
  const currentPath =
    pathname === "/drive" ? "/" : pathname.replace("/drive", "");
  return (
    <aside className="hidden lg:flex lg:flex-col w-72 bg-white/2 backdrop-blur-xl border-r border-white/5 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-white/5 rounded-3xl">
      {/* Decorative corner glow */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-400/10 blur-[60px] rounded-full pointer-events-none" />

      {/* Logo & Brand */}
      <div className="px-6 pt-6 pb-0 border-white/5">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="https://res.cloudinary.com/dggdpeaw4/image/upload/v1768534687/Gemini_Generated_Image_brk7dbbrk7dbbrk7_1_1_ptnltq.png"
            alt="Nebula Logo"
            width={60}
            height={60}
            className="
                rounded-lg
            drop-shadow-[0_0_48px_rgba(182,241,245,0.4)]"
          />

          <span className="text-glow-nebula font-semibold text-lg">NEBULA</span>
        </div>
      </div>

      {/* User Profile Section */}
      {profile && (
        <div className="px-6 pt-3 py-6 border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-linear-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {profile.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">
                {profile.username}
              </p>
              <p className="text-white/60 text-sm truncate">{profile.email}</p>
            </div>
          </div>

          {/* Premium Badge or Upgrade Button */}
          {profile.isPremium ? (
            <div className="flex items-center gap-2 px-3 py-2 bg-linear-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-lg">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium">
                Premium
              </span>
            </div>
          ) : (
            <Button className="w-full bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
          )}
        </div>
      )}

      {/* Navigation Links */}
      <nav className="p-4 space-y-1 border-b border-white/5">
        <Link href="/drive">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all group">
            <Home className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
            <span>Home</span>
          </button>
        </Link>

        <Link href="/drive/starred">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all group">
            <Star className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
            <span>Starred</span>
          </button>
        </Link>

        <Link href="/drive/trash">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all group">
            <Trash2 className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
            <span>Trash</span>
          </button>
        </Link>
      </nav>

      {/* Folder Tree */}
      <div className="flex-1 p-4 overflow-y-auto">
        <h3 className="text-white/60 text-sm font-medium mb-3 px-2">
          My Files
        </h3>
        {tree && <FolderTree folders={tree} currentPath={currentPath} />}
      </div>
    </aside>
  );
}
