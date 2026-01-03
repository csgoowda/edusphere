import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import CollegeLogin from './pages/auth/CollegeLogin';
import CollegeRegister from './pages/auth/CollegeRegister';
import GovLogin from './pages/auth/GovLogin';
import GovDashboard from './pages/gov/GovDashboard';
import VerifyCollege from './pages/gov/VerifyCollege';
import StudentLogin from './pages/auth/StudentLogin';
import StudentProfile from './pages/student/StudentProfile';
import StudentDashboard from './pages/student/StudentDashboard';
import CollegeDashboard from './pages/college/CollegeDashboard';
import SubmissionForm from './pages/college/SubmissionForm';
import ProtectedRoute from './components/common/ProtectedRoute';
import LandingPage from './pages/public/LandingPage';

const App: React.FC = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<LandingPage />} />

                    <Route path="/login/college" element={<CollegeLogin />} />
                    <Route path="/register/college" element={<CollegeRegister />} />
                    <Route path="/login/gov" element={<GovLogin />} />

                    <Route path="/gov/dashboard" element={
                        <ProtectedRoute allowedRoles={['GOV']}>
                            <GovDashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/gov/verify/:id" element={
                        <ProtectedRoute allowedRoles={['GOV']}>
                            <VerifyCollege />
                        </ProtectedRoute>
                    } />

                    {/* Student Routes */}
                    <Route path="/login/student" element={<StudentLogin />} />

                    <Route path="/student/profile" element={
                        <ProtectedRoute allowedRoles={['STUDENT']}>
                            <StudentProfile />
                        </ProtectedRoute>
                    } />

                    <Route path="/student/dashboard" element={
                        <ProtectedRoute allowedRoles={['STUDENT']}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/college/dashboard" element={
                        <ProtectedRoute allowedRoles={['COLLEGE']}>
                            <CollegeDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/college/submit" element={
                        <ProtectedRoute allowedRoles={['COLLEGE']}>
                            <SubmissionForm />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
