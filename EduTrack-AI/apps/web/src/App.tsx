import { useEffect, useState } from 'react';
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
import { supabase } from '@/lib/supabase';

export default function App() {
  const { user, role, login, logout } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Check active session immediately on boot
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata;
        login(
          { id: session.user.id, email: session.user.email!, name: meta?.first_name || session.user.email!.split('@')[0] },
          meta?.role || 'student'
        );
      }
      setIsInitializing(false);
    });

    // Listen for auth changes (logouts across tabs, token refeshes)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const meta = session.user.user_metadata;
        login(
          { id: session.user.id, email: session.user.email!, name: meta?.first_name || session.user.email!.split('@')[0] },
          meta?.role || 'student'
        );
      } else {
        logout();
      }
    });

    return () => subscription.unsubscribe();
  }, [login, logout]);

  if (isInitializing) {
    return <div className="min-h-screen bg-[#030712] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-t-2 border-indigo-500 animate-spin" />
    </div>;
  }

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
