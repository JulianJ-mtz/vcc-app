import { useState, useEffect } from 'react';
import {
  getCollection,
  addDocument,
  setupPolling
} from '../services/apiService';

interface ApiDocument {
  id: string;
  [key: string]: any;
}

export function useCollection(collectionName: string, realtime = false) {
  const [data, setData] = useState<ApiDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (realtime) {
      // Simulación de tiempo real mediante polling
      const unsubscribe = setupPolling(collectionName, (newData) => {
        setData(newData);
        setLoading(false);
      });

      return () => {
        unsubscribe();
      };
    } else {
      // Obtener datos una sola vez
      const fetchData = async () => {
        try {
          setLoading(true);
          const result = await getCollection(collectionName);
          setData(result);
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
      const id = await addDocument(collectionName, item);
      if (!realtime) {
        setData(prev => [...prev, { id, ...item }]);
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
      const result = await getCollection(collectionName);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al refrescar datos'));
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, addItem, refresh };
}