import { useState } from 'react';

const DUMMY_USERS = [
    { id: 1, name: 'Alex Johnson', role: 'Student', email: 'alex@edutrack.edu', status: 'Active' },
    { id: 2, name: 'Dr. Alan Turing', role: 'Faculty', email: 'alan@edutrack.edu', status: 'Active' },
];

export default function ManageUsers() {
    const [filter, setFilter] = useState('All');

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400">
                        System Administration
                    </h1>
                    <p className="text-gray-400 mt-1">Manage platform users, departments, and system metadata.</p>
                </div>
                <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl transition-colors font-medium">
                    + Invite User
                </button>
            </div>

            <div className="flex space-x-2 border-b border-white/10 pb-4">
                {['All', 'Student', 'Faculty'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === tab ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-white/5 overflow-x-auto relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] pointer-events-none" />

                <table className="w-full text-left border-collapse relative z-10">
                    <thead>
                        <tr className="border-b border-white/10 text-gray-400 text-sm">
                            <th className="py-4 px-4 font-medium">User identity</th>
                            <th className="py-4 px-4 font-medium">Role</th>
                            <th className="py-4 px-4 font-medium">Status</th>
                            <th className="py-4 px-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DUMMY_USERS.filter(u => filter === 'All' || u.role === filter).map(user => (
                            <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="py-4 px-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">{user.name}</p>
                                            <p className="text-xs text-gray-400">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <button className="text-sm text-blue-400 hover:text-blue-300">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
