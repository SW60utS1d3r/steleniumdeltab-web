import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Instructions from "@/components/Instructions";
import PopularGames from "@/components/PopularGames";
import SearchSection from "@/components/SearchSection";
import { useState } from "react";

export default function Home() {
  const [selectedAppId, setSelectedAppId] = useState("");

  const handleSelectAppId = (appId: string) => {
    setSelectedAppId(appId);
    // Scroll suave até a seção de busca
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Hero />
      <SearchSection 
        initialAppId={selectedAppId} 
        onAppIdChange={setSelectedAppId}
      />
      <PopularGames onSelectAppId={handleSelectAppId} />
      <Instructions />
      <Footer />
    </div>
  );
}
