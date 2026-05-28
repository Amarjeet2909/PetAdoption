import { useEffect, useState } from "react";
import { getAnnouncements } from "../../api/adminApi";
import type { Announcement } from "../../types/petTypes";

export default function AnnouncementBanner() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    useEffect(() => {
        getAnnouncements().then(setAnnouncements).catch(() => {});
    }, []);

    if (announcements.length === 0) return null;

    return (
        <div className="space-y-0">
            {announcements.map(a => (
                <div key={a.id} className={`px-4 py-2 text-center text-sm font-medium ${a.type === "warning" ? "bg-yellow-50 text-yellow-800" : a.type === "success" ? "bg-green-50 text-green-800" : "bg-blue-50 text-blue-800"}`}>
                    {a.type === "warning" ? "⚠️" : a.type === "success" ? "✅" : "ℹ️"} {a.message}
                </div>
            ))}
        </div>
    );
}