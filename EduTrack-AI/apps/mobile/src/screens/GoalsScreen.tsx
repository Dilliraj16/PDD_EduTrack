import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Task {
    id: number;
    text: string;
    completed: boolean;
}

export default function GoalsScreen({ onBack }: { onBack?: () => void }) {
    const [dailyTasks, setDailyTasks] = useState<Task[]>([
        { id: 1, text: 'Submit OD Request online', completed: false },
        { id: 2, text: 'Review Database Management notes', completed: false },
        { id: 3, text: 'Complete OS Lab 4', completed: true },
    ]);

    const [weeklyTasks, setWeeklyTasks] = useState<Task[]>([
        { id: 4, text: 'Read Chapter 4 of Advanced Calculus', completed: false },
        { id: 5, text: 'Finalize Group Project Presentation', completed: false },
        { id: 6, text: 'Attend Department Seminar', completed: false },
    ]);

    const [newTaskTextDaily, setNewTaskTextDaily] = useState('');
    const [newTaskTextWeekly, setNewTaskTextWeekly] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);

    const toggleTask = (taskId: number, isDaily: boolean) => {
        if (isDaily) {
            setDailyTasks(tasks => tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
        } else {
            setWeeklyTasks(tasks => tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
        }
    };

    const deleteTask = (taskId: number, isDaily: boolean) => {
        if (isDaily) {
            setDailyTasks(tasks => tasks.filter(t => t.id !== taskId));
        } else {
            setWeeklyTasks(tasks => tasks.filter(t => t.id !== taskId));
        }
    };

    const addTask = (isDaily: boolean) => {
        const text = isDaily ? newTaskTextDaily : newTaskTextWeekly;
        if (!text.trim()) return;

        const newTask = { id: Date.now(), text: text.trim(), completed: false };

        if (isDaily) {
            setDailyTasks([...dailyTasks, newTask]);
            setNewTaskTextDaily('');
        } else {
            setWeeklyTasks([...weeklyTasks, newTask]);
            setNewTaskTextWeekly('');
        }
    };

    const assignAIGoals = async () => {
        setIsAssigning(true);
        // Simulate AI thinking and network delay
        setTimeout(() => {
            const newDaily = [
                { id: Date.now() + 1, text: 'Review recently failed Unit Test scenarios', completed: false },
                { id: Date.now() + 2, text: 'Study for upcoming DBMS Pop Quiz', completed: false }
            ];

            const newWeekly = [
                { id: Date.now() + 3, text: 'Complete full-stack deployment tutorial', completed: false },
                { id: Date.now() + 4, text: 'Submit Midterm Progress Report', completed: false }
            ];

            setDailyTasks(prev => [...prev, ...newDaily]);
            setWeeklyTasks(prev => [...prev, ...newWeekly]);
            setIsAssigning(false);
        }, 1500);
    };

    const renderTaskList = (tasks: Task[], isDaily: boolean, newTaskText: string, setNewTaskText: (val: string) => void) => (
        <View className="space-y-3">
            {tasks.map(task => (
                <View
                    key={task.id}
                    className="flex-row items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-white/5"
                >
                    <TouchableOpacity
                        className="flex-row items-center flex-1 mr-2"
                        onPress={() => toggleTask(task.id, isDaily)}
                    >
                        {task.completed ? (
                            <Ionicons name="checkmark-circle" size={24} color="#34d399" />
                        ) : (
                            <Ionicons name="ellipse-outline" size={24} color="#64748b" />
                        )}
                        <Text className={`text-sm font-medium ml-3 flex-1 ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {task.text}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => deleteTask(task.id, isDaily)}
                        className="p-2 bg-rose-500/10 rounded-lg"
                    >
                        <Ionicons name="trash-outline" size={16} color="#fb7185" />
                    </TouchableOpacity>
                </View>
            ))}

            <View className="flex-row items-center mt-2">
                <TextInput
                    value={newTaskText}
                    onChangeText={setNewTaskText}
                    placeholder="Add a new goal..."
                    placeholderTextColor="#64748b"
                    className="flex-1 bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3 text-white text-sm"
                    onSubmitEditing={() => addTask(isDaily)}
                />
                <TouchableOpacity
                    onPress={() => addTask(isDaily)}
                    className="p-3 bg-indigo-500 rounded-xl ml-2 w-[48px] h-[48px] items-center justify-center"
                >
                    <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ScrollView className="flex-1 px-4 pt-4 pb-12">
            <View className="flex-row items-center mb-6 justify-between">
                <View className="flex-row items-center flex-1">
                    {onBack && (
                        <TouchableOpacity onPress={onBack} className="w-10 h-10 rounded-full bg-[#1e293b] border border-white/5 items-center justify-center mr-3">
                            <Ionicons name="chevron-back" size={24} color="#94a3b8" />
                        </TouchableOpacity>
                    )}
                    <View className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 items-center justify-center mr-3">
                        <Ionicons name="stats-chart" size={22} color="#818cf8" />
                    </View>
                    <Text className="text-white text-2xl font-bold flex-1" numberOfLines={1}>Goals & Progress</Text>
                </View>
            </View>

            <View className="bg-indigo-900/40 p-6 rounded-3xl border border-indigo-500/20 mb-6">
                <View className="flex-row items-center mb-2">
                    <Ionicons name="sparkles" size={20} color="#a78bfa" className="mr-2" />
                    <Text className="text-white font-bold text-lg">AI Goal Assistant</Text>
                </View>
                <Text className="text-slate-300 text-sm mb-4 leading-relaxed">
                    Let EduTrack analyze your curriculum and suggest daily and weekly milestones to keep you ahead.
                </Text>
                <TouchableOpacity
                    onPress={assignAIGoals}
                    disabled={isAssigning}
                    className="bg-indigo-500 p-3 rounded-xl flex-row items-center justify-center shadow-lg"
                >
                    {isAssigning ? (
                        <Text className="text-white font-bold ml-2">Analyzing...</Text>
                    ) : (
                        <>
                            <Ionicons name="flash" size={18} color="white" />
                            <Text className="text-white font-bold ml-2">Auto-Assign Goals</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            <View className="bg-[#1e293b] p-6 rounded-3xl border border-white/5 mb-6">
                <View className="flex-row items-center mb-6">
                    <View className="w-10 h-10 rounded-xl bg-orange-500/20 items-center justify-center mr-3">
                        <Ionicons name="checkbox-outline" size={20} color="#f97316" />
                    </View>
                    <Text className="text-white font-bold text-xl">Daily Goals</Text>
                </View>
                {renderTaskList(dailyTasks, true, newTaskTextDaily, setNewTaskTextDaily)}
            </View>

            <View className="bg-[#1e293b] p-6 rounded-3xl border border-white/5 mb-20">
                <View className="flex-row items-center mb-6">
                    <View className="w-10 h-10 rounded-xl bg-blue-500/20 items-center justify-center mr-3">
                        <Ionicons name="calendar-outline" size={20} color="#3b82f6" />
                    </View>
                    <Text className="text-white font-bold text-xl">Weekly Goals</Text>
                </View>
                {renderTaskList(weeklyTasks, false, newTaskTextWeekly, setNewTaskTextWeekly)}
            </View>
            <View className="h-10" />
        </ScrollView>
    );
}
