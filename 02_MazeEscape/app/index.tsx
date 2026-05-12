import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function StartScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.4, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.bgCircle, styles.bgCircle1, { opacity: glowAnim }]} />
      <Animated.View style={[styles.bgCircle, styles.bgCircle2, { opacity: glowAnim }]} />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.subtitle}>— 퍼즐 게임 —</Text>
          <Text style={styles.title}>MAZE</Text>
          <Text style={styles.titleAccent}>ESCAPE</Text>
          <Text style={styles.description}>
            미로를 헤쳐나가세요.{'\n'}출구에 도달해 탈출하세요.
          </Text>
        </View>

        <View style={styles.mazeDecor}>
          {Array.from({ length: 5 }).map((_, i) => (
            <View key={i} style={styles.decorRow}>
              {Array.from({ length: 5 }).map((_, j) => (
                <View
                  key={j}
                  style={[
                    styles.decorCell,
                    (i === 0 && j === 0) && styles.decorStart,
                    (i === 4 && j === 4) && styles.decorGoal,
                  ]}
                />
              ))}
            </View>
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/difficulty')}
          style={styles.btnWrapper}
        >
          <LinearGradient
            colors={['#2e7d32', '#66bb6a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btn}
          >
            <Text style={styles.btnText}>게임 시작</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgCircle: {
    position: 'absolute',
    borderRadius: 9999,
  },
  bgCircle1: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: 'rgba(46, 125, 50, 0.07)',
    top: -width * 0.2,
    left: -width * 0.2,
  },
  bgCircle2: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: 'rgba(102, 187, 106, 0.07)',
    bottom: -width * 0.1,
    right: -width * 0.1,
  },
  content: {
    width: '100%',
    paddingHorizontal: 32,
    alignItems: 'center',
    gap: 32,
  },
  titleContainer: {
    alignItems: 'center',
    gap: 8,
  },
  subtitle: {
    color: '#3d6b3d',
    fontSize: 11,
    letterSpacing: 4,
    fontWeight: '600',
  },
  title: {
    color: '#1a3a1a',
    fontSize: 56,
    fontWeight: '800',
    letterSpacing: 8,
    lineHeight: 60,
  },
  titleAccent: {
    color: '#2e7d32',
    fontSize: 56,
    fontWeight: '800',
    letterSpacing: 8,
    lineHeight: 60,
  },
  description: {
    color: '#3d6b3d',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
  },
  mazeDecor: {
    gap: 3,
    opacity: 0.6,
  },
  decorRow: {
    flexDirection: 'row',
    gap: 3,
  },
  decorCell: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(30,92,40,0.2)',
  },
  decorStart: {
    backgroundColor: 'rgba(30,140,60,0.25)',
    borderColor: '#1e8c3c',
  },
  decorGoal: {
    backgroundColor: 'rgba(255,160,0,0.25)',
    borderColor: '#ffa000',
  },
  btnWrapper: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#2e7d32',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
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
