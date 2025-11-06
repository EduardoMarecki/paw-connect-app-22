-- Secure public access by removing direct public SELECT on sensitive tables
-- and exposing only safe fields via dedicated views.

-- 1) Ensure RLS is enabled (defensive; will be no-ops if already enabled)
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.pet_caregivers ENABLE ROW LEVEL SECURITY;

-- 2) Remove overly permissive public viewing policies
-- Drop policy allowing anyone to view verified caregiver profiles (exposes phone)
DROP POLICY IF EXISTS "Anyone can view verified caregiver profiles" ON public.profiles;

-- Drop policy allowing anyone to view verified caregivers (exposes full address)
DROP POLICY IF EXISTS "Anyone can view verified caregivers" ON public.pet_caregivers;

-- 3) Maintain owner access on pet_caregivers (owners can manage their own row)
CREATE POLICY IF NOT EXISTS "Caregiver can manage own pet_caregivers row"
ON public.pet_caregivers
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4) Public, safe views excluding sensitive columns
-- View includes only non-sensitive caregiver columns and safe profile fields
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
JOIN public.profiles p ON p.id = pc.user_id
WHERE pc.verified = true;

-- Optional: a separate view for profiles if needed elsewhere publicly
CREATE OR REPLACE VIEW public.public_caregiver_profiles AS
SELECT
  p.id,
  p.full_name,
  p.avatar_url
FROM public.profiles p
WHERE p.id IN (
  SELECT pc.user_id FROM public.pet_caregivers pc WHERE pc.verified = true
);

-- 5) Grant read access to views only (anon & authenticated)
GRANT SELECT ON public.public_caregivers TO anon, authenticated;
GRANT SELECT ON public.public_caregiver_profiles TO anon, authenticated;

-- 6) Keep restrictive policies on base tables
-- Profiles: users can view their own profile; users can view profiles from bookings
-- (These were created in previous migrations; we preserve them.)

COMMENT ON VIEW public.public_caregivers IS 'Public, read-only view of verified caregivers without sensitive data (no phone, no full address).';
COMMENT ON VIEW public.public_caregiver_profiles IS 'Public, read-only view of safe profile fields (id, full_name, avatar_url) for verified caregivers.';