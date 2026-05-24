import React from "react";
import { navLinks } from "@/data/dummyContent";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-white py-16 border-t border-gray-800">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl leading-none">S</span>
              </div>
              <span className="font-bold text-xl tracking-tight">Synthetix</span>
            </div>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              Membangun fondasi otomatisasi bisnis masa depan dengan desain dan performa tanpa kompromi.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Produk</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Perusahaan</h4>
            <ul className="space-y-3">
              {["Tentang Kami", "Karir", "Blog", "Kontak"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Berlangganan</h4>
            <p className="text-gray-400 text-sm mb-4">
              Dapatkan pembaruan fitur terbaru dan tips otomatisasi langsung ke inbox Anda.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Alamat Email" 
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white w-full focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                Kirim
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Synthetix. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-6">
            {["Syarat", "Privasi", "Cookies"].map((legal) => (
              <a key={legal} href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
                {legal}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
