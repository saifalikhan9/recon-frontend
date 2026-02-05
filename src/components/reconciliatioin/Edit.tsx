"use client";

import { useState } from "react";
import { X, Save, Loader2, AlertTriangle } from "lucide-react";
import { reconService } from "@/services/recon-service";


interface EditStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordId: string | null;
  currentStatus: string;
  onSuccess: () => void; // To refresh the table data
}

export default function EditStatusModal({ isOpen, onClose, recordId, currentStatus, onSuccess }: EditStatusModalProps) {
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form when modal opens
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordId) return;
    
    // Validation: Enforce a note for audit purposes
    if (!note.trim()) {
      setError("A justification note is required for the audit trail.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call the API
      await reconService.manualOverride(recordId, status, note);
      
      // Success!
      onSuccess(); 
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Window */}
      <div className="fixed left-1/2 top-1/2 z-[70] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Override Status</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-rose-400 text-sm">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Status Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase text-slate-500">New Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-indigo-500 outline-none"
            >
              <option value="MATCHED">Matched</option>
              <option value="PARTIAL_MATCH">Partial Match</option>
              <option value="UNMATCHED">Unmatched</option>
            </select>
          </div>

          {/* Reason Textarea */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase text-slate-500">
              Reason <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Why are you changing this? (e.g., Verified manually via bank statement)"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-indigo-500 outline-none h-24 resize-none text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Save Changes</>}
            </button>
          </div>
        </form>

      </div>
    </>
  );
}