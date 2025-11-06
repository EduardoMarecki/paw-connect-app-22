import { Button } from "@/components/ui/button";
import { PawPrint } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/i18n/i18n";

export const Navbar = () => {
  const { t, locale, setLocale } = useTranslation();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="p-2 bg-primary rounded-xl">
              <PawPrint className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              {t("brand")}
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">{t("nav_sign_in")}</Button>
            </Link>
            <Link to="/auth">
              <Button variant="hero">{t("nav_get_started")}</Button>
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{t("lang_label")}:</span>
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as any)}
                className="text-sm bg-transparent border border-border rounded-md px-2 py-1"
              >
                <option value="pt-BR">PT-BR</option>
                <option value="en-US">EN</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
