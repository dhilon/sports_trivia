import { CircleUserRound, House, Inbox, KeyRound, LogOut, UserRoundSearch } from "lucide-react"
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "./components/ui/sidebar"



export function NavSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>Hello <SidebarTrigger /></SidebarHeader>
            <SidebarContent className='min-w-52 bg-amber-200'>
                <SidebarMenu>
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
                            <a href="/profile/Bob">
                                <CircleUserRound />
                                <span>Profile</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href="/gamelog">
                                <Inbox />
                                <span>Gamelog</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href="/friends">
                                <UserRoundSearch />
                                <span>Friends</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href="/password">
                                <KeyRound />
                                <span>Change Login</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href="/login">
                                <LogOut />
                                <span>Log out</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
