import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import { useTranslation } from "@/i18n/i18n";

export const Hero = () => {
  const { t } = useTranslation();
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Heart className="h-4 w-4" />
              <span>{t("hero_badge")}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {t("hero_title_line1")}
              <span className="block bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                {t("hero_title_line2")}
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("hero_description")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/auth">
                <Button size="lg" variant="hero" className="w-full sm:w-auto group">
                  {t("hero_cta_find")}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  {t("hero_cta_be")}
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-8 pt-6 text-sm">
              <div>
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-muted-foreground">{t("hero_stat_caregivers")}</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-2xl font-bold text-primary">2.5k+</div>
                <div className="text-muted-foreground">{t("hero_stat_pets")}</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-2xl font-bold text-primary">4.9</div>
                <div className="text-muted-foreground">{t("hero_stat_rating")}</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
            <img 
              src={heroImage} 
              alt="Família feliz com seus pets" 
              className="relative rounded-3xl shadow-2xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
