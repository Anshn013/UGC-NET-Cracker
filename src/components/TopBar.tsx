import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AppView } from '../types/economics';

interface TopBarProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  onQuickStartMock: () => void;
}

const NAV_ITEMS: { id: AppView; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'mock', label: 'Mock Arena' },
  { id: 'models', label: 'Model Lab' },
  { id: 'syllabus', label: 'Syllabus & Vault' },
];

export const TopBar: React.FC<TopBarProps> = ({
  activeView,
  onNavigate,
  onQuickStartMock,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: AppView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('overview')}
          className="font-display text-xl font-semibold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer hover:text-blue-700 transition-colors"
        >
          ArthaJRF
        </button>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`relative py-5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'text-blue-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-700"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onQuickStartMock}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Start Mock Test
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onQuickStartMock();
              }}
              className="w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
            >
              Start Mock Test
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
