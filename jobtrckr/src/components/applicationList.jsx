import { useState, useEffect, useMemo } from "react";
import { supabase } from "../supabaseClient";
import JobPostingButton from "./JobPostingButton";

export default function ApplicationList({ onEdit, apps }) {
  const [applications, setApplications] = useState(apps);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Track animation states
  const [animatingRows, setAnimatingRows] = useState({});
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    if (deleteTarget) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [deleteTarget]);

  useEffect(() => {
    setApplications(apps);
    const newAnimatingRows = {};
    apps.forEach(app => {
      newAnimatingRows[app.id] = true;
    });
    setAnimatingRows(newAnimatingRows);
  }, [apps]);

  

  const handleDeleteApplication = (app) => setDeleteTarget(app);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    // Animate row out
    setAnimatingRows(prev => ({ ...prev, [deleteTarget.id]: false }));
    await new Promise(r => setTimeout(r, 300));

    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", deleteTarget.id);

    if (!error) {
      setApplications(prev => prev.filter(app => app.id !== deleteTarget.id));
    }

    setShowModal(false);
    setTimeout(() => {
      setDeleteTarget(null);
      setDeleting(false);
    }, 300);
  };

  const cancelDelete = () => {
    if (!deleting) {
      setShowModal(false);
      setTimeout(() => setDeleteTarget(null), 300);
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch =
        app.company_name.toLowerCase().includes(search.toLowerCase()) ||
        app.job_title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
  };

  const statusStyles = {
    Applied: "bg-zinc-700/60 text-zinc-200",
    "Interview Scheduled": "bg-amber-500/20 text-amber-300",
    Interviewed: "bg-yellow-500/20 text-yellow-300",
    Offer: "bg-emerald-500/20 text-emerald-300",
    Rejected: "bg-red-500/20 text-red-300",
  };

  return (
    <>
      <section className="h-full">
        <div className="h-full bg-zinc-900 text-zinc-100 rounded-xl shadow-lg shadow-black/40 flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800 space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Applications</h2>

            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Search by company or job title..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input w-full md:flex-1 transition-colors"
              />

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="input w-full md:w-56 transition-colors"
              >
                <option value="">All statuses</option>
                <option value="Applied">Applied</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Interviewed">Interviewed</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>

              <button
                onClick={clearFilters}
                className="bg-zinc-800 text-zinc-300 px-4 py-2 rounded-xl hover:bg-zinc-700 hover:text-zinc-100 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-auto">
            <table className="w-full border-collapse min-w-max">
              <thead className="bg-zinc-800 text-zinc-400 text-sm sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Company</th>
                  <th className="px-4 py-3 text-left">Job</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Salary</th>
                  <th className="px-4 py-3 text-left">Applied</th>
                  <th className="px-4 py-3 text-left">Job Posting</th>
                  <th className="px-4 py-3 text-left">Control</th>
                  <th className="px-4 py-3 text-left">Notes</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-zinc-400">
                      <p className="text-sm">No matching applications.</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Try adjusting or clearing your filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map(app => (
                    <tr
                      key={app.id}
                      className={`
                        hover:bg-zinc-800/50
                        transition-all duration-300 ease-out
                        transform
                        ${animatingRows[app.id] ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}
                      `}
                    >
                      <td className="px-4 py-3 text-sm">{app.id}</td>
                      <td className="px-4 py-3 text-sm">{app.company_name}</td>
                      <td className="px-4 py-3 text-sm">{app.job_title}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium shadow shadow-black/30 transition-all duration-300 ease-out ${statusStyles[app.status]}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{app.location}</td>
                      <td className="px-4 py-3 text-sm">{app.salary_range}</td>
                      <td className="px-4 py-3 text-sm">{app.applied_date}</td>
                      <td className="px-4 py-3 text-sm">
                        <JobPostingButton url={app.job_url} />
                      </td>
                      <td className="px-4 py-3 text-sm flex gap-2">
                        <button
                          onClick={() => handleDeleteApplication(app)}
                          className="w-small max-w-2xl mx-auto bg-red-500 text-zinc-100 p-3 rounded-xl shadow-lg shadow-black/40 hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => onEdit(app)}
                          className="w-small max-w-2xl mx-auto bg-teal-600 text-zinc-100 p-3 rounded-xl shadow-lg shadow-black/40 hover:bg-teal-500 transition-colors"
                        >
                          Edit
                        </button>
                      </td>
                      <td>{app.notes}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Delete modal */}
      {deleteTarget && (
        <div
          className={`fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ease-out ${
            showModal ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={cancelDelete}
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl shadow-black/50 transition-all duration-300 ease-out ${
              showModal
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 translate-y-4"
            }`}
          >
            <h3 className="text-lg font-semibold text-zinc-100">Delete application</h3>
            <p className="text-sm text-zinc-400 mt-2">
              You are about to permanently delete
              <span className="text-zinc-200 font-medium"> {deleteTarget.job_title}</span>.
              <br />
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={cancelDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 disabled:bg-red-900 transition-colors"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
