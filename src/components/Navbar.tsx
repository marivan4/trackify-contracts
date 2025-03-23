
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Settings, FileText } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-subtle' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold tracking-tight">
            TrackifyContracts
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Início
            </Link>
            <Link to="/contracts" className="text-sm font-medium transition-colors hover:text-primary">
              Contratos
            </Link>
            <Link to="/tracking" className="text-sm font-medium transition-colors hover:text-primary">
              Rastreamento
            </Link>
            <Link to="/users" className="text-sm font-medium transition-colors hover:text-primary">
              Usuários
            </Link>
            <Link to="/installation" className="text-sm font-medium transition-colors hover:text-primary">
              Instalação
            </Link>
            <Button asChild variant="default" className="ml-4">
              <Link to="/new-contract">Novo Contrato</Link>
            </Button>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-subtle animate-fade-in">
          <nav className="flex flex-col px-4 py-6 space-y-4">
            <Link 
              to="/" 
              className="text-sm font-medium py-2 px-3 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Início
            </Link>
            <Link 
              to="/contracts" 
              className="text-sm font-medium py-2 px-3 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contratos
            </Link>
            <Link 
              to="/tracking" 
              className="text-sm font-medium py-2 px-3 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Rastreamento
            </Link>
            <Link 
              to="/users" 
              className="text-sm font-medium py-2 px-3 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User size={16} />
              Usuários
            </Link>
            <Link 
              to="/installation" 
              className="text-sm font-medium py-2 px-3 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Settings size={16} />
              Instalação
            </Link>
            <Button 
              asChild 
              variant="default" 
              className="mt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link to="/new-contract">Novo Contrato</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
