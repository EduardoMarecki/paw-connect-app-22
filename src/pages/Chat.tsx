import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

type Message = Tables<"messages"> & {
  sender: { full_name: string; avatar_url: string | null };
};

type Booking = Tables<"bookings"> & {
  pet: { name: string };
  caregiver: { profiles: { full_name: string } };
  tutor: { full_name: string };
};

const Chat = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (bookingId && currentUserId) {
      loadBooking();
      loadMessages();
      subscribeToMessages();
    }
  }, [bookingId, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
          profiles(full_name)
        ),
        profiles!bookings_tutor_id_fkey(full_name)
      `)
      .eq("id", bookingId!)
      .single();

    if (error) {
      toast.error("Erro ao carregar agendamento");
      return;
    }

    setBooking(data as any);
  };

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        profiles!messages_sender_id_fkey(full_name, avatar_url)
      `)
      .eq("booking_id", bookingId!)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading messages:", error);
      return;
    }

    setMessages(data as any);
    markAsRead();
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`chat-${bookingId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `booking_id=eq.${bookingId}`,
        },
        async (payload) => {
          const { data } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", (payload.new as any).sender_id)
            .single();

          setMessages((prev) => [
            ...prev,
            { ...payload.new, sender: data } as any,
          ]);
          markAsRead();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAsRead = async () => {
    await supabase
      .from("messages")
      .update({ read: true })
      .eq("booking_id", bookingId!)
      .neq("sender_id", currentUserId);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const { error } = await supabase.from("messages").insert({
      booking_id: bookingId!,
      sender_id: currentUserId,
      message: newMessage.trim(),
    });

    if (error) {
      toast.error("Erro ao enviar mensagem");
      return;
    }

    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">
                {booking?.pet?.name && `Agendamento - ${booking.pet.name}`}
              </h1>
              <p className="text-sm text-muted-foreground">
                {booking?.service_type}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => {
            const isOwn = message.sender_id === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <Card
                  className={`max-w-[70%] p-3 ${
                    isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {!isOwn && (
                    <p className="text-xs font-semibold mb-1">
                      {message.sender?.full_name}
                    </p>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {new Date(message.created_at!).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </Card>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t bg-card p-4">
          <div className="container mx-auto flex gap-2">
            <Input
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={sendMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
