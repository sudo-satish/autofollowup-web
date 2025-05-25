import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { auth } from "@clerk/nextjs/server"
import { items } from "./sidebar-menu-items";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const {userId, redirectToSignIn} = await auth();
    if (!userId) return redirectToSignIn()
  return (
    <SidebarProvider>
      <AppSidebar items={items}/>
      <main className="w-full p-5">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
