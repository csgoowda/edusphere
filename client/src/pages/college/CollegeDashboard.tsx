
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle, XCircle, AlertCircle, Lock } from 'lucide-react';
import API_BASE_URL from '../../api';

interface CollegeData {
    name: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CORRECTION_REQUIRED';
    is_locked: boolean;
    remarks?: string;
}

const CollegeDashboard: React.FC = () => {
    const [college, setCollege] = useState<CollegeData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_BASE_URL}/college/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCollege(res.data);
            } catch (err) {
                console.error("Failed to fetch college details");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;
    if (!college) return <div className="p-10 text-center text-red-600">Failed to load college data.</div>;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'text-green-600 bg-green-50 border-green-200';
            case 'REJECTED': return 'text-red-600 bg-red-50 border-red-200';
            case 'CORRECTION_REQUIRED': return 'text-orange-600 bg-orange-50 border-orange-200';
            default: return 'text-blue-600 bg-blue-50 border-blue-200';
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Institution Dashboard</h2>

            {/* Status Card */}
            <div className={`p-6 rounded-lg border-2 mb-8 flex items-center justify-between ${getStatusColor(college.status)}`}>
                <div>
                    <h3 className="text-lg font-bold uppercase tracking-wider">Verification Status</h3>
                    <p className="text-3xl font-black mt-2">{college.status.replace('_', ' ')}</p>
                    {college.remarks && (
                        <div className="mt-4 p-3 bg-white/50 rounded text-sm font-semibold">
                            <span className="block text-xs uppercase opacity-70">Government Remarks:</span>
                            {college.remarks}
                        </div>
                    )}
                </div>
                <div>
                    {college.status === 'APPROVED' ? <CheckCircle size={64} /> :
                        college.status === 'REJECTED' ? <XCircle size={64} /> :
                            college.status === 'CORRECTION_REQUIRED' ? <AlertCircle size={64} /> :
                                <FileText size={64} />}
                </div>
            </div>

            {/* Action Area */}
            {college.is_locked ? (
                <div className="bg-gray-100 p-8 rounded-lg text-center border-2 border-gray-300 border-dashed">
                    <Lock className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-gray-700">Submission Locked</h3>
                    <p className="text-gray-500 mt-2 max-w-lg mx-auto">
                        Your data has been submitted for government verification.
                        Editing is disabled to ensure data integrity during the audit process.
                    </p>
                    <button className="mt-6 px-6 py-2 bg-gray-300 text-gray-600 font-bold rounded cursor-not-allowed">
                        View Submitted Data
                    </button>
                </div>
            ) : (
                <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 text-center">
                    <div className="inline-block p-4 bg-blue-100 rounded-full text-govt-blue mb-4">
                        <FileText size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Complete Your Profile</h3>
                    <p className="text-gray-600 mt-2 mb-6 max-w-lg mx-auto">
                        Submit mandatory Academic, Faculty, and Placement details to get verified.
                        Incomplete profiles are not visible to students.
                    </p>
                    <Link to="/college/submit" className="inline-block px-8 py-3 bg-govt-blue text-white font-bold rounded-lg hover:bg-blue-800 transition-all shadow-md">
                        {college.status === 'CORRECTION_REQUIRED' ? 'Edit & Resubmit' : 'Start Submission'}
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CollegeDashboard;
