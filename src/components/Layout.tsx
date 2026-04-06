import { Outlet, NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, ReceiptText, BarChart3, User, ArrowLeftRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";

export default function Layout() {
  const { role, setRole, transactions } = useStore();
  const location = useLocation();

  const toggleRole = () => setRole(role === "viewer" ? "admin" : "viewer");

  const links = [
    { to: "/", label: "Overview", icon: LayoutDashboard },
    { to: "/transactions", label: "Transactions", icon: ReceiptText },
    { to: "/insights", label: "Insights", icon: BarChart3 },
  ];

  const activeIndex = links.findIndex(link => location.pathname === link.to || (link.to !== "/" && location.pathname.startsWith(link.to)));

  return (
    <div className="flex h-screen bg-[#fafaf7] text-[#18181b] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col justify-between bg-[#18181b] text-[#71717a] border-r border-[#e8e6df] p-4 z-10">
        <div>
          <div className="flex items-center gap-2 px-2 py-4 mb-8">
            <div className="h-8 w-8 rounded-lg bg-[#f59e0b] flex items-center justify-center shadow-lg shadow-[#f59e0b]/20">
              <span className="text-[#1c1917] font-bold">Z</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Zorvyn</h1>
          </div>
          <nav className="relative flex flex-col gap-2">
            {activeIndex !== -1 && (
              <div 
                className="absolute left-0 w-[3px] bg-[#6366f1] transition-all duration-300 pointer-events-none z-20"
                style={{
                  top: `${activeIndex * 52}px`,
                  height: '44px',
                  borderRadius: '0 2px 2px 0'
                }}
              />
            )}
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to || (link.to !== "/" && location.pathname.startsWith(link.to));

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ease-out outline-none ${
                    isActive
                      ? "text-[#ffffff] bg-[#6366f1]/[0.10] font-medium"
                      : "text-[#71717a] hover:bg-neutral-800 hover:text-white font-normal"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-[#ffffff]" : "text-[#71717a] group-hover:text-white"}`} />
                  <span className="flex-1">{link.label}</span>
                  {link.label === "Transactions" && (
                    <span className="px-2 py-[2px] bg-[#6366f1] text-white rounded-full text-[10px] font-bold leading-none">
                      {transactions.length}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User / Role Section */}
        <div className="border-t border-[#3f3f46] pt-4 pb-2">
          <div className="flex items-center justify-between px-2 mb-4 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[#f59e0b]/20 border border-[#f59e0b]/20 flex items-center justify-center">
                <User className="h-4 w-4 text-[#fbbf24]" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Test User</p>
                <p className="text-xs text-[#71717a] capitalize">{role} Mode</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleRole} title="Toggle Role (Admin/Viewer)" className="h-8 w-8 text-[#71717a] hover:text-white">
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
