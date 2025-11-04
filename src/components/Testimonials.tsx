import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Maria Silva",
    role: "Tutora do Thor",
    content: "Encontrei uma cuidadora incrível para o Thor! Ele voltou super feliz e bem cuidado. Recomendo muito!",
    rating: 5,
  },
  {
    name: "Carlos Mendes",
    role: "Tutor da Luna",
    content: "O sistema de agendamento é super prático e os cuidadores são muito atenciosos. A Luna adorou!",
    rating: 5,
  },
  {
    name: "Ana Paula",
    role: "Tutora do Bob",
    content: "Como cuidadora, o PetConnect mudou minha vida! Conheci pets maravilhosos e suas famílias.",
    rating: 5,
  },
];

export const Testimonials = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            O que dizem nossos
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {" "}usuários
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Histórias reais de tutores e cuidadores felizes
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
