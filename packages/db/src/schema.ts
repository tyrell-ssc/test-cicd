import { pgTable, text, timestamp, uuid, boolean, jsonb } from 'drizzle-orm/pg-core';
import { nanoid } from './utils/nanoid';

// ============================================
// USERS & AUTH
// ============================================

// Reference to Supabase auth.users table
// This table is managed by Supabase, we just reference it
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// ADMIN ACCESS
// ============================================

export const adminUsers = pgTable('admin_users', {
  id: text('id')
    .$defaultFn(() => nanoid())
    .primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('admin'), // admin, super_admin
  permissions: jsonb('permissions'), // Optional: granular permissions
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// MULTI-TENANT TABLES
// ============================================

export const tenants = pgTable('tenants', {
  id: text('id')
    .$defaultFn(() => nanoid())
    .primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const tenantMemberships = pgTable('tenant_memberships', {
  id: text('id')
    .$defaultFn(() => nanoid())
    .primaryKey(),
  tenantId: text('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('member'), // owner, admin, member
  invitedBy: uuid('invited_by').references(() => users.id),
  joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// USER PROFILES
// ============================================

export const profiles = pgTable('profiles', {
  id: text('id')
    .$defaultFn(() => nanoid())
    .primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  displayName: text('display_name'),
  avatar: text('avatar'),
  bio: text('bio'),
  onboardingCompleted: boolean('onboarding_completed').default(false).notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// SUBSCRIPTIONS (RevenueCat)
// ============================================

export const subscriptions = pgTable('subscriptions', {
  id: text('id')
    .$defaultFn(() => nanoid())
    .primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  tenantId: text('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  revenueCatId: text('revenue_cat_id').notNull().unique(),
  productId: text('product_id').notNull(),
  status: text('status').notNull(), // active, canceled, expired, trial
  currentPeriodStart: timestamp('current_period_start', { withTimezone: true }),
  currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false).notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// EXAMPLE TABLES
// ============================================

export const posts = pgTable('posts', {
  id: text('id')
    .$defaultFn(() => nanoid())
    .primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  tenantId: text('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content'),
  published: boolean('published').default(false).notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
