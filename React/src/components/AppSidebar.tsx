import { ChartArea, Home, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

import { NavUser } from "./NavUser";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: ChartArea,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { user } = useAuth();
  const location = useLocation();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="rounded">
                  <SidebarMenuButton asChild className="rounded">
                    <a
                      href={item.url}
                      className={`rounded ${
                        location.pathname === item.url
                          ? "bg-sidebar-accent"
                          : ""
                      }`}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col gap-4 mb-4">
          {user ? (
            <>
              <NavUser user={user} />
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="p-2 rounded bg-primary text-background border text-center"
              >
                Login
              </Link>
              <Link to="/register" className="p-2 rounded border text-center">
                Register
              </Link>
            </>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
