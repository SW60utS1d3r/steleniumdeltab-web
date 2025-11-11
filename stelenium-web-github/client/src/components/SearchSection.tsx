import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, ExternalLink, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface FileInfo {
  name: string;
  size: number;
  content: Blob;
}

interface SearchSectionProps {
  initialAppId?: string;
  onAppIdChange?: (appId: string) => void;
}

export default function SearchSection({ initialAppId = "", onAppIdChange }: SearchSectionProps) {
  const [appId, setAppId] = useState(initialAppId);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileInfo[]>([]);

  useEffect(() => {
    if (initialAppId) {
      setAppId(initialAppId);
    }
  }, [initialAppId]);

  const downloadWithFallback = async (appId: string): Promise<Blob> => {
    const githubUrl = `https://codeload.github.com/SteamAutoCracks/ManifestHub/zip/refs/heads/${appId}`;
    
    // Strategy 1: Try our backend proxy first
    try {
      const backendUrl = `/api/download/${appId}`;
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/zip',
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        if (blob.size > 0) {
          console.log("Downloaded via backend proxy");
          return blob;
        }
      }
      
      if (response.status === 404) {
        throw new Error("NOT_FOUND");
      }
    } catch (error) {
      console.warn("Backend proxy failed, trying alternatives:", error);
      if (error instanceof Error && error.message === "NOT_FOUND") {
        throw error;
      }
    }

    // Strategy 2: Try CORS proxies
    const corsProxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(githubUrl)}`,
      `https://corsproxy.io/?${encodeURIComponent(githubUrl)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(githubUrl)}`,
    ];

    for (const proxyUrl of corsProxies) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/zip',
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const blob = await response.blob();
          if (blob.size > 0) {
            console.log(`Downloaded via proxy: ${proxyUrl}`);
            return blob;
          }
        }

        if (response.status === 404) {
          throw new Error("NOT_FOUND");
        }
      } catch (error) {
        console.warn(`Proxy failed: ${proxyUrl}`, error);
        if (error instanceof Error && error.message === "NOT_FOUND") {
          throw error;
        }
        continue; // Try next proxy
      }
    }

    // Strategy 3: Try direct GitHub (may fail due to CORS)
    try {
      const response = await fetch(githubUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/zip',
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        if (blob.size > 0) {
          console.log("Downloaded directly from GitHub");
          return blob;
        }
      }

      if (response.status === 404) {
        throw new Error("NOT_FOUND");
      }
    } catch (error) {
      console.warn("Direct GitHub download failed:", error);
    }

    throw new Error("All download strategies failed");
  };

  const handleSearch = async () => {
    // Validação
    if (!appId.trim()) {
      toast.error("Por favor, insira um App ID");
      return;
    }

    if (!/^\d+$/.test(appId)) {
      toast.error("App ID deve conter apenas números");
      return;
    }

    setLoading(true);
    setFiles([]);

    try {
      toast.info("Baixando arquivos...");
      
      const blob = await downloadWithFallback(appId);

      if (blob.size === 0) {
        toast.error("Arquivo ZIP vazio recebido");
        setLoading(false);
        return;
      }

      // Usar JSZip para extrair arquivos
      let JSZip;
      try {
        JSZip = (await import("jszip")).default;
      } catch (e) {
        toast.error("Erro ao carregar biblioteca de extração");
        console.error("JSZip import error:", e);
        setLoading(false);
        return;
      }

      let zip;
      try {
        zip = await JSZip.loadAsync(blob);
      } catch (e) {
        console.error("ZIP extraction error:", e);
        toast.error("Erro ao extrair arquivo ZIP. O arquivo pode estar corrompido.");
        setLoading(false);
        return;
      }

      const extractedFiles: FileInfo[] = [];

      // Extrair apenas arquivos relevantes
      for (const [filename, zipEntry] of Object.entries(zip.files)) {
        if ((zipEntry as any).dir) continue;
        
        const basename = filename.split("/").pop() || "";
        
        if (basename.endsWith(".lua") || basename.endsWith(".json") || basename.endsWith(".vdf") || basename.endsWith(".manifest")) {
          try {
            const content = await (zipEntry as any).async("blob");
            extractedFiles.push({
              name: basename,
              size: content.size,
              content: content,
            });
          } catch (e) {
            console.error(`Erro ao extrair ${basename}:`, e);
          }
        }
      }

      if (extractedFiles.length === 0) {
        toast.error("Nenhum arquivo válido encontrado no repositório");
        setLoading(false);
        return;
      }

      setFiles(extractedFiles);
      toast.success(`${extractedFiles.length} arquivo(s) encontrado(s)!`);
    } catch (error) {
      console.error("Erro:", error);
      
      if (error instanceof Error) {
        if (error.message === "NOT_FOUND") {
          toast.error("App ID não encontrado no banco de dados ManifestHub");
        } else if (error.message === "All download strategies failed") {
          toast.error("Não foi possível baixar os arquivos. Tente novamente em alguns instantes.");
        } else {
          toast.error(`Erro ao processar arquivos: ${error.message}`);
        }
      } else {
        toast.error("Erro desconhecido ao processar arquivos");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (file: FileInfo) => {
    try {
      const url = URL.createObjectURL(file.content);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      link.style.display = "none";
      document.body.appendChild(link);
      
      // Usar setTimeout para garantir que o link foi adicionado ao DOM
      setTimeout(() => {
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success(`${file.name} baixado!`);
      }, 100);
    } catch (error) {
      console.error("Erro ao fazer download:", error);
      toast.error("Erro ao fazer download do arquivo");
    }
  };

  const handleDownloadAll = () => {
    if (files.length === 0) {
      toast.error("Nenhum arquivo para baixar");
      return;
    }
    
    files.forEach((file, index) => {
      setTimeout(() => handleDownload(file), index * 200);
    });
    
    toast.info(`Iniciando download de ${files.length} arquivo(s)...`);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (filename: string) => {
    if (filename.endsWith(".lua")) return "🔧";
    if (filename.endsWith(".json")) return "📄";
    if (filename.endsWith(".vdf")) return "🔑";
    if (filename.endsWith(".manifest")) return "📋";
    return "📁";
  };

  return (
    <section className="py-12">
      <div className="container">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Search Card */}
          <div className="bg-card border border-border rounded-xl p-6 md:p-8 glow-primary">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-[Poppins] mb-2">Buscar Jogo</h2>
                <p className="text-muted-foreground">
                  Insira o App ID do jogo para gerar os arquivos
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Ex: 10 (Counter-Strike)"
                    value={appId}
                    onChange={(e) => {
                      setAppId(e.target.value);
                      onAppIdChange?.(e.target.value);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="h-12 text-lg font-[JetBrains_Mono] bg-input border-border focus:border-primary transition-colors"
                    disabled={loading}
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  size="lg"
                  className="gradient-primary hover:opacity-90 transition-opacity h-12 px-8 font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Buscar
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ExternalLink className="w-4 h-4" />
                <span>Não sabe o App ID?</span>
                <a
                  href="https://steamdb.info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline font-medium"
                >
                  Consulte no SteamDB
                </a>
              </div>
            </div>
          </div>

          {/* Results */}
          {files.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-[Poppins]">
                    Arquivos Disponíveis
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    App ID: <span className="font-[JetBrains_Mono] text-primary">{appId}</span>
                  </p>
                </div>
                <Button
                  onClick={handleDownloadAll}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Todos
                </Button>
              </div>

              <div className="grid gap-3">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/50 transition-all group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-2xl">{getFileIcon(file.name)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium font-[JetBrains_Mono] truncate">
                          {file.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDownload(file)}
                      size="sm"
                      className="gradient-primary hover:opacity-90 transition-opacity"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Baixar
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
