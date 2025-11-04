import { Button } from "@/components/ui/button";
import { ArrowRight, PawPrint } from "lucide-react";
import { Link } from "react-router-dom";

export const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary-glow to-accent">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="inline-flex p-4 bg-white/10 rounded-full mb-6">
            <PawPrint className="h-12 w-12" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Pronto para começar?
          </h2>
          
          <p className="text-xl mb-8 text-white/90">
            Junte-se a milhares de tutores e cuidadores que já confiam no PetConnect
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all w-full sm:w-auto group"
              >
                Criar Conta Grátis
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-primary w-full sm:w-auto"
              >
                Saiba Mais
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
