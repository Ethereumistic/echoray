import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { OrgInitializer } from '@/components/dashboard/org-initializer'

/**
 * Layout for /o routes (organization-level actions like create).
 * Different from [scope]/[slug] layout - this is for org-wide actions.
 */
export default function OrgActionsLayout({
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
