import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './App.css'
import ApplicationForm from './components/ApplicationForm'
import ApplicationList from './components/applicationList'
import StatsCard from './components/statsCard'
import TimelineChart from './components/TimelineChart'
import Login from './pages/Login'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [editingApp, setEditingApp] = useState(null)
  const [applications, setApplications] = useState([])

  // Check if user is logged in on mount
  useEffect(() => {
    setLoading(true)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      fetchApplications()
    }
  }, [user])

  const fetchApplications = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", user.id)
      .order("applied_date", { ascending: false });
    setApplications(data || [])
  };

  // Called when form successfully submits (create or update)
  const handleFormSuccess = () => {
    fetchApplications()
    setEditingApp(null)
    setIsFormOpen(false)
  }

  // Called when user clicks Edit button in the list
  const handleEdit = (app) => {
    setEditingApp(app)
    setIsFormOpen(true)
  }

  // Called when user cancels editing
  const handleCancelEdit = () => {
    setEditingApp(null)  // Clear edit mode
    setIsFormOpen(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">JobTrackr</h1>
              <p className="text-sm text-zinc-400 mt-1">Track and manage your job applications</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setEditingApp(null)
                  setIsFormOpen(true)
                }}
                className="
                  bg-emerald-600 text-white
                  px-6 py-3 rounded-xl
                  shadow-lg shadow-black/40
                  hover:bg-emerald-500
                  transition-colors
                  font-medium
                "
              >
                {isFormOpen ? 'Hide Form' : editingApp ? 'Edit Application' : 'New Application'}
              </button>
              <button
                onClick={handleLogout}
                className="
                  bg-zinc-800 text-zinc-300
                  px-4 py-2 rounded-lg
                  hover:bg-zinc-700 hover:text-zinc-100
                  transition-colors
                  font-medium text-sm
                "
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-12">
        {/* Top Section: ApplicationList and TimelineChart side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Applications List - 2 columns wide */}
          <div className="lg:col-span-2">
            <ApplicationList
              key={refreshKey}
              onEdit={handleEdit}
              apps={applications}
            />
          </div>

          {/* Timeline Charts - 1 column */}
          <div className="bg-zinc-900 text-zinc-100 rounded-xl shadow-lg shadow-black/40 flex flex-col overflow-hidden">
            <TimelineChart apps={applications} />
          </div>
        </div>

        {/* Stats Section: Full width below */}
        <StatsCard
          apps={applications}
          refreshKey={refreshKey}
        />
      </main>

      {/* Application Form Modal Overlay */}
      <div
        className={`
          fixed inset-0
          bg-black/60 backdrop-blur-sm
          flex items-center justify-center
          z-50
          transition-all duration-300 ease-out
          ${isFormOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
          }
        `}
        onClick={handleCancelEdit}
      >
        <div
          className={`
            w-full max-w-2xl
            max-h-[95vh] overflow-y-auto
            mx-4
            transition-all duration-300 ease-out
            ${isFormOpen
              ? 'scale-100 translate-y-0'
              : 'scale-95 -translate-y-4'
            }
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <ApplicationForm
            onSuccess={handleFormSuccess}
            editingApp={editingApp}
            onCancelEdit={handleCancelEdit}
            user={user}
          />
        </div>
      </div>
    </div>
  )
}

export default App