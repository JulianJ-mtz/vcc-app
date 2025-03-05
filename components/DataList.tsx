import React from "react";
import {
    View,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    ListRenderItem,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useCollection } from "@/hooks/useCollection";
import { Ionicons } from "@expo/vector-icons";
import { ApiDocument } from "@/services/apiService";

interface DataListProps {
    collectionName: string;
    renderItem?: ListRenderItem<ApiDocument>;
    realtime?: boolean;
    onItemPress?: (item: ApiDocument) => void;
    emptyMessage?: string;
}

export default function DataList({
    collectionName,
    renderItem,
    realtime = false,
    onItemPress,
    emptyMessage = "No hay datos disponibles",
}: DataListProps) {
    const { data, loading, error, refresh } = useCollection(
        collectionName,
        realtime
    );

    // Renderizado por defecto de cada item
    const defaultRenderItem: ListRenderItem<ApiDocument> = ({ item }) => (
        <TouchableOpacity
            onPress={() => onItemPress && onItemPress(item)}
            style={styles.itemContainer}
        >
            <ThemedView style={styles.item}>
                <View style={styles.itemContent}>
                    <ThemedText style={styles.itemTitle}>
                        {item.title || item.name || item.id || "Sin título"}
                    </ThemedText>
                    {item.description && (
                        <ThemedText style={styles.itemDescription}>
                            {item.description}
                        </ThemedText>
                    )}

                    <View style={styles.itemDetails}>
                        {item.quantity !== undefined && (
                            <View style={styles.detailBadge}>
                                <Ionicons
                                    name="cube-outline"
                                    size={14}
                                    color="#0066cc"
                                />
                                <ThemedText style={styles.detailText}>
                                    Cant: {item.quantity}
                                </ThemedText>
                            </View>
                        )}

                        {item.price !== undefined && (
                            <View style={styles.detailBadge}>
                                <Ionicons
                                    name="pricetag-outline"
                                    size={14}
                                    color="#27ae60"
                                />
                                <ThemedText style={styles.detailText}>
                                    ${item.price}
                                </ThemedText>
                            </View>
                        )}

                        {item.expirationDate && (
                            <View style={styles.detailBadge}>
                                <Ionicons
                                    name="calendar-outline"
                                    size={14}
                                    color="#e74c3c"
                                />
                                <ThemedText style={styles.detailText}>
                                    {new Date(
                                        item.expirationDate
                                    ).toLocaleDateString()}
                                </ThemedText>
                            </View>
                        )}
                    </View>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
            </ThemedView>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0000ff" />
                <ThemedText style={styles.loadingText}>
                    Cargando datos...
                </ThemedText>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <ThemedText style={styles.errorText}>
                    Error al cargar datos: {error.message}
                </ThemedText>
                <TouchableOpacity onPress={refresh} style={styles.retryButton}>
                    <ThemedText style={styles.retryText}>Reintentar</ThemedText>
                </TouchableOpacity>
            </View>
        );
    }

    if (data.length === 0) {
        return (
            <View style={styles.centered}>
                <ThemedText style={styles.emptyText}>{emptyMessage}</ThemedText>
            </View>
        );
    }

    return (
        <FlatList
            data={data}
            renderItem={renderItem || defaultRenderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            onRefresh={refresh}
            refreshing={loading}
        />
    );
}

const styles = StyleSheet.create({
    list: {
        padding: 5,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#34495e",
    },
    errorText: {
        color: "#e74c3c",
        textAlign: "center",
        marginBottom: 15,
    },
    emptyText: {
        textAlign: "center",
        fontSize: 16,
        color: "#7f8c8d",
    },
    retryButton: {
        backgroundColor: "#0066cc",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    retryText: {
        color: "white",
        fontWeight: "bold",
    },
    itemContainer: {
        marginBottom: 10,
    },
    item: {
        padding: 16,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 17,
        fontWeight: "bold",
        marginBottom: 4,
        color: "#2c3e50",
    },
    itemDescription: {
        fontSize: 14,
        color: "#7f8c8d",
        marginBottom: 8,
    },
    itemDetails: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 4,
    },
    detailBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        marginRight: 8,
        marginBottom: 4,
    },
    detailText: {
        fontSize: 12,
        marginLeft: 4,
        color: "#34495e",
    },
});
