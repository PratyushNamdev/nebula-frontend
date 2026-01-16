"use client";
import { useState } from "react";
import { FolderPlus, Upload, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useGetProfile } from "@/services/profile";
import { useGetFolderByPath } from "@/services/folders";
import { UploadDialog } from "@molecules";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TopBar() {
  const { data: profile } = useGetProfile();
  const pathname = usePathname();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Convert pathname to breadcrumb segments
  const currentPath =
    pathname === "/drive" ? "/" : pathname.replace("/drive", "");
  const pathSegments =
    currentPath === "/"
      ? ["Drive"]
      : ["Drive", ...currentPath.split("/").filter(Boolean)];

  // Fetch current folder by path to get folderId
  const { data: currentFolder } = useGetFolderByPath(currentPath);
  console.log("Current Folder:", currentFolder);
  if (!profile) return null;

  return (
    <>
      <div className="sticky top-0 z-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-xl p-3 mt-3 mb-6 shadow-lg shadow-black/5  mx-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Breadcrumb with Folder Icon */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex items-center justify-center w-8 h-8 bg-white/5 rounded-lg">
              <FolderOpen className="w-4 h-4 text-cyan-400" />
            </div>

            <Breadcrumb>
              <BreadcrumbList>
                {pathSegments.map((segment, index) => (
                  <div key={index} className="flex items-center">
                    <BreadcrumbItem>
                      {index === pathSegments.length - 1 ? (
                        <BreadcrumbPage className="text-white font-medium">
                          {segment}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link
                            href={
                              index === 0
                                ? "/drive"
                                : `/drive/${pathSegments
                                    .slice(1, index + 1)
                                    .join("/")}`
                            }
                            className="text-white/60 hover:text-cyan-400 transition-colors"
                          >
                            {segment}
                          </Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < pathSegments.length - 1 && (
                      <BreadcrumbSeparator className="text-white/40 ml-3">
                        /
                      </BreadcrumbSeparator>
                    )}
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Right: Action Buttons + Storage */}
          <div className="flex items-center gap-3">
            {/* Action Buttons */}
            <Button
              variant="outline"
              size="sm"
              className="bg-white/5 hover:bg-white/10 border-white/20 text-white hover:text-cyan-400 transition-all h-8"
            >
              <FolderPlus className="w-4 h-4 mr-1.5" />
              New Folder
            </Button>
            <Button
              size="sm"
              onClick={() => setUploadDialogOpen(true)}
              disabled={!currentFolder}
              className="bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 h-8 disabled:opacity-50"
            >
              <Upload className="w-4 h-4 mr-1.5" />
              Upload
            </Button>

            {/* Storage Indicator */}
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-3 py-1.5">
              <div className="flex items-center gap-2">
                <div className="relative w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-0 bg-linear-to-r from-cyan-400 to-blue-500 transition-all"
                    style={{ width: `${profile.storage.percentage}%` }}
                  />
                </div>
                <span className="text-white/80 text-xs font-medium whitespace-nowrap">
                  {(profile.storage.used / 1024 ** 3).toFixed(1)} GB /{" "}
                  {(profile.storage.limit / 1024 ** 3).toFixed(0)} GB -{" "}
                  {profile.storage.percentage}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Dialog */}
      {currentFolder && (
        <UploadDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          folderId={currentFolder._id}
          folderPath={currentPath}
          userId={profile.id}
        />
      )}
    </>
  );
}
