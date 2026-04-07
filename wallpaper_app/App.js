import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { wallpapers, wallpaperCategories } from './src/data/wallpapers';
import { WallpaperCard } from './src/components/WallpaperCard';
import { CategoryPill } from './src/components/CategoryPill';
import { PreviewModal } from './src/components/PreviewModal';

const { width } = Dimensions.get('window');

export default function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [selectedWallpaper, setSelectedWallpaper] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const filteredWallpapers = useMemo(() => {
    if (activeCategory === 'All') {
      return wallpapers;
    }

    return wallpapers.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const featuredWallpaper = filteredWallpapers[0] || wallpapers[0];

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id]
    );
  };

  return (
    <LinearGradient colors={['#07111c', '#0d2236', '#09131d']} style={styles.appShell}>
      <ExpoStatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.backgroundOrbTop} />
        <View style={styles.backgroundOrbBottom} />

        <Animated.FlatList
          data={filteredWallpapers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          ListHeaderComponent={
            <View>
              <View style={styles.headerRow}>
                <View>
                  <Text style={styles.brandLabel}>DEPTHSCAPE</Text>
                  <Text style={styles.heroTitle}>3D Wallpaper Studio</Text>
                  <Text style={styles.heroSubtitle}>
                    Explore layered, cinematic wallpapers with a pseudo-3D gallery feel.
                  </Text>
                </View>

                <View style={styles.badgeCard}>
                  <Text style={styles.badgeNumber}>{favorites.length.toString().padStart(2, '0')}</Text>
                  <Text style={styles.badgeLabel}>Favorites</Text>
                </View>
              </View>

              <Pressable onPress={() => setSelectedWallpaper(featuredWallpaper)} style={styles.featuredWrap}>
                <LinearGradient
                  colors={featuredWallpaper.overlay}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.featuredGradient}
                >
                  <Text style={styles.featuredTag}>Featured Scene</Text>
                  <Text style={styles.featuredTitle}>{featuredWallpaper.title}</Text>
                  <Text style={styles.featuredMeta}>
                    {featuredWallpaper.category}  |  {featuredWallpaper.resolution}
                  </Text>

                  <View style={styles.featuredStatsRow}>
                    <View style={styles.statChip}>
                      <Text style={styles.statValue}>{featuredWallpaper.depth}</Text>
                      <Text style={styles.statLabel}>Depth</Text>
                    </View>
                    <View style={styles.statChip}>
                      <Text style={styles.statValue}>{featuredWallpaper.rating}</Text>
                      <Text style={styles.statLabel}>Rating</Text>
                    </View>
                    <View style={styles.statChipWide}>
                      <Text style={styles.statValue}>Tap To Preview</Text>
                      <Text style={styles.statLabel}>Presentation Mode</Text>
                    </View>
                  </View>
                </LinearGradient>
              </Pressable>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryRow}
              >
                {wallpaperCategories.map((category) => (
                  <CategoryPill
                    key={category}
                    label={category}
                    active={category === activeCategory}
                    onPress={() => setActiveCategory(category)}
                  />
                ))}
              </ScrollView>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Wallpaper Collection</Text>
                <Text style={styles.sectionMeta}>{filteredWallpapers.length} designs</Text>
              </View>
            </View>
          }
          renderItem={({ item, index }) => (
            <WallpaperCard
              item={item}
              index={index}
              scrollY={scrollY}
              screenWidth={width}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              onOpen={() => setSelectedWallpaper(item)}
            />
          )}
          ListFooterComponent={<View style={styles.footerSpace} />}
        />

        <PreviewModal
          visible={Boolean(selectedWallpaper)}
          wallpaper={selectedWallpaper}
          isFavorite={selectedWallpaper ? favorites.includes(selectedWallpaper.id) : false}
          onClose={() => setSelectedWallpaper(null)}
          onToggleFavorite={() => {
            if (selectedWallpaper) {
              toggleFavorite(selectedWallpaper.id);
            }
          }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },
  backgroundOrbTop: {
    position: 'absolute',
    top: -120,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 140,
    backgroundColor: 'rgba(58, 153, 255, 0.18)',
  },
  backgroundOrbBottom: {
    position: 'absolute',
    bottom: 120,
    left: -90,
    width: 220,
    height: 220,
    borderRadius: 120,
    backgroundColor: 'rgba(62, 255, 211, 0.12)',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  brandLabel: {
    color: '#90d2ff',
    fontSize: 12,
    letterSpacing: 3,
    marginBottom: 12,
    fontWeight: '700',
  },
  heroTitle: {
    color: '#f3fbff',
    fontSize: 34,
    lineHeight: 39,
    fontWeight: '800',
    width: width * 0.58,
  },
  heroSubtitle: {
    color: '#9db2c2',
    marginTop: 12,
    fontSize: 14,
    lineHeight: 22,
    width: width * 0.62,
  },
  badgeCard: {
    minWidth: 92,
    alignSelf: 'flex-start',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  badgeNumber: {
    color: '#f3fbff',
    fontSize: 28,
    fontWeight: '800',
  },
  badgeLabel: {
    marginTop: 4,
    color: '#89a6b8',
    fontSize: 12,
  },
  featuredWrap: {
    marginTop: 26,
  },
  featuredGradient: {
    padding: 24,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    minHeight: 220,
    justifyContent: 'space-between',
    shadowColor: '#041018',
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 },
    elevation: 14,
  },
  featuredTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(8, 18, 28, 0.22)',
    color: '#f7fbff',
    fontSize: 12,
    fontWeight: '700',
  },
  featuredTitle: {
    marginTop: 32,
    color: '#ffffff',
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '800',
    width: '75%',
  },
  featuredMeta: {
    marginTop: 10,
    color: '#e4f2ff',
    fontSize: 13,
    letterSpacing: 0.6,
  },
  featuredStatsRow: {
    marginTop: 22,
    flexDirection: 'row',
    gap: 12,
  },
  statChip: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 18,
    padding: 14,
  },
  statChipWide: {
    flex: 1.4,
    backgroundColor: 'rgba(8, 18, 28, 0.22)',
    borderRadius: 18,
    padding: 14,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  statLabel: {
    color: '#dceeff',
    fontSize: 11,
    marginTop: 4,
  },
  categoryRow: {
    paddingVertical: 24,
  },
  sectionHeader: {
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#eff8ff',
    fontSize: 20,
    fontWeight: '800',
  },
  sectionMeta: {
    color: '#7ca0b6',
    fontSize: 13,
  },
  footerSpace: {
    height: 24,
  },
});