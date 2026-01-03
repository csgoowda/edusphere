
import React, { useState } from 'react';
import API_BASE_URL from '../../api';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';

const CollegeRegister: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        code: '',
        address: '',
        principal_name: '',
        principal_phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            // Exclude confirmPassword from payload
            const { confirmPassword, ...payload } = formData;
            const res = await axios.post(`${API_BASE_URL}/auth/college/register`, payload);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/college/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed.');
        }
    };

    return (
        <div className="flex justify-center items-center py-10">
            <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-xl border-t-4 border-govt-gold">
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-yellow-50 rounded-full mb-3">
                        <Building2 className="text-govt-gold w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">College Registration</h2>
                    <p className="text-sm text-gray-500">Official Onboarding Form (Verified Access Only)</p>
                </div>

                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-6">{error}</div>}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">College Name</label>
                        <input type="text" name="name" onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-govt-blue" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Official Email</label>
                        <input type="email" name="email" onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-govt-blue" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">College Code (AISHE)</label>
                        <input type="text" name="code" onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-govt-blue" required />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                        <input type="text" name="address" onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-govt-blue" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Principal Name</label>
                        <input type="text" name="principal_name" onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-govt-blue" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Principal Phone</label>
                        <input type="tel" name="principal_phone" onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-govt-blue" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" name="password" onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-govt-blue" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input type="password" name="confirmPassword" onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-govt-blue" required />
                    </div>

                    <div className="md:col-span-2 mt-4">
                        <button type="submit" className="w-full bg-govt-blue text-white font-bold py-3 rounded hover:bg-blue-800 transition duration-200">
                            Register Institution
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-600">
                        Already registered?{' '}
                        <Link to="/login/college" className="text-govt-blue font-bold hover:underline">
                            Login to Dashboard
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CollegeRegister;
