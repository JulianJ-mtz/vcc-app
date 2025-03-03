interface ApiDocument {
  id: string;
  [key: string]: any;
}

// const API_URL = 'http://192.168.3.132:5103/api';
const API_URL = 'http://10.41.38.15:5103/api';

// Función para obtener datos de una colección (GET)
export const getCollection = async (collectionName: string): Promise<ApiDocument[]> => {
  try {
    console.log(`Solicitando colección: ${collectionName}`);
    const response = await fetch(`${API_URL}/${collectionName}`);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} al obtener colección '${collectionName}'`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error al obtener datos de '${collectionName}':`, error);
    throw error;
  }
};

// Función para obtener un documento específico
export const getDocument = async (collectionName: string, documentId: string): Promise<ApiDocument | null> => {
  try {
    const response = await fetch(`${API_URL}/${collectionName}/${documentId}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener el documento:', error);
    throw error;
  }
};

// Función para añadir un nuevo documento (POST)
export const addDocument = async (collectionName: string, data: Record<string, any>): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/${collectionName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    // Verificar si hay contenido en la respuesta
    const text = await response.text();
    if (!text) {
      return "Documento creado (sin ID devuelto)";
    }
    
    try {
      const result = JSON.parse(text);
      return result.id || JSON.stringify(result);
    } catch (jsonError) {
      console.warn('La respuesta no es un JSON válido:', text);
      return text;
    }
  } catch (error) {
    console.error('Error al añadir datos:', error);
    throw error;
  }
};

// Función para actualizar un documento
export const updateDocument = async (collectionName: string, documentId: string, data: Record<string, any>): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/${collectionName}/${documentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error al actualizar el documento:', error);
    throw error;
  }
};

// Función para eliminar un documento
export const deleteDocument = async (collectionName: string, documentId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/${collectionName}/${documentId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error al eliminar el documento:', error);
    throw error;
  }
};

// Función para configurar polling (actualizaciones periódicas)
export const setupPolling = (
  collectionName: string,
  callback: (data: ApiDocument[]) => void,
  interval = 5000
): (() => void) => {
  const intervalId = setInterval(async () => {
    try {
      const data = await getCollection(collectionName);
      callback(data);
    } catch (error) {
      console.error('Error en polling:', error);
    }
  }, interval);

  // Ejecutar inmediatamente la primera vez
  getCollection(collectionName)
    .then(data => callback(data))
    .catch(error => console.error('Error inicial en polling:', error));

  // Función para cancelar el polling
  return () => clearInterval(intervalId);
};

// Función para obtener datos una sola vez (sin polling)
export const fetchDataOnce = async (collectionName: string): Promise<ApiDocument[]> => {
  try {
    console.log(`Solicitando colección (una sola vez): ${collectionName}`);
    return await getCollection(collectionName);
  } catch (error) {
    console.error(`Error al obtener datos de '${collectionName}' (solicitud única):`, error);
    // Devolver array vacío en lugar de propagar el error
    return [];
  }
};