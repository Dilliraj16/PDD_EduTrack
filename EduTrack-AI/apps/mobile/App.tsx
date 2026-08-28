import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, KeyboardAvoidingView, Platform, View, TouchableOpacity, Text } from 'react-native';
import { useAuthStore } from './src/store/authStore';
import StudentDashboard from './src/screens/StudentDashboard';
import FacultyDashboard from './src/screens/FacultyDashboard';
import LoginScreen from './src/screens/LoginScreen';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

// Disable strict mode for Reanimated 4.5.x to prevent NativeWind from flooding the console and freezing the UI
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// @ts-ignore
import './global.css';

if (Platform.OS === 'web') {
  // Fix for NativeWind v4 Web dark mode bug 
  // Error: Cannot manually set color scheme, as dark mode is type 'media'
  (StyleSheet as any).setFlag?.('darkMode', 'class');
}

export default function App() {
  const { user, role, logout } = useAuthStore();

  if (!user) {
    return (
      <SafeAreaProvider style={{ flex: 1 }}>
        <LoginScreen />
        <StatusBar style="light" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View className="absolute top-12 right-4 z-50">
          <TouchableOpacity onPress={logout} className="p-2 rounded-full bg-red-500/20 border border-red-500/30">
            <Text className="text-red-400 text-xs font-bold uppercase">Exit</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, width: '100%' }}
        >
          {role === 'student' ? <StudentDashboard /> : <FacultyDashboard />}
        </KeyboardAvoidingView>
        <StatusBar style="light" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});
