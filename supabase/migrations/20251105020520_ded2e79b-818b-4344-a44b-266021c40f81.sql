-- Fix critical security issue: Restrict profiles table access
-- Remove the overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create more restrictive policies for profiles
-- 1. Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- 2. Users can view profiles of verified caregivers (needed for search)
CREATE POLICY "Anyone can view verified caregiver profiles"
ON public.profiles
FOR SELECT
USING (
  id IN (
    SELECT user_id 
    FROM public.pet_caregivers 
    WHERE verified = true
  )
);

-- 3. Users can view profiles of caregivers/tutors they have bookings with
CREATE POLICY "Users can view profiles from their bookings"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE (b.tutor_id = auth.uid() AND id IN (
      SELECT pc.user_id FROM public.pet_caregivers pc WHERE pc.id = b.caregiver_id
    ))
    OR (
      id = b.tutor_id AND b.caregiver_id IN (
        SELECT pc.id FROM public.pet_caregivers pc WHERE pc.user_id = auth.uid()
      )
    )
  )
);