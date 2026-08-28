import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Student {
    id: string;
    name: string;
    reg_no: string;
    present: boolean;
}

const mockRoster: Student[] = [
    { id: '1', name: 'John Doe', reg_no: 'CS1023', present: true },
    { id: '2', name: 'Jane Smith', reg_no: 'CS1024', present: true },
    { id: '3', name: 'Alice Walker', reg_no: 'CS1025', present: false },
    { id: '4', name: 'Bob Richards', reg_no: 'CS1026', present: false },
];

export default function AttendanceScreen({ onBack }: { onBack: () => void }) {
    const [roster, setRoster] = useState<Student[]>(mockRoster);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const toggleAttendance = (id: string, present: boolean) => {
        setRoster(prev => prev.map(s => s.id === id ? { ...s, present } : s));
    };

    const presentCount = roster.filter(s => s.present).length;

    return (
        <SafeAreaView className="flex-1 bg-[#101827]">
            <View className="flex-row items-center justify-between p-4 border-b border-white/5">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={onBack} className="mr-4 p-2 rounded-full bg-white/5 border border-white/10">
                        <Ionicons name="arrow-back" size={20} color="#fff" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-white">Attendance</Text>
                </View>
            </View>

            <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 100 }}>
                <View className="mb-6">
                    <Text className="text-3xl font-extrabold text-white mb-2 shadow-sm">Mark Attendance</Text>
                    <Text className="text-gray-400 font-semibold text-sm">Computer Networks - Fall 2026 Batch - CS Section A</Text>
                </View>

                <View className="bg-[#1a233a] rounded-3xl p-4 border border-white/5">
                    <View className="flex-row justify-between items-center mb-6 pt-2 px-2">
                        <View className="flex-row items-center">
                            <Ionicons name="people-outline" size={20} color="#d8b4fe" />
                            <Text className="text-white font-bold text-lg ml-2">Student Roster</Text>
                        </View>
                        <View className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                            <Text className="text-gray-400 text-xs font-bold">{presentCount} Present / {roster.length} Total</Text>
                        </View>
                    </View>

                    {roster.map((student, idx) => (
                        <View key={student.id} className={`flex-row items-center justify-between p-4 border-b border-white/5 relative ${idx === 0 ? 'border-t border-white/5' : ''}`}>
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-full bg-indigo-900/40 border border-indigo-500/20 items-center justify-center mr-4">
                                    <Text className="text-indigo-300 font-bold uppercase">{student.name.charAt(0)}</Text>
                                </View>
                                <View>
                                    <Text className="text-white font-bold text-base">{student.name}</Text>
                                    <Text className="text-gray-500 text-xs font-mono">{student.reg_no}</Text>
                                </View>
                            </View>
                            <View className="flex-row items-center gap-2">
                                <TouchableOpacity
                                    onPress={() => toggleAttendance(student.id, true)}
                                    className={`w-9 h-9 rounded-xl items-center justify-center border ${student.present ? 'bg-emerald-500 border-emerald-400' : 'bg-transparent border-white/10'}`}
                                >
                                    <Ionicons name="checkmark" size={18} color={student.present ? '#fff' : '#64748b'} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => toggleAttendance(student.id, false)}
                                    className={`w-9 h-9 rounded-xl items-center justify-center border ${!student.present ? 'bg-rose-500 border-rose-400' : 'bg-transparent border-white/10'}`}
                                >
                                    <Ionicons name="close" size={18} color={!student.present ? '#fff' : '#64748b'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    <View className="pt-6 pb-2 items-end px-2">
                        <TouchableOpacity
                            onPress={() => {
                                setIsSubmitted(true);
                                setTimeout(() => {
                                    if (onBack) onBack();
                                }, 1500);
                            }}
                            disabled={isSubmitted}
                            className={`px-6 py-4 rounded-xl flex-row items-center shadow-lg ${isSubmitted ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-gradient-to-r from-fuchsia-600 to-pink-600 shadow-pink-500/30'}`}
                        >
                            {isSubmitted ? (
                                <>
                                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                                    <Text className="text-white font-bold text-sm tracking-wide ml-2">Successfully marked</Text>
                                </>
                            ) : (
                                <Text className="text-white font-bold text-sm tracking-wide">Submit Roster Updates</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
