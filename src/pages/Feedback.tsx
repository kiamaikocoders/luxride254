import React, { useState, useEffect } from "react";
import { safeFetchJson } from "@/lib/safeFetch";
import { Button } from "@/components/ui/luxe-button";

interface FeedbackItem {
  user: string;
  rating: number;
  comment: string;
  date: string;
}

interface AnalyticsResponse {
  cx_insights?: string;
}

const Feedback: React.FC = () => {
  const [analytics, setAnalytics] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<string>("last7");
  const [serviceType, setServiceType] = useState<string>("all");
  const [feedback, setFeedback] = useState<FeedbackItem[]>([
    { user: "Sarah Kimani", rating: 5, comment: "Exceptional helicopter service!", date: "2024-06-01" },
    { user: "David Ochieng", rating: 5, comment: "Immaculate executive car, seamless booking.", date: "2024-05-30" },
    { user: "Grace Wanjiku", rating: 4, comment: "Speedboat was great, but a bit late.", date: "2024-05-28" },
  ]);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [respondModal, setRespondModal] = useState<{ open: boolean; feedbackIndex: number | null }>({ open: false, feedbackIndex: null });
  const [flagModal, setFlagModal] = useState<{ open: boolean; feedbackIndex: number | null }>({ open: false, feedbackIndex: null });
  const [adminResponse, setAdminResponse] = useState<string>("");

  // Key metrics (simulate for now)
  const avgRating = (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(2);
  const mostPopular = "Executive Cars";

  useEffect(() => {
    // Simulate analytics for landing page demo
    setLoading(true);
    setTimeout(() => {
      setAnalytics("Customer feedback analytics would be displayed here in the full application. This is a demo for the landing page.");
      setLoading(false);
    }, 1000);
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Feedback Management</h2>
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Date Range</label>
          <select 
            value={dateRange} 
            onChange={e => setDateRange(e.target.value)} 
            className="p-2 rounded-md border border-gray-300 bg-white"
          >
            <option value="last7">Last 7 days</option>
            <option value="last30">Last 30 days</option>
            <option value="all">All time</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Service Type</label>
          <select 
            value={serviceType} 
            onChange={e => setServiceType(e.target.value)} 
            className="p-2 rounded-md border border-gray-300 bg-white"
          >
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
        <div className="font-semibold text-gray-700 text-lg">Average Rating</div>
        <div className="text-2xl font-bold text-gray-900">{avgRating}</div>
        <div className="font-semibold text-gray-700 text-lg mt-2">Most Popular Service</div>
        <div className="text-2xl font-bold text-gray-900">{mostPopular}</div>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="font-semibold text-gray-700 mb-2">Recent Feedback</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-gray-200">
              <th className="p-2">User</th>
              <th className="p-2">Rating</th>
              <th className="p-2">Comment</th>
              <th className="p-2">Date</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((f, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="p-2">{f.user}</td>
                <td className="p-2">{f.rating} ⭐</td>
                <td className="p-2">{f.comment}</td>
                <td className="p-2">{f.date}</td>
                <td className="p-2 flex gap-2">
                  <button 
                    className="px-2 py-1 rounded bg-blue-600 text-xs text-white hover:bg-blue-700" 
                    onClick={() => handleRespond(i)}
                  >
                    Respond
                  </button>
                  <button 
                    className="px-2 py-1 rounded bg-red-600 text-xs text-white hover:bg-red-700" 
                    onClick={() => handleFlag(i)}
                  >
                    Flag
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Feedback;
