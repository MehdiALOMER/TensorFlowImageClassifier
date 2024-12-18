import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

interface Props {
    onImageSelected: (uri: string) => void;
}

const ImagePicker = ({ onImageSelected }: Props) => {
    const pickImage = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
        });

        if (result.assets && result.assets[0].uri) {
            onImageSelected(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Görüntü Seç" onPress={pickImage} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
});

export default ImagePicker;