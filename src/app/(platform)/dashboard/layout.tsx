import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { OrgInitializer } from '@/components/dashboard/org-initializer'

/**
 * Layout for /dashboard routes (legacy redirect support).
 */
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <OrgInitializer />
            <AppSidebar />
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}
