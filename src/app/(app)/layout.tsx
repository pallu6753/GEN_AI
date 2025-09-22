import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ProfileProvider } from "@/context/profile-context";
import { MainNav } from "@/components/main-nav";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ProfileProvider>
        <Sidebar>
          <SidebarHeader>
            <Button variant="ghost" className="w-full justify-start gap-2 px-2 text-lg font-semibold" asChild>
                <Link href="/">
                    <Icons.logo className="size-5" />
                    Pallavi
                </Link>
            </Button>
          </SidebarHeader>
          <SidebarContent>
            <MainNav />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>{children}</SidebarInset>
      </ProfileProvider>
    </SidebarProvider>
  );
}
