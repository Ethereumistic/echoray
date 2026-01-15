import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { OrgInitializer } from '@/components/dashboard/org-initializer'

/**
 * Layout for /p routes (personal-level actions like settings).
 * Different from [scope]/[slug] layout - this is for personal actions without a user ID.
 */
export default function PersonalActionsLayout({
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
