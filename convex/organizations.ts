import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

/**
 * Organization-related Convex functions
 * Handles CRUD operations for organizations
 */

/**
 * Get all organizations the current user is a member of
 */
export const listMyOrganizations = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return [];

        // Get all memberships for this user
        const memberships = await ctx.db
            .query("organizationMembers")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("status"), "active"))
            .collect();

        // Get the organizations
        const organizations = await Promise.all(
            memberships.map(async (membership) => {
                const org = await ctx.db.get(membership.organizationId);
                return org;
            })
        );

        return organizations.filter(Boolean);
    },
});

/**
 * Get a single organization by ID
 */
export const getOrganization = query({
    args: { id: v.id("organizations") },
    handler: async (ctx, { id }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        // Check if user is a member
        const membership = await ctx.db
            .query("organizationMembers")
            .withIndex("by_org_user", (q) =>
                q.eq("organizationId", id).eq("userId", userId)
            )
            .first();

        if (!membership || membership.status !== "active") {
            throw new Error("Not a member of this organization");
        }

        return await ctx.db.get(id);
    },
});

/**
 * Get an organization by slug
 */
export const getOrganizationBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, { slug }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return null;

        const org = await ctx.db
            .query("organizations")
            .withIndex("by_slug", (q) => q.eq("slug", slug))
            .first();

        if (!org) return null;

        // Check if user is a member
        const membership = await ctx.db
            .query("organizationMembers")
            .withIndex("by_org_user", (q) =>
                q.eq("organizationId", org._id).eq("userId", userId)
            )
            .first();

        if (!membership || membership.status !== "active") {
            return null;
        }

        return org;
    },
});

/**
 * Create a new organization
 */
export const createOrganization = mutation({
    args: {
        name: v.string(),
        slug: v.string(),
        description: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        // Check if slug is already taken
        const existingOrg = await ctx.db
            .query("organizations")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();

        if (existingOrg) {
            throw new Error("Organization slug already exists");
        }

        // Get the default "user" tier
        const userTier = await ctx.db
            .query("subscriptionTiers")
            .withIndex("by_slug", (q) => q.eq("slug", "user"))
            .first();

        if (!userTier) {
            throw new Error("Default subscription tier not found. Please seed the database.");
        }

        // Create the organization
        const orgId = await ctx.db.insert("organizations", {
            name: args.name,
            slug: args.slug,
            description: args.description,
            ownerId: userId,
            subscriptionTierId: userTier._id,
            subscriptionStatus: "active",
            subscriptionStartedAt: Date.now(),
            customPermissions: 0,
        });

        // Create system roles for the organization
        await createSystemRoles(ctx, orgId);

        // Add the creator as an owner member
        const memberId = await ctx.db.insert("organizationMembers", {
            organizationId: orgId,
            userId,
            status: "active",
            invitedAt: Date.now(),
            joinedAt: Date.now(),
            computedPermissions: 0,
        });

        // Get the owner role
        const ownerRole = await ctx.db
            .query("roles")
            .withIndex("by_org_systemRole", (q) =>
                q.eq("organizationId", orgId).eq("isSystemRole", true)
            )
            .filter((q) => q.eq(q.field("systemRoleType"), "owner"))
            .first();

        if (ownerRole) {
            await ctx.db.insert("memberRoles", {
                memberId,
                roleId: ownerRole._id,
                assignedAt: Date.now(),
            });
        }

        return orgId;
    },
});

/**
 * Update an organization's settings
 */
export const updateOrganization = mutation({
    args: {
        id: v.id("organizations"),
        name: v.optional(v.string()),
        slug: v.optional(v.string()),
        description: v.optional(v.string()),
        logoUrl: v.optional(v.string()),
        website: v.optional(v.string()),
    },
    handler: async (ctx, { id, ...updates }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const org = await ctx.db.get(id);
        if (!org) throw new Error("Organization not found");

        // Check if user is owner or has org.settings permission
        if (org.ownerId !== userId) {
            // TODO: Check permissions
            throw new Error("Only the owner can update organization settings");
        }

        // If slug is being changed, check it's not taken
        if (updates.slug && updates.slug !== org.slug) {
            const existingOrg = await ctx.db
                .query("organizations")
                .withIndex("by_slug", (q) => q.eq("slug", updates.slug!))
                .first();

            if (existingOrg) {
                throw new Error("Organization slug already exists");
            }
        }

        await ctx.db.patch(id, updates);
        return { success: true };
    },
});

/**
 * Helper: Create system roles for a new organization
 */
async function createSystemRoles(ctx: any, orgId: any) {
    // Owner role (all permissions)
    await ctx.db.insert("roles", {
        organizationId: orgId,
        name: "Owner",
        description: "Organization owner with full control",
        color: "#e74c3c",
        permissions: Number.MAX_SAFE_INTEGER, // All bits set
        position: 0,
        isSystemRole: true,
        systemRoleType: "owner",
        isAssignable: false,
        isDefault: false,
    });

    // Admin role
    await ctx.db.insert("roles", {
        organizationId: orgId,
        name: "Admin",
        description: "Administrator with most privileges",
        color: "#3498db",
        permissions: 524287, // Bits 0-18
        position: 1,
        isSystemRole: true,
        systemRoleType: "admin",
        isAssignable: true,
        isDefault: false,
    });

    // Moderator role
    await ctx.db.insert("roles", {
        organizationId: orgId,
        name: "Moderator",
        description: "Can manage members and content",
        color: "#2ecc71",
        permissions: 8191, // Bits 0-12
        position: 2,
        isSystemRole: true,
        systemRoleType: "moderator",
        isAssignable: true,
        isDefault: false,
    });

    // Member role (default)
    await ctx.db.insert("roles", {
        organizationId: orgId,
        name: "Member",
        description: "Default member role",
        color: "#95a5a6",
        permissions: 7, // Bits 0-2 (basic permissions)
        position: 3,
        isSystemRole: true,
        systemRoleType: "member",
        isAssignable: true,
        isDefault: true,
    });
}
