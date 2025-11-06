-- Update public views to include non-verified caregivers as well,
-- still exposing ONLY safe, non-sensitive fields.
-- This ensures search results show newly created caregivers
-- even before verification, while keeping phone and full address hidden.

-- Recreate public_caregivers without filtering by verified
CREATE OR REPLACE VIEW public.public_caregivers AS
SELECT
  pc.id,
  pc.user_id,
  pc.bio,
  pc.city,
  pc.state,
  pc.experience_years,
  pc.home_type,
  pc.has_yard,
  pc.max_pets_at_once,
  pc.price_per_day,
  pc.price_per_walk,
  pc.available_services,
  pc.accepts_pet_sizes,
  pc.verified,
  pc.rating,
  pc.total_reviews,
  p.full_name,
  p.avatar_url
FROM public.pet_caregivers pc
JOIN public.profiles p ON p.id = pc.user_id;

-- Recreate public_caregiver_profiles accordingly
CREATE OR REPLACE VIEW public.public_caregiver_profiles AS
SELECT
  p.id,
  p.full_name,
  p.avatar_url
FROM public.profiles p
WHERE p.id IN (
  SELECT pc.user_id FROM public.pet_caregivers pc
);

-- Ensure read permissions remain for anon/authenticated
GRANT SELECT ON public.public_caregivers TO anon, authenticated;
GRANT SELECT ON public.public_caregiver_profiles TO anon, authenticated;

COMMENT ON VIEW public.public_caregivers IS 'Public, read-only view of caregivers without sensitive data (no phone, no full address). Includes verified and non-verified.';
COMMENT ON VIEW public.public_caregiver_profiles IS 'Public, read-only view of safe profile fields (id, full_name, avatar_url) for caregivers.';