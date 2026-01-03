
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, GraduationCap, Plus, Trash2, TrendingUp, BookOpen, Pencil } from 'lucide-react';
import API_BASE_URL from '../../api';

interface College {
    id: string;
    name: string;
    code: string;
    email: string;
    status: string;
    is_locked: boolean;
    principal_name: string;
    address: string;
}

interface Scholarship {
    id: string;
    name: string;
    amount: string;
    eligibility: string;
    link?: string;
}

interface TrendingCourse {
    id: string;
    name: string;
    category: string;
    description: string;
}

const GovDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'verification' | 'scholarships' | 'courses'>('verification');
    const [colleges, setColleges] = useState<College[]>([]);
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [courses, setCourses] = useState<TrendingCourse[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [newScholarship, setNewScholarship] = useState({ name: '', amount: '', eligibility: '', link: '' });
    const [newCourse, setNewCourse] = useState({ name: '', category: '', description: '' });

    // Edit State
    const [editingScholarshipId, setEditingScholarshipId] = useState<string | null>(null);
    const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        try {
            const collegesRes = await axios.get(`${API_BASE_URL}/gov/colleges`, { headers });
            setColleges(collegesRes.data);
        } catch (err) {
            console.error("Failed to load colleges", err);
        }

        try {
            const scholarshipsRes = await axios.get(`${API_BASE_URL}/gov/scholarships`, { headers });
            setScholarships(scholarshipsRes.data);
        } catch (err) {
            console.error("Failed to load scholarships", err);
        }

        try {
            const coursesRes = await axios.get(`${API_BASE_URL}/gov/trending-courses`, { headers });
            setCourses(coursesRes.data);
        } catch (err) {
            console.error("Failed to load trending courses", err);
        }

        setLoading(false);
    };

    // --- Scholarship Handlers ---
    const handleAddScholarship = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (editingScholarshipId) {
                // Update Logic
                const res = await axios.put(`${API_BASE_URL}/gov/scholarships/${editingScholarshipId}`, newScholarship, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setScholarships(scholarships.map(s => s.id === editingScholarshipId ? res.data : s));
                setEditingScholarshipId(null);
                alert('Scholarship Updated Successfully');
            } else {
                // Add Logic
                const res = await axios.post(`${API_BASE_URL}/gov/scholarships`, newScholarship, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setScholarships([...scholarships, res.data]);
                alert('Scholarship Added Successfully');
            }
            setNewScholarship({ name: '', amount: '', eligibility: '', link: '' });
        } catch (err) {
            alert('Failed to save scholarship');
        }
    };

    const handleEditScholarship = (sch: Scholarship) => {
        setNewScholarship({
            name: sch.name,
            amount: sch.amount,
            eligibility: sch.eligibility,
            link: sch.link || ''
        });
        setEditingScholarshipId(sch.id);
    };

    const handleCancelEditScholarship = () => {
        setNewScholarship({ name: '', amount: '', eligibility: '', link: '' });
        setEditingScholarshipId(null);
    }

    const handleDeleteScholarship = async (id: string) => {
        if (!window.confirm('Delete this scholarship?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/gov/scholarships/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setScholarships(scholarships.filter(s => s.id !== id));
        } catch (err) {
            alert('Failed to delete scholarship');
        }
    };

    // --- Trending Course Handlers ---
    const handleAddCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (editingCourseId) {
                const res = await axios.put(`${API_BASE_URL}/gov/trending-courses/${editingCourseId}`, newCourse, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCourses(courses.map(c => c.id === editingCourseId ? res.data : c));
                setEditingCourseId(null);
                alert('Course Updated Successfully');
            } else {
                const res = await axios.post(`${API_BASE_URL}/gov/trending-courses`, newCourse, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCourses([...courses, res.data]);
                alert('Trending Course Added Successfully');
            }
            setNewCourse({ name: '', category: '', description: '' });
        } catch (err) {
            alert('Failed to save course');
        }
    };

    const handleEditCourse = (course: TrendingCourse) => {
        setNewCourse({
            name: course.name,
            category: course.category,
            description: course.description
        });
        setEditingCourseId(course.id);
    };

    const handleCancelEditCourse = () => {
        setNewCourse({ name: '', category: '', description: '' });
        setEditingCourseId(null);
    }

    const handleDeleteCourse = async (id: string) => {
        if (!window.confirm('Delete this course?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/gov/trending-courses/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCourses(courses.filter(c => c.id !== id));
        } catch (err) {
            alert('Failed to delete course');
        }
    };

    if (loading) return <div className="text-center p-10">Loading Dashboard...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Government Dashboard</h2>
                    <p className="text-gray-500">Manage verifications and student welfare</p>
                </div>

                <div className="flex bg-white rounded-lg p-1 shadow-sm border">
                    <button onClick={() => setActiveTab('verification')} className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${activeTab === 'verification' ? 'bg-govt-blue text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}>Requests</button>
                    <button onClick={() => setActiveTab('scholarships')} className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${activeTab === 'scholarships' ? 'bg-govt-blue text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}>Scholarships</button>
                    <button onClick={() => setActiveTab('courses')} className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${activeTab === 'courses' ? 'bg-govt-blue text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}>Trending Courses</button>
                </div>
            </header>

            {activeTab === 'verification' && (
                <>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Building2 className="text-govt-blue" /> Pending College Verifications
                    </h3>
                    {colleges.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded shadow">
                            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-400">No Pending Applications</h3>
                            <p className="text-gray-400">All submitted colleges have been processed.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="p-4 font-semibold text-gray-600">College Name</th>
                                        <th className="p-4 font-semibold text-gray-600">Code</th>
                                        <th className="p-4 font-semibold text-gray-600">Principal</th>
                                        <th className="p-4 font-semibold text-gray-600">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {colleges.map((college) => (
                                        <tr key={college.id} className="border-b hover:bg-gray-50">
                                            <td className="p-4 font-bold">{college.name}</td>
                                            <td className="p-4 font-mono text-sm">{college.code}</td>
                                            <td className="p-4 text-sm">{college.principal_name}</td>
                                            <td className="p-4">
                                                <Link to={`/gov/verify/${college.id}`} className="inline-flex items-center gap-2 px-3 py-1 bg-govt-blue text-white rounded text-sm hover:bg-blue-800">
                                                    Verify <ArrowRight size={14} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {activeTab === 'scholarships' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* List */}
                    <div className="md:col-span-2">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <GraduationCap className="text-govt-blue" /> Active Scholarships
                        </h3>
                        <div className="grid gap-4">
                            {scholarships.map((sch) => (
                                <div key={sch.id} className="bg-white p-6 rounded-lg shadow border flex justify-between items-start">
                                    <div>
                                        <h4 className="text-lg font-bold text-govt-blue">{sch.name}</h4>
                                        <p className="text-2xl font-black mt-1">₹{sch.amount}</p>
                                        <p className="text-sm text-gray-600 mt-2"><span className="font-bold">Eligibility:</span> {sch.eligibility}</p>
                                        {sch.link && <a href={sch.link} target="_blank" rel="noreferrer" className="text-xs text-blue-500 underline mt-2 block">View Details</a>}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEditScholarship(sch)} className="text-blue-500 hover:bg-blue-50 p-2 rounded">
                                            <Pencil size={20} />
                                        </button>
                                        <button onClick={() => handleDeleteScholarship(sch.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {scholarships.length === 0 && <p className="text-gray-500 italic">No active scholarships.</p>}
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white p-6 rounded-lg shadow h-fit border">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Plus size={20} /> {editingScholarshipId ? 'Edit Scholarship' : 'Add New Scholarship'}
                            </h3>
                            {editingScholarshipId && <button onClick={handleCancelEditScholarship} className="text-xs text-red-500 hover:underline">Cancel</button>}
                        </div>
                        <form onSubmit={handleAddScholarship} className="space-y-4">
                            <div><label className="block text-sm font-semibold mb-1">Scholarship Name</label><input type="text" value={newScholarship.name} onChange={e => setNewScholarship({ ...newScholarship, name: e.target.value })} className="w-full p-2 border rounded" required /></div>
                            <div><label className="block text-sm font-semibold mb-1">Amount (₹)</label><input type="text" value={newScholarship.amount} onChange={e => setNewScholarship({ ...newScholarship, amount: e.target.value })} className="w-full p-2 border rounded" required /></div>
                            <div><label className="block text-sm font-semibold mb-1">Eligibility Criteria</label><textarea value={newScholarship.eligibility} onChange={e => setNewScholarship({ ...newScholarship, eligibility: e.target.value })} className="w-full p-2 border rounded" rows={2} required /></div>
                            <div><label className="block text-sm font-semibold mb-1">External Link (Optional)</label><input type="url" value={newScholarship.link} onChange={e => setNewScholarship({ ...newScholarship, link: e.target.value })} className="w-full p-2 border rounded" placeholder="https://..." /></div>
                            <button type="submit" className={`w-full py-2 ${editingScholarshipId ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'} text-white font-bold rounded`}>
                                {editingScholarshipId ? 'Update Scholarship' : 'Publish Scholarship'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {activeTab === 'courses' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <TrendingUp className="text-govt-blue" /> Trending Courses
                        </h3>
                        <div className="grid gap-4">
                            {courses.map((course) => (
                                <div key={course.id} className="bg-white p-6 rounded-lg shadow border flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <BookOpen size={18} className="text-blue-500" />
                                            <h4 className="text-lg font-bold text-gray-800">{course.name}</h4>
                                        </div>
                                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded mt-2">{course.category}</span>
                                        <p className="text-sm text-gray-600 mt-2">{course.description}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEditCourse(course)} className="text-blue-500 hover:bg-blue-50 p-2 rounded">
                                            <Pencil size={20} />
                                        </button>
                                        <button onClick={() => handleDeleteCourse(course.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {courses.length === 0 && <p className="text-gray-500 italic">No trending courses listed.</p>}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow h-fit border">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Plus size={20} /> {editingCourseId ? 'Edit Course' : 'Add Trending Course'}
                            </h3>
                            {editingCourseId && <button onClick={handleCancelEditCourse} className="text-xs text-red-500 hover:underline">Cancel</button>}
                        </div>
                        <form onSubmit={handleAddCourse} className="space-y-4">
                            <div><label className="block text-sm font-semibold mb-1">Course Name</label><input type="text" value={newCourse.name} onChange={e => setNewCourse({ ...newCourse, name: e.target.value })} className="w-full p-2 border rounded" placeholder="e.g. B.Tech AI & DS" required /></div>
                            <div><label className="block text-sm font-semibold mb-1">Category</label><input type="text" value={newCourse.category} onChange={e => setNewCourse({ ...newCourse, category: e.target.value })} className="w-full p-2 border rounded" placeholder="e.g. Engineering" required /></div>
                            <div><label className="block text-sm font-semibold mb-1">Description (Optional)</label><textarea value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} className="w-full p-2 border rounded" rows={3} /></div>
                            <button type="submit" className={`w-full py-2 ${editingCourseId ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold rounded`}>
                                {editingCourseId ? 'Update Course' : 'Add Course'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GovDashboard;
