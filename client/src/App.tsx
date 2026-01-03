import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/common/Layout';

import LandingPage from './pages/public/LandingPage';

// Auth Pages
import CollegeLogin from './pages/auth/CollegeLogin';
import CollegeRegister from './pages/auth/CollegeRegister';
import GovLogin from './pages/auth/GovLogin';
import StudentLogin from './pages/auth/StudentLogin';

// Dashboards & Pages
import GovDashboard from './pages/gov/GovDashboard';
import VerifyCollege from './pages/gov/VerifyCollege';

import StudentProfile from './pages/student/StudentProfile';
import StudentDashboard from './pages/student/StudentDashboard';

import CollegeDashboard from './pages/college/CollegeDashboard';
import SubmissionForm from './pages/college/SubmissionForm';

// Route Guard
import ProtectedRoute from './components/common/ProtectedRoute';

const App: React.FC = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    {/* Public */}
                    <Route path="/" element={<LandingPage />} />

                    {/* Auth */}
                    <Route path="/login/college" element={<CollegeLogin />} />
                    <Route path="/register/college" element={<CollegeRegister />} />
                    <Route path="/login/gov" element={<GovLogin />} />
                    <Route path="/login/student" element={<StudentLogin />} />

                    {/* Government */}
                    <Route
                        path="/gov/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['GOV']}>
                                <GovDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/gov/verify/:id"
                        element={
                            <ProtectedRoute allowedRoles={['GOV']}>
                                <VerifyCollege />
                            </ProtectedRoute>
                        }
                    />

                    {/* Student */}
                    <Route
                        path="/student/profile"
                        element={
                            <ProtectedRoute allowedRoles={['STUDENT']}>
                                <StudentProfile />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/student/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['STUDENT']}>
                                <StudentDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* College */}
                    <Route
                        path="/college/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['COLLEGE']}>
                                <CollegeDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/college/submit"
                        element={
                            <ProtectedRoute allowedRoles={['COLLEGE']}>
                                <SubmissionForm />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
