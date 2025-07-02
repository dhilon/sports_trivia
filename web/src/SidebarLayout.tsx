import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"
import { NavSidebar } from "./NavSidebar"

export const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='w-screen gradient-background dark group/design-root'>
            <SidebarProvider defaultOpen={false}>
                <NavSidebar />
                <main className="w-full flex flex-col">
                    <SidebarTrigger />
                    <div className='w-full'>{children}</div>
                </main>
            </SidebarProvider>
        </div>

    )
}
