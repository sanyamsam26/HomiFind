import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Building2, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export function PublicLayout() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const isNavActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafd] text-slate-900 font-sans">
      {/* Marketing Top Navbar from Image 6 */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-[#1b206b] font-bold text-xl tracking-tight">
            <Building2 className="h-5 w-5 text-[#1b206b]" />
            <span>HomiFind AI</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-medium text-slate-600">
            <Link
              to="/discover"
              className={`transition-colors py-1 ${
                isNavActive("/discover")
                  ? "text-[#1b206b] font-bold border-b-2 border-[#1b206b]"
                  : "hover:text-[#1b206b]"
              }`}
            >
              Discover
            </Link>
            <Link
              to="/pricing"
              className={`transition-colors py-1 ${
                isNavActive("/pricing")
                  ? "text-[#1b206b] font-bold border-b-2 border-[#1b206b]"
                  : "hover:text-[#1b206b]"
              }`}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className={`transition-colors py-1 ${
                isNavActive("/about")
                  ? "text-[#1b206b] font-bold border-b-2 border-[#1b206b]"
                  : "hover:text-[#1b206b]"
              }`}
            >
              About
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <button
                onClick={() => {
                  if (currentUser.role === "owner") navigate("/owner/dashboard");
                  else if (currentUser.role === "broker") navigate("/broker/overview");
                  else navigate("/app/explore");
                }}
                className="bg-[#1b206b] hover:bg-[#141854] text-white font-medium text-xs px-5 py-2.5 rounded-full shadow-xs transition-all cursor-pointer flex items-center"
              >
                <span>Dashboard</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </button>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="text-xs font-semibold text-slate-700 hover:text-[#1b206b] px-3 py-2 cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  to="/auth/signup"
                  className="bg-[#1b206b] hover:bg-[#141854] text-white font-medium text-xs px-5 py-2.5 rounded-full shadow-xs transition-all cursor-pointer"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Public Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Marketing Footer from Image 6 */}
      <footer className="bg-[#f8fafe] border-t border-slate-200/60 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-[#1b206b] text-base">HomiFind AI</div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              © {new Date().getFullYear()} HomiFind AI. Quiet Luxury in Real Estate Discovery.
            </p>
          </div>

          <div className="flex flex-wrap items-center space-x-6 text-[11px] font-medium text-slate-600">
            <a href="#" className="hover:text-[#1b206b]">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#1b206b]">
              Terms of Service
            </a>
            <a href="#" className="hover:text-[#1b206b]">
              AI Ethics
            </a>
            <Link to="/contact" className="hover:text-[#1b206b]">
              Contact Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

