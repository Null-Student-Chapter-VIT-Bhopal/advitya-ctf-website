"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";

const initialForm = {
  name: "",
  author: "",
  description: "",
  category: "web",
  value: "",
};

export default function NewInstanceChall({ onClose, onCreated }) {
  const [formData, setFormData] = useState(initialForm);
  const [bundle, setBundle] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBundleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBundle(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bundle) {
      alert("ZIP bundle is required");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const fd = new FormData();
      fd.append("bundle", bundle);
      fd.append("metadata", JSON.stringify(formData));

      const res = await fetch("/api/admin/challenges/instance", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Upload failed");
      }

      onCreated();
      onClose();
    } catch (err) {
      alert(err.message || "Failed to upload instance challenge");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xl flex items-center justify-center p-4 z-50">
      <div className="rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium text-white">
              Add Instance Challenge
            </h3>
            <button onClick={onClose} className="p-1 text-white rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

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
              placeholder="Challenge description"
              className="w-full px-3 py-2 bg-white/10 rounded text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white mb-1">
              Challenge Bundle (ZIP)
            </label>
            <input
              type="file"
              accept=".zip"
              onChange={handleBundleChange}
              className="w-full px-3 py-2 bg-white/10 rounded text-sm text-white"
            />
            <p className="text-xs text-white/50 mt-1">
              Must contain a Dockerfile at root
            </p>
          </div>

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
                "Uploading…"
              ) : (
                <>
                  <Save className="w-4 h-4" /> Upload
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
