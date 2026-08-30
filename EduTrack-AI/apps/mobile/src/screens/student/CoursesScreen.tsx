import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../config/supabase';
import { useAuthStore } from '../../store/authStore';

interface CourseRecord {
    series: string;
    name: string;
    grade: string;
    status: string;
}

export default function CoursesScreen({ onBack }: { onBack?: () => void }) {
    const { user } = useAuthStore();
    const [completedCourses, setCompletedCourses] = useState<CourseRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchGrades() {
            if (!user) return;

            // Fetch the grades assigned to this specific student
            const { data: grades } = await supabase
                .from('course_results')
                .select('*')
                .eq('student_id', user.id);

            // Fetch the entire master courses list for name mapping
            const { data: courses } = await supabase.from('courses').select('*');

            if (grades && courses && isMounted) {
                // Filter out grades that are completely empty/unassigned
                const assignedGrades = grades.filter(g => g.grade && g.grade.trim() !== '');

                const mappedGrades = assignedGrades.map(g => {
                    const c = courses.find(course => course.code === g.course_code);
                    return {
                        series: g.course_code,
                        name: c?.name || 'Unknown Course',
                        grade: g.grade,
                        status: g.status || 'PASS'
                    };
                });
                setCompletedCourses(mappedGrades);
            }
            if (isMounted) setIsLoading(false);
        }

        fetchGrades();
        return () => { isMounted = false; };
    }, [user]);

    return (
        <ScrollView className="flex-1 px-4 pt-4 pb-12">
            <View className="flex-row items-center mb-6">
                {onBack && (
                    <TouchableOpacity onPress={onBack} className="w-10 h-10 rounded-full bg-[#1e293b] border border-white/5 items-center justify-center mr-3">
                        <Ionicons name="chevron-back" size={24} color="#94a3b8" />
                    </TouchableOpacity>
                )}
                <View className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 items-center justify-center mr-3">
                    <Ionicons name="ribbon" size={24} color="#34d399" />
                </View>
                <Text className="text-white text-2xl font-bold flex-1" numberOfLines={1}>Completed Courses</Text>
            </View>

            <View className="bg-emerald-900/40 p-6 rounded-3xl border border-emerald-500/20 mb-6">
                <Text className="text-slate-300 text-sm leading-relaxed">
                    Review your completed courses and academic performance history securely sourced from official faculty records.
                </Text>
            </View>

            <View className="bg-[#1e293b] rounded-[24px] border border-white/5 overflow-hidden p-6 min-h-[200px]">
                {isLoading ? (
                    <View className="flex-1 items-center justify-center py-10">
                        <ActivityIndicator size="large" color="#10b981" />
                        <Text className="text-slate-400 mt-4 text-sm font-medium">Syncing Transcripts...</Text>
                    </View>
                ) : completedCourses.length === 0 ? (
                    <View className="flex-1 items-center justify-center py-8">
                        <Ionicons name="ribbon-outline" size={48} color="#475569" />
                        <Text className="text-white font-bold text-lg mt-4">No Grades Recorded Yet</Text>
                        <Text className="text-slate-500 mt-2 text-center text-sm">Your faculty has not published any official grades to your transcript.</Text>
                    </View>
                ) : (
                    <View>
                        {/* Header Row */}
                        <View className="flex-row border-b border-white/10 pb-3 mb-2">
                            <Text className="flex-1 text-slate-400 uppercase text-[10px] font-bold">Course</Text>
                            <Text className="w-16 text-slate-400 uppercase text-[10px] font-bold text-center">Grade</Text>
                            <Text className="w-16 text-slate-400 uppercase text-[10px] font-bold text-right">Status</Text>
                        </View>

                        {/* Course List */}
                        {completedCourses.map((course, idx) => (
                            <View key={idx} className="flex-row items-center py-4 border-b border-white/5">
                                <View className="flex-1 p-1">
                                    <Text className="text-white font-bold text-sm mb-1">{course.name}</Text>
                                    <Text className="text-slate-500 font-mono text-xs">{course.series}</Text>
                                </View>
                                <View className="w-16 items-center">
                                    <Text className="text-white font-extrabold text-lg">{course.grade}</Text>
                                </View>
                                <View className="w-16 items-end">
                                    <View className={`px-2 py-1 rounded-lg border ${course.status.toUpperCase() === 'PASS'
                                            ? 'bg-emerald-500/10 border-emerald-500/20'
                                            : 'bg-rose-500/10 border-rose-500/20'
                                        }`}>
                                        <Text className={`text-[10px] font-bold ${course.status.toUpperCase() === 'PASS' ? 'text-emerald-400' : 'text-rose-400'
                                            }`}>
                                            {course.status.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </View>
            <View className="h-10" />
        </ScrollView>
    );
}
