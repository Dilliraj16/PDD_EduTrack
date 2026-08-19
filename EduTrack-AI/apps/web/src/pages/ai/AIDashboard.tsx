import { useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { CheckSquare, CalendarDays, GripVertical, CheckCircle2, Circle, Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';

const initialWidgets = [
    { id: 'daily', title: 'Daily Goals (To-Do)', icon: CheckSquare, color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-500/10' },
    { id: 'weekly', title: 'Weekly Goals', icon: CalendarDays, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-500/10' }
];

function DraggableWidget({ widget, children }: { widget: any, children: React.ReactNode }) {
    const controls = useDragControls();

    return (
        <Reorder.Item
            value={widget}
            dragListener={false}
            dragControls={controls}
            className="glass-panel p-6 rounded-3xl relative overflow-hidden group bg-white/60 dark:bg-black/20"
        >
            <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full blur-3xl ${widget.bg} opacity-50 pointer-events-none`} />

            <div className="flex justify-between items-center mb-6 relative z-10 border-b border-black/5 dark:border-white/5 pb-4">
                <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl ${widget.bg} flex items-center justify-center`}>
                        <widget.icon className={`w-5 h-5 ${widget.color}`} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white t-h">{widget.title}</h2>
                </div>
                <div
                    className="cursor-grab hover:bg-black/5 dark:hover:bg-white/10 p-2 rounded-lg transition-colors"
                    onPointerDown={(e) => controls.start(e)}
                >
                    <GripVertical className="w-5 h-5 text-slate-400 dark:text-gray-500" />
                </div>
            </div>

            <div className="relative z-10">
                {children}
            </div>
        </Reorder.Item>
    );
}

export default function AIDashboard() {
    const [widgets, setWidgets] = useState(initialWidgets);

    const [dailyTasks, setDailyTasks] = useState([
        { id: 1, text: 'Submit OD Request online', completed: false },
        { id: 2, text: 'Review Database Management notes', completed: false },
        { id: 3, text: 'Complete OS Lab 4', completed: true },
    ]);

    const [weeklyTasks, setWeeklyTasks] = useState([
        { id: 4, text: 'Read Chapter 4 of Advanced Calculus', completed: false },
        { id: 5, text: 'Finalize Group Project Presentation', completed: false },
        { id: 6, text: 'Attend Department Seminar', completed: false },
    ]);

    const [newTaskText, setNewTaskText] = useState({ daily: '', weekly: '' });
    const [isAssigning, setIsAssigning] = useState(false);

    const toggleTask = (taskId: number, isDaily: boolean) => {
        if (isDaily) {
            setDailyTasks(tasks => tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
        } else {
            setWeeklyTasks(tasks => tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
        }
    };

    const deleteTask = (taskId: number, isDaily: boolean, e: React.MouseEvent) => {
        e.stopPropagation();
        if (isDaily) {
            setDailyTasks(tasks => tasks.filter(t => t.id !== taskId));
        } else {
            setWeeklyTasks(tasks => tasks.filter(t => t.id !== taskId));
        }
    };

    const addTask = (isDaily: boolean) => {
        const text = isDaily ? newTaskText.daily : newTaskText.weekly;
        if (!text.trim()) return;

        const newTask = { id: Date.now(), text: text.trim(), completed: false };

        if (isDaily) {
            setDailyTasks([...dailyTasks, newTask]);
            setNewTaskText({ ...newTaskText, daily: '' });
        } else {
            setWeeklyTasks([...weeklyTasks, newTask]);
            setNewTaskText({ ...newTaskText, weekly: '' });
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent, isDaily: boolean) => {
        if (e.key === 'Enter') {
            addTask(isDaily);
        }
    };

    const assignAIGoals = async () => {
        setIsAssigning(true);
        // Simulate AI thinking and network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newDaily = [
            { id: Date.now() + 1, text: 'Review recently failed Unit Test scenarios', completed: false },
            { id: Date.now() + 2, text: 'Study for upcoming DBMS Pop Quiz', completed: false }
        ];

        const newWeekly = [
            { id: Date.now() + 3, text: 'Complete full-stack deployment tutorial', completed: false },
            { id: Date.now() + 4, text: 'Submit Midterm Progress Report', completed: false }
        ];

        setDailyTasks([...dailyTasks, ...newDaily]);
        setWeeklyTasks([...weeklyTasks, ...newWeekly]);
        setIsAssigning(false);
    };

    const renderTaskList = (tasks: any[], isDaily: boolean) => (
        <div className="space-y-4">
            <div className="space-y-2">
                {tasks.map(task => (
                    <div
                        key={task.id}
                        className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-white/5"
                        onClick={() => toggleTask(task.id, isDaily)}
                    >
                        <div className="flex items-center space-x-3">
                            {task.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20 flex-shrink-0" />
                            ) : (
                                <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                            )}
                            <span className={`text-sm font-medium ${task.completed ? 'line-through text-slate-400 dark:text-gray-500' : 'text-slate-700 dark:text-gray-200'}`}>
                                {task.text}
                            </span>
                        </div>
                        <button
                            onClick={(e) => deleteTask(task.id, isDaily, e)}
                            className="text-slate-400 opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all p-1"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Input for adding new task */}
            <div className="flex items-center space-x-2 mt-4 relative">
                <input
                    type="text"
                    value={isDaily ? newTaskText.daily : newTaskText.weekly}
                    onChange={(e) => setNewTaskText(prev => ({ ...prev, [isDaily ? 'daily' : 'weekly']: e.target.value }))}
                    onKeyDown={(e) => handleKeyPress(e, isDaily)}
                    placeholder="Add a new goal..."
                    className="flex-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
                <button
                    onClick={() => addTask(isDaily)}
                    className="p-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-colors shrink-0"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="mb-8 p-8 rounded-3xl bg-gradient-to-br from-indigo-50 dark:from-indigo-900/40 via-white dark:via-purple-900/20 to-slate-50 dark:to-transparent border border-indigo-100 dark:border-white/10 relative overflow-hidden shadow-sm">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-purple-500/10 blur-[80px] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                            <CheckSquare className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Goals & Progress
                            </h1>
                            <p className="text-slate-600 dark:text-gray-400 text-sm mt-1 font-medium">
                                Manage daily targets, track weekly milestones, and organize your tasks.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={assignAIGoals}
                        disabled={isAssigning}
                        className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {isAssigning ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Sparkles className="w-5 h-5" />
                        )}
                        <span>{isAssigning ? 'Analyzing Curriculum...' : 'Auto-Assign Goals'}</span>
                    </button>
                </div>
            </div>

            <Reorder.Group axis="y" values={widgets} onReorder={setWidgets} className="space-y-6">
                {widgets.map(w => (
                    <DraggableWidget key={w.id} widget={w}>
                        {w.id === 'daily' && renderTaskList(dailyTasks, true)}
                        {w.id === 'weekly' && renderTaskList(weeklyTasks, false)}
                    </DraggableWidget>
                ))}
            </Reorder.Group>
        </div>
    );
}
