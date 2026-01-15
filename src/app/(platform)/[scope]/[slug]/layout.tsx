"use client"

import { useParams, notFound } from 'next/navigation'
import { createContext, useContext, useMemo } from 'react'

/**
 * Scope context for personal (p) vs organization (o) workspaces.
 * Provides type-safe access to scope-related params throughout the app.
 */
interface ScopeContextValue {
    scope: 'p' | 'o'
    slug: string
    isPersonal: boolean
    isOrganization: boolean
}

const ScopeContext = createContext<ScopeContextValue | null>(null)

export function useScopeContext() {
    const context = useContext(ScopeContext)
    if (!context) {
        throw new Error('useScopeContext must be used within a ScopeProvider')
    }
    return context
}

/**
 * Unified layout for [scope]/[slug] routes.
 * Validates scope param and provides context for child pages.
 */
export default function ScopeSlugLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const params = useParams()
    const scope = params.scope as string
    const slug = params.slug as string

    // Validate scope - must be 'p' (personal) or 'o' (organization)
    if (scope !== 'p' && scope !== 'o') {
        notFound()
    }

    const contextValue = useMemo<ScopeContextValue>(() => ({
        scope: scope as 'p' | 'o',
        slug,
        isPersonal: scope === 'p',
        isOrganization: scope === 'o',
    }), [scope, slug])

    return (
        <ScopeContext.Provider value={contextValue}>
            {children}
        </ScopeContext.Provider>
    )
}
