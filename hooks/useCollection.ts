import { ApiService } from '@/services/apiService';
import { useState, useEffect } from 'react';

interface ApiDocument {
  id: string;
  [key: string]: any;
}

const apiService = ApiService.getInstance();

export function useCollection<T extends ApiDocument>(collectionName: string, realtime = false) {

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (realtime) {
      const unsubscribe = apiService.setupPolling(collectionName, (newData) => {
        const processedData = Array.isArray(newData)
          ? newData
          : (newData ? [newData] : []);

        setData(processedData as T[]);
        setLoading(false);
      });

      return () => {
        unsubscribe();
      };
    } else {
      const fetchData = async () => {
        try {
          setLoading(true);
          const result = await apiService.getCollection(collectionName);

          const processedData = Array.isArray(result)
            ? result
            : (result ? [result] : []);

          setData(processedData as T[]);
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Error desconocido'));
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [collectionName, realtime]);

  const addItem = async (item: Record<string, any>) => {
    try {
      const id = await apiService.addDocument(collectionName, item);
      if (!realtime) {
        setData(prev => [...prev, { id, ...item } as T]);
      }
      return id;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al añadir documento'));
      throw err;
    }
  };

  const refresh = async () => {
    try {
      setLoading(true);
      const result = await apiService.getCollection(collectionName);
      setData(result as T[]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al refrescar datos'));
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, addItem, refresh };
}