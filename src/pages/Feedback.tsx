import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/luxe-button";

const Feedback: React.FC = () => {
  const [analytics, setAnalytics] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState("last7");
  const [serviceType, setServiceType] = useState("all");
  const [feedback, setFeedback] = useState([
    { user: "Sarah Kimani", rating: 5, comment: "Exceptional helicopter service!", date: "2024-06-01" },
    { user: "David Ochieng", rating: 5, comment: "Immaculate executive car, seamless booking.", date: "2024-05-30" },
    { user: "Grace Wanjiku", rating: 4, comment: "Speedboat was great, but a bit late.", date: "2024-05-28" },
  ]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [respondModal, setRespondModal] = useState<{ open: boolean; feedbackIndex: number | null }>({ open: false, feedbackIndex: null });
  const [flagModal, setFlagModal] = useState<{ open: boolean; feedbackIndex: number | null }>({ open: false, feedbackIndex: null });
  const [adminResponse, setAdminResponse] = useState("");

  // Key metrics (simulate for now)
  const avgRating = (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(2);
  const mostPopular = "Executive Cars";

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("/functions/v1/cx-analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dateRange, serviceType }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.cx_insights) setAnalytics(data.cx_insights);
        else setError("No analytics found.");
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [dateRange, serviceType, refreshKey]);

  const handleRespond = (index: number) => {
    setRespondModal({ open: true, feedbackIndex: index });
    setAdminResponse("");
  };
  const handleFlag = (index: number) => {
    setFlagModal({ open: true, feedbackIndex: index });
  };
  const submitResponse = () => {
    setRespondModal({ open: false, feedbackIndex: null });
    // Add toast or API call here
  };
  const submitFlag = () => {
    setFlagModal({ open: false, feedbackIndex: null });
    // Add toast or API call here
  };

  return (
    <div className="min-h-screen bg-luxe-dark-primary flex flex-col items-center py-8">
      <div className="w-full max-w-3xl bg-luxe-dark-outline rounded p-6 mb-8">
        <div className="mb-4 flex flex-col md:flex-row gap-4">
          <div>
            <label className="block text-sm text-luxe-gray-secondary mb-1">Date Range</label>
            <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="p-2 rounded-md border">
              <option value="last7">Last 7 days</option>
              <option value="last30">Last 30 days</option>
              <option value="all">All time</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-luxe-gray-secondary mb-1">Service Type</label>
            <select value={serviceType} onChange={e => setServiceType(e.target.value)} className="p-2 rounded-md border">
              <option value="all">All</option>
              <option value="car">Executive Cars</option>
              <option value="chopper">Helicopter Charters</option>
              <option value="boat">Speedboat Transfers</option>
            </select>
          </div>
          <Button size="sm" variant="outline" onClick={() => setRefreshKey(k => k + 1)}>
            Refresh
          </Button>
        </div>
        <div className="mb-4">
          <div className="font-semibold text-luxe-gold-accent text-lg">Average Rating</div>
          <div className="text-2xl font-bold text-white">{avgRating}</div>
          <div className="font-semibold text-luxe-gold-accent text-lg mt-2">Most Popular Service</div>
          <div className="text-2xl font-bold text-white">{mostPopular}</div>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="font-semibold text-luxe-gold-accent mb-2">Recent Feedback</div>
        <table className="w-full text-sm bg-luxe-dark-primary rounded">
          <thead>
            <tr className="text-luxe-gray-secondary border-b border-luxe-dark-outline">
              <th className="py-2 px-2 text-left">User</th>
              <th className="py-2 px-2 text-left">Rating</th>
              <th className="py-2 px-2 text-left">Comment</th>
              <th className="py-2 px-2 text-left">Date</th>
              <th className="py-2 px-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((f, i) => (
              <tr key={i} className="border-b border-luxe-dark-outline">
                <td className="py-2 px-2">{f.user}</td>
                <td className="py-2 px-2">{f.rating} ⭐</td>
                <td className="py-2 px-2">{f.comment}</td>
                <td className="py-2 px-2">{f.date}</td>
                <td className="py-2 px-2 flex gap-2">
                  <button className="px-2 py-1 rounded bg-luxe-gold-accent text-xs text-luxe-dark-primary hover:bg-luxe-gold-accent/80" onClick={() => handleRespond(i)}>Respond</button>
                  <button className="px-2 py-1 rounded bg-red-600 text-xs text-white hover:bg-red-700" onClick={() => handleFlag(i)}>Flag</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Respond Modal and Flag Modal would go here if implemented */}
      </div>
    </div>
  );
};

export default Feedback; 