import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/5 py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-2 text-[#c9a84c]">
              INUKA
            </h3>
            <p className="text-sm text-[#c9a84c] font-light mb-4">
              ALWAYS WITH YOU
            </p>
            <p className="text-sm text-white/30">
              Beleza e cosméticos de alta qualidade.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white/40 text-sm uppercase tracking-wider">Produtos</h4>
            <ul className="space-y-2 text-sm text-white/25">
              <li><Link to="#" className="hover:text-[#c9a84c] transition">Cosméticos</Link></li>
              <li><Link to="#" className="hover:text-[#c9a84c] transition">Maquilhagem</Link></li>
              <li><Link to="#" className="hover:text-[#c9a84c] transition">Cuidados Capilares</Link></li>
              <li><Link to="#" className="hover:text-[#c9a84c] transition">SPA</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white/40 text-sm uppercase tracking-wider">Institucional</h4>
            <ul className="space-y-2 text-sm text-white/25">
              <li><Link to="#" className="hover:text-[#c9a84c] transition">Sobre Nós</Link></li>
              <li><Link to="#" className="hover:text-[#c9a84c] transition">Contactos</Link></li>
              <li><Link to="#" className="hover:text-[#c9a84c] transition">Política de Privacidade</Link></li>
              <li><Link to="#" className="hover:text-[#c9a84c] transition">Termos e Condições</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white/40 text-sm uppercase tracking-wider">Contactos</h4>
            <ul className="space-y-2 text-sm text-white/25">
              <li> info@inuka.co.mz</li>
              <li> +258 82 123 4567</li>
              <li> Maputo, Moçambique</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 mt-8 pt-8 text-center text-xs text-white/20">
          © 2026 INUKA. ALWAYS WITH YOU. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;