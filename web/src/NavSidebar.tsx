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

    const { user, isLoading, isError, clearUser } = currUser();

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
            // Clear the user cache so the app knows we're logged out
            clearUser();
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
            <SidebarHeader className="border-b border-gray-200/60 bg-white/80 backdrop-blur">
                <SidebarTrigger className="text-gray-800" />
                <span className="text-sm font-medium text-gray-700">Hello, {user?.username}</span>
            </SidebarHeader>
            <SidebarContent className='min-w-52 bg-white/70 backdrop-blur-md text-gray-700 border-r border-gray-200/60'>
                <SidebarMenu>
                    <SidebarMenuItem className="mb-2 mt-2 ml-2 mr-2">
                        <SidebarMenuButton asChild className={`rounded-xl transition-all ${isActive("/home") ? "bg-purple-600 text-white shadow-sm" : "hover:bg-gray-100 hover:text-gray-800"}`}>
                            <a href="/">
                                <House />
                                <span>Home</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem className="mb-2 ml-2 mr-2">
                        <SidebarMenuButton asChild className={`rounded-xl transition-all ${isActive(`/profile/${user?.id}`) ? "bg-purple-600 text-white shadow-sm" : "hover:bg-gray-100 hover:text-gray-800"}`}>
                            <a href={`/profile/${user?.id}`}>
                                <CircleUserRound />
                                <span>Profile</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem className="mb-2 ml-2 mr-2">
                        <SidebarMenuButton asChild className={`rounded-xl transition-all ${isActive(`/gamelog/${user?.username}`) ? "bg-purple-600 text-white shadow-sm" : "hover:bg-gray-100 hover:text-gray-800"}`}>
                            <a href={`/gamelog/${user?.username}`}>
                                <Inbox />
                                <span>Gamelog</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem className="mb-2 ml-2 mr-2">
                        <SidebarMenuButton asChild className={`rounded-xl transition-all ${isActive("/friends") ? "bg-purple-600 text-white shadow-sm" : "hover:bg-gray-100 hover:text-gray-800"}`}>
                            <a href={`/friends/`}>
                                <UserRoundSearch />
                                <span>Friends</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem className="mb-2 ml-2 mr-2">
                        <SidebarMenuButton asChild className={`rounded-xl transition-all ${isActive("/leaderboard") ? "bg-purple-600 text-white shadow-sm" : "hover:bg-gray-100 hover:text-gray-800"}`}>
                            <a href={`/leaderboard/`}>
                                <Trophy />
                                <span>Leaderboard</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Only show Change Login for non-Google users */}
                    {!user?.google_sub && (
                        <SidebarMenuItem className="mb-2 ml-2 mr-2">
                            <SidebarMenuButton asChild className={`rounded-xl transition-all ${isActive("/password") ? "bg-purple-600 text-white shadow-sm" : "hover:bg-gray-100 hover:text-gray-800"}`}>
                                <a href="/password">
                                    <KeyRound />
                                    <span>Change Login</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                    <SidebarMenuItem className="mb-2 ml-2 mr-2">
                        <SidebarMenuButton asChild className="rounded-xl hover:bg-gray-100 hover:text-gray-800 transition-all" onClick={handleLogout} disabled={isLoggingOut}>
                            <div>
                                <LogOut />
                                <span>{isLoggingOut ? "Logging out…" : "Log Out"}</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    {errMsg && <p className="text-red-500 mt-2 ml-2">{errMsg}</p>}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="border-t border-gray-200/60 bg-white/80 backdrop-blur" />
        </Sidebar>
    )
}
