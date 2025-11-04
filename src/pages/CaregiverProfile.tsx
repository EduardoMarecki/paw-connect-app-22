import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CaregiverProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [caregiverId, setCaregiverId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    bio: "",
    city: "",
    state: "",
    address: "",
    experience_years: "",
    home_type: "",
    has_yard: false,
    max_pets_at_once: "",
    price_per_day: "",
    price_per_walk: "",
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPetSizes, setSelectedPetSizes] = useState<string[]>([]);

  useEffect(() => {
    loadCaregiverProfile();
  }, []);

  const loadCaregiverProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("pet_caregivers")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setCaregiverId(data.id);
        setFormData({
          bio: data.bio || "",
          city: data.city || "",
          state: data.state || "",
          address: data.address || "",
          experience_years: data.experience_years?.toString() || "",
          home_type: data.home_type || "",
          has_yard: data.has_yard || false,
          max_pets_at_once: data.max_pets_at_once?.toString() || "",
          price_per_day: data.price_per_day?.toString() || "",
          price_per_walk: data.price_per_walk?.toString() || "",
        });
        setSelectedServices(data.available_services || []);
        setSelectedPetSizes(data.accepts_pet_sizes || []);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Erro ao carregar perfil");
    }
  };

  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const togglePetSize = (size: string) => {
    setSelectedPetSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const caregiverData = {
        user_id: user.id,
        bio: formData.bio || null,
        city: formData.city || null,
        state: formData.state || null,
        address: formData.address || null,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
        home_type: formData.home_type || null,
        has_yard: formData.has_yard,
        max_pets_at_once: formData.max_pets_at_once ? parseInt(formData.max_pets_at_once) : null,
        price_per_day: formData.price_per_day ? parseFloat(formData.price_per_day) : null,
        price_per_walk: formData.price_per_walk ? parseFloat(formData.price_per_walk) : null,
        available_services: selectedServices.length > 0 ? selectedServices as any : null,
        accepts_pet_sizes: selectedPetSizes.length > 0 ? selectedPetSizes as any : null,
      };

      if (caregiverId) {
        const { error } = await supabase
          .from("pet_caregivers")
          .update(caregiverData)
          .eq("id", caregiverId);

        if (error) throw error;
        toast.success("Perfil atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from("pet_caregivers")
          .insert([caregiverData]);

        if (error) throw error;
        toast.success("Perfil de cuidador criado com sucesso!");
      }

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(error.message || "Erro ao salvar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-6">Perfil de Cuidador</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="bio">Mini Bio</Label>
              <Textarea
                id="bio"
                placeholder="Conte um pouco sobre você e sua experiência com pets..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">Estado *</Label>
                <Input
                  id="state"
                  placeholder="SP, RJ, MG..."
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Endereço / Bairro</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div>
              <Label>Serviços Oferecidos *</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {[
                  { value: "hospedagem", label: "Hospedagem" },
                  { value: "passeio", label: "Passeio" },
                  { value: "visita_diaria", label: "Visita Diária" },
                  { value: "creche", label: "Creche" },
                ].map((service) => (
                  <label
                    key={service.value}
                    className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedServices.includes(service.value)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Checkbox
                      checked={selectedServices.includes(service.value)}
                      onCheckedChange={() => toggleService(service.value)}
                    />
                    <span>{service.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price_per_day">Preço por Dia (R$)</Label>
                <Input
                  id="price_per_day"
                  type="number"
                  step="0.01"
                  placeholder="100.00"
                  value={formData.price_per_day}
                  onChange={(e) => setFormData({ ...formData, price_per_day: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="price_per_walk">Preço por Passeio (R$)</Label>
                <Input
                  id="price_per_walk"
                  type="number"
                  step="0.01"
                  placeholder="30.00"
                  value={formData.price_per_walk}
                  onChange={(e) => setFormData({ ...formData, price_per_walk: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Aceita Pets de Porte</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[
                  { value: "pequeno", label: "Pequeno" },
                  { value: "medio", label: "Médio" },
                  { value: "grande", label: "Grande" },
                  { value: "gigante", label: "Gigante" },
                ].map((size) => (
                  <label
                    key={size.value}
                    className={`flex items-center gap-2 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPetSizes.includes(size.value)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Checkbox
                      checked={selectedPetSizes.includes(size.value)}
                      onCheckedChange={() => togglePetSize(size.value)}
                    />
                    <span className="text-sm">{size.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="experience_years">Anos de Experiência</Label>
                <Input
                  id="experience_years"
                  type="number"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="max_pets">Máx. Pets ao Mesmo Tempo</Label>
                <Input
                  id="max_pets"
                  type="number"
                  value={formData.max_pets_at_once}
                  onChange={(e) => setFormData({ ...formData, max_pets_at_once: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="home_type">Tipo de Moradia</Label>
              <Select
                value={formData.home_type}
                onValueChange={(value) => setFormData({ ...formData, home_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Casa">Casa</SelectItem>
                  <SelectItem value="Apartamento">Apartamento</SelectItem>
                  <SelectItem value="Sítio">Sítio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={formData.has_yard}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, has_yard: checked as boolean })
                }
              />
              <span>Possui quintal</span>
            </label>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Salvando..." : caregiverId ? "Atualizar Perfil" : "Criar Perfil"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CaregiverProfile;
