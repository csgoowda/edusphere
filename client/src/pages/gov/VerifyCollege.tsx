
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
    const [checklist, setChecklist] = useState({
        registration: false,
        address: false,
        accreditation: false,
        courses: false,
        contact: false
    });

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

    const handleAction = async (action: 'APPROVED' | 'REJECTED' | 'CORRECTION_REQUIRED' | 'RENEW' | 'REVOKE') => {
        if ((action === 'REJECTED' || action === 'CORRECTION_REQUIRED' || action === 'REVOKE') && !remarks.trim()) {
            alert('Please provide remarks for this action.');
            return;
        }

        // Checklist check for approval
        if (action === 'APPROVED') {
            const allChecked = Object.values(checklist).every(v => v);
            if (!allChecked) {
                alert('All checklist items must be verified before approval.');
                return;
            }
        }

        if (!window.confirm(`Are you sure you want to perform action: ${action}?`)) return;

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
            alert(err.response?.data?.error || 'Action Failed');
        } finally {
            setActionLoading(false);
        }
    };

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    if (!data) return <div className="p-10 text-center">Loading Data...</div>;

    const academic = data.academic_details;
    const placement = data.placement_details;

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Image Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white bg-red-500"
                        >
                            <XCircle size={24} />
                        </button>
                        <div className="p-4 flex items-center justify-center bg-gray-900">
                            <img src={previewImage} alt="Preview" className="max-w-full max-h-[80vh] object-contain" />
                        </div>
                        <div className="p-4 text-center border-t">
                            <a href={previewImage} download className="px-4 py-2 bg-govt-blue text-white rounded font-bold hover:bg-blue-800">Download Image</a>
                        </div>
                    </div>
                </div>
            )}

            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-6 hover:text-govt-blue">
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <header className="flex justify-between items-start mb-8 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{data.name}</h1>
                    <p className="text-gray-500 flex items-center gap-2">
                        AISHE Code: <span className="font-mono font-bold text-black">{data.code}</span>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded border">{data.college_type}</span>
                    </p>
                    <p className="text-sm mt-1">{data.address} | Principal: {data.principal_name} ({data.principal_phone})</p>
                    <p className="text-xs text-gray-400 mt-1">{data.district}, {data.state}, {data.country}</p>
                </div>
                <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded font-bold text-sm ${data.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        data.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {data.status}
                    </span>
                    {data.valid_until && (
                        <p className="text-xs mt-2 text-gray-500">Expires: {new Date(data.valid_until).toLocaleDateString()}</p>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Data */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Basic Info (Read-Only) */}
                    <section className="bg-white p-6 rounded shadow border">
                        <h3 className="text-lg font-bold text-govt-blue mb-4 flex items-center gap-2">
                            <CheckCircle size={20} /> Institutional Profile
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                            <div>
                                <p className="text-gray-500">Website</p>
                                <a href={data.website || '#'} className="font-semibold text-blue-600 hover:underline">{data.website || 'N/A'}</a>
                            </div>
                            <div>
                                <p className="text-gray-500">Email (Official)</p>
                                <p className="font-semibold">{data.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Principal</p>
                                <p className="font-semibold">{data.principal_name}</p>
                            </div>
                        </div>
                    </section>

                    {/* Academic Section */}
                    <section className="bg-white p-6 rounded shadow border">
                        <h3 className="text-lg font-bold text-govt-blue mb-4 flex items-center gap-2">
                            <FileText size={20} /> Academic Details
                        </h3>
                        {/* ... (Existing Content) */}
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
                                {academic?.courses_offered ? (
                                    typeof academic.courses_offered === 'string' ? JSON.parse(academic.courses_offered).map((c: string, i: number) => (
                                        <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs border">{c}</span>
                                    )) : academic.courses_offered.map((c: string, i: number) => (
                                        <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs border">{c}</span>
                                    ))
                                ) : 'None'}
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
                                {placement?.companies_visited ? (
                                    typeof placement.companies_visited === 'string' ? JSON.parse(placement.companies_visited).join(', ') : placement.companies_visited.join(', ')
                                ) : 'N/A'}
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
                                            const response = await axios.get(`${API_BASE_URL}/documents/${doc.id}`, {
                                                headers: { Authorization: `Bearer ${token}` },
                                                responseType: 'blob'
                                            });
                                            const contentType = response.headers['content-type'] || 'application/pdf';
                                            const file = new Blob([response.data], { type: contentType });
                                            const fileURL = URL.createObjectURL(file);

                                            if (contentType.includes('image')) {
                                                setPreviewImage(fileURL);
                                            } else {
                                                window.open(fileURL, '_blank');
                                            }
                                        } catch (e) {
                                            console.error(e);
                                            alert('Failed to open document.');
                                        }
                                    }}
                                    className="w-full text-left bg-white p-3 border rounded hover:bg-gray-50 flex items-center justify-between group cursor-pointer"
                                >
                                    <div>
                                        <p className="font-semibold text-sm capitalize">{doc.doc_type ? doc.doc_type.replace('_', ' ') : 'Document'}</p>
                                        <p className="text-xs text-gray-400">View Attachment</p>
                                    </div>
                                    <ExternalLink size={16} className="text-gray-400 group-hover:text-govt-blue" />
                                </button>
                            ))}
                            {(!data.documents || data.documents.length === 0) && <p className="text-sm text-gray-400">No documents uploaded.</p>}
                        </div>
                    </section>

                    {/* Officer Checklist (Only for Pending) */}
                    {data.status !== 'APPROVED' && (
                        <section className="bg-white p-6 rounded shadow border">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Verification Checklist</h3>
                            <div className="space-y-3">
                                {Object.entries({
                                    registration: 'Registration Valid',
                                    address: 'Address Verified',
                                    accreditation: 'Accreditation Verified',
                                    courses: 'Courses Approved',
                                    contact: 'Contact Details Valid'
                                }).map(([key, label]) => (
                                    <label key={key} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer border border-transparent hover:border-gray-200">
                                        <input
                                            type="checkbox"
                                            checked={(checklist as any)[key]}
                                            onChange={(e) => setChecklist({ ...checklist, [key]: e.target.checked })}
                                            className="w-5 h-5 accent-govt-blue"
                                        />
                                        <span className="text-sm font-medium text-gray-700">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Action Panel */}
                    <section className="bg-gray-50 p-6 rounded-lg border-2 border-govt-gold">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                            {data.status === 'APPROVED' ? 'Renewal Management' : 'Verification Actions'}
                        </h3>

                        <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Officer Remarks</label>
                            <textarea
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                className="w-full p-3 border rounded h-24 text-sm"
                                placeholder={data.status === 'APPROVED' ? "Enter renewal or revocation reason..." : "Enter reasons for rejection or correction requests..."}
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {data.status !== 'APPROVED' ? (
                                <>
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
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => handleAction('RENEW')}
                                        disabled={actionLoading}
                                        className="w-full py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={18} /> Renew Approval (+6 Months)
                                    </button>

                                    <button
                                        onClick={() => handleAction('REVOKE')}
                                        disabled={actionLoading}
                                        className="w-full py-3 bg-red-600 text-white font-bold rounded hover:bg-red-700 flex items-center justify-center gap-2"
                                    >
                                        <XCircle size={18} /> Revoke Approval
                                    </button>
                                </>
                            )}
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default VerifyCollege;
