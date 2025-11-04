import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, PawPrint, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

type Pet = Tables<"pets">;

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState<Pet[]>([]);
  const [userProfile, setUserProfile] = useState<{ full_name: string } | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    await loadUserData(session.user.id);
  };

  const loadUserData = async (userId: string) => {
    try {
      // Load profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .single();

      setUserProfile(profile);

      // Load pets
      const { data: petsData, error } = await supabase
        .from("pets")
        .select("*")
        .eq("tutor_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPets(petsData || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PawPrint className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">PetConnect</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Olá, {userProfile?.full_name}</span>
            <Button variant="outline" size="sm" onClick={() => navigate("/caregiver/profile")}>
              Perfil Cuidador
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/search")}>
              Buscar Cuidadores
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">Meus Pets</h2>
          <Button onClick={() => navigate("/pets/new")} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Pet
          </Button>
        </div>

        {pets.length === 0 ? (
          <Card className="p-12 text-center">
            <PawPrint className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Nenhum pet cadastrado</h3>
            <p className="text-muted-foreground mb-6">
              Comece adicionando informações sobre seu pet para encontrar cuidadores
            </p>
            <Button onClick={() => navigate("/pets/new")}>
              <Plus className="h-5 w-5 mr-2" />
              Adicionar Primeiro Pet
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <Card key={pet.id} className="p-6 hover:shadow-lg transition-shadow">
                {pet.photo_url && (
                  <img
                    src={pet.photo_url}
                    alt={pet.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-bold mb-2">{pet.name}</h3>
                <div className="space-y-1 text-sm text-muted-foreground mb-4">
                  <p>{pet.species} {pet.breed && `• ${pet.breed}`}</p>
                  {pet.age && <p>{pet.age} anos</p>}
                  {pet.size && <p>Porte: {pet.size}</p>}
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(`/pets/${pet.id}/edit`)}
                >
                  Editar
                </Button>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
