
import { Category } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'gift-baskets',
    title: 'Cestas de Presente',
    subtitle: 'Um pedaço de aconchego em cada laço',
    themeColor: 'border-orange-200',
    accentColor: 'text-[#8b4513]',
    // Correcting property names from bgGradient to bgGradientStart and bgGradientEnd
    bgGradientStart: '#fdf5e6',
    bgGradientEnd: '#ebceb1',
    icon: 'Gift',
    products: [
      /* Added price property to meet type requirements */
      { id: '1', name: 'Cesta Colheita do Dia', description: 'Produtos frescos, pães caseiros e o calor do campo.', imageUrl: 'https://images.unsplash.com/photo-1549465220-1d8c9d9c6703?auto=format&fit=crop&q=80&w=800', price: '180,00' },
      /* Added price property to meet type requirements */
      { id: '2', name: 'Chá de Outono', description: 'Uma seleção reconfortante para tardes de sol e brisa.', imageUrl: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800', price: '120,00' }
    ]
  },
  {
    id: 'bouquets',
    title: 'Buquês',
    subtitle: 'Flores colhidas com alma e poesia',
    themeColor: 'border-green-200',
    accentColor: 'text-[#2d5a27]',
    // Correcting property names from bgGradient to bgGradientStart and bgGradientEnd
    bgGradientStart: '#f0f7ef',
    bgGradientEnd: '#c5d8c1',
    icon: 'Flower',
    products: [
      /* Added price property to meet type requirements */
      { id: '3', name: 'Jardim Silvestre', description: 'O frescor do mato e a delicadeza das cores vivas.', imageUrl: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&q=80&w=800', price: '95,00' }
    ]
  },
  {
    id: 'pascoa',
    title: 'Páscoa',
    subtitle: 'O sabor da terra e do puro cacau',
    themeColor: 'border-yellow-200',
    accentColor: 'text-[#5d4037]',
    // Correcting property names from bgGradient to bgGradientStart and bgGradientEnd
    bgGradientStart: '#fffbeb',
    bgGradientEnd: '#fde68a',
    icon: 'Rabbit',
    products: []
  },
  {
    id: 'natal',
    title: 'Natal',
    subtitle: 'Luz, pinho e o abraço da família',
    themeColor: 'border-red-300',
    accentColor: 'text-[#9b1c1c]',
    // Correcting property names from bgGradient to bgGradientStart and bgGradientEnd
    bgGradientStart: '#fef2f2',
    bgGradientEnd: '#fca5a5',
    icon: 'TreePine',
    products: []
  },
  {
    id: 'mothers-day',
    title: 'Dia das Mães',
    subtitle: 'Onde todo amor do mundo floresce',
    themeColor: 'border-pink-300',
    accentColor: 'text-[#be185d]',
    // Correcting property names from bgGradient to bgGradientStart and bgGradientEnd
    bgGradientStart: '#fdf2f8',
    bgGradientEnd: '#f9a8d4',
    icon: 'Heart',
    products: []
  },
  {
    id: 'fathers-day',
    title: 'Dia dos Pais',
    subtitle: 'Raízes fortes e mãos que acolhem',
    themeColor: 'border-blue-300',
    accentColor: 'text-[#1e3a8a]',
    // Correcting property names from bgGradient to bgGradientStart and bgGradientEnd
    bgGradientStart: '#eff6ff',
    bgGradientEnd: '#93c5fd',
    icon: 'Anchor',
    products: []
  },
  {
    id: 'valentines-day',
    title: 'Dia dos Namorados',
    subtitle: 'Fogo, paixão e o encanto do agora',
    themeColor: 'border-rose-400',
    accentColor: 'text-[#7f1d1d]',
    // Correcting property names from bgGradient to bgGradientStart and bgGradientEnd
    bgGradientStart: '#fff1f2',
    bgGradientEnd: '#fb7185',
    icon: 'Flame',
    products: []
  }
];