
import React, { useState } from 'react';
import API_BASE_URL from '../../api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Phone, KeyRound, ArrowRight } from 'lucide-react';

const StudentLogin: React.FC = () => {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
    const [mockOtp, setMockOtp] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post(`${API_BASE_URL}/student/send-otp`, { mobile: phone });
            setMockOtp(res.data.mockOtp);
            setStep('OTP');
        } catch (err: any) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to send OTP');
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post(`${API_BASE_URL}/student/verify-otp`, { mobile: phone, otp });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            if (!res.data.profileComplete) {
                navigate('/student/profile'); // Force Profile
            } else {
                navigate('/student/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Invalid OTP');
        }
    };

    return (
        <div className="flex justify-center items-center h-[80vh] bg-blue-50">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center mb-6">
                    <div className="inline-block p-4 bg-blue-100 text-blue-600 rounded-full mb-3">
                        <User size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Student Access</h2>
                    <p className="text-gray-500">Find verified colleges & scholarships</p>
                </div>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm font-semibold">{error}</div>}

                {step === 'PHONE' ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Mobile Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full pl-10 p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Enter 10 digit number"
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full p-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 flex justify-center items-center gap-2">
                            Send OTP <ArrowRight size={18} />
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div className="bg-green-50 text-green-700 p-3 rounded text-sm mb-2">
                            Mock OTP sent: <strong>{mockOtp}</strong>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Enter OTP</label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full pl-10 p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Enter 4 digit OTP"
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full p-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 flex justify-center items-center gap-2">
                            Verify & Login <ArrowRight size={18} />
                        </button>
                        <button type="button" onClick={() => setStep('PHONE')} className="w-full text-sm text-gray-500 hover:underline">
                            Change Number
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default StudentLogin;
