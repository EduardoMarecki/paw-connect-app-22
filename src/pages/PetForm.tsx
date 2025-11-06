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
import { useTranslation } from "@/i18n/i18n";

const PetForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { t } = useTranslation();

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
      toast.error(t("petform_toast_load_error"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error(t("common_not_authenticated"));

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
        toast.success(t("petform_toast_update_success"));
      } else {
        const { error } = await supabase
          .from("pets")
          .insert([petData]);

        if (error) throw error;
        toast.success(t("petform_toast_create_success"));
      }

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error saving pet:", error);
      toast.error(error.message || t("petform_toast_save_error"));
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
          {t("common_back")}
        </Button>

        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-6">
            {isEdit ? t("petform_title_edit") : t("petform_title_new")}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">{t("petform_name_label")}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="species">{t("petform_species_label")}</Label>
                <Select
                  value={formData.species}
                  onValueChange={(value) => setFormData({ ...formData, species: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("petform_select_placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cachorro">{t("species_dog")}</SelectItem>
                    <SelectItem value="Gato">{t("species_cat")}</SelectItem>
                    <SelectItem value="Outro">{t("species_other")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="breed">{t("petform_breed_label")}</Label>
                <Input
                  id="breed"
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="age">{t("petform_age_label")}</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="size">{t("petform_size_label")}</Label>
                <Select
                  value={formData.size}
                  onValueChange={(value) => setFormData({ ...formData, size: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("petform_select_placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pequeno">{t("size_small")}</SelectItem>
                    <SelectItem value="medio">{t("size_medium")}</SelectItem>
                    <SelectItem value="grande">{t("size_large")}</SelectItem>
                    <SelectItem value="gigante">{t("size_giant")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="weight">{t("petform_weight_label")}</Label>
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
              <Label htmlFor="personality">{t("petform_personality_label")}</Label>
              <Input
                id="personality"
                placeholder={t("petform_personality_placeholder")}
                value={formData.personality}
                onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="allergies">{t("petform_allergies_label")}</Label>
              <Textarea
                id="allergies"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="health_notes">{t("petform_health_label")}</Label>
              <Textarea
                id="health_notes"
                placeholder={t("petform_health_placeholder")}
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
                <span>{t("petform_vaccinated")}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.neutered}
                  onChange={(e) => setFormData({ ...formData, neutered: e.target.checked })}
                  className="h-4 w-4"
                />
                <span>{t("petform_neutered")}</span>
              </label>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? t("petform_submit_saving") : isEdit ? t("petform_submit_update") : t("petform_submit_create")}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PetForm;
