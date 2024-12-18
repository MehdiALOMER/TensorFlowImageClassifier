import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as FileSystem from "expo-file-system";

export default class TensorFlowService {
    private model: mobilenet.MobileNet | null = null;

    // TensorFlow modelini yükleme
    async loadModel() {
        await tf.ready();
        if (!this.model) {
            this.model = await mobilenet.load();
        }
        return this.model;
    }

    // Görüntüyü sınıflandırma
    async classifyImage(imgUri: string) {
        if (!this.model) {
            throw new Error("Model yüklenmedi!");
        }

        const imgB64 = await FileSystem.readAsStringAsync(imgUri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        const imgBuffer = tf.util.encodeString(imgB64, "base64").buffer;
        const rawImageData = new Uint8Array(imgBuffer);
        const imageTensor = decodeJpeg(rawImageData);
        const predictions = await this.model.classify(imageTensor);
        return predictions;
    }
}