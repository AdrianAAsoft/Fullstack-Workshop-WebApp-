import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Workshop } from '../types';
import { Plus, Trash2, Edit2, X } from 'lucide-react';

export const AdminDashboard = () => {
    const { logout, user } = useAuth();
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: '',
        capacity: 20,
        status: 'activo'
    });

    const fetchWorkshops = async () => {
        try {
            const data = await api.getWorkshops();
            setWorkshops(data);
        } catch (error) {
            console.error('Failed to fetch workshops', error);
        }
    };

    useEffect(() => {
        fetchWorkshops();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this workshop?')) {
            await api.deleteWorkshop(id);
            fetchWorkshops();
        }
    };

    const handleEdit = (workshop: Workshop) => {
        setEditingWorkshop(workshop);
        setFormData({
            title: workshop.title,
            description: workshop.description,
            date: workshop.date,
            time: workshop.time,
            location: workshop.location,
            category: workshop.category,
            capacity: workshop.capacity,
            status: workshop.status
        });
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingWorkshop(null);
        setFormData({
            title: '',
            description: '',
            date: '',
            time: '',
            location: '',
            category: '',
            capacity: 20,
            status: 'activo'
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingWorkshop) {
                await api.updateWorkshop(editingWorkshop.id, formData);
            } else {
                await api.createWorkshop(formData);
            }
            setIsModalOpen(false);
            fetchWorkshops();
        } catch (error) {
            console.error('Failed to save workshop', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Admin: {user?.username}</span>
                        <button onClick={logout} className="text-red-600 hover:text-red-800 font-medium">Logout</button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between mb-6">
                    <h2 className="text-xl font-semibold">Manage Workshops</h2>
                    <button
                        onClick={handleCreate}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700"
                    >
                        <Plus size={20} /> Create Workshop
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title/Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">When & Where</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {workshops.map((workshop) => (
                                <tr key={workshop.id}>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{workshop.title}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">{workshop.description}</div>
                                        <div className="text-xs text-gray-400 mt-1">{workshop.category}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{workshop.date} at {workshop.time}</div>
                                        <div className="text-sm text-gray-500">{workshop.location}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${workshop.status === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {workshop.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {workshop.enrolled} / {workshop.capacity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(workshop)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(workshop.id)} className="text-red-600 hover:text-red-900">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">{editingWorkshop ? 'Edit Workshop' : 'Create Workshop'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                    value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                    value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date</label>
                                    <input type="date" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                        value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Time</label>
                                    <input type="time" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                        value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Location</label>
                                    <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                        value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                        value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Capacity</label>
                                    <input type="number" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                        value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                        value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                        <option value="activo">Active</option>
                                        <option value="cancelado">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
