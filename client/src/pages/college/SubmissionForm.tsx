
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, Briefcase, Save, AlertTriangle, Upload } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../api';

const SubmissionForm: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        // Academic
        courses_offered: [''],
        fees_per_course: [{ course: '', fee: '' }],
        intake_capacity: '',
        accreditation: '',

        // Faculty
        faculty: [{ name: '', designation: '', qualification: '', experience_years: '', department: '' }],

        // Placement
        placement_percentage: '',
        avg_package: '',
        max_package: '',
        companies_visited: [''],

        // Documents (URLs)
        documents: {
            aicte_approval: '',
            university_affiliation: '',
            naac_certificate: '',
            placement_proof: ''
        }
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        // Validation: PDF only, Max 5MB
        if (file.type !== 'application/pdf') {
            alert('Only PDF files are allowed');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('type', docType);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_BASE_URL}/upload`, uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            setFormData(prev => ({
                ...prev,
                documents: { ...prev.documents, [docType]: res.data.fileUrl }
            }));
        } catch (err) {
            console.error(err);
            alert('File upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- Dynamic Array Handlers ---

    const handleArrayChange = (index: number, value: string, field: 'courses_offered' | 'companies_visited') => {
        const list = [...formData[field]];
        list[index] = value;
        setFormData({ ...formData, [field]: list });
    };

    const addArrayItem = (field: 'courses_offered' | 'companies_visited') => {
        setFormData({ ...formData, [field]: [...formData[field], ''] });
    };

    const removeArrayItem = (index: number, field: 'courses_offered' | 'companies_visited') => {
        const list = [...formData[field]];
        list.splice(index, 1);
        setFormData({ ...formData, [field]: list });
    };

    // --- Complex Object Handlers (Faculty, Fees) ---

    const handleFacultyChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const list = [...formData.faculty];
        // @ts-ignore
        list[index][e.target.name] = e.target.value;
        setFormData({ ...formData, faculty: list });
    };

    const addFaculty = () => {
        setFormData({
            ...formData,
            faculty: [...formData.faculty, { name: '', designation: '', qualification: '', experience_years: '', department: '' }]
        });
    };

    const removeFaculty = (index: number) => {
        const list = [...formData.faculty];
        list.splice(index, 1);
        setFormData({ ...formData, faculty: list });
    };

    // --- Fee Handlers ---
    const handleFeeChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const list = [...formData.fees_per_course];
        // @ts-ignore
        list[index][e.target.name] = e.target.value;
        setFormData({ ...formData, fees_per_course: list });
    };

    const addFee = () => {
        setFormData({
            ...formData,
            fees_per_course: [...formData.fees_per_course, { course: '', fee: '' }]
        });
    };

    const removeFee = (index: number) => {
        const list = [...formData.fees_per_course];
        list.splice(index, 1);
        setFormData({ ...formData, fees_per_course: list });
    };

    // --- Submit Handler ---

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!window.confirm("Are you sure? Once submitted, you cannot edit this data.")) return;

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            // This endpoint will be implemented in the next backend task
            await axios.post(`${API_BASE_URL}/college/submit`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/college/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Submission failed. Please check all fields.');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Data Submission Form</h2>
            <p className="text-gray-500 mb-8 flex items-center gap-2">
                <AlertTriangle size={18} className="text-orange-500" />
                All fields are mandatory. Editing is disabled after submission.
            </p>

            {error && <div className="p-4 mb-6 bg-red-100 text-red-700 rounded border-l-4 border-red-500">{error}</div>}

            <form onSubmit={handleSubmit}>

                {/* Section 1: Academic Details */}
                <div className="mb-8 border p-6 rounded-lg bg-gray-50">
                    <h3 className="text-xl font-bold text-govt-blue flex items-center gap-2 mb-4">
                        <FileText /> Academic Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Accreditation (NAAC Grade)</label>
                            <input type="text" name="accreditation" value={formData.accreditation} onChange={handleChange} className="w-full p-2 border rounded" placeholder="e.g. A++" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Total Intake Capacity</label>
                            <input type="number" name="intake_capacity" value={formData.intake_capacity} onChange={handleChange} className="w-full p-2 border rounded" required />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-semibold mb-2">Courses Offered</label>
                        {formData.courses_offered.map((course: string, index: number) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={course}
                                    onChange={(e) => handleArrayChange(index, e.target.value, 'courses_offered')}
                                    className="flex-1 p-2 border rounded"
                                    placeholder="Course Name (e.g. B.Tech Computer Science)"
                                    required
                                />
                                {index > 0 && <button type="button" onClick={() => removeArrayItem(index, 'courses_offered')} className="text-red-500 font-bold px-2">X</button>}
                            </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem('courses_offered')} className="text-sm text-govt-blue font-bold">+ Add Course</button>
                    </div>

                    <div className="mt-6 border-t pt-4">
                        <label className="block text-sm font-semibold mb-2">Fee Structure</label>
                        {/* @ts-ignore */}
                        {formData.fees_per_course.map((feeObj: any, index: number) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    name="course"
                                    value={feeObj.course}
                                    onChange={(e) => handleFeeChange(index, e)}
                                    className="flex-1 p-2 border rounded"
                                    placeholder="Course Name"
                                    required
                                />
                                <input
                                    type="number"
                                    name="fee"
                                    value={feeObj.fee}
                                    onChange={(e) => handleFeeChange(index, e)}
                                    className="w-32 p-2 border rounded"
                                    placeholder="Fee (₹)"
                                    required
                                />
                                {index > 0 && <button type="button" onClick={() => removeFee(index)} className="text-red-500 font-bold px-2">X</button>}
                            </div>
                        ))}
                        <button type="button" onClick={addFee} className="text-sm text-govt-blue font-bold">+ Add Fee Details</button>
                    </div>
                </div>

                {/* Section 2: Faculty Details */}
                <div className="mb-8 border p-6 rounded-lg bg-gray-50">
                    <h3 className="text-xl font-bold text-govt-blue flex items-center gap-2 mb-4">
                        <Users /> Faculty Details
                    </h3>

                    {formData.faculty.map((member: any, index: number) => (
                        <div key={index} className="mb-4 p-4 bg-white border rounded shadow-sm relative">
                            <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase">Faculty Member #{index + 1}</h4>
                            {index > 0 && <button type="button" onClick={() => removeFaculty(index)} className="absolute top-2 right-2 text-red-500 font-bold">Remove</button>}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input type="text" name="name" value={member.name} onChange={(e) => handleFacultyChange(index, e)} placeholder="Name" className="p-2 border rounded" required />
                                <input type="text" name="designation" value={member.designation} onChange={(e) => handleFacultyChange(index, e)} placeholder="Designation" className="p-2 border rounded" required />
                                <input type="text" name="qualification" value={member.qualification} onChange={(e) => handleFacultyChange(index, e)} placeholder="Qualification" className="p-2 border rounded" required />
                                <input type="number" name="experience_years" value={member.experience_years} onChange={(e) => handleFacultyChange(index, e)} placeholder="Exp (Years)" className="p-2 border rounded" required />
                                <input type="text" name="department" value={member.department} onChange={(e) => handleFacultyChange(index, e)} placeholder="Department" className="p-2 border rounded" required />
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={addFaculty} className="py-2 px-4 bg-white border border-govt-blue text-govt-blue rounded font-semibold hover:bg-blue-50">
                        + Add Faculty Member
                    </button>
                </div>

                {/* Section 3: Placement Details */}
                <div className="mb-8 border p-6 rounded-lg bg-gray-50">
                    <h3 className="text-xl font-bold text-govt-blue flex items-center gap-2 mb-4">
                        <Briefcase /> Placement Statistics
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Placement %</label>
                            <input type="number" step="0.1" name="placement_percentage" value={formData.placement_percentage} onChange={handleChange} className="w-full p-2 border rounded" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Avg Package (LPA)</label>
                            <input type="number" step="0.1" name="avg_package" value={formData.avg_package} onChange={handleChange} className="w-full p-2 border rounded" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Max Package (LPA)</label>
                            <input type="number" step="0.1" name="max_package" value={formData.max_package} onChange={handleChange} className="w-full p-2 border rounded" required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Companies Visited</label>
                        {formData.companies_visited.map((comp: string, index: number) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={comp}
                                    onChange={(e) => handleArrayChange(index, e.target.value, 'companies_visited')}
                                    className="flex-1 p-2 border rounded"
                                    placeholder="Company Name"
                                    required
                                />
                                {index > 0 && <button type="button" onClick={() => removeArrayItem(index, 'companies_visited')} className="text-red-500 font-bold px-2">X</button>}
                            </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem('companies_visited')} className="text-sm text-govt-blue font-bold">+ Add Company</button>
                    </div>
                </div>

                {/* Section 4: Mandatory Documents */}
                <div className="mb-8 border p-6 rounded-lg bg-gray-50">
                    <h3 className="text-xl font-bold text-govt-blue flex items-center gap-2 mb-4">
                        <Upload /> Mandatory Documents (PDF Only)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { label: 'AICTE Approval', key: 'aicte_approval' },
                            { label: 'University Affiliation', key: 'university_affiliation' },
                            { label: 'NAAC Certificate', key: 'naac_certificate' },
                            { label: 'Placement Proof', key: 'placement_proof' },
                        ].map((doc) => (
                            <div key={doc.key} className="border p-4 rounded bg-white">
                                <label className="block text-sm font-bold mb-2 text-gray-700">{doc.label}</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => handleFileUpload(e, doc.key)}
                                        className="text-sm"
                                        disabled={uploading}
                                        required
                                    />
                                    {/* @ts-ignore */}
                                    {formData.documents[doc.key] && <span className="text-green-600 font-bold text-xs">✓ Uploaded</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-right">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-4 bg-green-600 text-white font-bold text-lg rounded hover:bg-green-700 shadow-lg flex items-center gap-2 ml-auto"
                    >
                        {loading ? 'Submitting...' : <><Save /> Final Submit</>}
                    </button>
                    <p className="text-xs text-gray-500 mt-2">By clicking submit, you certify that all data is authentic.</p>
                </div>

            </form>
        </div>
    );
};

export default SubmissionForm;
