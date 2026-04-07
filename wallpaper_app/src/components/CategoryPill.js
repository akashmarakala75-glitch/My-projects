import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export function CategoryPill({ label, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, active ? styles.pillActive : styles.pillInactive]}
    >
      <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    marginRight: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillActive: {
    backgroundColor: '#c8f1ff',
    borderColor: '#c8f1ff',
  },
  pillInactive: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.12)',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
  labelActive: {
    color: '#07111c',
  },
  labelInactive: {
    color: '#d6e7f5',
  },
});