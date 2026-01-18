
import React, { useState, useRef } from 'react';
import { Category, Product, Decoration, BrandingSettings, SubCategory } from '../types';
import { X, Plus, Trash2, Settings2, Palette, Image as ImageIcon, Edit3, Star, DollarSign, Instagram, MessageCircle, ArrowUp, ArrowDown, ListFilter, Lock, User, Move, Check } from 'lucide-react';

interface AdminPanelProps {
  categories: Category[];
  onUpdateCategories: (newCategories: Category[]) => void;
  branding: BrandingSettings;
  onUpdateBranding: (newBranding: BrandingSettings) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ categories, onUpdateCategories, branding, onUpdateBranding, onClose }) => {
  const [activeTab, setActiveTab] = useState<string>(categories[0]?.id || 'branding');
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ name: '', description: '', imageUrl: '', price: '', subCategoryId: '' });
  const [newSubCatName, setNewSubCatName] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editProductData, setEditProductData] = useState<Partial<Product>>({});
  
  // Sistema de Login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const productFileRef = useRef<HTMLInputElement>(null);
  const editProductFileRef = useRef<HTMLInputElement>(null);
  const decoFileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = btoa(user); 
    const p = btoa(pass);
    if (u === 'QUdBUEUyMQ==' && p === 'MDcxMg==') {
      setIsLoggedIn(true);
    } else {
      alert("Credenciais Inválidas");
    }
  };

  const isBrandingActive = activeTab === 'branding';
  const currentCategory = categories.find(c => c.id === activeTab);

  const updateCurrentCategory = (updates: Partial<Category>) => {
    onUpdateCategories(categories.map(cat => cat.id === activeTab ? { ...cat, ...updates } : cat));
  };

  const moveCategory = (idx: number, direction: 'up' | 'down') => {
    const newCats = [...categories];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newCats.length) return;
    [newCats[idx], newCats[targetIdx]] = [newCats[targetIdx], newCats[idx]];
    onUpdateCategories(newCats);
  };

  const moveSubCategory = (idx: number, direction: 'up' | 'down') => {
    if (!currentCategory?.subCategories) return;
    const newSubs = [...currentCategory.subCategories];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newSubs.length) return;
    [newSubs[idx], newSubs[targetIdx]] = [newSubs[targetIdx], newSubs[idx]];
    updateCurrentCategory({ subCategories: newSubs });
  };

  const moveProduct = (prodIdx: number, direction: 'up' | 'down') => {
    if (!currentCategory) return;
    const newProds = [...currentCategory.products];
    const targetIdx = direction === 'up' ? prodIdx - 1 : prodIdx + 1;
    if (targetIdx < 0 || targetIdx >= newProds.length) return;
    [newProds[prodIdx], newProds[targetIdx]] = [newProds[targetIdx], newProds[prodIdx]];
    updateCurrentCategory({ products: newProds });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'decoration' | 'edit-product') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (type === 'product') setNewProduct(prev => ({ ...prev, imageUrl: base64String }));
      else if (type === 'edit-product') setEditProductData(prev => ({ ...prev, imageUrl: base64String }));
      else if (type === 'decoration' && currentCategory) {
        const deco: Decoration = { id: Date.now().toString(), url: base64String, position: { x: 50, y: 50 }, size: 100 };
        updateCurrentCategory({ decorations: [...(currentCategory.decorations || []), deco] });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const addSubCategory = () => {
    if (!newSubCatName.trim() || !currentCategory) return;
    const newSub: SubCategory = { id: Date.now().toString(), name: newSubCatName.trim() };
    updateCurrentCategory({ subCategories: [...(currentCategory.subCategories || []), newSub] });
    setNewSubCatName('');
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.imageUrl) return alert("Nome e Imagem são obrigatórios!");
    const product: Product = { 
      id: Date.now().toString(), name: newProduct.name!, description: newProduct.description || '', 
      imageUrl: newProduct.imageUrl!, price: newProduct.price || '', subCategoryId: newProduct.subCategoryId 
    };
    updateCurrentCategory({ products: [...(currentCategory?.products || []), product] });
    setNewProduct({ name: '', description: '', imageUrl: '', price: '', subCategoryId: '' });
  };

  const startEditingProduct = (product: Product) => {
    setEditingProductId(product.id);
    setEditProductData({ ...product });
  };

  const saveEditedProduct = () => {
    if (!currentCategory || !editingProductId) return;
    const updatedProducts = currentCategory.products.map(p => 
      p.id === editingProductId ? { ...p, ...editProductData } as Product : p
    );
    updateCurrentCategory({ products: updatedProducts });
    setEditingProductId(null);
    setEditProductData({});
  };

  const updateDecoPosition = (decoId: string, x: number, y: number) => {
    if (!currentCategory?.decorations) return;
    const updated = currentCategory.decorations.map(d => d.id === decoId ? { ...d, position: { x, y } } : d);
    updateCurrentCategory({ decorations: updated });
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 bg-[#3d2b1f]/98 backdrop-blur-2xl z-[100] flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-[#d2b48c]/30 text-center">
          <div className="mb-8 flex justify-center"><div className="p-4 bg-[#8b4513] rounded-full text-white shadow-lg"><Lock size={32} /></div></div>
          <h2 className="text-3xl font-luxury text-[#5d4037] mb-2">Acesso Restrito</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Usuário" className="w-full pl-4 pr-4 py-4 bg-[#f4eee8] rounded-2xl outline-none" value={user} onChange={e => setUser(e.target.value)} />
            <input type="password" placeholder="Senha" className="w-full pl-4 pr-4 py-4 bg-[#f4eee8] rounded-2xl outline-none" value={pass} onChange={e => setPass(e.target.value)} />
            <button type="submit" className="w-full bg-[#8b4513] text-white py-4 rounded-2xl font-black uppercase tracking-widest">Entrar</button>
            <button type="button" onClick={onClose} className="text-[#a67c52] text-xs font-bold uppercase mt-4">Voltar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#3d2b1f]/95 backdrop-blur-xl z-[100] flex items-center justify-center p-2 md:p-4">
      <div className="bg-[#fdfcfb] w-full max-w-7xl h-[95vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border border-[#d2b48c]/30">
        <div className="p-4 md:p-6 border-b border-[#e5dcd3] flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-4 text-[#8b4513]"><Settings2 size={24} /><h2 className="text-xl md:text-3xl font-luxury text-[#5d4037]">Painel Administrativo</h2></div>
          <button onClick={onClose} className="p-2 hover:bg-red-50 text-red-400 rounded-full transition-all"><X size={24} /></button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-20 md:w-80 border-r border-[#e5dcd3] bg-[#faf7f4] flex flex-col shrink-0 overflow-y-auto no-scrollbar">
            <button onClick={() => setActiveTab('branding')} className={`w-full p-4 flex items-center gap-3 ${isBrandingActive ? 'bg-[#8b4513] text-white' : 'text-[#8b4513]'}`}>
              <Palette size={18} /> <span className="hidden md:block font-bold text-[10px] uppercase">Identidade Visual</span>
            </button>
            {categories.map((cat, idx) => (
              <div key={cat.id} className={`flex items-center group ${activeTab === cat.id ? 'bg-white' : ''}`}>
                <button onClick={() => setActiveTab(cat.id)} className={`flex-1 text-left p-4 text-xs ${activeTab === cat.id ? 'text-[#8b4513] font-bold' : 'text-[#6b5847]'}`}>{cat.title} {cat.isFavorite && "⭐"}</button>
                <div className="flex flex-col pr-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => moveCategory(idx, 'up')}><ArrowUp size={12}/></button>
                  <button onClick={() => moveCategory(idx, 'down')}><ArrowDown size={12}/></button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-white/30">
            {isBrandingActive ? (
              <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 rounded-3xl border">
                 <h3 className="text-2xl font-luxury text-[#5d4037]">Página Inicial</h3>
                 <div className="grid grid-cols-2 gap-6">
                    <input className="bg-[#f4eee8] p-4 rounded-xl font-luxury" value={branding.brandName} onChange={e => onUpdateBranding({...branding, brandName: e.target.value})} />
                    <input className="bg-[#f4eee8] p-4 rounded-xl font-handwritten text-xl" value={branding.slogan} onChange={e => onUpdateBranding({...branding, slogan: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-3 gap-6">
                    <div><label className="text-[10px] font-bold">FUNDO</label><input type="color" className="w-full h-10" value={branding.headerBg} onChange={e => onUpdateBranding({...branding, headerBg: e.target.value})} /></div>
                    <div><label className="text-[10px] font-bold">TEXTO</label><input type="color" className="w-full h-10" value={branding.headerTextColor} onChange={e => onUpdateBranding({...branding, headerTextColor: e.target.value})} /></div>
                    <div><label className="text-[10px] font-bold">SLOGAN</label><input type="color" className="w-full h-10" value={branding.sloganColor} onChange={e => onUpdateBranding({...branding, sloganColor: e.target.value})} /></div>
                 </div>
                 <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <input className="bg-[#f4eee8] p-4 rounded-xl" placeholder="Instagram" value={branding.instagram || ''} onChange={e => onUpdateBranding({...branding, instagram: e.target.value})} />
                    <input className="bg-[#f4eee8] p-4 rounded-xl" placeholder="WhatsApp" value={branding.whatsapp || ''} onChange={e => onUpdateBranding({...branding, whatsapp: e.target.value})} />
                 </div>
              </div>
            ) : currentCategory && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <section className="bg-white p-5 rounded-3xl border border-[#d2b48c]/20 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-[#8b4513]">Personalização & Decorações</h4>
                      <div className="flex items-center gap-2">
                         <input type="color" className="w-6 h-6 rounded-full border cursor-pointer" value={currentCategory.favoriteColor || '#8b4513'} onChange={e => updateCurrentCategory({favoriteColor: e.target.value})} />
                         <button onClick={() => updateCurrentCategory({ isFavorite: !currentCategory.isFavorite })} className={`p-2 rounded-full ${currentCategory.isFavorite ? 'bg-amber-100 text-amber-600' : 'bg-gray-100'}`}><Star size={18} className={currentCategory.isFavorite ? "fill-current" : ""} /></button>
                      </div>
                    </div>
                    <div ref={canvasRef} className="relative w-full aspect-video rounded-xl border-2 border-dashed border-[#d2b48c]/30 overflow-hidden bg-slate-50 shadow-inner mb-4" style={{ background: `linear-gradient(to bottom, ${currentCategory.bgGradientStart}, ${currentCategory.bgGradientEnd})` }}>
                       {currentCategory.decorations?.map((deco) => (
                         <div key={deco.id} className="absolute cursor-move group" style={{ left: `${deco.position.x}%`, top: `${deco.position.y}%`, width: `${deco.size}px`, transform: 'translate(-50%, -50%)' }} onMouseDown={(e) => {
                             const rect = canvasRef.current!.getBoundingClientRect();
                             const onMouseMove = (moveE: MouseEvent) => {
                               const newX = ((moveE.clientX - rect.left) / rect.width) * 100;
                               const newY = ((moveE.clientY - rect.top) / rect.height) * 100;
                               updateDecoPosition(deco.id, Math.max(0, Math.min(100, newX)), Math.max(0, Math.min(100, newY)));
                             };
                             const onMouseUp = () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp); };
                             window.addEventListener('mousemove', onMouseMove); window.addEventListener('mouseup', onMouseUp);
                         }}>
                           <img src={deco.url} className="w-full h-auto pointer-events-none opacity-80" />
                           <button onClick={(e) => { e.stopPropagation(); updateCurrentCategory({ decorations: currentCategory.decorations?.filter(d => d.id !== deco.id) }) }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X size={10}/></button>
                           <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-white px-2 py-0.5 rounded shadow text-[8px] font-bold">Tam: <input type="number" className="w-8 border-none p-0 focus:ring-0" value={deco.size} onChange={(e) => updateCurrentCategory({ decorations: currentCategory.decorations?.map(d => d.id === deco.id ? {...d, size: parseInt(e.target.value) || 0} : d) })} /></div>
                         </div>
                       ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input type="color" className="w-full h-8" value={currentCategory.bgGradientStart} onChange={e => updateCurrentCategory({bgGradientStart: e.target.value})} />
                      <input type="color" className="w-full h-8" value={currentCategory.bgGradientEnd} onChange={e => updateCurrentCategory({bgGradientEnd: e.target.value})} />
                    </div>
                    <button onClick={() => decoFileRef.current?.click()} className="w-full border-2 border-[#d2b48c] p-3 rounded-xl text-[10px] font-bold text-[#8b4513] hover:bg-orange-50 flex items-center justify-center gap-2"><ImageIcon size={14}/> ADICIONAR DECORAÇÃO</button>
                    <input type="file" ref={decoFileRef} className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'decoration')} />
                  </section>

                  <section className="bg-white p-5 rounded-3xl border border-[#d2b48c]/20 shadow-sm">
                    <h4 className="text-[10px] font-black uppercase mb-4">Subcategorias</h4>
                    <div className="flex gap-2 mb-4">
                      <input className="flex-1 bg-[#f4eee8] p-2 rounded-xl text-xs" placeholder="Nova Subcategoria..." value={newSubCatName} onChange={e => setNewSubCatName(e.target.value)} />
                      <button onClick={addSubCategory} className="bg-[#8b4513] text-white px-4 rounded-xl"><Plus size={16}/></button>
                    </div>
                    <div className="space-y-2">
                      {currentCategory.subCategories?.map((sub, sIdx) => (
                        <div key={sub.id} className="bg-[#f4eee8] px-4 py-2 rounded-xl text-xs flex items-center justify-between group">
                          {sub.name}
                          <div className="flex gap-2"><button onClick={() => moveSubCategory(sIdx, 'up')}><ArrowUp size={14}/></button><button onClick={() => moveSubCategory(sIdx, 'down')}><ArrowDown size={14}/></button><button onClick={() => updateCurrentCategory({ subCategories: currentCategory.subCategories?.filter(s => s.id !== sub.id) })} className="text-red-400"><Trash2 size={14}/></button></div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="space-y-6">
                  <section className="bg-white p-6 rounded-3xl border border-[#d2b48c]/20 shadow-sm">
                    <h4 className="text-[10px] font-black uppercase mb-4">Produtos</h4>
                    {/* NOVO PRODUTO */}
                    <div className="bg-[#faf7f4] p-4 rounded-2xl border mb-6 space-y-3">
                      <h5 className="text-[9px] font-black uppercase text-[#8b4513] opacity-60">Cadastrar Novo</h5>
                      <div className="flex gap-2">
                        <button onClick={() => productFileRef.current?.click()} className="w-16 h-16 border-2 border-dashed border-[#d2b48c] rounded-xl flex items-center justify-center overflow-hidden">
                          {newProduct.imageUrl ? <img src={newProduct.imageUrl} className="w-full h-full object-cover" /> : <Plus size={20}/>}
                        </button>
                        <div className="flex-1 space-y-2">
                          <input className="w-full bg-white p-2 rounded-lg text-xs" placeholder="Nome" value={newProduct.name || ''} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                          <input className="w-full bg-white p-2 rounded-lg text-xs" placeholder="Preço" value={newProduct.price || ''} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                        </div>
                      </div>
                      <textarea className="w-full bg-white p-2 rounded-lg text-xs h-16" placeholder="Descrição..." value={newProduct.description || ''} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                      <select className="w-full bg-white p-2 rounded-lg text-xs" value={newProduct.subCategoryId || ''} onChange={e => setNewProduct({...newProduct, subCategoryId: e.target.value})}>
                        <option value="">Sem Subcategoria</option>
                        {currentCategory.subCategories?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                      <button onClick={handleAddProduct} className="w-full bg-[#5d4037] text-white py-2 rounded-xl font-bold uppercase text-[10px]">ADICIONAR</button>
                      <input type="file" ref={productFileRef} className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'product')} />
                    </div>

                    {/* LISTAGEM E EDIÇÃO */}
                    <div className="space-y-2 max-h-[400px] overflow-y-auto no-scrollbar">
                      {currentCategory.products.map((prod, pIdx) => (
                        <div key={prod.id} className={`flex flex-col p-2 bg-[#fdfcfb] rounded-xl border transition-all ${editingProductId === prod.id ? 'border-[#8b4513] shadow-md ring-1 ring-[#8b4513]/20' : 'border-[#e5dcd3]/50'}`}>
                          {editingProductId === prod.id ? (
                            <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                               <div className="flex gap-3">
                                 <button onClick={() => editProductFileRef.current?.click()} className="w-12 h-12 rounded-lg overflow-hidden border border-[#d2b48c] relative group">
                                    <img src={editProductData.imageUrl} className="w-full h-full object-cover opacity-50" />
                                    <div className="absolute inset-0 flex items-center justify-center text-[#8b4513]"><ImageIcon size={14}/></div>
                                 </button>
                                 <div className="flex-1 space-y-2">
                                    <input className="w-full bg-[#f4eee8] p-1.5 rounded text-xs" placeholder="Nome" value={editProductData.name || ''} onChange={e => setEditProductData({...editProductData, name: e.target.value})} />
                                    <input className="w-full bg-[#f4eee8] p-1.5 rounded text-xs" placeholder="Preço" value={editProductData.price || ''} onChange={e => setEditProductData({...editProductData, price: e.target.value})} />
                                 </div>
                               </div>
                               <textarea className="w-full bg-[#f4eee8] p-2 rounded text-[10px] h-16" placeholder="Descrição" value={editProductData.description || ''} onChange={e => setEditProductData({...editProductData, description: e.target.value})} />
                               <div className="flex items-center gap-2">
                                  <select className="flex-1 bg-[#f4eee8] p-1.5 rounded text-[10px]" value={editProductData.subCategoryId || ''} onChange={e => setEditProductData({...editProductData, subCategoryId: e.target.value})}>
                                     <option value="">Sem Subcategoria</option>
                                     {currentCategory.subCategories?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                  </select>
                                  <button onClick={saveEditedProduct} className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"><Check size={14}/></button>
                                  <button onClick={() => setEditingProductId(null)} className="bg-gray-400 text-white p-2 rounded-lg hover:bg-gray-500 transition-colors"><X size={14}/></button>
                               </div>
                               <input type="file" ref={editProductFileRef} className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'edit-product')} />
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 group">
                              <img src={prod.imageUrl} className="w-12 h-12 object-cover rounded-lg" />
                              <div className="flex-1">
                                <h5 className="text-[10px] font-bold">{prod.name}</h5>
                                <p className="text-[9px] text-[#8b4513]">R$ {prod.price}</p>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button onClick={() => startEditingProduct(prod)} className="p-1 hover:bg-[#8b4513] hover:text-white rounded transition-colors" title="Editar"><Edit3 size={12}/></button>
                                 <button onClick={() => moveProduct(pIdx, 'up')} className="p-1 hover:bg-orange-50 rounded transition-colors"><ArrowUp size={12}/></button>
                                 <button onClick={() => moveProduct(pIdx, 'down')} className="p-1 hover:bg-orange-50 rounded transition-colors"><ArrowDown size={12}/></button>
                                 <button onClick={() => updateCurrentCategory({ products: currentCategory.products.filter(p => p.id !== prod.id) })} className="p-1 text-red-300 hover:text-red-500 rounded transition-colors"><Trash2 size={12}/></button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
