import { House, Inbox, KeyRound } from "lucide-react"
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarFooter, SidebarMenu, SidebarGroupContent, SidebarMenuButton, SidebarMenuItem, SidebarGroupLabel, SidebarTrigger } from "./components/ui/sidebar"



export function NavSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>Hello <SidebarTrigger /></SidebarHeader>
            <SidebarContent className='min-w-52 bg-amber-200'>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href="/inbox">
                                <Inbox />
                                <span>Inbox</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href="/">
                                <House />
                                <span>Home</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href="/login">
                                <KeyRound />
                                <span>Login</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
