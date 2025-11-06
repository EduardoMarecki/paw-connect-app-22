import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PawPrint, ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/i18n/i18n";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"tutor" | "cuidador">("tutor");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            phone: phone,
            role: role,
          },
        },
      });

      if (error) throw error;

      toast({
        title: t("signup_success_title"),
        description: t("signup_success_desc"),
      });

      // Navega para a tela de verificação com o email do usuário
      navigate("/auth/verify-email", { state: { email } });
    } catch (error: any) {
      toast({
        title: t("signup_error_title"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const msg = String(error.message || "").toLowerCase();
        if (msg.includes("confirm")) {
          toast({
            title: t("login_unconfirmed_title"),
            description: t("login_unconfirmed_desc"),
            variant: "destructive",
          });
          navigate("/auth/verify-email", { state: { email } });
        } else {
          toast({
            title: t("login_error_title"),
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: t("login_success_title"),
        description: t("login_success_desc"),
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: t("login_error_title"),
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
        <Link to="/" className="inline-flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors">
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
            <CardTitle className="text-2xl">{t("auth_title")}</CardTitle>
            <CardDescription>
              {t("auth_description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">{t("tabs_login")}</TabsTrigger>
                <TabsTrigger value="signup">{t("tabs_signup")}</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">{t("login_email_label")}</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">{t("login_password_label")}</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? t("login_loading") : t("login_submit")}
                  </Button>

                  <div className="flex items-center gap-2 text-sm pt-2">
                    <span className="text-muted-foreground">{t("login_resend_hint")}</span>
                    <button
                      type="button"
                      onClick={async () => {
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
                            options: { emailRedirectTo: redirectUrl },
                          });
                          if (error) throw error;
                          toast({
                            title: t("login_resend_success_title"),
                            description: t("login_resend_success_desc"),
                          });
                        } catch (err: any) {
                          toast({
                            title: t("login_resend_error_title"),
                            description: err.message,
                            variant: "destructive",
                          });
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="inline-flex items-center text-primary hover:underline"
                    >
                      <Mail className="h-3.5 w-3.5 mr-1" />
                      {t("login_resend_button")}
                    </button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">{t("signup_name_label")}</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Seu nome"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">{t("signup_phone_label")}</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t("signup_email_label")}</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{t("signup_password_label")}</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("role_label")}</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole("tutor")}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          role === "tutor"
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-1">🐕</div>
                          <div>{t("role_tutor_title")}</div>
                          <div className="text-xs opacity-70">{t("role_tutor_sub")}</div>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("cuidador")}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          role === "cuidador"
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-1">❤️</div>
                          <div>{t("role_caregiver_title")}</div>
                          <div className="text-xs opacity-70">{t("role_caregiver_sub")}</div>
                        </div>
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? t("signup_loading") : t("signup_submit")}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
