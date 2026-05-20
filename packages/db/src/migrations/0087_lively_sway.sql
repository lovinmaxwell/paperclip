ALTER TABLE "agent_runtime_state" ADD COLUMN IF NOT EXISTS "total_premium_requests" double precision DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "cost_events" ADD COLUMN IF NOT EXISTS "premium_requests" double precision DEFAULT 0 NOT NULL;