import React, { useState } from 'react';
import { Product, BrandingSettings } from '../types';
import { X, ChevronRight, MessageCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [showModal, setShowModal] = useState(false);
  
  const firstLine = product.description.split('\n')[0].split('.')[0] + '.';

  const handleWhatsAppOrder = () => {
    const brandingSaved = localStorage.getItem('agape-branding-v11');
    const branding: BrandingSettings = brandingSaved ? JSON.parse(brandingSaved) : { whatsapp: '' };
    const phone = branding.whatsapp?.replace(/\D/g, '');
    
    if (!phone) {
      alert('Número de WhatsApp não configurado no painel administrativo.');
      return;
    }

    let messageText = branding.customWhatsappMessage || "Olá! Gostaria de fazer um pedido deste item do catálogo:\n\n*Produto:* {nome}\n*Valor:* R$ {valor}\n\nPoderia me informar a disponibilidade?";
    
    // Substitui placeholders
    messageText = messageText.replace(/{nome}/gi, product.name);
    messageText = messageText.replace(/{valor}/gi, product.price);

    const message = encodeURIComponent(messageText);
    window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
  };

  return (
    <>
      <div className="group flex flex-col cursor-pointer" onClick={() => setShowModal(true)}>
        <div className="relative w-full aspect-[4/5] overflow-hidden organic-card shadow-xl shadow-[#433422]/10 mb-6 bg-[#e5dcd3] border-[6px] border-white transition-all duration-500 hover:-rotate-1">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
          />
          {product.price && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg z-30 border border-[#d2b48c]/30">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#8b4513]">R$ {product.price}</span>
            </div>
          )}
        </div>
        
        <div className="text-left px-2">
          <h3 className="text-3xl font-luxury text-[#433422] mb-1 leading-none group-hover:text-[#8b4513] transition-colors">
            {product.name}
          </h3>
          <p className="font-serif-soft text-[#6b5847] text-lg leading-snug italic line-clamp-1">
            {firstLine}
          </p>
          <button 
            className="mt-2 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#a67c52] hover:text-[#8b4513] transition-colors"
          >
            Ver Detalhes <ChevronRight size={12}/>
          </button>
          <div className="mt-4 h-[1px] w-8 bg-[#d2b48c] group-hover:w-16 transition-all duration-500"></div>
        </div>
      </div>

      {/* Modal de Detalhes (Popup) */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-[#3d2b1f]/80 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-[#fdfcfb] w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-[#d2b48c]/30 animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-md rounded-full text-[#8b4513] hover:bg-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="w-full md:w-1/2 h-64 md:h-auto">
              <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.name} />
            </div>
            
            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col justify-center">
              <h2 className="text-5xl md:text-6xl font-luxury text-[#433422] mb-4">{product.name}</h2>
              {product.price && (
                <p className="text-2xl font-bold text-[#8b4513] mb-6">R$ {product.price}</p>
              )}
              <div className="w-12 h-[2px] bg-[#d2b48c] mb-8"></div>
              <p className="font-serif-soft text-2xl md:text-3xl text-[#6b5847] leading-relaxed italic whitespace-pre-wrap mb-10">
                {product.description}
              </p>

              <button 
                onClick={handleWhatsAppOrder}
                className="flex items-center justify-center gap-4 bg-[#25D366] hover:bg-[#20ba59] text-white py-4 px-8 rounded-full font-black uppercase text-[10px] tracking-[0.2em] shadow-md transition-all active:scale-95 group"
              >
                <MessageCircle size={18} />
                Encomendar via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;