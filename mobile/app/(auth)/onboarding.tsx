/**
 * Onboarding Screen - Muse taste profile setup
 * TODO: Implement conversational taste profile setup
 */
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const router = useRouter();

  const handleSkip = () => {
    router.replace('/(tabs)/library');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Chapters</Text>
        <Text style={styles.description}>
          Let's set up your taste profile with Muse.{'\n\n'}
          This will help us recommend chapters you'll love.
        </Text>

        <Text style={styles.note}>
          (Taste profile setup coming soon)
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleSkip}>
          <Text style={styles.buttonText}>Continue to Library</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '300',
    color: '#2C2416',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 1,
  },
  description: {
    fontSize: 16,
    color: '#5C4A3A',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  note: {
    fontSize: 14,
    color: '#8B7355',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#2C2416',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#F5F1E8',
    fontSize: 16,
    fontWeight: '600',
  },
});
