
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md border-b-4 border-govt-gold custom-header">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo Section */}
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-govt-blue rounded-full text-white">
                        <ShieldCheck size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-govt-blue tracking-tight">EduSphere</h1>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Government Verified Portal</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
                    <a href="/#" className="hover:text-govt-blue transition-colors">Home</a>
                    <a href="/#scholarships" className="hover:text-govt-blue transition-colors">Scholarships</a>
                    <a href="/#trending" className="hover:text-govt-blue transition-colors">Trending Courses</a>
                    <a href="/#verified" className="hover:text-govt-blue transition-colors text-govt-blue flex items-center gap-1">
                        <ShieldCheck size={16} /> Verified Colleges
                    </a>
                </nav>

                {/* Login Buttons */}
                <div className="flex items-center space-x-3">
                    <Link to="/login/student" className="px-4 py-2 text-sm font-semibold text-govt-blue border border-govt-blue rounded-md hover:bg-govt-blue hover:text-white transition-all">
                        Student Login
                    </Link>
                    <Link to="/login/college" className="px-4 py-2 text-sm font-semibold text-white bg-govt-blue rounded-md hover:bg-blue-800 transition-all shadow-sm">
                        College Login
                    </Link>
                    <Link to="/login/gov" className="text-xs text-gray-400 hover:text-gray-600 font-semibold underline">
                        Officer
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
