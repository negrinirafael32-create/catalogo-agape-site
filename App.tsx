
import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_CATEGORIES } from './constants';
import { Category, CategoryId, BrandingSettings, Product } from './types';
import ProductCard from './components/ProductCard';
import AdminPanel from './components/AdminPanel';
import * as Icons from 'lucide-react';

const DEFAULT_BRANDING: BrandingSettings = {
  brandName: 'AGAPE',
  slogan: 'Atelier de Afetos',
  headerBg: '#fdfcfb',
  headerTextColor: '#5d4037',
  sloganColor: '#8b4513',
  instagram: '',
  whatsapp: ''
};

const App: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('agape-catalog-v11');
    if (saved) return JSON.parse(saved);
    return INITIAL_CATEGORIES;
  });

  const [branding, setBranding] = useState<BrandingSettings>(() => {
    const saved = localStorage.getItem('agape-branding-v11');
    return saved ? JSON.parse(saved) : DEFAULT_BRANDING;
  });
  
  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId>('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [priceSort, setPriceSort] = useState<'none' | 'asc' | 'desc'>('none');

  const displayCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return 0;
    });
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('agape-catalog-v11', JSON.stringify(categories));
    if (!activeCategoryId && displayCategories.length > 0) {
      setActiveCategoryId(displayCategories[0].id);
    }
  }, [categories, displayCategories]);

  useEffect(() => {
    localStorage.setItem('agape-branding-v11', JSON.stringify(branding));
  }, [branding]);

  const handleLogoClick = () => {
    setLogoClicks(prev => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        setIsAdminOpen(true);
        return 0;
      }
      return newCount;
    });
    setTimeout(() => setLogoClicks(0), 2000);
  };

  const activeCategory = categories.find(c => c.id === activeCategoryId) || displayCategories[0];

  const getSortedProducts = (products: Product[]) => {
    if (priceSort === 'none') return products;
    return [...products].sort((a, b) => {
      const p1 = parseFloat(a.price.replace(',', '.')) || 0;
      const p2 = parseFloat(b.price.replace(',', '.')) || 0;
      return priceSort === 'asc' ? p1 - p2 : p2 - p1;
    });
  };

  if (!activeCategory) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#f4eee8] rustic-texture overflow-x-hidden">
      <header className="pt-24 pb-16 px-6 text-center relative border-b border-[#e5dcd3]" style={{ backgroundColor: branding.headerBg }}>
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative flex flex-col items-center justify-center py-12 px-8 md:px-24 bg-[#f2e8d5]/40 rounded-[100px] border-2 border-[#d2b48c]/30 shadow-sm backdrop-blur-sm cursor-default" onClick={handleLogoClick}>
            <h1 className="text-7xl md:text-9xl font-luxury tracking-tight" style={{ color: branding.headerTextColor }}>{branding.brandName}</h1>
            <p className="font-handwritten text-3xl md:text-4xl mt-4" style={{ color: branding.sloganColor }}>{branding.slogan}</p>
          </div>
        </div>
      </header>

      <nav className="sticky top-0 bg-[#fdfcfb]/95 backdrop-blur-md z-30 border-b border-[#e5dcd3] shadow-md">
        <div className="max-w-screen-xl mx-auto flex items-end justify-start md:justify-center px-8 h-32 gap-4 md:gap-8 overflow-x-auto no-scrollbar pb-2">
          {displayCategories.map((cat) => {
            const isActive = activeCategoryId === cat.id;
            const isFav = cat.isFavorite;
            const color = isFav ? (cat.favoriteColor || '#8b4513') : '#8b4513';
            return (
              <button key={cat.id} onClick={() => { setActiveCategoryId(cat.id); setPriceSort('none'); }} className={`group flex flex-col items-center justify-end min-w-[100px] transition-all duration-500 pb-2 ${isActive ? 'scale-110' : 'opacity-70'}`}>
                <div className="p-4 rounded-full transition-all border-2 relative" style={{ backgroundColor: isActive ? color : 'white', borderColor: isFav ? (cat.favoriteColor || '#d2b48c') : '#e5dcd3', color: isActive ? 'white' : '#433422' }}>
                  {isFav && <Icons.Star className="absolute -top-1 -right-1 fill-amber-400 text-amber-400 animate-pulse" size={14} />}
                  {(Icons as any)[cat.icon] ? React.createElement((Icons as any)[cat.icon], { size: 24 }) : <Icons.Sparkles size={24}/>}
                </div>
                <span className="text-[9px] font-black uppercase mt-2 whitespace-nowrap" style={{ color: isActive ? color : '#433422' }}>{cat.title}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <main className="flex-1 transition-all duration-1000 relative" style={{ background: `linear-gradient(to bottom, ${activeCategory.bgGradientStart}, ${activeCategory.bgGradientEnd})` }}>
        {activeCategory.decorations?.map((deco) => (
          <div key={deco.id} className="absolute pointer-events-none animate-float" style={{ left: `${deco.position.x}%`, top: `${deco.position.y}%`, width: `${deco.size}px` }}>
            <img src={deco.url} className="w-full h-auto opacity-70" alt="" />
          </div>
        ))}

        <div className="max-w-screen-xl mx-auto px-6 py-20 relative z-10">
          <div className="text-center mb-16 relative">
            {activeCategory.isFavorite && (
              <div className="flex justify-center mb-6">
                 <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-white text-[9px] font-black uppercase tracking-widest shadow-md" style={{ backgroundColor: activeCategory.favoriteColor || '#8b4513' }}>
                    <Icons.Star size={10} className="fill-current"/> Destaque Especial
                 </span>
              </div>
            )}
            <h2 className="text-6xl md:text-8xl font-luxury mb-4" style={{ color: activeCategory.accentColor }}>{activeCategory.title}</h2>
            <p className="font-handwritten text-3xl md:text-5xl italic opacity-85 mb-8" style={{ color: activeCategory.accentColor }}>{activeCategory.subtitle}</p>
            
            {/* Filtro de Preço para o Cliente */}
            <div className="flex justify-center gap-4 mt-8">
               <button 
                  onClick={() => setPriceSort(priceSort === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/40 backdrop-blur-sm border border-white/20 text-[10px] font-black uppercase tracking-widest hover:bg-white/60 transition-all"
                  style={{ color: activeCategory.accentColor }}
               >
                  <Icons.ArrowUpDown size={14}/>
                  Preço: {priceSort === 'none' ? 'Padrão' : priceSort === 'asc' ? 'Menor' : 'Maior'}
               </button>
               {priceSort !== 'none' && (
                 <button onClick={() => setPriceSort('none')} className="p-2 bg-white/20 rounded-full" style={{ color: activeCategory.accentColor }}>
                    <Icons.X size={14}/>
                 </button>
               )}
            </div>
          </div>

          <div className="space-y-24">
            {activeCategory.subCategories && activeCategory.subCategories.length > 0 ? (
              activeCategory.subCategories.map(sub => {
                const subProds = getSortedProducts(activeCategory.products.filter(p => p.subCategoryId === sub.id));
                if (subProds.length === 0) return null;
                return (
                  <div key={sub.id} className="space-y-12">
                    <div className="flex items-center gap-4">
                      <div className="h-[1px] flex-1 bg-current opacity-20"></div>
                      <h3 className="text-3xl font-luxury uppercase tracking-widest px-6" style={{ color: activeCategory.accentColor }}>{sub.name}</h3>
                      <div className="h-[1px] flex-1 bg-current opacity-20"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                      {subProds.map(product => <ProductCard key={product.id} product={product} />)}
                    </div>
                  </div>
                );
              })
            ) : null}
            
            {/* Produtos sem subcategoria ou se não houver subcategorias definidas */}
            {getSortedProducts(activeCategory.products.filter(p => !p.subCategoryId || !activeCategory.subCategories?.length)).length > 0 && (
              <div className="space-y-12">
                 {(activeCategory.subCategories?.length || 0) > 0 && <div className="h-[1px] w-full bg-current opacity-10"></div>}
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                    {getSortedProducts(activeCategory.products.filter(p => !p.subCategoryId || !activeCategory.subCategories?.length)).map(product => <ProductCard key={product.id} product={product} />)}
                 </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-24 bg-[#3d2b1f] text-[#f4eee8] text-center border-t border-[#d2b48c]/20">
        <div className="max-w-screen-md mx-auto px-6">
          <h3 className="text-5xl font-luxury mb-8">{branding.brandName}</h3>
          <p className="font-serif-soft italic text-xl opacity-70 mb-12">"{branding.slogan}"</p>
          <div className="flex justify-center gap-8 opacity-40">
            {branding.instagram && <a href={`https://instagram.com/${branding.instagram.replace('@','')}`} target="_blank"><Icons.Instagram size={24}/></a>}
            {branding.whatsapp && <a href={`https://wa.me/${branding.whatsapp.replace(/\D/g,'')}`} target="_blank"><Icons.MessageCircle size={24}/></a>}
          </div>
        </div>
      </footer>

      {isAdminOpen && <AdminPanel categories={categories} onUpdateCategories={setCategories} branding={branding} onUpdateBranding={setBranding} onClose={() => setIsAdminOpen(false)} />}
    </div>
  );
};

export default App;
