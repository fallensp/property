import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, MessageCircle, User } from "lucide-react";

export function AgentCard() {
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
                        <h3 className="font-semibold text-lg">Sarah Tan</h3>
                        <p className="text-sm text-muted-foreground">Senior Real Estate Negotiator</p>
                        <p className="text-xs text-muted-foreground">REN 12345</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <Button className="w-full gap-2" variant="default">
                        <Phone className="h-4 w-4" />
                        Call
                    </Button>
                    <Button className="w-full gap-2 bg-[#25D366] hover:bg-[#25D366]/90 text-white">
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                    </Button>
                </div>
                <Button variant="outline" className="w-full">
                    Enquire via Email
                </Button>
                <p className="text-xs text-center text-muted-foreground px-4">
                    By clicking, you agree to our Terms & Conditions and Privacy Policy.
                </p>
            </CardContent>
        </Card>
    );
}
