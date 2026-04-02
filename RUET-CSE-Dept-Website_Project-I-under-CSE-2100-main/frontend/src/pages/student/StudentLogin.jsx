import { useState } from 'react'
import { Link } from 'react-router-dom'

import Breadcrumb from '../../components/quickMenu/Breadcrumb'
import PageHeroBanner from '../../components/quickMenu/PageHeroBanner'
import { useAuth } from '../../context/AuthContext'

const LOGIN_NAV = [
  { label: 'Student Login', to: '/login' },
]

const StudentLogin = () => {
  const { user, isLoggedIn, isReady, login, logout } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', studentId: '', password: '' })
  const [error, setError] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!form.email.trim() || !form.password.trim()) {
      setError('Email and password are required')
      return
    }

    login({
      name: form.name,
      email: form.email,
      studentId: form.studentId,
    })

    setForm({ name: '', email: '', studentId: '', password: '' })
  }

  return (
    <>
      <Breadcrumb current="Student Login" />

      <PageHeroBanner
        title="Student Login"
        navLinks={LOGIN_NAV}
        activeTo="/login"
      />

      <section
        className="w-screen bg-white"
        style={{
          paddingTop: 'clamp(2.2rem, 4vw, 4rem)',
          paddingBottom: 'clamp(2.2rem, 4vw, 4rem)',
          paddingLeft: 'clamp(1rem, 6vw, 7rem)',
          paddingRight: 'clamp(1rem, 6vw, 7rem)',
        }}
      >
        {!isReady ? (
          <div className="text-center text-gray-blue font-medium">Loading session...</div>
        ) : isLoggedIn ? (
          <div className="max-w-2xl mx-auto bg-[#F8FBFF] border border-light-blue rounded-2xl" style={{ padding: 'clamp(1rem, 2.3vw, 2rem)' }}>
            <h2 className="font-dmSans font-semibold text-dark-blue-1" style={{ fontSize: 'clamp(1.25rem, 1.8vw, 1.8rem)' }}>
              You are logged in
            </h2>
            <div className="mt-4 text-black/75" style={{ fontSize: 'clamp(0.92rem, 1.05vw, 1rem)', lineHeight: 1.8 }}>
              <p><strong>Name:</strong> {user?.name || 'N/A'}</p>
              <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
              <p><strong>Student ID:</strong> {user?.studentId || 'N/A'}</p>
            </div>
            <div className="flex flex-wrap mt-5" style={{ gap: '0.7rem' }}>
              <button
                onClick={logout}
                className="bg-blue text-white rounded-full px-5 py-2.5 font-semibold hover:bg-dark-blue-0 transition-colors duration-200"
              >
                Logout
              </button>
              <Link
                to="/student/profiles"
                className="border border-blue text-blue rounded-full px-5 py-2.5 font-semibold hover:bg-blue/10 transition-colors duration-200"
              >
                Go to Student Profiles
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="max-w-2xl mx-auto bg-white border border-light-blue shadow-sm rounded-2xl"
            style={{ padding: 'clamp(1rem, 2.3vw, 2rem)' }}
          >
            <h2 className="font-dmSans font-semibold text-dark-blue-1" style={{ fontSize: 'clamp(1.25rem, 1.8vw, 1.8rem)' }}>
              Login to Student Portal
            </h2>
            <p className="text-gray-blue mt-1" style={{ fontSize: 'clamp(0.9rem, 1.05vw, 1rem)' }}>
              Session is persisted in localStorage, so refresh keeps you signed in.
            </p>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">
                {error}
              </div>
            )}

            <div className="grid sm:grid-cols-2 grid-cols-1 mt-5" style={{ gap: '0.9rem' }}>
              <div className="flex flex-col" style={{ gap: '0.35rem' }}>
                <label className="font-semibold text-black/80">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="border border-light-blue rounded-lg px-3 py-2 outline-none"
                  placeholder="Your full name"
                />
              </div>
              <div className="flex flex-col" style={{ gap: '0.35rem' }}>
                <label className="font-semibold text-black/80">Student ID</label>
                <input
                  type="text"
                  value={form.studentId}
                  onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                  className="border border-light-blue rounded-lg px-3 py-2 outline-none"
                  placeholder="e.g. 2003007"
                />
              </div>
              <div className="flex flex-col sm:col-span-2" style={{ gap: '0.35rem' }}>
                <label className="font-semibold text-black/80">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="border border-light-blue rounded-lg px-3 py-2 outline-none"
                  placeholder="name@cse.ruet.ac.bd"
                />
              </div>
              <div className="flex flex-col sm:col-span-2" style={{ gap: '0.35rem' }}>
                <label className="font-semibold text-black/80">Password *</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="border border-light-blue rounded-lg px-3 py-2 outline-none"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-5 bg-blue text-white rounded-full px-6 py-2.5 font-semibold hover:bg-dark-blue-0 transition-colors duration-200"
            >
              Login
            </button>
          </form>
        )}
      </section>
    </>
  )
}

export default StudentLogin
