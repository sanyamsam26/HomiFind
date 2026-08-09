import React from "react";
import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#f8fafe] font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Outlet />
    </div>
  );
}

