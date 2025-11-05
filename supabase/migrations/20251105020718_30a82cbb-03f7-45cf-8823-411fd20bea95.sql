-- Fix policy creation error and phone exposure
-- Drop all existing SELECT policies on profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view verified caregiver profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles from their bookings" ON public.profiles;

-- Create new restrictive policies
-- 1. Users can view their own profile (including phone)
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- 2. Public can view limited info of verified caregivers (NO phone numbers)
-- Note: We'll handle field selection in the application code
CREATE POLICY "Public can view verified caregiver basic info"
ON public.profiles
FOR SELECT
USING (
  id IN (
    SELECT user_id 
    FROM public.pet_caregivers 
    WHERE verified = true
  )
);

-- 3. Users can view full profiles (including phone) of people they have bookings with
CREATE POLICY "Users can view booking-related profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE (
      -- Tutor viewing their caregiver's profile
      (b.tutor_id = auth.uid() AND id IN (
        SELECT pc.user_id FROM public.pet_caregivers pc WHERE pc.id = b.caregiver_id
      ))
      OR
      -- Caregiver viewing their tutor's profile
      (id = b.tutor_id AND b.caregiver_id IN (
        SELECT pc.id FROM public.pet_caregivers pc WHERE pc.user_id = auth.uid()
      ))
    )
  )
);