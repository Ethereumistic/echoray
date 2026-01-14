import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

/**
 * User-related Convex functions
 * Handles profile management and user queries
 */

/**
 * Get the currently authenticated user's profile
 */
export const currentUser = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return null;

        // Get the user from auth tables
        const user = await ctx.db.get(userId);
        if (!user) return null;

        // Get the profile if it exists
        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .first();

        return {
            id: userId,
            email: user.email,
            ...profile,
        };
    },
});

/**
 * Get a user's profile by ID
 */
export const getProfile = query({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .first();

        return profile;
    },
});

/**
 * Create or update the current user's profile
 */
export const upsertProfile = mutation({
    args: {
        fullName: v.optional(v.string()),
        username: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const user = await ctx.db.get(userId);
        if (!user) throw new Error("User not found");

        // Check if profile exists
        const existingProfile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .first();

        if (existingProfile) {
            // Update existing profile
            await ctx.db.patch(existingProfile._id, {
                ...args,
                email: user.email,
            });
            return existingProfile._id;
        } else {
            // Create new profile
            return await ctx.db.insert("profiles", {
                userId,
                email: user.email,
                ...args,
            });
        }
    },
});

/**
 * Update the current user's display name
 */
export const updateDisplayName = mutation({
    args: { displayName: v.string() },
    handler: async (ctx, { displayName }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .first();

        if (profile) {
            await ctx.db.patch(profile._id, { fullName: displayName });
        } else {
            const user = await ctx.db.get(userId);
            await ctx.db.insert("profiles", {
                userId,
                email: user?.email,
                fullName: displayName,
            });
        }

        return { success: true };
    },
});

/**
 * Update the current user's avatar URL
 */
export const updateAvatar = mutation({
    args: { avatarUrl: v.string() },
    handler: async (ctx, { avatarUrl }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .first();

        if (profile) {
            await ctx.db.patch(profile._id, { avatarUrl });
        } else {
            const user = await ctx.db.get(userId);
            await ctx.db.insert("profiles", {
                userId,
                email: user?.email,
                avatarUrl,
            });
        }

        return { success: true };
    },
});
