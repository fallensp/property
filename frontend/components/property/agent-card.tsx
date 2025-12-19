import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, MessageCircle, User, Mail } from "lucide-react";

type AgentCardProps = {
  agent: {
    id?: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
};

const formatPhoneForWhatsApp = (phone?: string | null) => {
  if (!phone) return null;
  const digits = phone.replace(/[^\d]/g, "");
  return digits.length ? `https://wa.me/${digits}` : null;
};

const formatPhoneTel = (phone?: string | null) => {
  if (!phone) return null;
  const digits = phone.replace(/[^\d+]/g, "");
  return digits.length ? `tel:${digits}` : null;
};

export function AgentCard({ agent }: AgentCardProps) {
  const hasContact = Boolean(agent?.phone || agent?.email);
  const phoneHref = formatPhoneTel(agent?.phone);
  const whatsappHref = formatPhoneForWhatsApp(agent?.phone);
  const emailHref = agent?.email ? `mailto:${agent.email}` : null;

  return (
    <Card className="sticky top-24 border-border/80 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
            <AvatarImage src="/images/avatars/agent.jpg" />
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">
              {agent?.name || "Agent contact"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {agent?.email || "Drop us a note for details"}
            </p>
            {agent?.phone ? (
              <p className="text-xs text-muted-foreground">{agent.phone}</p>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Button
            className="w-full gap-2"
            variant="default"
            asChild={Boolean(phoneHref)}
            disabled={!phoneHref}
          >
            {phoneHref ? (
              <a href={phoneHref}>
                <Phone className="h-4 w-4" />
                Call
              </a>
            ) : (
              <>
                <Phone className="h-4 w-4" />
                Call
              </>
            )}
          </Button>
          <Button
            className="w-full gap-2 bg-[#25D366] hover:bg-[#25D366]/90 text-white"
            asChild={Boolean(whatsappHref)}
            disabled={!whatsappHref}
          >
            {whatsappHref ? (
              <a href={whatsappHref} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            ) : (
              <>
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </>
            )}
          </Button>
        </div>
        <Button variant="outline" className="w-full" asChild={Boolean(emailHref)} disabled={!emailHref}>
          {emailHref ? (
            <a href={emailHref}>
              <Mail className="mr-2 h-4 w-4" />
              Enquire via Email
            </a>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Enquire via Email
            </>
          )}
        </Button>
        <p className="text-xs text-center text-muted-foreground px-4">
          {hasContact
            ? "Contact the agent directly for more details."
            : "Agent contact details not available yet."}
        </p>
      </CardContent>
    </Card>
  );
}
