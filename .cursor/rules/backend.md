# Metriq Backend Rules

- Kysely is the source of truth for persistence access
- All DB queries must live in packages/db/queries/*
- Routers must stay thin and call DAL functions
- Validators come from packages/validators
- Keep role gating explicit at the tRPC boundary
- Structure DAL so tenant/company scoping can be centralized later