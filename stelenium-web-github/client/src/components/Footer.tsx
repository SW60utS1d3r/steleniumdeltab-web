import { ExternalLink, Github, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-sm">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div className="space-y-3">
            <h3 className="font-bold font-[Poppins] text-lg">Sobre o STELENIUM PROJETO DELTA B</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Continuação do projeto Stelenium. Gerador gratuito de arquivos Manifest e Lua para Steam Tools.
              Utiliza o repositório público ManifestHub mantido pela comunidade.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h3 className="font-bold font-[Poppins] text-lg">Links Úteis</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://steamdb.info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  SteamDB
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/SteamAutoCracks/ManifestHub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  <Github className="w-3 h-3" />
                  ManifestHub Repository
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <h3 className="font-bold font-[Poppins] text-lg">Informações</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✅ 100% Gratuito</li>
              <li>🔄 Sempre Atualizado</li>
              <li>🌐 Open Source</li>
              <li>⚡ Download Instantâneo</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              © 2025 STELENIUM PROJETO DELTA B. Todos os direitos reservados.
            </p>
            <p className="flex items-center gap-1">
              Feito com <Heart className="w-4 h-4 text-destructive fill-destructive" /> pela comunidade
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
