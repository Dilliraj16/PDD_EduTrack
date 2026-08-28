import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ScrollView as NativeScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MOCK_SCHEDULE = {
    'Monday': [
        { id: 1, subject: 'Advanced Mathematics', faculty: 'Dr. Sarah Connor', room: 'Block A - 101', type: 'Lecture', start: '09:00', end: '10:30' },
        { id: 2, subject: 'Data Structures', faculty: 'Prof. Alan Turing', room: 'Lab 3', type: 'Practical', start: '10:45', end: '12:15' },
        { id: 3, subject: 'Computer Networks', faculty: 'Dr. John Smith', room: 'Block B - 204', type: 'Lecture', start: '13:00', end: '14:30' }
    ],
    'Tuesday': [
        { id: 4, subject: 'Operating Systems', faculty: 'Prof. Linus Torvalds', room: 'Block A - 302', type: 'Lecture', start: '09:00', end: '11:00' },
        { id: 5, subject: 'Database Management', faculty: 'Dr. E.F. Codd', room: 'Lab 1', type: 'Practical', start: '11:15', end: '13:15' }
    ],
    'Wednesday': [
        { id: 6, subject: 'Software Engineering', faculty: 'Dr. Grace Hopper', room: 'Block B - 105', type: 'Lecture', start: '10:00', end: '12:00' },
        { id: 7, subject: 'Cloud Computing', faculty: 'Prof. Jeff Bezos', room: 'Block C - 401', type: 'Lecture', start: '13:30', end: '15:30' }
    ],
    'Thursday': [
        { id: 9, subject: 'Artificial Intelligence', faculty: 'Dr. Alan Newell', room: 'Block A - 201', type: 'Lecture', start: '09:00', end: '10:30' },
        { id: 10, subject: 'Machine Learning', faculty: 'Prof. Geoffrey Hinton', room: 'Lab 2', type: 'Practical', start: '11:00', end: '13:00' },
        { id: 11, subject: 'Pattern Recognition', faculty: 'Dr. Yann LeCun', room: 'Block C - 102', type: 'Lecture', start: '14:00', end: '15:30' }
    ],
    'Friday': [
        { id: 8, subject: 'Cyber Security', faculty: 'Dr. Kevin Mitnick', room: 'Lab 4', type: 'Practical', start: '09:00', end: '12:00' }
    ],
    'Saturday': [
        { id: 12, subject: 'Web Development Workshop', faculty: 'Prof. Tim Berners-Lee', room: 'Lab 1', type: 'Practical', start: '09:00', end: '12:00' },
        { id: 13, subject: 'Soft Skills Training', faculty: 'Dr. Brené Brown', room: 'Auditorium', type: 'Lecture', start: '13:00', end: '15:00' }
    ]
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function TimetableScreen({ onBack }: { onBack?: () => void }) {
    const defaultDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const [selectedDay, setSelectedDay] = useState(DAYS.includes(defaultDay) ? defaultDay : 'Monday');

    const schedule = MOCK_SCHEDULE[selectedDay as keyof typeof MOCK_SCHEDULE] || [];

    return (
        <ScrollView className="flex-1 px-4 pt-4 pb-12 w-full h-full">
            <View className="flex-row items-center mb-6">
                {onBack && (
                    <TouchableOpacity onPress={onBack} className="w-10 h-10 rounded-full bg-[#1e293b] border border-white/5 items-center justify-center mr-3">
                        <Ionicons name="chevron-back" size={24} color="#94a3b8" />
                    </TouchableOpacity>
                )}
                <View className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 items-center justify-center mr-3">
                    <Ionicons name="calendar" size={24} color="#38bdf8" />
                </View>
                <Text className="text-white text-2xl font-bold">Timetable</Text>
            </View>

            {/* Day Selector */}
            <View className="mb-6">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
                    {DAYS.map((day) => {
                        const isSelected = selectedDay === day;
                        return (
                            <TouchableOpacity
                                key={day}
                                onPress={() => setSelectedDay(day)}
                                className={`px-5 py-2.5 rounded-xl mr-3 border ${isSelected
                                    ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/30'
                                    : 'bg-white/5 border-white/10'
                                    }`}
                            >
                                <Text className={`font-bold ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                                    {day}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Schedule List */}
            {schedule.length === 0 ? (
                <View className="bg-[#1e293b] p-8 rounded-3xl border border-white/5 items-center justify-center">
                    <Ionicons name="cafe-outline" size={48} color="#64748b" className="mb-4" />
                    <Text className="text-white font-bold text-lg text-center mt-4">No Classes Scheduled</Text>
                    <Text className="text-slate-400 text-center text-sm mt-2">Enjoy your free day!</Text>
                </View>
            ) : (
                schedule.map((slot) => (
                    <View key={slot.id} className="flex-row mb-4">
                        <View className="w-20 items-end pr-4 pt-2 border-r border-slate-700/50">
                            <Text className="text-slate-400 text-xs font-bold text-right">{slot.start}</Text>
                            <Text className="text-slate-600 text-[10px] mt-1 text-right">{slot.end}</Text>
                        </View>
                        <View className="flex-1 ml-4 bg-[#1e293b] p-4 rounded-2xl border border-white/5 shadow-md">
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className={`text-[10px] font-bold uppercase ${slot.type === 'Practical' ? 'text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md' : 'text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md'}`}>
                                    {slot.type}
                                </Text>
                            </View>
                            <Text className="text-white font-bold text-base mb-3 leading-tight">{slot.subject}</Text>
                            <View className="flex-row items-center mb-1">
                                <Ionicons name="person-outline" size={14} color="#94a3b8" />
                                <Text className="text-slate-400 text-xs ml-1.5">{slot.faculty}</Text>
                            </View>
                            <View className="flex-row items-center">
                                <Ionicons name="location-outline" size={14} color="#94a3b8" />
                                <Text className="text-slate-400 text-xs ml-1.5">{slot.room}</Text>
                            </View>
                        </View>
                    </View>
                ))
            )}
            <View className="h-10" />
        </ScrollView>
    );
}
