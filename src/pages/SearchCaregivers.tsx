import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { MapPin, Star, DollarSign, Home } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Caregiver = {
  id: string;
  user_id: string;
  bio: string | null;
  city: string | null;
  state: string | null;
  experience_years: number | null;
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
  };
};

const SearchCaregivers = () => {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    city: "",
    state: "",
    service: "",
    minRating: 0,
    maxPrice: 500,
  });

  useEffect(() => {
    searchCaregivers();
  }, []);

  const searchCaregivers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("pet_caregivers")
        .select("*, profiles!inner(id, full_name, avatar_url)")
        .eq("verified", true);

      if (filters.city) {
        query = query.ilike("city", `%${filters.city}%`);
      }
      
      if (filters.state) {
        query = query.ilike("state", `%${filters.state}%`);
      }

      if (filters.service) {
        query = query.contains("available_services", [filters.service]);
      }

      if (filters.minRating > 0) {
        query = query.gte("rating", filters.minRating);
      }

      const { data, error } = await query.order("rating", { ascending: false });

      if (error) throw error;

      // Filter by price on client side
      const filtered = data?.filter((c: any) => {
        const maxPrice = Math.max(
          c.price_per_day || 0,
          c.price_per_walk || 0
        );
        return maxPrice <= filters.maxPrice;
      }) || [];

      setCaregivers(filtered as any);
    } catch (error) {
      console.error("Error searching caregivers:", error);
      toast.error("Erro ao buscar cuidadores");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchCaregivers();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Buscar Cuidadores</h1>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <Card className="p-6 h-fit lg:sticky lg:top-4">
            <h2 className="text-xl font-bold mb-4">Filtros</h2>
            
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  placeholder="São Paulo"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  placeholder="SP"
                  value={filters.state}
                  onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="service">Tipo de Serviço</Label>
                <Select
                  value={filters.service}
                  onValueChange={(value) => setFilters({ ...filters, service: value === "all" ? "" : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os serviços" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="hospedagem">Hospedagem</SelectItem>
                    <SelectItem value="passeio">Passeio</SelectItem>
                    <SelectItem value="visita_diaria">Visita Diária</SelectItem>
                    <SelectItem value="creche">Creche</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Avaliação Mínima: {filters.minRating} ⭐</Label>
                <Slider
                  value={[filters.minRating]}
                  onValueChange={(value) => setFilters({ ...filters, minRating: value[0] })}
                  max={5}
                  step={0.5}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Preço Máximo: R$ {filters.maxPrice}</Label>
                <Slider
                  value={[filters.maxPrice]}
                  onValueChange={(value) => setFilters({ ...filters, maxPrice: value[0] })}
                  max={500}
                  step={10}
                  className="mt-2"
                />
              </div>

              <Button type="submit" className="w-full">
                Buscar
              </Button>
            </form>
          </Card>

          {/* Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : caregivers.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">
                  Nenhum cuidador encontrado com esses filtros
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground mb-4">
                  {caregivers.length} cuidador{caregivers.length !== 1 ? "es" : ""} encontrado{caregivers.length !== 1 ? "s" : ""}
                </p>
                
                {caregivers.map((caregiver) => (
                  <Card key={caregiver.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        {caregiver.profiles.avatar_url ? (
                          <img
                            src={caregiver.profiles.avatar_url}
                            alt={caregiver.profiles.full_name}
                            className="w-24 h-24 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                            {caregiver.profiles.full_name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold">{caregiver.profiles.full_name}</h3>
                            <div className="flex items-center gap-2 text-muted-foreground mt-1">
                              <MapPin className="h-4 w-4" />
                              <span>
                                {caregiver.city}, {caregiver.state}
                              </span>
                            </div>
                          </div>
                          
                          {caregiver.verified && (
                            <Badge variant="default">✓ Verificado</Badge>
                          )}
                        </div>

                        {caregiver.bio && (
                          <p className="text-muted-foreground mb-3 line-clamp-2">
                            {caregiver.bio}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2 mb-3">
                          {caregiver.available_services?.map((service) => (
                            <Badge key={service} variant="secondary">
                              {service === "hospedagem" && "🏠 Hospedagem"}
                              {service === "passeio" && "🦮 Passeio"}
                              {service === "visita_diaria" && "👋 Visita"}
                              {service === "creche" && "🎉 Creche"}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {caregiver.rating !== null && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold">{caregiver.rating.toFixed(1)}</span>
                                <span className="text-muted-foreground text-sm">
                                  ({caregiver.total_reviews || 0})
                                </span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-4 text-sm">
                              {caregiver.price_per_day && (
                                <span className="font-semibold text-primary">
                                  R$ {caregiver.price_per_day}/dia
                                </span>
                              )}
                              {caregiver.price_per_walk && (
                                <span className="font-semibold text-primary">
                                  R$ {caregiver.price_per_walk}/passeio
                                </span>
                              )}
                            </div>
                          </div>

                          <Button asChild>
                            <Link to={`/caregivers/${caregiver.id}`}>
                              Ver Perfil
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchCaregivers;
