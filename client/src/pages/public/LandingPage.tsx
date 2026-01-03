
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BookOpen, Award, ArrowRight, ShieldCheck, TrendingUp, Building2 } from 'lucide-react';
import API_BASE_URL from '../../api';

const LandingPage: React.FC = () => {
    const [stats, setStats] = useState({
        total_colleges: 0,
        verified_institutes: 0,
        registered_students: 0,
        avg_placement_package: '0'
    });
    const [trending, setTrending] = useState<any[]>([]);
    const [scholarships, setScholarships] = useState<any[]>([]);

    useEffect(() => {
        const fetchPublicData = async () => {
            try {
                const statsRes = await axios.get(`${API_BASE_URL}/public/stats`);
                setStats(statsRes.data);

                const trendRes = await axios.get(`${API_BASE_URL}/public/trending`);
                setTrending(trendRes.data);

                const schRes = await axios.get(`${API_BASE_URL}/public/scholarships`);
                setScholarships(schRes.data);
            } catch (err) {
                console.error("Failed to load public data");
            }
        };
        fetchPublicData();
    }, []);

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-govt-blue to-blue-900 text-white pt-20 pb-24 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-blue-800 bg-opacity-50 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-blue-700">
                            <ShieldCheck size={18} className="text-green-400" />
                            <span>Government Verified Platform</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-white">
                            Your Future, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Verified.</span>
                        </h1>
                        <p className="text-xl text-blue-100 mb-8 max-w-lg">
                            EduSphere is the official portal for authenticated college data, verified placements, and secure admissions. No fake claims, just facts.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/login/student" className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg transition transform hover:-translate-y-1">
                                Student Login <ArrowRight size={20} />
                            </Link>
                            <Link to="/register/college" className="px-8 py-4 bg-white text-govt-blue font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition">
                                Institute Register
                            </Link>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <img src="/hero.png" alt="Education" className="rounded-lg shadow-2xl border-4 border-white/10" />
                    </div>
                </div>

                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600 rounded-full filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
            </section>

            {/* Live Stats */}
            <section id="verified" className="py-12 bg-gray-50 border-b relative -mt-10 mx-6 rounded-xl shadow-lg max-w-7xl md:mx-auto z-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-200">
                    <div className="p-4">
                        <div className="text-4xl font-black text-govt-blue mb-2">{stats.verified_institutes}</div>
                        <div className="text-gray-600 font-semibold uppercase text-xs tracking-wider">Verified Colleges</div>
                    </div>
                    <div className="p-4">
                        <div className="text-4xl font-black text-green-600 mb-2">{stats.total_colleges}</div>
                        <div className="text-gray-600 font-semibold uppercase text-xs tracking-wider">Total Registered</div>
                    </div>
                    <div className="p-4">
                        <div className="text-4xl font-black text-purple-600 mb-2">{stats.registered_students}+</div>
                        <div className="text-gray-600 font-semibold uppercase text-xs tracking-wider">Active Students</div>
                    </div>
                    <div className="p-4">
                        <div className="text-4xl font-black text-orange-500 mb-2">₹{stats.avg_placement_package}L</div>
                        <div className="text-gray-600 font-semibold uppercase text-xs tracking-wider">Avg Package</div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose EduSphere?</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">We provide a unified ecosystem for students, colleges, and the government to ensure transparency and quality in education.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 bg-white border rounded-xl hover:shadow-xl transition group">
                        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">100% Verified Data</h3>
                        <p className="text-gray-500">Every piece of data, from faculty to placements, is verified by government officers before being published.</p>
                    </div>
                    <div className="p-8 bg-white border rounded-xl hover:shadow-xl transition group">
                        <div className="w-14 h-14 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition">
                            <TrendingUp size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Placement Transparency</h3>
                        <p className="text-gray-500">View real placement records, average packages, and top recruiters with uploaded proof documents.</p>
                    </div>
                    <div className="p-8 bg-white border rounded-xl hover:shadow-xl transition group">
                        <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition">
                            <BookOpen size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Scholarship Access</h3>
                        <p className="text-gray-500">Direct access to government scholarships like Pragati and Saksham for eligible students.</p>
                    </div>
                </div>
            </section>

            {/* Scholarships Section */}
            <section id="scholarships" className="py-20 bg-blue-50 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Government Scholarships</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Financial aid opportunities available for eligible students.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {scholarships.length > 0 ? (
                            scholarships.map((sch) => (
                                <div key={sch.id} className="bg-white p-8 rounded-xl shadow-md border-t-4 border-purple-500 hover:shadow-xl transition">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{sch.name}</h3>
                                    <div className="text-3xl font-black text-purple-600 mb-4">₹{sch.amount}</div>
                                    <p className="text-gray-600 mb-6"><span className="font-semibold">Eligibility:</span> {sch.eligibility}</p>
                                    <a href={sch.link || "#"} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-3 bg-purple-50 text-purple-700 font-bold rounded-lg hover:bg-purple-100 transition">
                                        Apply Now
                                    </a>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center text-gray-500">No scholarships available at the moment.</div>
                        )}
                    </div>
                </div>
            </section>

            {/* Trending Courses */}
            <section id="trending" className="py-20 bg-gray-50 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 mb-12">Trending Courses This Year</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {trending.map((course, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border flex items-center gap-4 hover:border-govt-blue transition cursor-default">
                                <div className="p-3 bg-gray-100 rounded-full text-gray-600">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">{course.name}</h4>
                                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">High Demand</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 px-6 bg-govt-blue text-white text-center">
                <div className="max-w-3xl mx-auto">
                    <Building2 className="w-16 h-16 mx-auto mb-6 opacity-80" />
                    <h2 className="text-4xl font-bold mb-6">Are you an Educational Institute?</h2>
                    <p className="text-xl text-blue-200 mb-8">Join the national verified network today. Submit your data and get the 'Government Verified' badge.</p>
                    <Link to="/register/college" className="inline-block px-10 py-4 bg-white text-govt-blue font-bold rounded-lg shadow-xl hover:bg-gray-100 transition">
                        Register Institute Now
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
