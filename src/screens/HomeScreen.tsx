import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Button, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import TensorFlowService from "../services/tensorflowService";

const HomeScreen = () => {
    const [isTfReady, setIsTfReady] = useState(false);
    const [mobilenetModel, setMobilenetModel] = useState<boolean>(false);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [predictions, setPredictions] = useState<any[] | null>(null);
    const tfService = new TensorFlowService();

    // Modeli yükleme
    useEffect(() => {
        (async () => {
            try {
                await tfService.loadModel();
                setMobilenetModel(true);
                setIsTfReady(true);
            } catch (error) {
                console.error("Model yükleme hatası:", error);
            }
        })();
    }, []);

    // Görüntü seçimi ve sınıflandırma
    const selectImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
        });

        if (!result.cancelled) {
            setImageUri(result.uri);
            setPredictions(null);
            try {
                const preds = await tfService.classifyImage(result.uri);
                setPredictions(preds);
            } catch (error) {
                console.error("Görüntü sınıflandırma hatası:", error);
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>TensorFlow Image Classifier</Text>
            <Text>TF Status: {isTfReady ? "👌" : "⏳"}</Text>
            <Text>Model Status: {mobilenetModel ? "👌" : "⏳"}</Text>

            {imageUri && (
                <Image source={{ uri: imageUri }} style={styles.image} />
            )}

            <Button
                title="Resim Seç ve Tahmin Et"
                onPress={selectImage}
                disabled={!mobilenetModel}
            />

            {predictions && (
                <View style={styles.predictions}>
                    {predictions.map((pred, index) => (
                        <Text key={index}>
                            {pred.className}: {(pred.probability * 100).toFixed(2)}%
                        </Text>
                    ))}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: "center",
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    image: {
        width: 200,
        height: 200,
        marginVertical: 10,
    },
    predictions: {
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        width: "90%",
        borderRadius: 5,
    },
});

export default HomeScreen;