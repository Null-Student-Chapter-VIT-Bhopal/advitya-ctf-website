"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const page = () => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !user || !isAuthenticated) {
      toast.error("Log in to view your Team", {
        theme: "dark",
        position: "bottom-right",
        toastId: "myTeam",
      });

      router.push("/Auth/login");
      return;
    }

    fetchTeam();
  }, [user, isAuthenticated]);

  const fetchTeam = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/user/team", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setTeam(data.team);
      console.log("Fetched team:", data.team);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-gray-400">
        Loading MyTeam...
      </div>
    );
  }

  /* ---------------- NO TEAM ---------------- */

  if (!team) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-gray-400">
        You are not part of any team yet.
      </div>
    );
  }

  /* ---------------- HAS TEAM ---------------- */

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-slate-100">{team.name}</h1>

      <div className="bg-[#191919] border border-white/20 rounded-xl p-6">
        <p className="text-slate-400 mb-4">Score: {team.score}</p>

        <h2 className="font-semibold mb-3">Members</h2>

        <ul className="space-y-2">
          {team.members.map((m) => (
            <li
              key={m._id}
              className="flex justify-between px-4 py-2 bg-white/5 rounded"
            >
              <span>{m.name}</span>

              {String(m._id) === String(team.captainId) && (
                <span className="text-xs text-yellow-400">Captain</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default page;
