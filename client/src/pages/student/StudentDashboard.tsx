
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin, GraduationCap, CheckCircle } from 'lucide-react';
import API_BASE_URL from '../../api';

const StudentDashboard: React.FC = () => {
    const [colleges, setColleges] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchColleges = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_BASE_URL}/student/colleges`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setColleges(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchColleges();
    }, []);

    return (
        <div className="max-w-6xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Verified Colleges</h1>
                <p className="text-gray-500">Only government verified institutions are listed here.</p>
            </header>

            {loading ? <div className="text-center p-10">Loading...</div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {colleges.map((college) => (
                        <div key={college.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-200 border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{college.name}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                                    <MapPin size={16} /> {college.address}
                                </p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Accreditation</span>
                                        <span className="font-semibold text-blue-600">{college.academic_details?.accreditation || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Avg. Package</span>
                                        <span className="font-semibold text-green-600">₹ {college.placement_details?.avg_package} LPA</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Placement %</span>
                                        <span className="font-semibold text-purple-600">{college.placement_details?.placement_percentage}%</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {college.academic_details?.courses_offered ? JSON.parse(college.academic_details.courses_offered).slice(0, 3).map((c: string, i: number) => (
                                        <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{c}</span>
                                    )) : null}
                                </div>
                            </div>
                            <div className="px-6 py-3 bg-gray-50 border-t flex justify-between items-center">
                                <span className="flex items-center gap-1 text-xs font-bold text-green-600 uppercase">
                                    <CheckCircle size={14} /> Verified
                                </span>
                                <button className="text-sm text-blue-600 font-bold hover:underline">View Details</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && colleges.length === 0 && (
                <div className="text-center py-20 bg-white rounded shadow">
                    <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-400">No Verified Colleges Found</h3>
                    <p className="text-gray-400">Please check back later.</p>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
