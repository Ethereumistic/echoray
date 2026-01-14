import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";

/**
 * Permission management Convex functions
 * Handles permission checks and computation
 */

/**
 * Permission bit positions - must match the seed data and types/permissions.ts
 */
export const PERMISSION_BITS: Record<string, number> = {
    // Basic
    'profile.view': 0,
    'profile.edit': 1,

    // Web tier
    'analytics.view': 2,
    'export.csv': 3,
    'integrations.basic': 4,

    // App tier
    'analytics.advanced': 5,
    'api.access': 6,
    'export.pdf': 7,
    'webhooks.manage': 8,

    // CRM tier
    'crm.contacts': 9,
    'crm.deals': 10,
    'crm.automation': 11,

    // Admin permissions
    'org.settings': 12,
    'members.invite': 13,
    'members.remove': 14,
    'roles.manage': 15,
    'billing.view': 16,
    'billing.manage': 17,

    // Addons
    'integrations.zapier': 18,
    'integrations.slack': 19,
    'storage.extended': 20,
    'support.priority': 21,
};

/**
 * Check if a permission bit is set
 */
export function hasPermissionBit(permissions: number, bitPosition: number): boolean {
    return (permissions & (1 << bitPosition)) !== 0;
}

/**
 * Set a permission bit
 */
export function setPermissionBit(permissions: number, bitPosition: number): number {
    return permissions | (1 << bitPosition);
}

/**
 * Clear a permission bit
 */
export function clearPermissionBit(permissions: number, bitPosition: number): number {
    return permissions & ~(1 << bitPosition);
}

/**
 * Check if the current user has a specific permission in an organization
 */
export const checkPermission = query({
    args: {
        organizationId: v.id("organizations"),
        permissionCode: v.string(),
    },
    handler: async (ctx, { organizationId, permissionCode }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return false;

        const bitPosition = PERMISSION_BITS[permissionCode];
        if (bitPosition === undefined) return false;

        // Get computed permissions
        const permissions = await computeMemberPermissionsInternal(ctx, userId, organizationId);

        return hasPermissionBit(permissions, bitPosition);
    },
});

/**
 * Get all permissions for the current user in an organization
 */
export const getUserPermissions = query({
    args: { organizationId: v.id("organizations") },
    handler: async (ctx, { organizationId }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return {};

        const permissions = await computeMemberPermissionsInternal(ctx, userId, organizationId);

        // Convert to permission code -> boolean map
        const result: Record<string, boolean> = {};
        for (const [code, bitPosition] of Object.entries(PERMISSION_BITS)) {
            result[code] = hasPermissionBit(permissions, bitPosition);
        }

        return result;
    },
});

/**
 * Internal function to compute member permissions
 */
async function computeMemberPermissionsInternal(
    ctx: any,
    userId: Id<"users">,
    organizationId: Id<"organizations">
): Promise<number> {
    let permissions = 0;

    // Get membership
    const membership = await ctx.db
        .query("organizationMembers")
        .withIndex("by_org_user", (q: any) =>
            q.eq("organizationId", organizationId).eq("userId", userId)
        )
        .first();

    if (!membership || membership.status !== "active") {
        return 0;
    }

    // Check if we have a valid cached value (less than 5 minutes old)
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    if (
        membership.permissionsLastComputedAt &&
        membership.permissionsLastComputedAt > fiveMinutesAgo
    ) {
        return membership.computedPermissions;
    }

    // 1. Get base tier permissions
    const org = await ctx.db.get(organizationId);
    if (!org) return 0;

    const tier = await ctx.db.get(org.subscriptionTierId);
    if (tier) {
        permissions |= tier.basePermissions;
    }
    permissions |= org.customPermissions;

    // 2. Add organization addons
    const addons = await ctx.db
        .query("organizationAddons")
        .withIndex("by_organizationId", (q: any) => q.eq("organizationId", organizationId))
        .filter((q: any) =>
            q.and(
                q.eq(q.field("isActive"), true),
                q.or(
                    q.eq(q.field("expiresAt"), undefined),
                    q.gt(q.field("expiresAt"), Date.now())
                )
            )
        )
        .collect();

    for (const addon of addons) {
        const permission = await ctx.db.get(addon.permissionId);
        if (permission) {
            permissions = setPermissionBit(permissions, permission.bitPosition);
        }
    }

    // 3. Get role permissions
    const memberRoles = await ctx.db
        .query("memberRoles")
        .withIndex("by_memberId", (q: any) => q.eq("memberId", membership._id))
        .collect();

    for (const mr of memberRoles) {
        const role = await ctx.db.get(mr.roleId);
        if (role) {
            permissions |= role.permissions;
        }
    }

    // 4. Apply member-specific overrides
    const overrides = await ctx.db
        .query("memberPermissionOverrides")
        .withIndex("by_memberId", (q: any) => q.eq("memberId", membership._id))
        .filter((q: any) =>
            q.or(
                q.eq(q.field("expiresAt"), undefined),
                q.gt(q.field("expiresAt"), Date.now())
            )
        )
        .collect();

    // Sort so denies are processed last
    overrides.sort((a: any, b: any) => (a.allow ? -1 : 1) - (b.allow ? -1 : 1));

    for (const override of overrides) {
        const permission = await ctx.db.get(override.permissionId);
        if (permission) {
            if (override.allow) {
                permissions = setPermissionBit(permissions, permission.bitPosition);
            } else {
                permissions = clearPermissionBit(permissions, permission.bitPosition);
            }
        }
    }

    // Note: We don't cache here in a query (can't mutate in query)
    // Caching would need to be done in a separate mutation

    return permissions;
}

/**
 * Recompute and cache a member's permissions
 */
export const recomputeMemberPermissions = mutation({
    args: { memberId: v.id("organizationMembers") },
    handler: async (ctx, { memberId }) => {
        const member = await ctx.db.get(memberId);
        if (!member) throw new Error("Member not found");

        const permissions = await computeMemberPermissionsInternal(
            ctx,
            member.userId,
            member.organizationId
        );

        await ctx.db.patch(memberId, {
            computedPermissions: permissions,
            permissionsLastComputedAt: Date.now(),
        });

        return permissions;
    },
});
