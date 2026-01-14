"use client"

import { useEffect } from "react"
import { useQuery } from "convex/react"
import { useAuthStore } from "@/stores/auth-store"
import { api } from "../../../convex/_generated/api"
import type { Organization } from "@/stores/auth-store"

/**
 * OrgInitializer is a hidden component that manages organization and permission state.
 * It ensures the auth store is populated with the user's organizations and active org permissions.
 */
export function OrgInitializer() {
    const {
        userId,
        setOrganizations,
        activeOrganization,
        setActiveOrganization,
        setPermissions,
        setLoading
    } = useAuthStore()

    // Query organizations the user is a member of
    const organizations = useQuery(
        api.organizations.listMyOrganizations,
        userId ? {} : "skip"
    )

    // Query permissions for the active organization
    const permissions = useQuery(
        api.permissions.getUserPermissions,
        activeOrganization?._id ? { organizationId: activeOrganization._id } : "skip"
    )

    // Update organizations in store when query completes
    useEffect(() => {
        if (organizations === undefined) {
            setLoading(true)
            return
        }

        setLoading(false)
        const orgs = (organizations || []) as Organization[]
        setOrganizations(orgs)

        // If no active org or the saved one is no longer in the list, pick the first one
        if (!activeOrganization || !orgs.find(o => o._id === activeOrganization?._id)) {
            const firstOrg = orgs.length > 0 ? orgs[0] : null
            setActiveOrganization(firstOrg)
        }
    }, [organizations, activeOrganization, setActiveOrganization, setLoading, setOrganizations])

    // Update permissions when they change
    useEffect(() => {
        if (permissions !== undefined) {
            setPermissions(permissions)
        }
    }, [permissions, setPermissions])

    return null // Hidden component
}
