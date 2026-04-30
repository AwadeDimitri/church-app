-- ============================================================================
-- prayer_requests : ajout des champs liés à l'exauçement.
-- testimony    : message de témoignage écrit par l'auteur quand il marque
--                la prière comme exaucée. Nullable (vide tant que pas exaucée).
-- answered_at  : horodatage du moment où la prière a été marquée exaucée.
--                Stamp automatique via trigger sur le flip is_answered false→true.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- Schema
-- ----------------------------------------------------------------------------

ALTER TABLE public.prayer_requests
    ADD COLUMN testimony text,
    ADD COLUMN answered_at timestamp with time zone;


-- ----------------------------------------------------------------------------
-- Trigger : stamp answered_at au flip is_answered false→true.
-- Au rollback (true→false) : clear answered_at et testimony pour éviter
-- toute donnée orpheline.
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.prayer_requests_handle_answered()
RETURNS trigger AS $$
BEGIN
    IF NEW.is_answered AND OLD.is_answered IS DISTINCT FROM NEW.is_answered THEN
        NEW.answered_at = COALESCE(NEW.answered_at, now());
    END IF;
    IF NOT NEW.is_answered AND OLD.is_answered THEN
        NEW.answered_at = NULL;
        NEW.testimony = NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prayer_requests_handle_answered_trigger
    BEFORE UPDATE ON public.prayer_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.prayer_requests_handle_answered();


-- ----------------------------------------------------------------------------
-- Backfill : pour les prières déjà marquées exaucées avant cette migration,
-- on utilise updated_at comme meilleure approximation de la date d'exauçement.
-- ----------------------------------------------------------------------------

UPDATE public.prayer_requests
   SET answered_at = updated_at
 WHERE is_answered = true
   AND answered_at IS NULL;
