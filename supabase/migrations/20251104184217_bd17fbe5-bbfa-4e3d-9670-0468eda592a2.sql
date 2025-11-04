-- Add location fields to pet_caregivers table
ALTER TABLE public.pet_caregivers
ADD COLUMN city TEXT,
ADD COLUMN state TEXT,
ADD COLUMN address TEXT,
ADD COLUMN bio TEXT;

-- Add index for location searches
CREATE INDEX idx_pet_caregivers_location ON public.pet_caregivers(city, state);

-- Add index for verified caregivers
CREATE INDEX idx_pet_caregivers_verified ON public.pet_caregivers(verified) WHERE verified = true;