"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { Menu, X } from "lucide-react";

export default function AdminLayoutWrapper({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex w-full h-[100dvh] overflow-hidden bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform lg:transform-none lg:static transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <AdminSidebar session={session} onNavigate={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden">
        {/* Mobile Header (Hamburger) */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <div className="font-bold text-[#041C3F]">GenBI Admin</div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
