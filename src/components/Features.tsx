import { Home, MapPin, Calendar, Shield, Heart, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Home,
    title: "Hospedagem",
    description: "Deixe seu pet em um lar acolhedor com cuidadores verificados",
  },
  {
    icon: MapPin,
    title: "Passeios",
    description: "Passeios diários para manter seu pet ativo e feliz",
  },
  {
    icon: Calendar,
    title: "Visitas Diárias",
    description: "Cuidados regulares quando você não pode estar presente",
  },
  {
    icon: Shield,
    title: "Segurança",
    description: "Todos os cuidadores são verificados e avaliados",
  },
  {
    icon: Heart,
    title: "Amor Garantido",
    description: "Cuidadores apaixonados que tratam pets como família",
  },
  {
    icon: Star,
    title: "Avaliações Reais",
    description: "Sistema de reviews transparente e confiável",
  },
];

export const Features = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Como funciona o
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {" "}PetConnect
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Cuidado profissional e amoroso para seu melhor amigo
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2"
            >
              <CardContent className="pt-6">
                <div className="mb-4 p-3 bg-primary/10 rounded-2xl w-fit group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
