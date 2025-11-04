import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PetForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    size: "",
    weight: "",
    personality: "",
    health_notes: "",
    allergies: "",
    vaccinated: false,
    neutered: false,
  });

  useEffect(() => {
    if (isEdit) {
      loadPet();
    }
  }, [id]);

  const loadPet = async () => {
    try {
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setFormData({
        name: data.name,
        species: data.species,
        breed: data.breed || "",
        age: data.age?.toString() || "",
        size: data.size || "",
        weight: data.weight?.toString() || "",
        personality: data.personality || "",
        health_notes: data.health_notes || "",
        allergies: data.allergies || "",
        vaccinated: data.vaccinated || false,
        neutered: data.neutered || false,
      });
    } catch (error) {
      console.error("Error loading pet:", error);
      toast.error("Erro ao carregar dados do pet");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const petData = {
        name: formData.name,
        species: formData.species,
        breed: formData.breed || null,
        age: formData.age ? parseInt(formData.age) : null,
        size: formData.size ? (formData.size as "pequeno" | "medio" | "grande" | "gigante") : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        personality: formData.personality || null,
        health_notes: formData.health_notes || null,
        allergies: formData.allergies || null,
        vaccinated: formData.vaccinated,
        neutered: formData.neutered,
        tutor_id: user.id,
      };

      if (isEdit) {
        const { error } = await supabase
          .from("pets")
          .update(petData)
          .eq("id", id);

        if (error) throw error;
        toast.success("Pet atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from("pets")
          .insert([petData]);

        if (error) throw error;
        toast.success("Pet cadastrado com sucesso!");
      }

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error saving pet:", error);
      toast.error(error.message || "Erro ao salvar pet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-6">
            {isEdit ? "Editar Pet" : "Adicionar Novo Pet"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Nome do Pet *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="species">Espécie *</Label>
                <Select
                  value={formData.species}
                  onValueChange={(value) => setFormData({ ...formData, species: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cachorro">Cachorro</SelectItem>
                    <SelectItem value="Gato">Gato</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="breed">Raça</Label>
                <Input
                  id="breed"
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="age">Idade (anos)</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="size">Porte</Label>
                <Select
                  value={formData.size}
                  onValueChange={(value) => setFormData({ ...formData, size: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pequeno">Pequeno</SelectItem>
                    <SelectItem value="medio">Médio</SelectItem>
                    <SelectItem value="grande">Grande</SelectItem>
                    <SelectItem value="gigante">Gigante</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="personality">Temperamento</Label>
              <Input
                id="personality"
                placeholder="Ex: Calmo, brincalhão, medroso..."
                value={formData.personality}
                onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="allergies">Alergias</Label>
              <Textarea
                id="allergies"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="health_notes">Observações de Saúde</Label>
              <Textarea
                id="health_notes"
                placeholder="Medicações, condições especiais..."
                value={formData.health_notes}
                onChange={(e) => setFormData({ ...formData, health_notes: e.target.value })}
              />
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.vaccinated}
                  onChange={(e) => setFormData({ ...formData, vaccinated: e.target.checked })}
                  className="h-4 w-4"
                />
                <span>Vacinado</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.neutered}
                  onChange={(e) => setFormData({ ...formData, neutered: e.target.checked })}
                  className="h-4 w-4"
                />
                <span>Castrado</span>
              </label>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Salvando..." : isEdit ? "Atualizar Pet" : "Cadastrar Pet"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PetForm;
