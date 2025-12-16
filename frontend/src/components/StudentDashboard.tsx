import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Workshop } from '../types';
import { Calendar, MapPin, Clock, X } from 'lucide-react';

export const StudentDashboard = () => {
    const { logout, user } = useAuth();
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
    const [registerData, setRegisterData] = useState({ studentName: '', studentEmail: '' });
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const fetchWorkshops = async () => {
        try {
            const data = await api.getWorkshops();
            // Only show active workshops for students
            setWorkshops(data.filter(w => w.status === 'activo'));
        } catch (error) {
            console.error('Failed to fetch workshops', error);
        }
    };

    useEffect(() => {
        fetchWorkshops();
    }, []);

    const handleRegisterClick = (workshop: Workshop) => {
        setSelectedWorkshop(workshop);
        setMessage(null);
        setRegisterData({ studentName: '', studentEmail: '' });
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedWorkshop) return;

        try {
            await api.registerStudent(selectedWorkshop.id, registerData);
            setMessage({ type: 'success', text: 'Registration successful!' });
            // Refresh workshops to update enrolled count
            fetchWorkshops();
            setTimeout(() => setSelectedWorkshop(null), 1500);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Registration failed' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Student Portal</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Student: {user?.username}</span>
                        <button onClick={logout} className="text-gray-600 hover:text-gray-800 font-medium">Logout</button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-xl font-semibold mb-6">Available Workshops</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workshops.map((workshop) => (
                        <div key={workshop.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-full">
                                        {workshop.category}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {workshop.enrolled} / {workshop.capacity}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{workshop.title}</h3>
                                <p className="text-gray-600 mb-4 h-20 overflow-y-auto">{workshop.description}</p>

                                <div className="space-y-2 text-sm text-gray-500 mb-6">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} /> {workshop.date}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} /> {workshop.time}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} /> {workshop.location}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleRegisterClick(workshop)}
                                    disabled={workshop.enrolled >= workshop.capacity}
                                    className={`w-full py-2 px-4 rounded-md font-medium text-center ${workshop.enrolled >= workshop.capacity
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }`}
                                >
                                    {workshop.enrolled >= workshop.capacity ? 'Full Capacity' : 'Register Now'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Registration Modal */}
            {selectedWorkshop && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Register for {selectedWorkshop.title}</h3>
                            <button onClick={() => setSelectedWorkshop(null)} className="text-gray-400 hover:text-gray-500">
                                <X size={24} />
                            </button>
                        </div>

                        {message && (
                            <div className={`p-3 rounded mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {message.text}
                            </div>
                        )}

                        {!message?.text.includes('successful') && (
                            <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Your Name</label>
                                    <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                        value={registerData.studentName} onChange={(e) => setRegisterData({ ...registerData, studentName: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Your Email</label>
                                    <input type="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                        value={registerData.studentEmail} onChange={(e) => setRegisterData({ ...registerData, studentEmail: e.target.value })} />
                                </div>
                                <div className="mt-6">
                                    <button type="submit" className="w-full bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700">
                                        Confirm Registration
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
