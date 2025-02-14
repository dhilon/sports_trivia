import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"
import { NavSidebar } from "./NavSidebar"

export const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='w-screen'>
            <SidebarProvider defaultOpen={false}>
                <NavSidebar />
                <main className="w-full flex flex-col place-content-center">
                    <SidebarTrigger />
                    <div className='w-full'>{children}</div>
                </main>
            </SidebarProvider>
        </div>

    )
}
