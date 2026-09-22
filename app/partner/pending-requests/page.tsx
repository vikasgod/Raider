"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import axios from "axios";
import { IBooking } from "@/models/booking.modal";
import { Loader2 } from "lucide-react";

function Page() {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/partner/bookings/pending");
      setBookings(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetchPendingRequests();
  }, []);
  return (
    <div className="min-h-screen bg-[#f4f5f7">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-semibold text-gray-900">
            Ride Requests
          </h1>
          <p className="mt-3 text-gray-500 text-lg">
            Manage incoming ride requests and respond in real time
          </p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-8 h-8 text-gray-700" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm">
            <p className="text-gray-500 text-lg">No pending ride requests.</p>
          </div>
        ) : (
         <div className="space-y-6">
            {bookings.map((booking, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{y: -2}}
                transition={{ duration: 0.25 }}
                className="bg-white border border-gray-200 
          rounded-2xl hover:shadow-md transition p-8 shadow-sm"
              >
                </motion.div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
}

export default Page;
