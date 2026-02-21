"use client";

import { useEffect, useState } from "react";
import { Bell, Users, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import io from "socket.io-client";

let socket;

const page = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [globalNotifs, setGlobalNotifs] = useState([]);
  const [teamNotifs, setTeamNotifs] = useState([]);
  const [personalNotifs, setPersonalNotifs] = useState([]);

  /* ==========================
     PROTECT ROUTE
  ========================== */
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/Auth/login");
    }
  }, [user, loading, router]);

  /* ==========================
     FETCH EXISTING NOTIFICATIONS
  ========================== */
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();

        const globals = data.filter(n => n.scope === "global");
        const teams = data.filter(n => n.scope === "team");
        const personals = data.filter(n => n.scope === "user");

        setGlobalNotifs(globals);
        setTeamNotifs(teams);
        setPersonalNotifs(personals);
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };

    fetchNotifications();
  }, [user]);

  /* ==========================
     SOCKET LISTENER
  ========================== */
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");

    socket = io({
      auth: { token }
    });

    socket.on("event", (payload) => {
      if (!payload) return;

      if (payload.scope === "global") {
        setGlobalNotifs(prev => [payload, ...prev]);
      }

      if (payload.scope === "team") {
        setTeamNotifs(prev => [payload, ...prev]);
      }

      if (payload.scope === "user") {
        setPersonalNotifs(prev => [payload, ...prev]);
      }
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [user]);

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold text-yellow-500 mb-8">
        Notifications
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <NotificationBox
          title="Broadcasts"
          icon={<Bell className="w-6 h-6 text-yellow-500" />}
          notifications={globalNotifs}
        />

        <NotificationBox
          title="Team Comms"
          icon={<Users className="w-6 h-6 text-blue-400" />}
          notifications={teamNotifs}
        />

        <NotificationBox
          title="Direct Messages"
          icon={<User className="w-6 h-6 text-red-500" />}
          notifications={personalNotifs}
        />

      </div>
    </div>
  );
};

const NotificationBox = ({ title, icon, notifications }) => {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        {icon}
        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((note, index) => (
            <div
              key={index}
              className="bg-black/40 border-l-4 border-yellow-600 p-4 rounded"
            >
              <p className="text-sm text-gray-400">
                {new Date(note.createdAt).toLocaleString()}
              </p>
              <p className="text-gray-200 mt-1">{note.message}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">
            No new transmissions...
          </p>
        )}
      </div>
    </div>
  );
};

export default page