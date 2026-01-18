
export type CategoryId = string;

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  subCategoryId?: string;
  order?: number;
}

export interface SubCategory {
  id: string;
  name: string;
}

export interface Decoration {
  id: string;
  url: string;
  position: { x: number; y: number };
  size: number;
}

export interface Category {
  id: CategoryId;
  title: string;
  subtitle: string;
  themeColor: string;
  accentColor: string;
  bgGradientStart: string;
  bgGradientEnd: string;
  favoriteColor?: string;
  icon: string;
  products: Product[];
  subCategories?: SubCategory[];
  isFavorite?: boolean;
  decorations?: Decoration[];
  order?: number;
}

export interface BrandingSettings {
  brandName: string;
  slogan: string;
  headerBg: string;
  headerTextColor: string;
  sloganColor: string;
  instagram?: string;
  whatsapp?: string;
}
