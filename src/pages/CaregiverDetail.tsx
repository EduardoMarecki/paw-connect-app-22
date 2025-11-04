import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Star, Home, PawPrint } from "lucide-react";
import { toast } from "sonner";

type CaregiverDetail = {
  id: string;
  bio: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  experience_years: number | null;
  home_type: string | null;
  has_yard: boolean | null;
  max_pets_at_once: number | null;
  rating: number | null;
  total_reviews: number | null;
  price_per_day: number | null;
  price_per_walk: number | null;
  available_services: string[] | null;
  accepts_pet_sizes: string[] | null;
  verified: boolean | null;
  profiles: {
    full_name: string;
    avatar_url: string | null;
    phone: string | null;
  };
};

const CaregiverDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caregiver, setCaregiver] = useState<CaregiverDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCaregiver();
  }, [id]);

  const loadCaregiver = async () => {
    try {
      const { data, error } = await supabase
        .from("pet_caregivers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      // Fetch profile separately
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, phone")
        .eq("id", data.user_id)
        .single();

      setCaregiver({
        ...data,
        profiles: profileData || { full_name: "", avatar_url: null, phone: null }
      } as any);
    } catch (error) {
      console.error("Error loading caregiver:", error);
      toast.error("Erro ao carregar perfil do cuidador");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!caregiver) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Cuidador não encontrado</p>
          <Button onClick={() => navigate("/search")}>Voltar à Busca</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/search")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar à Busca
        </Button>

        <Card className="p-8">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="flex-shrink-0">
              {caregiver.profiles.avatar_url ? (
                <img
                  src={caregiver.profiles.avatar_url}
                  alt={caregiver.profiles.full_name}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center text-4xl">
                  {caregiver.profiles.full_name.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {caregiver.profiles.full_name}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {caregiver.city}, {caregiver.state}
                    </span>
                  </div>
                </div>
                
                {caregiver.verified && (
                  <Badge variant="default" className="text-base px-4 py-2">
                    ✓ Verificado
                  </Badge>
                )}
              </div>

              {caregiver.rating !== null && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(caregiver.rating!)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-lg">{caregiver.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">
                    ({caregiver.total_reviews || 0} avaliações)
                  </span>
                </div>
              )}

              {caregiver.bio && (
                <p className="text-muted-foreground leading-relaxed">
                  {caregiver.bio}
                </p>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Serviços Oferecidos</h3>
              <div className="space-y-2">
                {caregiver.available_services?.map((service) => (
                  <div key={service} className="flex items-center gap-2">
                    <PawPrint className="h-4 w-4 text-primary" />
                    <span>
                      {service === "hospedagem" && "Hospedagem"}
                      {service === "passeio" && "Passeio"}
                      {service === "visita_diaria" && "Visita Diária"}
                      {service === "creche" && "Creche"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Preços</h3>
              <div className="space-y-2">
                {caregiver.price_per_day && (
                  <p className="text-2xl font-bold text-primary">
                    R$ {caregiver.price_per_day}
                    <span className="text-sm font-normal text-muted-foreground">/dia</span>
                  </p>
                )}
                {caregiver.price_per_walk && (
                  <p className="text-2xl font-bold text-primary">
                    R$ {caregiver.price_per_walk}
                    <span className="text-sm font-normal text-muted-foreground">/passeio</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Informações</h3>
              <div className="space-y-2 text-muted-foreground">
                {caregiver.experience_years && (
                  <p>📅 {caregiver.experience_years} anos de experiência</p>
                )}
                {caregiver.home_type && (
                  <p>🏠 {caregiver.home_type}</p>
                )}
                {caregiver.has_yard && <p>🌳 Possui quintal</p>}
                {caregiver.max_pets_at_once && (
                  <p>🐾 Até {caregiver.max_pets_at_once} pets ao mesmo tempo</p>
                )}
              </div>
            </div>

            {caregiver.accepts_pet_sizes && caregiver.accepts_pet_sizes.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Aceita Pets</h3>
                <div className="flex flex-wrap gap-2">
                  {caregiver.accepts_pet_sizes.map((size) => (
                    <Badge key={size} variant="secondary">
                      Porte {size}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator className="my-6" />

          <div className="flex gap-4">
            <Button size="lg" className="flex-1">
              Solicitar Serviço
            </Button>
            <Button size="lg" variant="outline" className="flex-1">
              Enviar Mensagem
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CaregiverDetail;
