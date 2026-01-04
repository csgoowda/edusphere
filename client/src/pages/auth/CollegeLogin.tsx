
import React, { useState } from 'react';
import API_BASE_URL from '../../api';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const CollegeLogin: React.FC = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/college/login`, formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/college/dashboard');
        } catch (err: any) {
            const details = err.response?.data?.details;
            const errorMsg = err.response?.data?.error;
            setError(details ? `${errorMsg}: ${details}` : errorMsg || 'Login failed. Please check credentials.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl border-t-4 border-govt-blue">
                <div className="text-center mb-6">
                    <div className="inline-block p-3 bg-blue-50 rounded-full mb-3">
                        <ShieldCheck className="text-govt-blue w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">College Login</h2>
                    <p className="text-sm text-gray-500">Access your institution dashboard</p>
                </div>

                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Official Email ID</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-govt-blue focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-govt-blue focus:outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-govt-blue text-white font-bold py-2 rounded hover:bg-blue-800 transition duration-200"
                    >
                        Secure Login
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-600">
                        New Institution?{' '}
                        <Link to="/register/college" className="text-govt-blue font-bold hover:underline">
                            Register Here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CollegeLogin;
