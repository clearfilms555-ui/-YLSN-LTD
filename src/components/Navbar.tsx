import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  ShoppingCart,
  Menu,
  X,
  Shield,
  Volume2,
  Calendar,
  Layers,
  Wrench,
  Globe,
  ChevronDown,
} from 'lucide-react';
import { CompanySettings } from '../types';
import { Language, languages, translations } from '../i18n/translations';

interface NavbarProps {
  settings: CompanySettings;
  cartCount: number;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenServiceModal: (type?: string) => void;
  onOpenQuoteModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  cartCount,
  currentLanguage,
  onLanguageChange,
  onOpenCart,
  onOpenAdmin,
  onOpenServiceModal,
  onOpenQuoteModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const t = translations[currentLanguage];
  const activeLangObj = languages.find((l) => l.code === currentLanguage) || languages[0];

  const navLinks = [
    { label: t.services, href: '#services' },
    { label: t.shop, href: '#shop' },
    { label: t.quoteBuilder, href: '#quote-builder' },
    { label: t.soundLab, href: '#sound-lab' },
    { label: t.whyYlsn, href: '#why-ylsn' },
    { label: t.contact, href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#07090E]/95 backdrop-blur-md border-b border-amber-500/20 shadow-2xl">
      {/* Top Announcement Bar */}
      {settings.isAnnouncementActive && settings.announcementText && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-semibold text-xs md:text-sm py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-inner">
          <span className="animate-pulse">🔊</span>
          <span>{settings.announcementText}</span>
          <a
            href={`tel:${settings.phone.replace(/\s+/g, '')}`}
            className="hidden sm:inline-flex items-center gap-1 bg-black/20 hover:bg-black/40 px-2 py-0.5 rounded text-xs transition-colors ml-2"
          >
            <Phone className="w-3 h-3" /> Call {settings.phone}
          </a>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <a href="#" className="flex items-center gap-3.5 group">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-amber-500/60 shadow-lg shadow-amber-500/20 group-hover:border-amber-400 transition-all duration-300 bg-slate-950 p-0.5">
              <img
                src={settings.logoUrl || '/ylsn_logo.jpg'}
                alt="YLSN LTD Sound Systems Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/ylsn_logo.jpg';
                }}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  YLSN
                </span>
                <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded tracking-wider shadow">
                  LTD
                </span>
              </div>
              <span className="text-[11px] font-medium tracking-widest uppercase text-cyan-400 flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-cyan-400 inline" /> Sound Systems
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs xl:text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors duration-200 relative group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Right Controls: Languages, Hotline, Cart, Admin */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Language Switcher Dropdown (5 Languages) */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                title="Select Language"
              >
                <span>{activeLangObj.flag}</span>
                <span className="hidden xl:inline">{activeLangObj.nativeName}</span>
                <span className="xl:hidden">{activeLangObj.code.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-[#0E131F] border border-amber-500/40 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in duration-150">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                    Choose Language
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors cursor-pointer ${
                        currentLanguage === lang.code
                          ? 'bg-amber-500/20 text-amber-300 font-bold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">
                        {lang.code}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clickable Official Hotline */}
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400 transition-all duration-200 text-xs font-semibold shadow-md"
              title="Click to call YLSN LTD hotline"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{settings.phone}</span>
            </a>

            {/* WhatsApp Quick Action */}
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                'Hello YLSN LTD! I would like to inquire about sound system services and equipment.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30 text-xs font-medium"
              title="Chat with YLSN on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{t.whatsApp}</span>
            </a>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 hover:text-cyan-400 transition-colors duration-200 shadow-md cursor-pointer"
              aria-label="View Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-lg border-2 border-[#07090E] animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Dashboard Entry */}
            <button
              onClick={onOpenAdmin}
              className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 text-slate-400 hover:text-amber-400 transition-colors duration-200 text-xs flex items-center gap-1 cursor-pointer"
              title="Admin Portal"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{t.admin}</span>
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Language Trigger */}
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
            >
              {activeLangObj.flag}
            </button>

            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-400"
              aria-label="Call YLSN Hotline"
            >
              <Phone className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200"
              aria-label="Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Language Selector Dropdown */}
        {langDropdownOpen && (
          <div className="lg:hidden bg-[#0E131F] border-b border-amber-500/30 px-4 py-2 grid grid-cols-2 gap-2 shadow-2xl">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onLanguageChange(lang.code);
                  setLangDropdownOpen(false);
                }}
                className={`flex items-center gap-2 p-2 rounded-lg text-xs font-semibold ${
                  currentLanguage === lang.code
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 text-slate-200'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.nativeName}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B0E14] border-b border-amber-500/20 px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-2 border-b border-slate-800 pb-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800/60 hover:text-amber-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm shadow-md"
            >
              <Phone className="w-4 h-4" />
              <span>Call {settings.phone}</span>
            </a>

            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                'Hello YLSN LTD! I would like to inquire about sound system services and equipment.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600/30 border border-emerald-500/50 text-emerald-400 font-semibold text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenServiceModal();
                }}
                className="py-2 px-3 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5"
              >
                <Wrench className="w-3.5 h-3.5 text-cyan-400" /> {t.bookService}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuoteModal();
                }}
                className="py-2 px-3 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> {t.getQuote}
              </button>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full text-center py-2 text-xs text-slate-400 hover:text-amber-400 flex items-center justify-center gap-1.5 pt-2"
            >
              <Shield className="w-3.5 h-3.5" /> Administrator Dashboard & API
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
