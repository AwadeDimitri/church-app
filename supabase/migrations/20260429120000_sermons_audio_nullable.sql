-- ============================================================================
-- Make sermons.audio_url nullable: a sermon may legitimately be video-only
-- (YouTube/Vimeo) without a separate audio file. To keep the data sane we
-- still require *at least one* of audio_url or video_url.
-- ============================================================================

ALTER TABLE public.sermons
  ALTER COLUMN audio_url DROP NOT NULL;

ALTER TABLE public.sermons
  ADD CONSTRAINT sermons_media_required_check
  CHECK (audio_url IS NOT NULL OR video_url IS NOT NULL);
