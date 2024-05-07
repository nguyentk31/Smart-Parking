import { Navbar, SidebarNav, Footer } from "@/components";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const DefaultLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  return (
    <div className="h-full flex flex-col min-h-screen overflow-hidden">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex-grow">
        <SidebarNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
