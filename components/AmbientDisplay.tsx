import { ApiDocument } from "@/services/apiService";
import { View, StyleSheet, Animated } from "react-native";
import { ThemedText } from "./ThemedText";
import { useCollection } from "@/hooks/useCollection";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";

interface AmbientData {
    humidity: number;
    id: string;
    temperature: number;
    time: string;
}

interface AmbientDisplayProps {
    collectionName: string;
    realtime?: boolean;
    onItemPress?: (item: ApiDocument) => void;
    emptyMessage?: string;
}

export default function AmbientDisplay({
    collectionName,
    realtime = true,
    emptyMessage = "No hay datos disponibles",
}: AmbientDisplayProps) {
    const { data, loading, error } = useCollection<AmbientData>(
        collectionName,
        realtime
    );
    const [temperature, setTemperature] = useState<number | null>(null);
    const [humidity, setHumidity] = useState<number | null>(null);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        console.log("Datos completos:", data);

        if (data && data.length > 0) {
            const lastReading = data[data.length - 1];
            console.log("Último dato recibido:", lastReading);

            if (lastReading.temperature !== undefined) {
                setTemperature(lastReading.temperature);
            } else {
                console.error("Temperatura no encontrada en el último dato");
            }

            if (lastReading.humidity !== undefined) {
                setHumidity(lastReading.humidity);
            } else {
                console.error("Humedad no encontrada en el último dato");
            }
        }
    }, [data]);


    // Mostrar estado de carga
    if (loading) {
        return (
            <View style={styles.container}>
                <ThemedText style={styles.loadingText}>
                    Cargando datos ambientales...
                </ThemedText>
            </View>
        );
    }

    // Mostrar error si existe
    if (error) {
        return (
            <View style={styles.container}>
                <ThemedText style={styles.errorText}>
                    Error al cargar los datos: {error.message}
                </ThemedText>
            </View>
        );
    }

    // Mostrar mensaje si no hay datos
    if (!data || data.length === 0) {
        return (
            <View style={styles.container}>
                <ThemedText style={styles.errorText}>{emptyMessage}</ThemedText>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ThemedText>Debug - Data: {JSON.stringify(data)}</ThemedText>
            <ThemedText style={styles.debugText}>
                Datos disponibles: {Array.isArray(data) ? data.length : 0}
            </ThemedText>
            <ThemedText style={styles.temperatureText}>
                {temperature !== null ? temperature.toFixed(1) : "--"}°C
            </ThemedText>
            <ThemedText style={styles.humidityText}>
                {humidity !== null ? humidity.toFixed(1) : "--"}%
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "grey",
    },
    card: {
        backgroundColor: "white",
        borderRadius: 15,
        padding: 30,
        width: "100%",
        maxWidth: 400,
        // height: '80%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 10,
        color: "#0066cc",
    },
    readingsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 20,
    },
    temperatureContainer: {
        alignItems: "center",
    },
    humidityContainer: {
        alignItems: "center",
    },
    temperatureText: {
        fontSize: 72,
        fontWeight: "bold",
        color: "#333",
        includeFontPadding: false,
        textAlignVertical: "center",
        lineHeight: 85,
    },
    humidityText: {
        fontSize: 48,
        fontWeight: "bold",
        color: "#33b5e5",
        includeFontPadding: false,
        textAlignVertical: "center",
        lineHeight: 60,
    },
    label: {
        fontSize: 16,
        color: "#666",
        marginTop: 5,
    },
    statusContainer: {
        alignItems: "center",
        marginTop: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#f8f9fa",
    },
    statusText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    lastUpdate: {
        fontSize: 12,
        color: "#666",
        textAlign: "center",
        marginTop: 10,
    },
    loadingText: {
        fontSize: 16,
        color: "#666",
    },
    errorText: {
        fontSize: 16,
        color: "#ff4444",
    },
    debugText: {
        fontSize: 14,
        color: "#666",
        marginBottom: 20,
    },
});
