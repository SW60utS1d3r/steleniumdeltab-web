import { Gamepad2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-background opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-secondary/10" />
      
      {/* Content */}
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo/Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 glow-primary rounded-full blur-xl" />
              <div className="relative bg-gradient-primary p-6 rounded-full">
                <Gamepad2 className="w-16 h-16 text-primary-foreground" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold font-[Poppins]">
              <span className="gradient-text">STELENIUM</span>
              <br />
              <span className="text-xl md:text-2xl text-secondary font-[Poppins]">PROJETO DELTA B</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium">
              Gerador de Arquivos Manifest & Lua
            </p>
          </div>

          {/* Description */}
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Gere automaticamente arquivos <span className="text-primary font-semibold">Manifest</span> e{" "}
            <span className="text-secondary font-semibold">Lua</span> para o Steam Tools.
            Rápido, gratuito e sempre atualizado com a biblioteca ManifestHub.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
            {[
              { icon: "⚡", title: "Rápido", desc: "Download instantâneo" },
              { icon: "🔄", title: "Atualizado", desc: "Sempre sincronizado" },
              { icon: "🎮", title: "Gratuito", desc: "100% open source" },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-300 hover:glow-primary"
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
