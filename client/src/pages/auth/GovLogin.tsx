import React, { useState } from 'react';
import API_BASE_URL from '../../api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Landmark } from 'lucide-react';

const GovLogin: React.FC = () => {
    const [formData, setFormData] = useState({ employee_id: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/gov/login`, formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/gov/dashboard');
        } catch (err: any) {
            console.error("Login Error:", err);
            const details = err.response?.data?.details;
            const errorMsg = err.response?.data?.error || err.message || 'Access Denied.';
            setError(details ? `${errorMsg}: ${details}` : errorMsg);
        }
    };

    return (
        <div className="flex justify-center items-center h-[80vh] bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded shadow-lg border-t-4 border-red-800">
                <div className="text-center mb-6">
                    <div className="inline-block p-4 bg-red-100 rounded-full mb-3">
                        <Landmark className="text-red-900 w-12 h-12" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Government Login</h2>
                    <p className="text-sm text-gray-500 uppercase font-semibold">Authorized Personnel Only</p>
                </div>

                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Employee ID</label>
                        <input
                            type="text"
                            name="employee_id"
                            value={formData.employee_id}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-red-800 focus:outline-none"
                            placeholder="GOV001"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-red-800 focus:outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-red-900 text-white font-bold py-3 rounded hover:bg-red-800 transition duration-200"
                    >
                        Secure Access
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GovLogin;
