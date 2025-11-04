import { PawPrint } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary rounded-xl">
                <PawPrint className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                PetConnect
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Conectando tutores a cuidadores de confiança desde 2024.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Para Tutores</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/auth" className="hover:text-primary transition-colors">Encontrar Cuidador</Link></li>
              <li><Link to="/auth" className="hover:text-primary transition-colors">Como Funciona</Link></li>
              <li><Link to="/auth" className="hover:text-primary transition-colors">Segurança</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Para Cuidadores</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/auth" className="hover:text-primary transition-colors">Ser Cuidador</Link></li>
              <li><Link to="/auth" className="hover:text-primary transition-colors">Verificação</Link></li>
              <li><Link to="/auth" className="hover:text-primary transition-colors">Dicas</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/auth" className="hover:text-primary transition-colors">Central de Ajuda</Link></li>
              <li><Link to="/auth" className="hover:text-primary transition-colors">Contato</Link></li>
              <li><Link to="/auth" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 PetConnect. Todos os direitos reservados. Feito com ❤️ para pets.</p>
        </div>
      </div>
    </footer>
  );
};
