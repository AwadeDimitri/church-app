-- ============================================================================
-- Limites de longueur sur les champs textuels libres :
--  - prayer_requests.content     : 500 caractères max
--  - prayer_requests.testimony   : 1000 caractères max (NULL toléré)
--  - prayer_intercessions.content : 300 caractères max
-- Contraintes côté DB pour blinder même si un client bypasse la validation
-- frontend (Validators.maxLength + maxlength HTML).
-- ============================================================================

ALTER TABLE public.prayer_requests
    ADD CONSTRAINT prayer_requests_content_length_check
        CHECK (length(content) <= 500),
    ADD CONSTRAINT prayer_requests_testimony_length_check
        CHECK (testimony IS NULL OR length(testimony) <= 1000);

ALTER TABLE public.prayer_intercessions
    ADD CONSTRAINT prayer_intercessions_content_length_check
        CHECK (length(content) <= 300);
