import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Star } from "lucide-react";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

type Booking = Tables<"bookings"> & {
  pet: { name: string };
  caregiver: { id: string; user_id: string; profiles: { full_name: string } };
};

const Review = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (bookingId && currentUserId) {
      loadBooking();
    }
  }, [bookingId, currentUserId]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setCurrentUserId(session.user.id);
  };

  const loadBooking = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        pets(name),
        pet_caregivers!bookings_caregiver_id_fkey(
          id,
          user_id,
          profiles(full_name)
        )
      `)
      .eq("id", bookingId!)
      .eq("status", "concluido")
      .single();

    if (error || !data) {
      toast.error("Agendamento não encontrado ou não concluído");
      navigate("/dashboard");
      return;
    }

    // Check if already reviewed
    const { data: existingReview } = await supabase
      .from("reviews")
      .select("id")
      .eq("booking_id", bookingId!)
      .eq("reviewer_id", currentUserId)
      .maybeSingle();

    if (existingReview) {
      toast.error("Você já avaliou este serviço");
      navigate("/dashboard");
      return;
    }

    setBooking(data as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Selecione uma avaliação");
      return;
    }

    if (!booking?.caregiver?.user_id) {
      toast.error("Erro ao identificar cuidador");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("reviews").insert({
      booking_id: bookingId!,
      reviewer_id: currentUserId,
      reviewed_id: booking.caregiver.user_id,
      rating,
      comment: comment.trim() || null,
    });

    if (error) {
      toast.error("Erro ao enviar avaliação");
      setLoading(false);
      return;
    }

    // Update caregiver rating
    const { data: reviews } = await supabase
      .from("reviews")
      .select("rating")
      .eq("reviewed_id", booking.caregiver.user_id);

    if (reviews) {
      const avgRating =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

      await supabase
        .from("pet_caregivers")
        .update({
          rating: avgRating,
          total_reviews: reviews.length,
        })
        .eq("id", booking.caregiver.id);
    }

    toast.success("Avaliação enviada com sucesso!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Avaliar Serviço</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-8">
          {booking && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold mb-2">
                  Como foi a experiência com {booking.caregiver.profiles.full_name}?
                </h2>
                <p className="text-muted-foreground">
                  Serviço: {booking.service_type} - Pet: {booking.pet.name}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3 text-center">
                    Avaliação
                  </label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-10 w-10 ${
                            star <= (hoveredRating || rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Comentário (opcional)
                  </label>
                  <Textarea
                    placeholder="Conte como foi sua experiência..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={5}
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {comment.length}/500 caracteres
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Enviando..." : "Enviar Avaliação"}
                  </Button>
                </div>
              </form>
            </>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Review;
