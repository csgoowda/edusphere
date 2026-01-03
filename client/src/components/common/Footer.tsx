
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-govt-blue text-white pt-10 pb-6 border-t-4 border-govt-gold mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">EduSphere</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            The official government portal for higher education verification and transparency.
                            Ensuring a future free of fake degrees and unverified institutions.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 text-govt-gold">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><button className="hover:text-white transition-colors">Department of Education</button></li>
                            <li><button className="hover:text-white transition-colors">UGC Official Website</button></li>
                            <li><button className="hover:text-white transition-colors">AICTE Portal</button></li>
                            <li><button className="hover:text-white transition-colors">Grievance Redressal</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 text-govt-gold">Contact Us</h4>
                        <div className="text-sm text-gray-300 space-y-2">
                            <p>Ministry of Education</p>
                            <p>Shastri Bhawan, New Delhi</p>
                            <p>Helpline: 1800-111-EDU</p>
                            <p>Email: support@edusphere.gov.in</p>
                        </div>
                    </div>
                </div>
                <div className="border-t border-blue-800 pt-6 text-center text-xs text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Government of India. All Rights Reserved.</p>
                    <p className="mt-2 text-gray-500">
                        This portal is designed and developed by National Informatics Centre.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
