import { Button } from "@/components/ui/button";
import { Copy, Star } from "lucide-react";
import { toast } from "sonner";

interface Game {
  name: string;
  appId: string;
  icon: string;
}

const POPULAR_GAMES: Game[] = [
  { name: "Counter-Strike", appId: "10", icon: "🎯" },
  { name: "Terraria", appId: "105600", icon: "⛏️" },
  { name: "Cyberpunk 2077", appId: "1091500", icon: "🌃" },
  { name: "Baldur's Gate 3", appId: "1086940", icon: "🐉" },
  { name: "GTA V", appId: "271590", icon: "🚗" },
  { name: "The Witcher 3", appId: "292030", icon: "⚔️" },
  { name: "Red Dead Redemption 2", appId: "1174180", icon: "🤠" },
  { name: "Elden Ring", appId: "1245620", icon: "🛡️" },
];

interface PopularGamesProps {
  onSelectAppId: (appId: string) => void;
}

export default function PopularGames({ onSelectAppId }: PopularGamesProps) {
  const copyAppId = (appId: string, gameName: string) => {
    navigator.clipboard.writeText(appId);
    toast.success(`App ID de ${gameName} copiado!`);
  };

  return (
    <section className="py-12 bg-muted/30">
      <div className="container">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Star className="w-6 h-6 text-primary fill-primary" />
              <h2 className="text-2xl md:text-3xl font-bold font-[Poppins]">
                Jogos Populares
              </h2>
            </div>
            <p className="text-muted-foreground">
              Clique para usar o App ID ou copiar para a área de transferência
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POPULAR_GAMES.map((game) => (
              <div
                key={game.appId}
                className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-300 hover:glow-primary group"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{game.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{game.name}</h3>
                      <p className="text-xs text-muted-foreground font-[JetBrains_Mono]">
                        {game.appId}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => onSelectAppId(game.appId)}
                      size="sm"
                      className="flex-1 gradient-primary hover:opacity-90 transition-opacity text-xs"
                    >
                      Usar
                    </Button>
                    <Button
                      onClick={() => copyAppId(game.appId, game.name)}
                      size="sm"
                      variant="outline"
                      className="border-primary/30 hover:border-primary hover:bg-primary/10"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
