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
          <Text style={styles.backText}>← 뒤로</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.subtitle}>선택</Text>
          <Text style={styles.title}>DIFFICULTY</Text>
        </View>

        <DifficultySelector selected={selected} onSelect={setSelected} />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleStart}
          style={styles.btnWrapper}
        >
          <LinearGradient
            colors={['#2e7d32', '#66bb6a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btn}
          >
            <Text style={styles.btnText}>시작 →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e3',
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
    color: '#3d6b3d',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 2,
  },
  header: {
    gap: 4,
  },
  subtitle: {
    color: '#3d6b3d',
    fontSize: 11,
    letterSpacing: 4,
    fontWeight: '600',
  },
  title: {
    color: '#1a3a1a',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 4,
  },
  btnWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#2e7d32',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
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
