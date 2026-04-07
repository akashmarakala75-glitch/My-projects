import React from 'react';
import { Animated, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CARD_HEIGHT = 232;
const CARD_SPACING = 22;

export function WallpaperCard({
  item,
  index,
  scrollY,
  screenWidth,
  isFavorite,
  onToggleFavorite,
  onOpen,
}) {
  const inputRange = [
    -1,
    0,
    (CARD_HEIGHT + CARD_SPACING) * index,
    (CARD_HEIGHT + CARD_SPACING) * (index + 2),
  ];

  const translateY = scrollY.interpolate({
    inputRange,
    outputRange: [0, 0, 0, -18],
    extrapolate: 'clamp',
  });

  const scale = scrollY.interpolate({
    inputRange,
    outputRange: [1, 1, 1, 0.95],
    extrapolate: 'clamp',
  });

  const rotateX = scrollY.interpolate({
    inputRange,
    outputRange: ['0deg', '0deg', '0deg', '9deg'],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.cardShell,
        {
          width: screenWidth - 40,
          transform: [{ perspective: 900 }, { translateY }, { scale }, { rotateX }],
        },
      ]}
    >
      <Pressable onPress={onOpen} style={styles.cardPressable}>
        <ImageBackground source={{ uri: item.image }} imageStyle={styles.imageStyle} style={styles.imageWrap}>
          <LinearGradient colors={['rgba(5,11,18,0.10)', 'rgba(5,11,18,0.88)']} style={styles.overlay}>
            <View style={[styles.floatingGlow, { backgroundColor: item.glow }]} />

            <View style={styles.topRow}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>{item.category}</Text>
              </View>

              <Pressable onPress={onToggleFavorite} style={styles.favoriteButton}>
                <Text style={styles.favoriteButtonText}>{isFavorite ? 'Saved' : 'Save'}</Text>
              </Pressable>
            </View>

            <View style={styles.bottomContent}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.description}</Text>

              <View style={styles.metaRow}>
                <View style={styles.metaChip}>
                  <Text style={styles.metaValue}>{item.depth}</Text>
                  <Text style={styles.metaLabel}>Depth</Text>
                </View>
                <View style={styles.metaChip}>
                  <Text style={styles.metaValue}>{item.resolution}</Text>
                  <Text style={styles.metaLabel}>Display</Text>
                </View>
                <View style={styles.metaChip}>
                  <Text style={styles.metaValue}>{item.rating}</Text>
                  <Text style={styles.metaLabel}>Score</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardShell: {
    height: CARD_HEIGHT,
    marginBottom: CARD_SPACING,
    borderRadius: 30,
    shadowColor: '#01060a',
    shadowOpacity: 0.26,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 },
    elevation: 18,
  },
  cardPressable: {
    flex: 1,
    borderRadius: 30,
    overflow: 'hidden',
  },
  imageWrap: {
    flex: 1,
    backgroundColor: '#102232',
  },
  imageStyle: {
    borderRadius: 30,
  },
  overlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  floatingGlow: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 999,
    top: 18,
    right: -10,
    opacity: 0.25,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  typeBadgeText: {
    color: '#f8fdff',
    fontWeight: '700',
    fontSize: 12,
  },
  favoriteButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(3, 12, 19, 0.42)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  favoriteButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  bottomContent: {
    gap: 10,
  },
  title: {
    color: '#f3fbff',
    fontSize: 28,
    lineHeight: 31,
    fontWeight: '800',
    width: '70%',
  },
  subtitle: {
    color: '#d5e9fb',
    fontSize: 13,
    lineHeight: 20,
    width: '78%',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  metaChip: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 16,
    padding: 12,
  },
  metaValue: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 12,
  },
  metaLabel: {
    color: '#d5e9fb',
    fontSize: 10,
    marginTop: 4,
  },
});