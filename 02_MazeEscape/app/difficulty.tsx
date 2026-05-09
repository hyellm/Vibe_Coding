import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import DifficultySelector from '../components/DifficultySelector';
import { Difficulty } from '../types/game';
import { loadLastDifficulty, saveLastDifficulty } from '../utils/gameLogic';

export default function DifficultyScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<Difficulty>('normal');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    loadLastDifficulty().then((d) => {
      if (d) setSelected(d);
    });

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleStart = async () => {
    await saveLastDifficulty(selected);
    router.push({ pathname: '/game', params: { difficulty: selected } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.subtitle}>SELECT</Text>
          <Text style={styles.title}>DIFFICULTY</Text>
        </View>

        <DifficultySelector selected={selected} onSelect={setSelected} />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleStart}
          style={styles.btnWrapper}
        >
          <LinearGradient
            colors={['#7b2ff7', '#4a6cf7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btn}
          >
            <Text style={styles.btnText}>START →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e1a',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 28,
  },
  backBtn: {
    alignSelf: 'flex-start',
  },
  backText: {
    color: '#4a6aaa',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 2,
  },
  header: {
    gap: 4,
  },
  subtitle: {
    color: '#4a6aaa',
    fontSize: 11,
    letterSpacing: 4,
    fontWeight: '600',
  },
  title: {
    color: '#e0ecff',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 4,
  },
  btnWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#7b2ff7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
    marginTop: 'auto',
    marginBottom: 16,
  },
  btn: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 16,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 3,
  },
});
