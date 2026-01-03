
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle, FileText, ArrowLeft, ExternalLink } from 'lucide-react';
import API_BASE_URL from '../../api';

const VerifyCollege: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [remarks, setRemarks] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_BASE_URL}/gov/colleges/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDetails();
    }, [id]);

    const handleAction = async (action: 'APPROVED' | 'REJECTED' | 'CORRECTION_REQUIRED') => {
        if (action !== 'APPROVED' && !remarks.trim()) {
            alert('Please provide remarks for Rejection/Correction.');
            return;
        }
        if (!window.confirm(`Are you sure you want to mark this as ${action}?`)) return;

        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/gov/verify`, {
                collegeId: id,
                action,
                remarks
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(`College ${action} Successfully`);
            navigate('/gov/dashboard');
        } catch (err: any) {
            alert(err.response?.data?.error || 'Verification Failed');
        } finally {
            setActionLoading(false);
        }
    };

    if (!data) return <div className="p-10 text-center">Loading Data...</div>;

    const academic = data.academic_details;
    const placement = data.placement_details;

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-6 hover:text-govt-blue">
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <header className="flex justify-between items-start mb-8 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{data.name}</h1>
                    <p className="text-gray-500">AISHE Code: <span className="font-mono font-bold text-black">{data.code}</span></p>
                    <p className="text-sm mt-1">{data.address} | Principal: {data.principal_name} ({data.principal_phone})</p>
                </div>
                <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded font-bold text-sm">
                        {data.status}
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Data */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Academic Section */}
                    <section className="bg-white p-6 rounded shadow border">
                        <h3 className="text-lg font-bold text-govt-blue mb-4 flex items-center gap-2">
                            <FileText size={20} /> Academic Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Accreditation</p>
                                <p className="font-semibold">{academic?.accreditation || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Intake Capacity</p>
                                <p className="font-semibold">{academic?.intake_capacity}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-gray-500 text-sm mb-1">Courses Offered</p>
                            <div className="flex flex-wrap gap-2">
                                {academic?.courses_offered ? JSON.parse(academic.courses_offered).map((c: string, i: number) => (
                                    <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs border">{c}</span>
                                )) : 'None'}
                            </div>
                        </div>
                    </section>

                    {/* Faculty Section */}
                    <section className="bg-white p-6 rounded shadow border">
                        <h3 className="text-lg font-bold text-govt-blue mb-4">Faculty List ({data.faculty?.length || 0})</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-2">Name</th>
                                        <th className="p-2">Designation</th>
                                        <th className="p-2">Qual.</th>
                                        <th className="p-2">Exp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.faculty?.map((f: any) => (
                                        <tr key={f.id} className="border-b">
                                            <td className="p-2 font-medium">{f.name}</td>
                                            <td className="p-2">{f.designation}</td>
                                            <td className="p-2">{f.qualification}</td>
                                            <td className="p-2">{f.experience_years} yrs</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Placement Section */}
                    <section className="bg-white p-6 rounded shadow border">
                        <h3 className="text-lg font-bold text-govt-blue mb-4">Placement Statistics</h3>
                        <div className="grid grid-cols-3 gap-4 text-center mb-4">
                            <div className="p-3 bg-green-50 rounded">
                                <p className="text-xs text-gray-500">Placement %</p>
                                <p className="text-xl font-bold text-green-700">{placement?.placement_percentage}%</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded">
                                <p className="text-xs text-gray-500">Avg Package</p>
                                <p className="text-xl font-bold text-blue-700">{placement?.avg_package} LPA</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded">
                                <p className="text-xs text-gray-500">Max Package</p>
                                <p className="text-xl font-bold text-purple-700">{placement?.max_package} LPA</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-2">Companies Visited</p>
                            <p className="text-sm">
                                {placement?.companies_visited ? JSON.parse(placement.companies_visited).join(', ') : 'N/A'}
                            </p>
                        </div>
                    </section>
                </div>

                {/* Right Column: Actions & Docs */}
                <div className="space-y-8">

                    {/* Documents */}
                    <section className="bg-white p-6 rounded shadow border">
                        <h3 className="text-lg font-bold text-govt-blue mb-4">Uploaded Documents</h3>
                        <div className="space-y-3">
                            {data.documents?.map((doc: any) => (
                                <button
                                    key={doc.id}
                                    onClick={async () => {
                                        try {
                                            const token = localStorage.getItem('token');
                                            const filename = doc.url.split('/uploads/')[1];
                                            const response = await axios.get(`${API_BASE_URL}/upload/${filename}`, {
                                                headers: { Authorization: `Bearer ${token}` },
                                                responseType: 'blob'
                                            });
                                            const url = window.URL.createObjectURL(new Blob([response.data]));
                                            window.open(url, '_blank');
                                        } catch (e) {
                                            alert('Failed to open document. Authorization required.');
                                        }
                                    }}
                                    className="w-full text-left bg-white p-3 border rounded hover:bg-gray-50 flex items-center justify-between group cursor-pointer"
                                >
                                    <div>
                                        <p className="font-semibold text-sm capitalize">{doc.doc_type.replace('_', ' ')}</p>
                                        <p className="text-xs text-gray-400">Click to View (Secure)</p>
                                    </div>
                                    <ExternalLink size={16} className="text-gray-400 group-hover:text-govt-blue" />
                                </button>
                            ))}
                            {(!data.documents || data.documents.length === 0) && <p className="text-sm text-gray-400">No documents uploaded.</p>}
                        </div>
                    </section>

                    {/* Action Panel */}
                    <section className="bg-gray-50 p-6 rounded-lg border-2 border-govt-gold">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Verification Actions</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Officer Remarks (Allowed for Public View)</label>
                            <textarea
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                className="w-full p-3 border rounded h-24 text-sm"
                                placeholder="Enter reasons for rejection or correction requests..."
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={() => handleAction('APPROVED')}
                                disabled={actionLoading}
                                className="w-full py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={18} /> Approve College
                            </button>

                            <button
                                onClick={() => handleAction('CORRECTION_REQUIRED')}
                                disabled={actionLoading}
                                className="w-full py-3 bg-yellow-500 text-white font-bold rounded hover:bg-yellow-600 flex items-center justify-center gap-2"
                            >
                                <AlertCircle size={18} /> Request Correction
                            </button>

                            <button
                                onClick={() => handleAction('REJECTED')}
                                disabled={actionLoading}
                                className="w-full py-3 bg-red-600 text-white font-bold rounded hover:bg-red-700 flex items-center justify-center gap-2"
                            >
                                <XCircle size={18} /> Reject Application
                            </button>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default VerifyCollege;
