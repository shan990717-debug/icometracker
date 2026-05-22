import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { db } from '@/api/base44Client';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { seedDefaultCategories } from '@/lib/seedCategories';

export function useIncomeSources() {
  // We keep this here so it runs your original setup data
  useEffect(() => { seedDefaultCategories(); }, []);

  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ['incomeSources'],
    queryFn: async () => {
      try {
        const q = query(collection(db, 'IncomeSource'), orderBy('sort_order', 'asc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error fetching income sources from Firebase:", error);
        return [];
      }
    },
    staleTime: 30000,
  });

  return {
    sources: data.filter(s => s.is_active !== false).sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99)),
    allSources: data.sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99)),
    isLoading,
    refetch,
  };
}

export function useDeductionCategories() {
  useEffect(() => { seedDefaultCategories(); }, []);

  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ['deductionCategories'],
    queryFn: async () => {
      try {
        const q = query(collection(db, 'DeductionCategory'), orderBy('sort_order', 'asc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error fetching deduction categories from Firebase:", error);
        return [];
      }
    },
    staleTime: 30000,
  });

  return {
    categories: data.filter(d => d.is_active !== false).sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99)),
    allCategories: data.sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99)),
    isLoading,
    refetch,
  };
}
