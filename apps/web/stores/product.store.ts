import { create } from 'zustand';
import { Product, ProductInput } from '@/types/product';
import api from '@/lib/axios';

interface ProductState {
  products: Product[];
  categories: string[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  selected: Product | null;
  fetchProducts: (page?: number, limit?: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  addProduct: (data: ProductInput) => Promise<void>;
  updateProduct: (id: number, data: ProductInput) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  fetchProductById: (id: number) => Promise<void>;
  setSelected: (product: Product | null) => void;
  resetForm: () => void;
  setField: (field: keyof Product, value: any) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  categories: [],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  selected: null,

  fetchProducts: async (page = 1, limit = 10) => {
    try {
      set({ loading: true });
      const res = await api.get(`/products?page=${page}&limit=${limit}`);
      set({
        products: res.data.data,
        total: res.data.total,
        page: Number(res.data.page),
        limit: Number(res.data.limit),
        loading: false,
      });
    } catch (error) {
      console.error('Failed to fetch products:', error);
      set({ loading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const res = await api.get('/products/categories');
      set({ categories: res.data });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },

  addProduct: async (data: ProductInput) => {
    await api.post('/products', data);
  },

  updateProduct: async (id: number, data: ProductInput) => {
    await api.patch(`/products/${id}`, data);
  },

  deleteProduct: async (id: number) => {
    await api.delete(`/products/${id}`);
  },

  fetchProductById: async (id: number) => {
    const res = await api.get(`/products/${id}`);
    set({ selected: res.data });
  },

  setSelected: (product: Product | null) => set({ selected: product }),

  resetForm: () => set({ selected: null }),

  setField: (field: keyof Product, value: any) =>
    set((state) => ({
      selected: {
        ...(state.selected || {}),
        [field]: value,
      } as Product,
    })),
}));
