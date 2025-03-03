import React, { useState } from "react";
import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    Modal,
    Platform,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { addDocument } from "../services/apiService";
import { IMedicine } from "@/interfaces/Medicine";

interface AddItemFormProps {
    collectionName: string;
    onSuccess?: () => void;
    visible: boolean;
    onClose: () => void;
}

export default function AddItemForm({
    collectionName,
    onSuccess,
    visible,
    onClose,
}: AddItemFormProps) {
    const [formData, setFormData] = useState<Partial<IMedicine>>({
        name: "",
        quantity: 0,
        description: "",
        expirationDate: new Date(),
    });
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleChange = (field: keyof IMedicine, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || formData.expirationDate;
        setShowDatePicker(Platform.OS === "ios");
        handleChange("expirationDate", currentDate);
    };

    const handleSubmit = async () => {
        if (!formData.name?.trim()) {
            Alert.alert("Error", "El nombre es obligatorio");
            return;
        }

        try {
            setLoading(true);
            await addDocument(collectionName, formData);
            Alert.alert("Éxito", "Medicamento añadido correctamente");
            setFormData({
                name: "",
                quantity: 0,
                description: "",
                expirationDate: new Date(),
            });
            if (onSuccess) {
                onSuccess();
            }
            onClose();
        } catch (error) {
            Alert.alert("Error", "No se pudo añadir el medicamento");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <ThemedView style={styles.container}>
                    <ThemedText style={styles.title}>
                        Añadir Medicamento
                    </ThemedText>

                    <View style={styles.formGroup}>
                        <ThemedText style={styles.label}>Nombre</ThemedText>
                        <TextInput
                            style={styles.input}
                            value={formData.name}
                            onChangeText={(value) =>
                                handleChange("name", value)
                            }
                            placeholder="Nombre del medicamento"
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <ThemedText style={styles.label}>Cantidad</ThemedText>
                        <TextInput
                            style={styles.input}
                            value={formData.quantity?.toString()}
                            onChangeText={(value) =>
                                handleChange("quantity", parseInt(value) || 0)
                            }
                            placeholder="Cantidad disponible"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <ThemedText style={styles.label}>
                            Descripción
                        </ThemedText>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={formData.description}
                            onChangeText={(value) =>
                                handleChange("description", value)
                            }
                            placeholder="Descripción del medicamento"
                            placeholderTextColor="#999"
                            multiline={true}
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                            disabled={loading}
                        >
                            <ThemedText style={styles.buttonText}>
                                Cancelar
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.submitButton,
                                loading && styles.disabledButton,
                            ]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            <ThemedText style={styles.buttonText}>
                                {loading ? "Guardando..." : "Guardar"}
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                </ThemedView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: 20,
    },
    container: {
        width: "100%",
        maxWidth: 500,
        padding: 20,
        borderRadius: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    formGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        backgroundColor: "#fff",
        color: "#333",
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: "top",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 5,
        alignItems: "center",
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: "#ccc",
    },
    submitButton: {
        backgroundColor: "#0066cc",
    },
    disabledButton: {
        opacity: 0.7,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    datePickerButton: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        padding: 12,
        backgroundColor: "#fff",
    },
    dateText: {
        fontSize: 16,
        color: "#333",
    },
});
