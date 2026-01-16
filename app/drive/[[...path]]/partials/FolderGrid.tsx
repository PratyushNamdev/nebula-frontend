"use client";
import Link from "next/link";
import {
  Folder,
  MoreVertical,
  Trash2,
  Edit3,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface FolderItem {
  _id: string;
  name: string;
  path: string;
  createdAt: string;
}

interface FolderGridProps {
  folders: FolderItem[];
}

export function FolderGrid({ folders }: FolderGridProps) {
  if (folders.length === 0) return null;

  const handleDelete = (folderId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Delete folder:", folderId);
    // TODO: Implement delete logic
  };

  const handleRename = (folderId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Rename folder:", folderId);
    // TODO: Implement rename logic
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-white/5">
      <div className="bg-white/5 backdrop-blur-xl border-t border-white/10 p-6">
        {/* Section Header */}
        <h2 className="text-white/60 text-sm font-medium mb-4 px-2">
          Folders ({folders.length})
        </h2>

        {/* Folders Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3">
          {folders.map((folder) => (
            <div key={folder._id} className="group relative">
              <Link href={`/drive${folder.path}`}>
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 hover:bg-white/10 hover:border-cyan-400/30 transition-all cursor-pointer">
                  {/* Decorative glow on hover */}
                  <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/5 rounded-xl transition-all blur-xl pointer-events-none" />

                  {/* Three Dots Menu */}
                  <div className="absolute bottom-3 right-2 z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e: any) => e.preventDefault()}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-lg"
                        >
                          <MoreVertical className="h-3 w-3 text-white" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-black/80 backdrop-blur-xl border-white/10 text-white"
                      >
                        <DropdownMenuItem
                          className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                          onClick={(e: any) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                          onClick={(e: any) => handleRename(folder._id, e)}
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:bg-red-500/20 focus:bg-red-500/20 text-red-400 cursor-pointer"
                          onClick={(e: any) => handleDelete(folder._id, e)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Folder Icon */}
                  <div className="relative flex items-center justify-center h-20 mb-2">
                    <div className="w-14 h-14 bg-linear-to-br from-cyan-400/20 to-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Folder className="w-7 h-7 text-cyan-400" />
                    </div>
                  </div>

                  {/* Folder Info */}
                  <div className="relative">
                    <p className="text-white text-sm font-medium truncate mb-1">
                      {folder.name}
                    </p>
                    <p className="text-white/40 text-xs">
                      {new Date(folder.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
