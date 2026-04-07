import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Modal,
  NativeModules,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

const wallpaperNativeModule = NativeModules.WallPaperManager;

export function PreviewModal({ visible, wallpaper, isFavorite, onClose, onToggleFavorite }) {
  const [isApplying, setIsApplying] = useState(false);

  const downloadWallpaperAsync = async () => {
    if (!wallpaper || !FileSystem.cacheDirectory) {
      throw new Error('Wallpaper storage is not available on this device.');
    }

    const targetUri = `${FileSystem.cacheDirectory}${wallpaper.id}.jpg`;
    const { uri } = await FileSystem.downloadAsync(wallpaper.image, targetUri);
    return uri;
  };

  const saveToLibraryAsync = async (fileUri) => {
    const permission = await MediaLibrary.requestPermissionsAsync();

    if (permission.status !== 'granted') {
      throw new Error('Media library permission was denied.');
    }

    const asset = await MediaLibrary.createAssetAsync(fileUri);
    return asset.uri;
  };

  const handleApplyWallpaper = async () => {
    if (!wallpaper || isApplying) {
      return;
    }

    setIsApplying(true);

    try {
      const fileUri = await downloadWallpaperAsync();

      if (Platform.OS === 'android') {
        if (wallpaperNativeModule?.setWallpaper) {
          const result = await new Promise((resolve) => {
            wallpaperNativeModule.setWallpaper({ uri: fileUri }, (response) => {
              resolve(response);
            });
          });

          if (result?.status === 'success') {
            Alert.alert('Wallpaper Applied', 'The wallpaper was changed directly on your Android device.');
            return;
          }

          throw new Error(result?.msg || 'The Android wallpaper module could not apply this image.');
        }

        await saveToLibraryAsync(fileUri);

        Alert.alert(
          'Native Build Required',
          'Direct wallpaper setting only works in the generated Android app build. This image was saved so you can still apply it manually.'
        );
        return;
      }

      const savedUri = await saveToLibraryAsync(fileUri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(savedUri || fileUri);
      }

      Alert.alert(
        'Saved To Photos',
        'iPhone does not allow Expo apps to change the wallpaper directly. The image was saved so you can apply it from Photos.'
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to apply wallpaper right now.';
      Alert.alert('Apply Failed', message);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {wallpaper ? (
            <>
              <ImageBackground source={{ uri: wallpaper.image }} style={styles.previewImage} imageStyle={styles.previewImageStyle}>
                <LinearGradient colors={['rgba(2,8,14,0.05)', 'rgba(2,8,14,0.82)']} style={styles.previewOverlay}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTag}>Live Preview</Text>
                    <Pressable onPress={onClose} style={styles.closeButton}>
                      <Text style={styles.closeButtonText}>Close</Text>
                    </Pressable>
                  </View>

                  <View style={styles.modalHeroContent}>
                    <Text style={styles.modalTitle}>{wallpaper.title}</Text>
                    <Text style={styles.modalSubtitle}>{wallpaper.description}</Text>
                  </View>
                </LinearGradient>
              </ImageBackground>

              <ScrollView contentContainerStyle={styles.detailsContent} showsVerticalScrollIndicator={false}>
                <View style={styles.infoCard}>
                  <Text style={styles.infoTitle}>Project Highlights</Text>
                  <Text style={styles.infoBody}>
                    This concept simulates a 3D wallpaper browsing experience using layered gradients, image depth,
                    perspective transforms, category filtering, preview actions, and a favorites system.
                  </Text>
                </View>

                <View style={styles.metricRow}>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>{wallpaper.category}</Text>
                    <Text style={styles.metricLabel}>Theme</Text>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>{wallpaper.depth}</Text>
                    <Text style={styles.metricLabel}>Depth</Text>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>{wallpaper.resolution}</Text>
                    <Text style={styles.metricLabel}>Resolution</Text>
                  </View>
                </View>

                <View style={styles.actionRow}>
                  <Pressable onPress={handleApplyWallpaper} disabled={isApplying} style={[styles.primaryAction, isApplying && styles.primaryActionDisabled]}>
                    {isApplying ? (
                      <View style={styles.loadingRow}>
                        <ActivityIndicator size="small" color="#061019" />
                        <Text style={styles.primaryActionText}>Applying...</Text>
                      </View>
                    ) : (
                      <Text style={styles.primaryActionText}>Apply Wallpaper</Text>
                    )}
                  </Pressable>
                  <Pressable onPress={onToggleFavorite} style={styles.secondaryAction}>
                    <Text style={styles.secondaryActionText}>{isFavorite ? 'Remove Favorite' : 'Save Favorite'}</Text>
                  </Pressable>
                </View>
              </ScrollView>
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(1, 8, 13, 0.78)',
    justifyContent: 'flex-end',
  },
  sheet: {
    height: '90%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#08131d',
  },
  previewImage: {
    height: 340,
    justifyContent: 'flex-end',
  },
  previewImageStyle: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  previewOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
  },
  modalTag: {
    color: '#f2f8fd',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  closeButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(1, 8, 13, 0.40)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  closeButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  modalHeroContent: {
    gap: 8,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '800',
    width: '75%',
  },
  modalSubtitle: {
    color: '#d8ebfb',
    fontSize: 14,
    lineHeight: 21,
    width: '78%',
  },
  detailsContent: {
    padding: 20,
    gap: 16,
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  infoTitle: {
    color: '#f5fbff',
    fontWeight: '800',
    fontSize: 17,
    marginBottom: 10,
  },
  infoBody: {
    color: '#a9c1d3',
    fontSize: 13,
    lineHeight: 21,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#10202e',
    borderRadius: 18,
    padding: 16,
  },
  metricValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  metricLabel: {
    color: '#85a4b7',
    fontSize: 11,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  primaryAction: {
    flex: 1.15,
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: '#d6f7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionDisabled: {
    opacity: 0.72,
  },
  primaryActionText: {
    color: '#061019',
    fontWeight: '800',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  secondaryAction: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  secondaryActionText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});