import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/luxe-button";

const VEHICLE_TYPES = ["car", "chopper", "boat"];
const SUPABASE_FUNCTIONS_URL = "https://eepcddbdvfhmeouzkpsb.functions.supabase.co";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  vehicleType?: string;
}

interface BookingResult {
  assigned_vehicle: string;
  ai_message: string;
  price: number;
}

const BookingModal: React.FC<BookingModalProps> = ({ open, onClose, vehicleType }) => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [type, setType] = useState(vehicleType || "car");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BookingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Feedback state
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackComments, setFeedbackComments] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // Simulate booking for landing page demo
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      setResult({
        assigned_vehicle: `Luxury ${type} - Confirmed`,
        message: "Your ride has been booked successfully! Download our VIP app to track your ride in real-time.",
        price: "Contact us for VIP pricing",
      });
      setShowFeedback(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackLoading(true);
    setFeedbackError(null);
    setFeedbackSuccess(false);
    try {
      // Placeholder: POST to feedback edge function (implement as needed)
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "demo-user",
          rating: feedbackRating,
          comments: feedbackComments,
        }),
      });
      if (!res.ok) throw new Error("Feedback submission failed");
      setFeedbackSuccess(true);
    } catch (err: unknown) {
      setFeedbackError(err instanceof Error ? err.message : String(err));
    } finally {
      setFeedbackLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>Book a Ride</DialogHeader>
        {!showFeedback ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block font-medium">Pickup Location</label>
              <Input value={pickup} onChange={e => setPickup(e.target.value)} required placeholder="Enter pickup location" />
            </div>
            <div className="space-y-2">
              <label className="block font-medium">Dropoff Location</label>
              <Input value={dropoff} onChange={e => setDropoff(e.target.value)} required placeholder="Enter dropoff location" />
            </div>
            <div className="space-y-2">
              <label className="block font-medium">Vehicle Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full p-2 rounded-md border">
                {VEHICLE_TYPES.map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
              </select>
            </div>
            <Button type="submit" variant="premium" className="w-full" disabled={loading}>
              {loading ? "Booking..." : "Book Now"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div className="text-lg font-semibold mb-2">Thank you for booking! Please rate your experience:</div>
            <div className="space-y-2">
              <label className="block font-medium">Rating</label>
              <select value={feedbackRating} onChange={e => setFeedbackRating(Number(e.target.value))} className="w-full p-2 rounded-md border">
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block font-medium">Comments</label>
              <Input value={feedbackComments} onChange={e => setFeedbackComments(e.target.value)} placeholder="Your feedback..." />
            </div>
            <Button type="submit" variant="premium" className="w-full" disabled={feedbackLoading}>
              {feedbackLoading ? "Submitting..." : "Submit Feedback"}
            </Button>
            {feedbackError && <div className="text-red-500 mt-2">{feedbackError}</div>}
            {feedbackSuccess && <div className="text-green-500 mt-2">Thank you for your feedback!</div>}
          </form>
        )}
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {result && !showFeedback && (
          <div className="mt-4 p-4 bg-luxe-dark-outline rounded">
            <div><strong>Vehicle:</strong> {result.assigned_vehicle}</div>
            <div><strong>Status:</strong> {result.message}</div>
            <div><strong>Pricing:</strong> {result.price}</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal; 