import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ApplicationForm({ onSuccess, editingApp, user }) {
  const EMPTY_FORM = {
    company_name: "",
    job_title: "",
    status: "Applied",
    job_url: "",
    salary_range: "",
    location: "",
    notes: "",
    applied_date: new Date().toISOString().split("T")[0],
  };

  const [supaData, setSupaData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editingApp) {
      setSupaData({
        company_name: editingApp.company_name ?? "",
        job_title: editingApp.job_title ?? "",
        status: editingApp.status ?? "Applied",
        job_url: editingApp.job_url ?? "",
        salary_range: editingApp.salary_range ?? "",
        location: editingApp.location ?? "",
        notes: editingApp.notes ?? "",
        applied_date: editingApp.applied_date ?? new Date().toISOString().split("T")[0],
      });
    } else {
      setSupaData(EMPTY_FORM);
    }
  }, [editingApp]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupaData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!supaData.company_name.trim()) return setError("Company name is required") && setLoading(false);
    if (!supaData.job_title.trim()) return setError("Job title is required") && setLoading(false);
    if (!supaData.applied_date) return setError("Applied date is required") && setLoading(false);
    if (!supaData.job_url.trim()) return setError("Job URL required") && setLoading(false);
    if (!supaData.location.trim()) return setError("Location required") && setLoading(false);
    if (supaData.applied_date > new Date().toISOString().split("T")[0]) return setError("Applied date cannot be in the future") && setLoading(false);
    if (supaData.job_url && !supaData.job_url.startsWith("http")) return setError("Invalid URL") && setLoading(false);

    let response;
    if (editingApp) {
      response = await supabase.from("applications").update(supaData).eq("id", editingApp.id);
    } else {
      // Add user_id for new applications
      const payload = { ...supaData, user_id: user?.id, job_url: supaData.job_url };
      response = await supabase.from("applications").insert([payload]);
    }

    setLoading(false);

    if (response.error) return setError(response.error.message || "Failed to save");

    setSupaData(EMPTY_FORM);
    onSuccess?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-zinc-900 text-zinc-100 p-6 rounded-xl shadow-lg shadow-black/40 space-y-5 transition-all duration-300 ease-out transform"
    >
      <h2 className="text-xl font-semibold tracking-tight">Application Details</h2>
      {error && <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg transition-all duration-300">{error}</div>}

      <div className="flex flex-col gap-1">
        <label htmlFor="company_name" className="text-sm text-zinc-400">Company Name <span className="text-red-500">*</span></label>
        <input id="company_name" name="company_name" type="text" className="input transition-colors" value={supaData.company_name} onChange={handleChange} required />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="job_title" className="text-sm text-zinc-400">Job Title <span className="text-red-500">*</span></label>
        <input id="job_title" name="job_title" type="text" className="input transition-colors" value={supaData.job_title} onChange={handleChange} required />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="status" className="text-sm text-zinc-400">Status</label>
        <select id="status" name="status" className="input transition-colors" value={supaData.status} onChange={handleChange} required>
          <option value="Applied">Applied</option>
          <option value="Interview Scheduled">Interview Scheduled</option>
          <option value="Interviewed">Interviewed</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="job_url" className="text-sm text-zinc-400">Job URL <span className="text-red-500">*</span></label>
        <input id="job_url" name="job_url" type="url" className="input transition-colors" value={supaData.job_url} onChange={handleChange} required />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="salary_range" className="text-sm text-zinc-400">Salary Range <span className="text-red-500">*</span></label>
        <input id="salary_range" name="salary_range" type="text" className="input transition-colors" value={supaData.salary_range} onChange={handleChange} required />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="location" className="text-sm text-zinc-400">Location <span className="text-red-500">*</span></label>
        <input id="location" name="location" type="text" className="input transition-colors" value={supaData.location} onChange={handleChange} required />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="applied_date" className="text-sm text-zinc-400">Applied Date <span className="text-red-500">*</span></label>
        <input id="applied_date" name="applied_date" type="date" className="input transition-colors" value={supaData.applied_date} onChange={handleChange} required />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className="text-sm text-zinc-400">Notes</label>
        <textarea id="notes" name="notes" className="input resize-none transition-colors" rows="4" value={supaData.notes} onChange={handleChange}></textarea>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-black font-medium py-2 rounded-lg transition-colors"
      >
        {loading ? "Saving..." : editingApp ? "Save Application" : "Add Application"}
      </button>
    </form>
  );
}
