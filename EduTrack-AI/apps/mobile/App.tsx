import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import StudentDashboard from './src/screens/StudentDashboard';
// @ts-ignore
import './global.css';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: '100%' }}
      >
        <StudentDashboard />
      </KeyboardAvoidingView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});
