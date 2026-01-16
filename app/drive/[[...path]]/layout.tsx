// app/drive/layout.tsx
import { Sidebar } from "./partials/Sidebar";
export default function DriveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen p-6 gap-8">
      {/* Desktop Sidebar - hidden on mobile */}
      <Sidebar />

      {/* Main Content Area - scrollable */}
      <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-white/5">
        {children}
      </main>
    </div>
  );
}
