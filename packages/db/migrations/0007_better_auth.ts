import { sql, type Kysely } from "kysely";

/**
 * Better Auth core + plugins (Organization, Admin, API Key, Stripe subscription, Email OTP, One-Time Token).
 * Column names match Better Auth’s default Postgres/Kysely mapping (camelCase, quoted identifiers).
 *
 * @see apps/web/src/lib/auth/config.ts — keep plugins and `advanced.database.generateId` in sync.
 */
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`create extension if not exists "pgcrypto";`.execute(db);

  await sql`
    create table auth_user (
      "id" uuid primary key default gen_random_uuid(),
      "name" text not null,
      "email" text not null,
      "emailVerified" boolean not null default false,
      "image" text,
      "createdAt" timestamptz not null,
      "updatedAt" timestamptz not null,
      "role" text,
      "banned" boolean default false,
      "banReason" text,
      "banExpires" timestamptz,
      "stripeCustomerId" text
    );
  `.execute(db);
  await sql`create unique index auth_user_email_unique on auth_user ("email");`.execute(db);

  await sql`
    create table "organization" (
      "id" uuid primary key default gen_random_uuid(),
      "name" text not null,
      "slug" text not null,
      "logo" text,
      "createdAt" timestamptz not null,
      "metadata" text,
      "stripeCustomerId" text
    );
  `.execute(db);
  await sql`create unique index "organization_slug_unique" on "organization" ("slug");`.execute(db);

  await sql`
    create table "session" (
      "id" uuid primary key default gen_random_uuid(),
      "expiresAt" timestamptz not null,
      "token" text not null,
      "createdAt" timestamptz not null,
      "updatedAt" timestamptz not null,
      "ipAddress" text,
      "userAgent" text,
      "userId" uuid not null references auth_user ("id") on delete cascade,
      "activeOrganizationId" text,
      "impersonatedBy" text
    );
  `.execute(db);
  await sql`create unique index "session_token_unique" on "session" ("token");`.execute(db);
  await sql`create index "session_userId_idx" on "session" ("userId");`.execute(db);

  await sql`
    create table "account" (
      "id" uuid primary key default gen_random_uuid(),
      "accountId" text not null,
      "providerId" text not null,
      "userId" uuid not null references auth_user ("id") on delete cascade,
      "accessToken" text,
      "refreshToken" text,
      "idToken" text,
      "accessTokenExpiresAt" timestamptz,
      "refreshTokenExpiresAt" timestamptz,
      "scope" text,
      "password" text,
      "createdAt" timestamptz not null,
      "updatedAt" timestamptz not null
    );
  `.execute(db);
  await sql`create index "account_userId_idx" on "account" ("userId");`.execute(db);

  await sql`
    create table "verification" (
      "id" uuid primary key default gen_random_uuid(),
      "identifier" text not null,
      "value" text not null,
      "expiresAt" timestamptz not null,
      "createdAt" timestamptz not null,
      "updatedAt" timestamptz not null
    );
  `.execute(db);
  await sql`create index "verification_identifier_idx" on "verification" ("identifier");`.execute(db);

  await sql`
    create table "member" (
      "id" uuid primary key default gen_random_uuid(),
      "organizationId" uuid not null references "organization" ("id") on delete cascade,
      "userId" uuid not null references auth_user ("id") on delete cascade,
      "role" text not null default 'member',
      "createdAt" timestamptz not null
    );
  `.execute(db);
  await sql`create index "member_organizationId_idx" on "member" ("organizationId");`.execute(db);
  await sql`create index "member_userId_idx" on "member" ("userId");`.execute(db);
  await sql`
    create unique index "member_organization_user_unique" on "member" ("organizationId", "userId");
  `.execute(db);

  await sql`
    create table "invitation" (
      "id" uuid primary key default gen_random_uuid(),
      "organizationId" uuid not null references "organization" ("id") on delete cascade,
      "email" text not null,
      "role" text,
      "status" text not null default 'pending',
      "expiresAt" timestamptz not null,
      "createdAt" timestamptz not null,
      "inviterId" uuid not null references auth_user ("id") on delete cascade
    );
  `.execute(db);
  await sql`create index "invitation_organizationId_idx" on "invitation" ("organizationId");`.execute(db);
  await sql`create index "invitation_email_idx" on "invitation" ("email");`.execute(db);

  await sql`
    create table "apikey" (
      "id" uuid primary key default gen_random_uuid(),
      "configId" text not null default 'default',
      "name" text,
      "start" text,
      "referenceId" text not null,
      "prefix" text,
      "key" text not null,
      "refillInterval" integer,
      "refillAmount" integer,
      "lastRefillAt" timestamptz,
      "enabled" boolean default true,
      "rateLimitEnabled" boolean default true,
      "rateLimitTimeWindow" integer default 86400000,
      "rateLimitMax" integer default 10,
      "requestCount" integer default 0,
      "remaining" integer,
      "lastRequest" timestamptz,
      "expiresAt" timestamptz,
      "createdAt" timestamptz not null,
      "updatedAt" timestamptz not null,
      "permissions" text,
      "metadata" text
    );
  `.execute(db);
  await sql`create index "apikey_configId_idx" on "apikey" ("configId");`.execute(db);
  await sql`create index "apikey_referenceId_idx" on "apikey" ("referenceId");`.execute(db);
  await sql`create index "apikey_key_idx" on "apikey" ("key");`.execute(db);

  await sql`
    create table "subscription" (
      "id" uuid primary key default gen_random_uuid(),
      "plan" text not null,
      "referenceId" text not null,
      "stripeCustomerId" text,
      "stripeSubscriptionId" text,
      "status" text not null default 'incomplete',
      "periodStart" timestamptz,
      "periodEnd" timestamptz,
      "trialStart" timestamptz,
      "trialEnd" timestamptz,
      "cancelAtPeriodEnd" boolean default false,
      "cancelAt" timestamptz,
      "canceledAt" timestamptz,
      "endedAt" timestamptz,
      "seats" integer,
      "billingInterval" text,
      "stripeScheduleId" text
    );
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("subscription").ifExists().execute();
  await db.schema.dropTable("apikey").ifExists().execute();
  await db.schema.dropTable("invitation").ifExists().execute();
  await db.schema.dropTable("member").ifExists().execute();
  await db.schema.dropTable("verification").ifExists().execute();
  await db.schema.dropTable("account").ifExists().execute();
  await db.schema.dropTable("session").ifExists().execute();
  await db.schema.dropTable("organization").ifExists().execute();
  await sql`drop table if exists auth_user cascade;`.execute(db);
}
