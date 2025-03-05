import {
    StyleSheet,
    View,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Push from "@/components/Push";
import DataList from "@/components/DataList";
import AddItemForm from "@/components/AddItemForm";
import { fetchDataOnce } from "@/services/apiService";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                setLoading(true);
                // Verificar conexión con la API
                await fetchDataOnce("medicine");
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Error de conexión'));
                Alert.alert(
                    "Error de conexión",
                    "No se pudo conectar con la API local. Asegúrate de que tu servidor esté ejecutándose en http://localhost:5103"
                );
            } finally {
                setLoading(false);
            }
        };

        initializeApp();
    }, []);

    const handleItemPress = (item: any) => {
        console.log("Item seleccionado:", item);
        Alert.alert(
            item.name || "Detalle",
            `ID: ${item.id}\n${Object.entries(item)
                .filter(([key]) => key !== 'id' && key !== 'name')
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n')}`
        );
    };

    const handleAddSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <ThemedText style={styles.loadingText}>Conectando con la API local...</ThemedText>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>
                    No se pudo conectar con la API local en http://localhost:5103
                </ThemedText>
                <ThemedText style={styles.errorSubtext}>
                    Asegúrate de que tu servidor esté ejecutándose y sea accesible desde la aplicación.
                </ThemedText>
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.header}>
                <ThemedText style={styles.title}>Gestión de Inventario</ThemedText>
                <ThemedText style={styles.subtitle}>Conectado a: http://localhost:5103</ThemedText>
            </View>
            
            <View style={styles.dataContainerWrapper}>
                <View style={styles.dataHeader}>
                    <View style={styles.dataHeaderLeft}>
                        <Ionicons name="list" size={22} color="#0066cc" style={styles.headerIcon} />
                        <ThemedText style={styles.dataTitle}>
                            Medicamentos
                        </ThemedText>
                    </View>
                    <TouchableOpacity 
                        style={styles.addButton}
                        onPress={() => setIsAddModalVisible(true)}
                    >
                        <Ionicons name="add-circle" size={22} color="#ffffff" />
                        <ThemedText style={styles.addButtonText}>Añadir</ThemedText>
                    </TouchableOpacity>
                </View>
                
                <ThemedView style={styles.dataContainer} key={refreshKey}>
                    <DataList 
                        collectionName="medicine"
                        onItemPress={handleItemPress}
                        realtime={false}
                        emptyMessage="No hay medicamentos registrados"
                    />
                </ThemedView>
            </View>
            
            <AddItemForm 
                collectionName="medicine"
                visible={isAddModalVisible}
                onClose={() => setIsAddModalVisible(false)}
                onSuccess={handleAddSuccess}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "flex-start",
        margin: 30,
        maxWidth: 800,
        flex: 1,
    },
    header: {
        paddingTop: 24,
        marginBottom: 12,
        alignItems: "center",
    },
    title: {
        fontSize: 16,
        paddingTop: 10,
        fontWeight: "bold",
        marginBottom: 6,
        textAlign: "center",
        color: "#2c3e50",
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 8,
        textAlign: "center",
        opacity: 0.7,
        color: "#7f8c8d",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: "#f8f9fa",
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: "#34495e",
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: "#f8f9fa",
    },
    errorText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#e74c3c',
        textAlign: 'center',
        marginBottom: 12,
    },
    errorSubtext: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 24,
        color: "#7f8c8d",
        maxWidth: 300,
    },
    dataContainerWrapper: {
        flex: 1,
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        overflow: "hidden",
    },
    dataHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
        backgroundColor: "#fafafa",
    },
    dataHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        marginRight: 8,
    },
    dataTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#2c3e50",
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#0066cc",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
    },
    addButtonText: {
        marginLeft: 6,
        color: '#ffffff',
        fontWeight: '600',
    },
    dataContainer: {
        flex: 1,
        padding: 12,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: "absolute",
    },
});
