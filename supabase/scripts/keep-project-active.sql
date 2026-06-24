-- =============================================================================
-- Keep Supabase free-tier project active
-- Run once in: Supabase Dashboard → SQL Editor
-- =============================================================================
--
-- Why: Free projects pause after ~7 days without incoming API activity. A paused
-- project can be restored for 90 days; after that it is permanently deleted.
--
-- What this does: Schedules a lightweight PostgREST read (chat_cache, limit 1)
-- every Monday and Thursday at 12:00 UTC — well under the inactivity window.
-- Cost: ~104 edge-gateway requests/year.
--
-- BEFORE RUNNING — replace both placeholders in this file:
--   YOUR_PROJECT_REF  →  Dashboard → Project Settings → General → Reference ID
--                          (e.g. rrpmjlfvatnbmwecmfvj)
--   YOUR_ANON_KEY     →  Dashboard → Project Settings → API → anon public key
--
-- Verify after running:
--   SELECT jobid, schedule, jobname, active FROM cron.job WHERE jobname = 'keep-project-active';
--
-- Remove later:
--   SELECT cron.unschedule(jobid) FROM cron.job WHERE jobname = 'keep-project-active';
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

GRANT USAGE ON SCHEMA cron TO postgres;
GRANT USAGE ON SCHEMA net TO postgres;

DO $$
DECLARE
  jid integer;
BEGIN
  SELECT jobid INTO jid FROM cron.job WHERE jobname = 'keep-project-active';
  IF jid IS NOT NULL THEN
    PERFORM cron.unschedule(jid);
  END IF;
END $$;

SELECT cron.schedule(
  'keep-project-active',
  '0 12 * * 1,4',
  $job$
  SELECT net.http_get(
    url := 'https://YOUR_PROJECT_REF.supabase.co/rest/v1/chat_cache?select=id&limit=1',
    headers := jsonb_build_object(
      'apikey', 'YOUR_ANON_KEY',
      'Authorization', 'Bearer YOUR_ANON_KEY'
    ),
    timeout_milliseconds := 15000
  );
  $job$
);
