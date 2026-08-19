import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/authentication/Login';
import DashboardLayout from '@/layouts/DashboardLayout';
import StudentDashboard from '@/pages/student/Dashboard';
import CourseEnrollment from '@/pages/student/CourseEnrollment';
import CompletedCourses from '@/pages/student/CompletedCourses';
import ODRequest from '@/pages/student/ODRequest';
import AssignmentSubmission from '@/pages/student/AssignmentSubmission';
import FacultyAssignments from '@/pages/faculty/Assignments';
import FacultyDashboard from '@/pages/faculty/Dashboard';
import MarkAttendance from '@/pages/faculty/MarkAttendance';
import CourseResults from '@/pages/faculty/CourseResults';
import CreateCourse from '@/pages/faculty/CreateCourse';

import SubjectChat from '@/pages/chat/SubjectChat';
import Timetable from '@/pages/shared/Timetable';
import Notifications from '@/pages/shared/Notifications';
import Settings from '@/pages/shared/Settings';
import AIDashboard from '@/pages/ai/AIDashboard';
import { useAuthStore } from '@/store/authStore';

export default function App() {
  const { user, role } = useAuthStore();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />

      {/* Protected Routes enclosed in DashboardLayout */}
      <Route path="/dashboard" element={user ? <DashboardLayout /> : <Navigate to="/login" />}>
        <Route index element={
          role === 'student' ? <StudentDashboard /> :
            role === 'faculty' ? <FacultyDashboard /> :
              <div className="flex items-center justify-center p-8 text-white h-full">Error: Unknown Role</div>
        } />
        <Route path="enrollment" element={role === 'student' ? <CourseEnrollment /> : <Navigate to="/dashboard" />} />
        <Route path="completed-courses" element={role === 'student' ? <CompletedCourses /> : <Navigate to="/dashboard" />} />
        <Route path="od-request" element={role === 'student' ? <ODRequest /> : <Navigate to="/dashboard" />} />
        <Route path="assignments" element={role === 'student' ? <AssignmentSubmission /> : role === 'faculty' ? <FacultyAssignments /> : <Navigate to="/dashboard" />} />
        <Route path="attendance" element={role === 'faculty' ? <MarkAttendance /> : <Navigate to="/dashboard" />} />
        <Route path="course-results" element={role === 'faculty' ? <CourseResults /> : <Navigate to="/dashboard" />} />
        <Route path="create-course" element={role === 'faculty' ? <CreateCourse /> : <Navigate to="/dashboard" />} />
        <Route path="chat" element={<SubjectChat />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
        <Route path="ai-insights" element={<AIDashboard />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
