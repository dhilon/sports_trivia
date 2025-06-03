import { CircleUserRound, House, Inbox, KeyRound, LogOut, UserRoundSearch } from "lucide-react"
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "./components/ui/sidebar"
import { useState } from "react";
import axios from "axios";
import { navigate } from "wouter/use-browser-location";
import { currUser } from "./components/CurrUser";


export function NavSidebar() { //need to change redirects to fetch currUser

    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const { user, isLoading, isError, errorMessage } = currUser();

    if (isLoading) {
        return <p>Loading user…</p>;
    }
    if (isError) {
        return <p style={{ color: "red" }}>Error: {errorMessage}</p>;
    }

    async function handleLogout() {
        setErrMsg("");
        setIsLoggingOut(true);

        try {
            await axios.get("http://localhost:5000/logout/", {
                withCredentials: true,
            });
            // Successfully logged out on the server; redirect to /login
            navigate("/login");
        } catch (error: any) {
            console.error("Logout error:", error);
            setErrMsg("Failed to log out. Please try again.");
            setIsLoggingOut(false);
        }
    }



    return (
        <Sidebar>
            <SidebarHeader>Hello, {user?.username}<SidebarTrigger /></SidebarHeader>
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
                            <a href={`/profile/${user?.username}`}>
                                <CircleUserRound />
                                <span>Profile</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href={`/gamelog/${user?.username}`}>
                                <Inbox />
                                <span>Gamelog</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href={`/friends/`}>
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
                        <SidebarMenuButton asChild onClick={handleLogout} disabled={isLoggingOut}>
                            <div>
                                <LogOut />
                                <span>{isLoggingOut ? "Logging out…" : "Log Out"}</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    {errMsg && <p className="text-red-500 mt-2 ml-2">{errMsg}</p>}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
