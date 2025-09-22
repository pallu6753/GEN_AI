"use client";

import {
  Briefcase,
  LayoutDashboard,
  UserCog,
  BookOpenCheck,
  TrendingUp,
  ClipboardCheck,
  FileText,
  MessageSquare,
  Network,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const links = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: UserCog,
  },
  {
    href: "/assessment",
    label: "Assessment",
    icon: ClipboardCheck,
  },
  {
    href: "/recommendations",
    label: "Recommendations",
    icon: Briefcase,
  },
  {
    href: "/insights",
    label: "Job Insights",
    icon: TrendingUp,
  },
  {
    href: "/curriculum",
    label: "Curriculum",
    icon: BookOpenCheck,
  },
   {
    href: "/interview",
    label: "Mock Interview",
    icon: MessageSquare,
  },
  {
    href: "/resume",
    label: "Resume",
    icon: FileText,
  },
  {
    href: "/architecture",
    label: "Architecture",
    icon: Network,
  }
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === link.href}
            tooltip={link.label}
          >
            <Link href={link.href}>
              <link.icon />
              <span>{link.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
