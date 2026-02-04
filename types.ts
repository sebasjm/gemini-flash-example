
export interface Category {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  createdAt: number;
}

export interface StorageLocation {
  id: string;
  name: string;
  description: string;
  createdAt: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  upc: string;
  description: string;
  imageUrls: string[];
  categoryId: string;
  storageLocationId: string;
  quantity: number;
  price: number; // Re-adding price as requested for catalog editing
  tag?: string;
  tagColor?: string;
  createdAt: number;
}

export interface Catalog {
  id: string;
  name: string;
  description: string;
  productIds: string[];
  createdAt: number;
  themeColor?: string;
}

export type ViewState = 'dashboard' | 'inventory' | 'catalogs' | 'catalog-detail' | 'public-view' | 'settings' | 'locations' | 'location-detail';

export interface AppState {
  products: Product[];
  categories: Category[];
  storageLocations: StorageLocation[];
  catalogs: Catalog[];
  activeCatalogId: string | null;
  activeLocationId: string | null;
  currentView: ViewState;
}
