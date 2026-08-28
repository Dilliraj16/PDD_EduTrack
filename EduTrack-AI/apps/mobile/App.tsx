import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, KeyboardAvoidingView, Platform, View, TouchableOpacity, Text } from 'react-native';
import { useState } from 'react';
import StudentDashboard from './src/screens/StudentDashboard';
import FacultyDashboard from './src/screens/FacultyDashboard';
// @ts-ignore
import './global.css';

export default function App() {
  const [activeRole, setActiveRole] = useState<'student' | 'faculty'>('student');

  return (
    <SafeAreaView style={styles.container}>
      {/* Universal Developer Tab Switcher */}
      <View className="flex-row justify-center items-center w-full px-4 pt-10 pb-4 bg-[#0f172a] shadow-xl z-50 border-b border-white/10 mt-6">
        <TouchableOpacity
          onPress={() => setActiveRole('student')}
          className={`flex-1 mx-2 py-3 rounded-2xl flex-row items-center justify-center ${activeRole === 'student' ? 'bg-blue-600 shadow-lg shadow-blue-500/30' : 'bg-white/5 border border-white/10'}`}
        >
          <Text className={`font-bold uppercase text-xs tracking-wider ${activeRole === 'student' ? 'text-white' : 'text-gray-400'}`}>Student Side</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveRole('faculty')}
          className={`flex-1 mx-2 py-3 rounded-2xl flex-row items-center justify-center ${activeRole === 'faculty' ? 'bg-purple-600 shadow-lg shadow-purple-500/30' : 'bg-white/5 border border-white/10'}`}
        >
          <Text className={`font-bold uppercase text-xs tracking-wider ${activeRole === 'faculty' ? 'text-white' : 'text-gray-400'}`}>Faculty Side</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: '100%' }}
      >
        {activeRole === 'student' ? <StudentDashboard /> : <FacultyDashboard />}
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
