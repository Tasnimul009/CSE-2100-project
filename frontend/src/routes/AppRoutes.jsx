import { Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'

import Home             from '../pages/Home'
import NotFound         from '../pages/NotFound'
import Header           from '../components/layout/Header'
import Footer           from '../components/layout/Footer'

import Notice           from '../pages/quickMenu/Notice'
import NewsEvents       from '../pages/quickMenu/NewsEvents'
import Achievements     from '../pages/quickMenu/Achievements'
import CampusLife       from '../pages/quickMenu/CampusLife'
import MouCollaboration from '../pages/quickMenu/MouCollaboration'

import StudentLogin     from '../pages/student/StudentLogin'
import StudentProfile   from '../pages/student/StudentProfile'
import StudentDashboard from '../pages/student/StudentDashboard'
import StudentResults   from '../pages/student/StudentResults'
import CR               from '../pages/student/CR'
import Advisor          from '../pages/student/Advisor'
import AdvisorBatch     from '../pages/student/AdvisorBatch'
import RequireAuth      from './RequireAuth'

import Dean             from '../pages/faculty/Dean'
import HeadOfDept       from '../pages/faculty/HeadOfDept'
import FacultyMembers   from '../pages/faculty/FacultyMembers'
import OfficerStaff     from '../pages/faculty/OfficerStaff'

// ── Scroll to top on every route change ──────────────────────────────────────
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])
  return null
}

// ── Routes ────────────────────────────────────────────────────────────────────
const AppRoutes = () => {
  return (
    <Routes>
      <Route element={
        <>
          <ScrollToTop />
          <Header />
          <Outlet />
          <Footer />
        </>
      }>
        <Route path="/" element={<Home />} />

        <Route path="/notice"                      element={<Notice />} />
        <Route path="/news-events"                 element={<NewsEvents />} />
        <Route path="/achievements"                element={<Achievements />} />
        <Route path="/campus-life"                 element={<CampusLife />} />
        <Route path="/quickMenu/mou-collaboration" element={<MouCollaboration />} />

        {/* ── Student Routes ── */}
        <Route path="/login" element={<StudentLogin />} />
        <Route path="/student/login" element={<StudentLogin />} />

        <Route
          path="/student"
          element={(
            <RequireAuth>
              <StudentDashboard />
            </RequireAuth>
          )}
        />
        <Route
          path="/student/dashboard"
          element={(
            <RequireAuth>
              <StudentDashboard />
            </RequireAuth>
          )}
        />

        <Route
          path="/student/profiles"
          element={(
            <RequireAuth>
              <StudentProfile />
            </RequireAuth>
          )}
        />

        <Route
          path="/student/results"
          element={(
            <RequireAuth>
              <StudentResults />
            </RequireAuth>
          )}
        />
        <Route path="/student/profile" element={<Navigate to="/student/profiles" replace />} />

        <Route path="/student/cr" element={<CR />} />

        <Route path="/student/advisor" element={<Advisor />} />
        <Route path="/student/advisor/:batch" element={<AdvisorBatch />} />

        {/* <Route path="/contact" element={<Contact />} /> */}
        {/* <Route path="/about/cse"               element={<AboutCSE />} /> */}
        {/* <Route path="/about/message-from-head" element={<MessageFromHead />} /> */}
        {/* <Route path="/about/mission-vision"    element={<MissionVision />} /> */}
        {/* <Route path="/about/history"           element={<History />} /> */}
        {/* <Route path="/about/achievement"       element={<Achievement />} /> */}

        {/* <Route path="/facilities/classroom"    element={<Classroom />} /> */}
        {/* <Route path="/facilities/labs"         element={<Labs />} /> */}
        {/* <Route path="/facilities/library"      element={<Library />} /> */}
        {/* <Route path="/facilities/seminar-room" element={<SeminarRoom />} /> */}
        {/* <Route path="/facilities/ict">          element={<ICTInfrastructure />} /> */}

        {/* <Route path="/academic/programs"       element={<Programs />} /> */}
        {/* <Route path="/academic/curriculum"     element={<Curriculum />} /> */}
        {/* <Route path="/academic/syllabus"       element={<Syllabus />} /> */}
        {/* <Route path="/academic/calendar"       element={<AcademicCalendar />} /> */}
        {/* <Route path="/academic/class-routine"  element={<ClassRoutine />} /> */}
        {/* <Route path="/academic/exam-routine"   element={<ExamRoutine />} /> */}

        {/* ── Faculty Routes ── */}
        <Route path="/faculty/dean" element={<Dean />} />
        <Route path="/faculty/head" element={<HeadOfDept />} />
        <Route path="/faculty/members" element={<FacultyMembers />} />
        <Route path="/faculty/staff" element={<OfficerStaff />} />

        {/* <Route path="/research/areas"          element={<ResearchAreas />} /> */}
        {/* <Route path="/research/publications"   element={<Publications />} /> */}
        {/* <Route path="/research/projects"       element={<Projects />} /> */}

        {/* <Route path="/student/guidelines"      element={<Guidelines />} /> */}
        {/* <Route path="/student/guidelines"      element={<Guidelines />} /> */}
        {/* <Route path="/student/results"         element={<Results />} /> */}

      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
