import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const availableCourses = [
    { id: 1, code: 'CS101', name: 'Intro to Computer Science', credits: 4, faculty: 'Dr. Alan Turing' },
    { id: 2, code: 'MATH201', name: 'Advanced Calculus', credits: 3, faculty: 'Dr. Euler' },
    { id: 3, code: 'PHY105', name: 'Quantum Physics', credits: 4, faculty: 'Dr. Feynman' },
    { id: 4, code: 'ENG102', name: 'Technical Writing', credits: 2, faculty: 'Prof. Strunk' },
    { id: 5, code: 'ECO101', name: 'Microeconomics', credits: 3, faculty: 'Dr. Smith' },
];

export default function EnrollmentScreen({ onBack }: { onBack?: () => void }) {
    const [enrolled, setEnrolled] = useState<(number | string)[]>([]);

    const handleEnroll = (id: number | string) => {
        if (!enrolled.includes(id)) {
            setEnrolled(prev => [...prev, id]);
        }
    };

    return (
        <ScrollView className="flex-1 px-4 pt-4 pb-12 w-full h-full">
            <View className="flex-row items-center mb-6">
                {onBack && (
                    <TouchableOpacity onPress={onBack} className="w-10 h-10 rounded-full bg-[#1e293b] border border-white/5 items-center justify-center mr-3">
                        <Ionicons name="chevron-back" size={24} color="#94a3b8" />
                    </TouchableOpacity>
                )}
                <View className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 items-center justify-center mr-3">
                    <Ionicons name="book" size={24} color="#fb923c" />
                </View>
                <Text className="text-white text-2xl font-bold">Course Enrollment</Text>
            </View>

            <View className="bg-orange-900/30 border border-orange-500/20 p-5 rounded-3xl flex-row items-start mb-6">
                <Ionicons name="information-circle" size={24} color="#fb923c" />
                <View className="ml-3 flex-1">
                    <Text className="text-orange-400 font-bold mb-1 text-base">Enrollment Window Active</Text>
                    <Text className="text-orange-300 text-sm leading-relaxed">
                        Select and register for subjects required in your current semester. You have 4 days left to finalize your elective choices for Semester VI.
                    </Text>
                </View>
            </View>

            <Text className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-4 ml-1">Available Electives</Text>

            <View className="space-y-4">
                {availableCourses.map((course) => {
                    const isEnrolled = enrolled.includes(course.id);
                    return (
                        <View key={course.id} className="bg-[#1e293b] p-5 rounded-3xl mb-4 border border-white/5 relative overflow-hidden">
                            <View className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <Ionicons name="book" size={80} color="#10b981" />
                            </View>

                            <View className="relative z-10">
                                <View className="flex-row items-center justify-between mb-3">
                                    <View className="px-3 py-1 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                                        <Text className="text-emerald-400 text-xs font-bold font-mono">
                                            {course.code}
                                        </Text>
                                    </View>
                                    <Text className="text-xs text-slate-400 font-medium">{course.credits} Credits</Text>
                                </View>
                                <Text className="text-white font-bold text-lg mb-1">{course.name}</Text>
                                <View className="flex-row items-center mb-5">
                                    <Ionicons name="person-circle-outline" size={16} color="#94a3b8" />
                                    <Text className="text-sm text-slate-400 ml-1.5 font-medium">{course.faculty}</Text>
                                </View>

                                <TouchableOpacity
                                    onPress={() => handleEnroll(course.id)}
                                    disabled={isEnrolled}
                                    className={`w-full py-3.5 rounded-xl font-medium flex-row items-center justify-center transition-all ${isEnrolled
                                            ? 'bg-emerald-500/20 border border-emerald-500/30'
                                            : 'bg-white/10 border border-white/5'
                                        }`}
                                >
                                    {isEnrolled ? (
                                        <>
                                            <Ionicons name="checkmark-circle" size={20} color="#34d399" />
                                            <Text className="text-emerald-400 font-bold ml-2">Enrolled</Text>
                                        </>
                                    ) : (
                                        <Text className="text-white font-bold tracking-wide">Enroll Now</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}
            </View>
            <View className="h-10" />
        </ScrollView>
    );
}
