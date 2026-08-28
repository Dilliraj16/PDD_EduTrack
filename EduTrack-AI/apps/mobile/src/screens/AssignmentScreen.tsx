import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Platform, LayoutAnimation, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const MOCK_ASSIGNMENTS = [
    { id: '1', course: 'Computer Networks', title: 'TCP/IP Flow Control Analysis', due: 'Tomorrow, 11:59 PM', status: 'pending', description: 'Analyze the congestion control algorithms implemented in modern TCP stacks. Provide PCAP file traces if possible.' },
    { id: '2', course: 'Software Engineering', title: 'Sprint 1 Architecture Doc', due: 'Fri, 05:00 PM', status: 'pending', description: 'Submit the final IEEE format architecture document including Mermaid diagrams of the CI/CD pipeline.' },
    { id: '3', course: 'Data Structures', title: 'B-Tree Implementation', due: 'Last Week', status: 'graded', score: '95/100', feedback: 'Excellent time complexity handling on node splits.' }
];

export default function AssignmentScreen({ onBack }: { onBack?: () => void }) {
    const [activeTab, setActiveTab] = useState<'pending' | 'graded'>('pending');
    const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(MOCK_ASSIGNMENTS[0].id);
    const [searchQuery, setSearchQuery] = useState('');

    // Upload state
    const [uploadedFile, setUploadedFile] = useState<{ name: string, size: number } | null>(null);
    const [uploading, setUploading] = useState(false);
    const [submittedAssignments, setSubmittedAssignments] = useState<string[]>([]);

    let filtered = MOCK_ASSIGNMENTS.filter(a => a.status === activeTab);
    if (searchQuery) {
        filtered = filtered.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.course.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    const toggleSelection = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedAssignmentId(id === selectedAssignmentId ? '' : id);
        setUploadedFile(null); // reset file when switching
    };

    const handleSelectFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const file = result.assets[0];
                const sizeInMB = file.size ? parseFloat((file.size / (1024 * 1024)).toFixed(2)) : 0;
                setUploadedFile({ name: file.name, size: sizeInMB });
            }
        } catch (err) {
            console.error('Error selecting file:', err);
        }
    };

    const handleUpload = (id: string) => {
        if (!uploadedFile) return;
        setUploading(true);
        setTimeout(() => {
            setUploading(false);
            setSubmittedAssignments(prev => [...prev, id]);
            setUploadedFile(null);
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }, 1500);
    };

    return (
        <ScrollView className="flex-1 bg-[#101827]" contentContainerStyle={{ padding: 16 }}>
            {/* Header Mirroring Web */}
            <View className="mb-6 flex-row items-center">
                {onBack && (
                    <TouchableOpacity onPress={onBack} className="w-10 h-10 rounded-full bg-[#1e293b] border border-white/5 items-center justify-center mr-3 mt-1">
                        <Ionicons name="chevron-back" size={24} color="#94a3b8" />
                    </TouchableOpacity>
                )}
                <View>
                    <Text className="text-3xl font-extrabold text-[#d8b4fe] tracking-tight">
                        Assignments & Storage
                    </Text>
                    <Text className="text-gray-400 mt-1 font-medium">Manage and upload documents securely.</Text>
                </View>
            </View>

            {/* Tabs */}
            <View className="flex-row bg-[#1e293b] p-1 rounded-xl mb-6 border border-white/10">
                <TouchableOpacity
                    className={`flex-1 py-3 items-center rounded-lg ${activeTab === 'pending' ? 'bg-purple-600 shadow-lg' : ''}`}
                    onPress={() => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        setActiveTab('pending');
                        setSelectedAssignmentId(MOCK_ASSIGNMENTS.find(a => a.status === 'pending')?.id || '');
                    }}
                >
                    <Text className={`font-bold ${activeTab === 'pending' ? 'text-white' : 'text-gray-400'}`}>Pending Needs</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-1 py-3 items-center rounded-lg ${activeTab === 'graded' ? 'bg-purple-600 shadow-lg' : ''}`}
                    onPress={() => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        setActiveTab('graded');
                        setSelectedAssignmentId(MOCK_ASSIGNMENTS.find(a => a.status === 'graded')?.id || '');
                    }}
                >
                    <Text className={`font-bold ${activeTab === 'graded' ? 'text-white' : 'text-gray-400'}`}>Graded & Feedback</Text>
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View className="bg-white/5 border border-white/10 rounded-xl flex-row items-center px-4 mb-4">
                <Ionicons name="search" size={18} color="#64748b" />
                <TextInput
                    className="flex-1 py-3 px-3 text-white"
                    placeholder="Search assignments..."
                    placeholderTextColor="#64748b"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Assignment List */}
            {filtered.length === 0 ? (
                <View className="items-center justify-center py-10">
                    <Ionicons name="folder-open-outline" size={48} color="#475569" />
                    <Text className="text-gray-500 mt-4 font-bold">No assignments found.</Text>
                </View>
            ) : (
                filtered.map(assignment => {
                    const isSelected = selectedAssignmentId === assignment.id;
                    const isSubmitted = submittedAssignments.includes(assignment.id);

                    return (
                        <TouchableOpacity
                            activeOpacity={0.9}
                            key={assignment.id}
                            onPress={() => toggleSelection(assignment.id)}
                            className={`p-4 rounded-[24px] mb-4 overflow-hidden border ${isSelected
                                ? 'bg-[#1a0f2e] border-purple-500/30'
                                : 'bg-white/5 border-white/5'
                                }`}
                        >
                            {/* List Item Header */}
                            <View className="flex-row justify-between items-center mb-2">
                                <View className="bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                                    <Text className="text-purple-400 text-[10px] font-bold uppercase tracking-wider">{assignment.course}</Text>
                                </View>
                                {assignment.status === 'pending' ? (
                                    <Ionicons name="time-outline" size={16} color="#fbbf24" />
                                ) : (
                                    <Ionicons name="checkmark-circle" size={16} color="#34d399" />
                                )}
                            </View>

                            <Text className={`font-bold text-[16px] mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>{assignment.title}</Text>
                            <Text className="text-gray-500 text-xs font-medium">Due: {assignment.due}</Text>

                            {/* Details & Dropzone Area (Accordion Expansion) */}
                            {isSelected && (
                                <View className="mt-5 pt-5 border-t border-white/10">
                                    <View className="bg-black/20 p-4 rounded-2xl border border-white/5 mb-5">
                                        <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Instructions</Text>
                                        <Text className="text-gray-300 text-sm leading-relaxed">{assignment.description}</Text>

                                        {assignment.status === 'graded' && (
                                            <View className="mt-4 pt-4 border-t border-white/10 flex-row justify-between items-start">
                                                <View className="flex-1 pr-2">
                                                    <Text className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-1">Faculty Feedback</Text>
                                                    <Text className="text-emerald-50/80 text-sm">{assignment.feedback}</Text>
                                                </View>
                                                <View className="items-end">
                                                    <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Final Score</Text>
                                                    <Text className="text-emerald-400 font-bold text-xl font-mono">{assignment.score}</Text>
                                                </View>
                                            </View>
                                        )}
                                    </View>

                                    {/* Upload Section For Pending */}
                                    {assignment.status === 'pending' && (
                                        <View>
                                            <Text className="text-sm font-semibold mb-3 text-white">Upload Submission (Supabase Cloud)</Text>

                                            {isSubmitted ? (
                                                <View className="border-2 border-dashed border-emerald-500/50 rounded-[24px] bg-emerald-500/10 p-6 items-center justify-center">
                                                    <View className="w-12 h-12 rounded-full bg-emerald-500/20 items-center justify-center mb-3">
                                                        <Ionicons name="checkmark" size={24} color="#34d399" />
                                                    </View>
                                                    <Text className="text-lg font-bold text-white mb-1">Submission Successful!</Text>
                                                    <Text className="text-xs text-gray-400 text-center">Your file has been securely uploaded.</Text>
                                                </View>
                                            ) : (
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    onPress={handleSelectFile}
                                                    className={`border-2 border-dashed rounded-[24px] p-6 items-center justify-center ${uploadedFile ? 'border-purple-500 bg-purple-500/10' : 'border-white/20 bg-black/20'
                                                        }`}
                                                >
                                                    {uploadedFile ? (
                                                        <View className="w-full flex-row items-center justify-between bg-white/10 rounded-xl p-3 border border-white/10">
                                                            <View className="flex-row items-center flex-1">
                                                                <View className="w-10 h-10 rounded-lg bg-purple-500/20 items-center justify-center mr-3">
                                                                    <Ionicons name="document-text" size={20} color="#c084fc" />
                                                                </View>
                                                                <View className="flex-1">
                                                                    <Text className="font-semibold text-white text-sm" numberOfLines={1}>{uploadedFile.name}</Text>
                                                                    <Text className="text-xs text-gray-400 mt-0.5">{uploadedFile.size} MB</Text>
                                                                </View>
                                                            </View>
                                                            <TouchableOpacity
                                                                className="w-8 h-8 rounded-full bg-white/10 items-center justify-center"
                                                                onPress={() => setUploadedFile(null)}
                                                            >
                                                                <Ionicons name="close" size={16} color="white" />
                                                            </TouchableOpacity>
                                                        </View>
                                                    ) : (
                                                        <>
                                                            <View className="w-16 h-16 rounded-full bg-white/5 items-center justify-center mb-4">
                                                                <Ionicons name="cloud-upload-outline" size={32} color="#94a3b8" />
                                                            </View>
                                                            <Text className="font-bold text-base text-white mb-1">Tap to select your file</Text>
                                                            <Text className="text-xs text-gray-400 mb-4 font-medium">Supports PDF, DOCX up to 50MB</Text>
                                                            <View className="px-5 py-2 bg-white/10 rounded-lg border border-white/10">
                                                                <Text className="text-white text-xs font-bold">Browse Files</Text>
                                                            </View>
                                                        </>
                                                    )}
                                                </TouchableOpacity>
                                            )}

                                            {uploadedFile && !isSubmitted && (
                                                <View className="mt-4 pt-4">
                                                    <TouchableOpacity
                                                        className={`p-4 rounded-xl flex-row justify-center items-center ${uploading ? 'bg-purple-600/50' : 'bg-[#9333ea]'
                                                            }`}
                                                        disabled={uploading}
                                                        onPress={() => handleUpload(assignment.id)}
                                                    >
                                                        {uploading ? (
                                                            <View className="flex-row items-center">
                                                                <ActivityIndicator color="white" size="small" />
                                                                <Text className="text-white font-bold ml-3">Uploading to Cloud...</Text>
                                                            </View>
                                                        ) : (
                                                            <>
                                                                <Ionicons name="cloud-upload" size={18} color="white" />
                                                                <Text className="text-white font-bold ml-2 text-base">Upload Assignment</Text>
                                                            </>
                                                        )}
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })
            )}
        </ScrollView>
    );
}
