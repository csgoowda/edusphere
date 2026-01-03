
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Save } from 'lucide-react';
import API_BASE_URL from '../../api';

const StudentProfile: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        country: 'India',
        state: '',
        district: '',
        education_level: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/student/profile`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/student/dashboard');
        } catch (err) {
            alert('Failed to update profile. Please check all fields.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <UserCheck className="text-blue-600" /> Complete Your Profile
            </h2>
            <p className="text-gray-500 mb-8">You must complete your profile to view verified colleges.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Full Name</label>
                        <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Country</label>
                        <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full p-2 border rounded" readOnly />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">State</label>
                        <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">District</label>
                        <input type="text" name="district" value={formData.district} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Current Education</label>
                        <select name="education_level" value={formData.education_level} onChange={handleChange} className="w-full p-2 border rounded" required>
                            <option value="">Select Level</option>
                            <option value="High School">High School (10th)</option>
                            <option value="Inter/Plus 2">Intermediate (12th)</option>
                            <option value="Undergraduate">Undergraduate</option>
                            <option value="Postgraduate">Postgraduate</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4 border-t">
                    <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 flex justify-center items-center gap-2">
                        <Save size={20} /> Save & Continue
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StudentProfile;
