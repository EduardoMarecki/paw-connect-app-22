import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, Mail, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/i18n/i18n";

export default function VerifyEmail() {
  const location = useLocation();
  const stateEmail = (location.state as { email?: string } | null)?.email || "";
  const [email, setEmail] = useState(stateEmail);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleResend = async () => {
    if (!email) {
      toast({
        title: t("verify_error_title"),
        description: t("verify_error_no_email"),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });
      if (error) throw error;
      toast({
        title: t("verify_resend_success_title"),
        description: t("verify_resend_success_desc"),
      });
    } catch (error: any) {
      toast({
        title: t("verify_resend_error_title"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/auth" className="inline-flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          {t("verify_back_to_auth")}
        </Link>

        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <PawPrint className="h-10 w-10 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">{t("verify_title")}</CardTitle>
            <CardDescription>{t("verify_description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  {t("verify_email_label")}
                </label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button onClick={handleResend} disabled={loading} className="whitespace-nowrap">
                    <Mail className="h-4 w-4 mr-2" />
                    {loading ? t("verify_resend_loading") : t("verify_resend_button")}
                  </Button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {t("verify_hint")}
              </div>
              <div className="text-sm">
                <Link to="/auth" className="text-primary hover:underline">
                  {t("verify_already_confirmed")}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}