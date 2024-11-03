"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Settings,
  MessageSquare,
  Shield,
  Youtube,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const routes = [
  {
    label: "Dashboard",
    icon: BarChart,
    href: "/dashboard",
  },
  {
    label: "Comments",
    icon: MessageSquare,
    href: "/dashboard/comments",
  },
  {
    label: "Moderation",
    icon: Shield,
    href: "/dashboard/moderation",
  },
  {
    label: "Channels",
    icon: Youtube,
    href: "/dashboard/channels",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col bg-background border-r">
      <div className="h-16 flex items-center gap-2 px-6 border-b">
        <Youtube className="h-6 w-6 text-red-500" />
        <span className="font-bold">TubeBot</span>
      </div>
      
      <div className="flex-1 flex flex-col gap-2 p-4">
        {routes.map((route) => (
          <Button
            key={route.href}
            variant={pathname === route.href ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-2",
              pathname === route.href && "bg-secondary"
            )}
            asChild
            onClick={onNavigate}
          >
            <Link href={route.href}>
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          </Button>
        ))}
      </div>
      
      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}