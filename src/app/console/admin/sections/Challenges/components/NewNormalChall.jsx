"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";

const initialForm = {
  name: "",
  author: "",
  description: "",
  category: "web",
  value: "",
  flag: "",
  file_url: "",
  visible: true,
};

export default function NewNormalChall({ onClose, onCreated }) {
  const [formData, setFormData] = useState(initialForm);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* ---------- handlers ---------- */

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/admin/challenges/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setFormData((prev) => ({ ...prev, file_url: data.url }));
    } catch (err) {
      alert(err.message || "File upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/admin/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          type: "normal",
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      onCreated?.(data.newChallenge);
      onClose();
    } catch (err) {
      alert(err.message || "Failed to create challenge");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xl flex items-center justify-center p-4 z-50">
      <div className="rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium text-white">
              Add New Challenge
            </h3>
            <button onClick={onClose} className="p-1 text-white rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-white mb-1">
                Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Challenge name"
                className="w-full px-3 py-2 bg-white/10 rounded text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1">
                Author
              </label>
              <input
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                placeholder="Author"
                className="w-full px-3 py-2 bg-white/10 rounded text-sm text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-white mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/10 rounded text-sm text-white"
              >
                {[
                  "web",
                  "OSINT",
                  "pwn",
                  "crypto",
                  "forensics",
                  "reverse",
                  "misc",
                ].map((c) => (
                  <option key={c} value={c} className="bg-black">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-white mb-1">
                Points
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                required
                min="1"
                placeholder="Points"
                className="w-full px-3 py-2 bg-white/10 rounded text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="3"
              placeholder="Description"
              className="w-full px-3 py-2 bg-white/10 rounded text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white mb-1">
              Flag
            </label>
            <input
              name="flag"
              value={formData.flag}
              onChange={handleInputChange}
              required
              placeholder="flag{...}"
              className="w-full px-3 py-2 bg-white/10 rounded text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white mb-1">
              Upload File (Optional)
            </label>
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={uploading}
              className="w-full px-3 py-2 bg-white/10 rounded text-sm text-white"
            />
            {uploading && <p className="text-xs text-blue-400">Uploading…</p>}
          </div>

          <label className="flex items-center gap-2 text-xs text-white">
            <input
              type="checkbox"
              name="visible"
              checked={formData.visible}
              onChange={handleInputChange}
            />
            Visible to participants
          </label>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white disabled:bg-white/5 text-white hover:text-black text-sm rounded"
            >
              {submitting ? (
                "Creating…"
              ) : (
                <>
                  <Save className="w-4 h-4" /> Create
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
