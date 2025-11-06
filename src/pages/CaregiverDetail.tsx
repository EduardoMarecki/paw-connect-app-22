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
  user_id: string;
  bio: string | null;
  city: string | null;
  state: string | null;
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
  full_name: string;
  avatar_url: string | null;
};

const CaregiverDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caregiver, setCaregiver] = useState<CaregiverDetail | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCaregiver();
  }, [id]);

  const loadCaregiver = async () => {
    try {
      // SECURITY: Read from safe public view (no phone, no full address)
      const { data, error } = await supabase
        .from("public_caregivers")
        .select("id, user_id, bio, city, state, experience_years, verified, accepts_pet_sizes, has_yard, max_pets_at_once, price_per_day, price_per_walk, available_services, rating, total_reviews, home_type, full_name, avatar_url")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;

      setCaregiver(data as any);

      // Load reviews
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select(`
          *,
          profiles!reviews_reviewer_id_fkey(full_name, avatar_url)
        `)
        .eq("reviewed_id", data.user_id)
        .order("created_at", { ascending: false })
        .limit(10);

      setReviews(reviewsData || []);
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
              {caregiver.avatar_url ? (
                <img
                  src={caregiver.avatar_url}
                  alt={caregiver.full_name}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center text-4xl">
                  {caregiver.full_name.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {caregiver.full_name}
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

          <Button 
            size="lg" 
            className="w-full"
            onClick={() => navigate(`/booking/request/${id}`)}
          >
            Solicitar Serviço
          </Button>
        </Card>

        {/* Reviews Section */}
        <Card className="p-8 mt-6">
          <h2 className="text-2xl font-bold mb-6">
            Avaliações ({reviews.length})
          </h2>
          
          {reviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Ainda não há avaliações para este cuidador
            </p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-0">
                  <div className="flex items-start gap-4">
                    {review.profiles?.avatar_url ? (
                      <img
                        src={review.profiles.avatar_url}
                        alt={review.profiles.full_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        {review.profiles?.full_name?.charAt(0) || "?"}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold">
                          {review.profiles?.full_name || "Usuário"}
                        </p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {new Date(review.created_at).toLocaleDateString("pt-BR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      {review.comment && (
                        <p className="text-muted-foreground">{review.comment}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CaregiverDetail;
