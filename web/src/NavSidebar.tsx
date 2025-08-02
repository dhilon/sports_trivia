import { CircleUserRound, House, Inbox, KeyRound, LogOut, Trophy, UserRoundSearch } from "lucide-react"
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "./components/ui/sidebar"
import { useState } from "react";
import axios from "axios";
import { navigate } from "wouter/use-browser-location";
import { Redirect, useLocation } from "wouter";
import { currUser } from "./components/CurrUser";


export function NavSidebar() { //need to change redirects to fetch currUser

    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [location] = useLocation();

    const { user, isLoading, isError } = currUser();

    if (isLoading) {
        return <p>Loading user…</p>;
    }
    if (isError) {
        return <Redirect to="/login" />;
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

    // Helper function to check if a path is active
    const isActive = (path: string) => {
        if (path === "/" && location === "/") return true;
        if (path !== "/" && location.startsWith(path)) return true;
        return false;
    };

    return (
        <Sidebar>
            <SidebarHeader><SidebarTrigger />Hello, {user?.username}</SidebarHeader>
            <SidebarContent className='min-w-52 bg-amber-200 text-purple-500'>
                <SidebarMenu>
                    <SidebarMenuItem className="mb-2 mt-2 ml-2 mr-2">
                        <SidebarMenuButton asChild className={`rounded-xl ${isActive("/home") ? "bg-purple-600 text-white" : ""}`}>
                            <a href="/">
                                <House />
                                <span>Home</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem className="mb-2 ml-2 mr-2">
                        <SidebarMenuButton asChild className={`rounded-xl ${isActive(`/profile/${user?.username}`) ? "bg-purple-600 text-white" : ""}`}>
                            <a href={`/profile/${user?.username}`}>
                                <CircleUserRound />
                                <span>Profile</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem className="mb-2 ml-2 mr-2">
                        <SidebarMenuButton asChild className={`rounded-xl ${isActive(`/gamelog/${user?.username}`) ? "bg-purple-600 text-white" : ""}`}>
                            <a href={`/gamelog/${user?.username}`}>
                                <Inbox />
                                <span>Gamelog</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem className="mb-2 ml-2 mr-2">
                        <SidebarMenuButton asChild className={`rounded-xl ${isActive("/friends") ? "bg-purple-600 text-white" : ""}`}>
                            <a href={`/friends/`}>
                                <UserRoundSearch />
                                <span>Friends</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem className="mb-2 ml-2 mr-2">
                        <SidebarMenuButton asChild className={`rounded-xl ${isActive("/leaderboard") ? "bg-purple-600 text-white" : ""}`}>
                            <a href={`/leaderboard/`}>
                                <Trophy />
                                <span>Leaderboard</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem className="mb-2 ml-2 mr-2">
                        <SidebarMenuButton asChild className={`rounded-xl ${isActive("/password") ? "bg-purple-600 text-white" : ""}`}>
                            <a href="/password">
                                <KeyRound />
                                <span>Change Login</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem className="mb-2 ml-2 mr-2">
                        <SidebarMenuButton asChild className="rounded-xl" onClick={handleLogout} disabled={isLoggingOut}>
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
