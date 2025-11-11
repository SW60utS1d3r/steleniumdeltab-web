import { BookOpen, Download, FileCode, Search } from "lucide-react";

export default function Instructions() {
  const steps = [
    {
      icon: Search,
      title: "Encontre o App ID",
      description: "Acesse o SteamDB e busque pelo jogo desejado para encontrar o App ID",
      color: "text-primary",
    },
    {
      icon: FileCode,
      title: "Insira o App ID",
      description: "Digite o App ID no campo de busca acima e clique em Buscar",
      color: "text-secondary",
    },
    {
      icon: Download,
      title: "Baixe os Arquivos",
      description: "Os arquivos Manifest e Lua serão gerados automaticamente para download",
      color: "text-primary",
    },
    {
      icon: BookOpen,
      title: "Use no Steam Tools",
      description: "Coloque os arquivos na pasta do Steam Tools e execute o programa",
      color: "text-secondary",
    },
  ];

  return (
    <section className="py-12">
      <div className="container">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold font-[Poppins]">
              Como Usar
            </h2>
            <p className="text-muted-foreground">
              Siga estes passos simples para gerar seus arquivos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="relative bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group"
                >
                  {/* Step Number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center font-bold text-sm glow-primary">
                    {index + 1}
                  </div>

                  <div className="space-y-4">
                    <div className={`${step.color} transition-transform group-hover:scale-110 duration-300`}>
                      <Icon className="w-10 h-10" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-bold font-[Poppins]">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Info */}
          <div className="bg-card/50 border border-border rounded-xl p-6 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold font-[Poppins] mb-2">
                  O que são arquivos Manifest e Lua?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Os arquivos <span className="text-primary font-semibold">Manifest</span> contêm
                  informações sobre os depots do jogo (versões, checksums, etc), enquanto os arquivos{" "}
                  <span className="text-secondary font-semibold">Lua</span> são scripts de configuração
                  que o Steam Tools utiliza para processar e adicionar o jogo à biblioteca Steam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
