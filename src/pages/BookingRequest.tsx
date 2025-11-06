import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useTranslation } from "@/i18n/i18n";

type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
};

type CaregiverInfo = {
  id: string;
  available_services: string[];
  price_per_day: number | null;
  price_per_walk: number | null;
  profiles: {
    full_name: string;
  };
};

export default function BookingRequest() {
  const { caregiverId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [caregiver, setCaregiver] = useState<CaregiverInfo | null>(null);
  const [selectedPet, setSelectedPet] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [instructions, setInstructions] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    loadData();
  }, [caregiverId]);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Load user's pets
      const { data: petsData, error: petsError } = await supabase
        .from("pets")
        .select("id, name, species, breed")
        .eq("tutor_id", user.id);

      if (petsError) throw petsError;
      setPets(petsData || []);

      // Load caregiver info
      const { data: caregiverData, error: caregiverError } = await supabase
        .from("pet_caregivers")
        .select("id, available_services, price_per_day, price_per_walk, user_id")
        .eq("id", caregiverId)
        .maybeSingle();

      if (caregiverError) throw caregiverError;

      // Get profile separately
      if (caregiverData) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", caregiverData.user_id)
          .maybeSingle();

        setCaregiver({
          ...caregiverData,
          profiles: { full_name: profileData?.full_name || "Cuidador" }
        });
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error(t("booking_toast_load_error"));
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (!serviceType || !startDate || !endDate || !caregiver) return 0;

    if (serviceType === "passeio") {
      return caregiver.price_per_walk || 0;
    }

    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return (caregiver.price_per_day || 0) * days;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPet || !serviceType || !startDate || !endDate) {
      toast.error(t("booking_toast_required_fields"));
      return;
    }

    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const totalPrice = calculatePrice();

      const { error } = await supabase.from("bookings").insert([{
        tutor_id: user.id,
        caregiver_id: caregiverId as string,
        pet_id: selectedPet,
        service_type: serviceType as "hospedagem" | "passeio" | "visita_diaria" | "creche",
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        special_instructions: instructions || null,
        total_price: totalPrice,
        status: "pendente" as const
      }]);

      if (error) throw error;

      toast.success(t("booking_toast_success"));
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error(t("booking_toast_error"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!caregiver || pets.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>{t("booking_error_title")}</CardTitle>
            <CardDescription>
              {pets.length === 0 
                ? t("booking_need_pet")
                : t("booking_caregiver_not_found")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate(pets.length === 0 ? "/pet/form" : "/search")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {pets.length === 0 ? t("petform_submit_create") : t("common_back")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("common_back")}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{t("booking_request_title")}</CardTitle>
          <CardDescription>
            {t("booking_request_desc_prefix")} {caregiver.profiles.full_name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pet">{t("booking_select_pet_label")}</Label>
              <Select value={selectedPet} onValueChange={setSelectedPet} required>
                <SelectTrigger>
                  <SelectValue placeholder={t("booking_select_pet_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id}>
                      {pet.name} - {pet.species} {pet.breed && `(${pet.breed})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">{t("booking_select_service_label")}</Label>
              <Select value={serviceType} onValueChange={setServiceType} required>
                <SelectTrigger>
                  <SelectValue placeholder={t("booking_select_service_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {caregiver.available_services?.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service === "hospedagem" && t("service_hospedagem")}
                      {service === "passeio" && t("service_passeio")}
                      {service === "visita_diaria" && t("service_visita_diaria")}
                      {service === "creche" && t("service_creche")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("booking_date_start_label")}</Label>
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>

              <div className="space-y-2">
                <Label>{t("booking_date_end_label")}</Label>
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={(date) => !startDate || date < startDate}
                  className="rounded-md border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">{t("booking_instructions_label")}</Label>
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder={t("booking_instructions_placeholder")}
                rows={4}
              />
            </div>

            {startDate && endDate && serviceType && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-lg font-semibold">
                  {t("booking_total_label")}: R$ {calculatePrice().toFixed(2)}
                </p>
              </div>
            )}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("booking_submit_loading")}
                </>
              ) : (
                t("booking_submit")
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
