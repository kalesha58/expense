import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Button } from './Button';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';

// Update the value type to allow for file info
interface ReceiptFile {
  uri: string;
  name?: string;
  mimeType?: string;
}

interface ReceiptUploadProps {
  value: ReceiptFile[];
  onChange: (files: ReceiptFile[]) => void;
  label?: string;
}

function isPdf(file: ReceiptFile): boolean {
  if (!file) return false;
  if (file.mimeType && file.mimeType === 'application/pdf') return true;
  if (file.name && file.name.toLowerCase().endsWith('.pdf')) return true;
  if (file.uri && file.uri.toLowerCase().includes('.pdf')) return true;
  return false;
}

export const ReceiptUpload: React.FC<ReceiptUploadProps> = ({ value = [], onChange, label = 'Receipts' }) => {
  // Add image(s)
  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Media library permission is required to upload a receipt.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
        allowsMultipleSelection: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newFiles = result.assets.map(asset => ({
          uri: asset.uri,
          name: asset.fileName || undefined,
          mimeType: asset.type || undefined,
        }));
        onChange([...value, ...newFiles]);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open image library.');
    }
  };

  // Add photo from camera
  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required to take a photo.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        onChange([...value, {
          uri: asset.uri,
          name: asset.fileName || undefined,
          mimeType: asset.type || undefined,
        }]);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open camera.');
    }
  };

  // Add PDF
  const handlePickPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      if (result && !result.canceled && (result as any).uri) {
        onChange([...value, { uri: (result as any).uri, name: (result as any).name || undefined, mimeType: (result as any).mimeType || undefined }]);
      } else if (result && 'assets' in result && Array.isArray((result as any).assets) && (result as any).assets.length > 0) {
        const asset = (result as any).assets[0];
        onChange([...value, { uri: asset.uri, name: asset.name || undefined, mimeType: asset.mimeType || undefined }]);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open document picker.');
    }
  };

  // Remove file
  const handleRemove = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  // Share PDF
  const handleSharePdf = async (file: ReceiptFile) => {
    try {
      await Sharing.shareAsync(file.uri);
    } catch (error) {
      Alert.alert('Error', 'Could not share PDF.');
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.filesContainer}>
        {value.map((file, idx) => (
          isPdf(file) ? (
            <View style={styles.pdfContainer} key={file.uri + idx}>
              <Feather name="file-text" size={40} color="#0572CE" />
              <Text style={styles.pdfFilename} numberOfLines={1}>{file.name || file.uri.split('/').pop()}</Text>
              <TouchableOpacity style={styles.sharePdfButton} onPress={() => handleSharePdf(file)}>
                <Feather name="share-2" size={32} color="#fff" style={styles.sharePdfIcon} />
              </TouchableOpacity>
              <Text style={styles.sharePdfLabel}>Share PDF</Text>
              <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(idx)}>
                <Feather name="x" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imageContainer} key={file.uri + idx}>
              <Image source={{ uri: file.uri }} style={styles.image} resizeMode="cover" />
              <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(idx)}>
                <Feather name="x" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )
        ))}
      </View>
      <View style={styles.uploadContainer}>
        <Button
          title="Take Photo"
          onPress={handleTakePhoto}
          variant="outline"
          leftIcon={<Feather name="camera" size={18} color="#0572CE" />}
          style={styles.uploadButton}
        />
        <Button
          title="Upload Images"
          onPress={handlePickImage}
          variant="outline"
          leftIcon={<Feather name="upload" size={18} color="#0572CE" />}
          style={styles.uploadButton}
        />
        <Button
          title="Upload PDF"
          onPress={handlePickPdf}
          variant="outline"
          leftIcon={<Feather name="file-text" size={18} color="#0572CE" />}
          style={styles.uploadButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 16,
    fontWeight: '500',
  },
  filesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 4,
    marginRight: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pdfContainer: {
    width: 110,
    height: 110,
    borderRadius: 16,
    borderWidth: 0,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0572CE22',
    marginBottom: 8,
    marginRight: 12,
    shadowColor: '#0572CE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  pdfFilename: {
    marginTop: 8,
    fontSize: 12,
    color: '#0572CE',
    textAlign: 'center',
    maxWidth: 100,
    fontWeight: '600',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F5222D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadContainer: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  uploadButton: {
    flex: 1,
    marginTop: 0,
    marginBottom: 0,
    minWidth: 120,
  },
  viewPdfButton: {
    marginTop: 4,
    width: 80,
    alignSelf: 'center',
  },
  sharePdfButton: {
    backgroundColor: '#0572CE',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
    shadowColor: '#0572CE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  sharePdfIcon: {
    alignSelf: 'center',
  },
  sharePdfLabel: {
    color: '#0572CE',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
}); 