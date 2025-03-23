
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import { FileText, BarChart3, MapPin, Smartphone } from 'lucide-react';

const Index = () => {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    statistics: false,
    cta: false
  });
  
  const sectionRefs = {
    hero: useRef<HTMLDivElement>(null),
    features: useRef<HTMLDivElement>(null),
    statistics: useRef<HTMLDivElement>(null),
    cta: useRef<HTMLDivElement>(null)
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.15
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id as keyof typeof isVisible;
          setIsVisible(prev => ({ ...prev, [id]: true }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    if (sectionRefs.hero.current) observer.observe(sectionRefs.hero.current);
    if (sectionRefs.features.current) observer.observe(sectionRefs.features.current);
    if (sectionRefs.statistics.current) observer.observe(sectionRefs.statistics.current);
    if (sectionRefs.cta.current) observer.observe(sectionRefs.cta.current);
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        id="hero" 
        ref={sectionRefs.hero}
        className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className={`max-w-3xl mx-auto text-center transition-all duration-700 transform ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            Sistema de Rastreamento 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700 ml-2">
              Veicular
            </span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-muted-foreground">
            Gerencie contratos, acompanhe veículos e mantenha seus dados organizados em uma única plataforma simples e eficiente.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/new-contract">Criar Novo Contrato</Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="rounded-full px-8">
              <Link to="/contracts">Ver Contratos</Link>
            </Button>
          </div>
        </div>
        
        {/* Decorative Background Element */}
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-full -z-10 overflow-hidden">
          <div className="absolute -top-60 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-blue-100/30 blur-3xl"></div>
        </div>
      </section>
      
      {/* Features Section */}
      <section 
        id="features" 
        ref={sectionRefs.features}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 transform ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Recursos do Sistema
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Tudo o que você precisa para gerenciar seus contratos de rastreamento veicular de forma eficiente.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FileText className="h-10 w-10 text-blue-500" />,
                title: "Contratos Digitais",
                description: "Crie, edite e gerencie contratos digitais com assinatura eletrônica segura.",
                delay: "delayed-100"
              },
              {
                icon: <BarChart3 className="h-10 w-10 text-blue-500" />,
                title: "Relatórios Detalhados",
                description: "Visualize relatórios e estatísticas sobre seus contratos e rastreamentos.",
                delay: "delayed-200"
              },
              {
                icon: <MapPin className="h-10 w-10 text-blue-500" />,
                title: "Rastreamento em Tempo Real",
                description: "Acompanhe a localização dos veículos em tempo real com atualizações rápidas.",
                delay: "delayed-300"
              },
              {
                icon: <Smartphone className="h-10 w-10 text-blue-500" />,
                title: "Notificações por WhatsApp",
                description: "Envie contratos e atualizações diretamente pelo WhatsApp para seus clientes.",
                delay: "delayed-400"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`bg-white p-6 rounded-xl shadow-subtle transform transition-all duration-500 ${isVisible.features ? `opacity-100 translate-y-0 ${feature.delay}` : 'opacity-0 translate-y-10'}`}
              >
                <div className="p-3 bg-blue-50 rounded-full w-fit">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-xl font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Statistics Section */}
      <section 
        id="statistics" 
        ref={sectionRefs.statistics}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 transform ${isVisible.statistics ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Números que Importam
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Nossa plataforma tem ajudado empresas a melhorar sua gestão de contratos e rastreamento veicular.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "99%", label: "Disponibilidade" },
              { value: "+15.000", label: "Contratos Gerados" },
              { value: "+25.000", label: "Veículos Rastreados" },
              { value: "100%", label: "Clientes Satisfeitos" }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`text-center glass p-8 rounded-xl transition-all duration-700 transform ${isVisible.statistics ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="text-4xl md:text-5xl font-bold text-blue-500">
                  {stat.value}
                </div>
                <div className="mt-2 text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section 
        id="cta" 
        ref={sectionRefs.cta}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-500 to-blue-700 text-white"
      >
        <div className={`max-w-3xl mx-auto text-center transition-all duration-700 transform ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Pronto para começar?
          </h2>
          <p className="mt-4 text-lg text-blue-100 max-w-xl mx-auto">
            Crie seu primeiro contrato digital e experimente a plataforma completa de rastreamento veicular.
          </p>
          <div className="mt-10">
            <Button asChild size="lg" variant="secondary" className="rounded-full px-8 text-blue-700 hover:text-blue-800">
              <Link to="/new-contract">Criar um Contrato Agora</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Sistema de Rastreamento Veicular. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
