import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'

import Breadcrumb from '../../components/quickMenu/Breadcrumb'
import PageHeroBanner from '../../components/quickMenu/PageHeroBanner'
import { useAuth } from '../../context/AuthContext'
import { getStudentPhoto, setStudentPhoto } from '../../services/studentPhotos'
import { buildUpdatedStudentsJsonWithPhoto } from '../../services/studentsJsonUpdater'

const STUDENT_NAV = [
  { label: 'Dashboard', to: '/student' },
  { label: 'Student Profiles', to: '/student/profiles' },
]

const StudentDashboard = () => {
  const { user, logout } = useAuth()
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const username = user?.username || ''

  const photoDataUrl = useMemo(() => getStudentPhoto(username), [username])

  const downloadTextFile = (filename, text, mime = 'text/plain;charset=utf-8') => {
    const blob = new Blob([text], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const onPickPhoto = async (file) => {
    if (!file) return
    if (!username) {
      setError('Missing username for this session')
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    // Keep it small to avoid blowing up localStorage
    const maxBytes = 1_500_000 // ~1.5MB
    if (file.size > maxBytes) {
      setError('Image is too large. Please use an image under ~1.5MB')
      return
    }

    setSaving(true)
    setError('')

    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      setStudentPhoto(username, String(dataUrl || ''))
    } catch (_) {
      setError('Could not save photo. Try a smaller image.')
    } finally {
      setSaving(false)
    }
  }

  const onDownloadUpdatedCsv = async () => {
    if (!username) return
    setDownloading(true)
    setError('')
    try {
      const nextJson = await buildUpdatedStudentsJsonWithPhoto({
        username,
        photoDataUrl: getStudentPhoto(username),
      })
      downloadTextFile('students.updated.json', nextJson, 'application/json;charset=utf-8')
    } catch (_) {
      setError('Could not build updated JSON. Ensure public/students.json exists and has username fields.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <>
      <Breadcrumb current="Student Dashboard" />

      <PageHeroBanner
        title="Student Dashboard"
        navLinks={STUDENT_NAV}
        activeTo="/student"
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
        <div className="max-w-2xl mx-auto bg-[#F8FBFF] border border-light-blue rounded-2xl" style={{ padding: 'clamp(1rem, 2.3vw, 2rem)' }}>
          <h2 className="font-dmSans font-semibold text-dark-blue-1" style={{ fontSize: 'clamp(1.25rem, 1.8vw, 1.8rem)' }}>
            Welcome, {user?.name || 'Student'}
          </h2>
          <p className="text-gray-blue mt-1" style={{ fontSize: 'clamp(0.9rem, 1.05vw, 1rem)' }}>
            This page is only visible after you log in.
          </p>

          <div className="mt-4 text-black/75" style={{ fontSize: 'clamp(0.92rem, 1.05vw, 1rem)', lineHeight: 1.8 }}>
            <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
            <p><strong>Student ID:</strong> {user?.studentId || 'N/A'}</p>
            <p><strong>Username:</strong> {user?.username || 'N/A'}</p>
            <p><strong>Logged in at:</strong> {user?.loggedInAt ? new Date(user.loggedInAt).toLocaleString() : 'N/A'}</p>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="mt-5 grid sm:grid-cols-[1fr_1fr] grid-cols-1 items-start" style={{ gap: '1rem' }}>
            <div>
              <p className="font-semibold text-black/80">Upload your photo</p>
              <p className="text-gray-blue" style={{ fontSize: '0.95rem' }}>
                Saved in your browser, and you can download an updated JSON file.
              </p>

              <label className="mt-3 border-2 border-dashed border-light-blue rounded-lg bg-white px-4 py-5 cursor-pointer hover:border-blue transition-colors duration-200 block">
                <span className="font-semibold text-black/80">Click to upload</span>
                <span className="block text-gray-blue text-sm">JPG/PNG under ~1.5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={saving}
                  onChange={(e) => onPickPhoto(e.target.files?.[0])}
                />
              </label>

              <button
                onClick={onDownloadUpdatedCsv}
                disabled={downloading}
                className={`mt-3 border border-blue text-blue rounded-full px-4 py-2 font-semibold transition-colors duration-200 ${downloading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue/10 cursor-pointer'}`}
              >
                {downloading ? 'Preparing JSON…' : 'Download updated students.json'}
              </button>
            </div>

            <div className="flex items-center justify-center bg-white border border-light-blue rounded-lg min-h-40 p-3">
              {photoDataUrl ? (
                <img src={photoDataUrl} alt="Your photo" className="object-cover w-full max-h-52 rounded-md" />
              ) : (
                <div className="text-gray-blue text-center" style={{ fontSize: '0.95rem' }}>
                  No photo uploaded yet
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap mt-5" style={{ gap: '0.7rem' }}>
            <Link
              to="/student/profiles"
              className="bg-blue text-white rounded-full px-5 py-2.5 font-semibold hover:bg-dark-blue-0 transition-colors duration-200 inline-block cursor-pointer"
            >
              Open Student Profiles
            </Link>
            <Link
              to="/student/results"
              className="border border-blue text-blue rounded-full px-5 py-2.5 font-semibold hover:bg-blue/10 transition-colors duration-200 inline-block cursor-pointer"
            >
              View your academic report
            </Link>
            <button
              onClick={logout}
              className="border border-blue text-blue rounded-full px-5 py-2.5 font-semibold hover:bg-blue/10 transition-colors duration-200 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default StudentDashboard
