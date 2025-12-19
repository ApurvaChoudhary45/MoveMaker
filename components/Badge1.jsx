import React from "react";
import { motion } from "framer-motion";

export default function BadgeModal() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center"
      >
        {/* Badge Icon Placeholder */}
        <div className="w-24 h-24 mx-auto bg-yellow-300 rounded-full shadow-md flex items-center justify-center text-4xl font-bold">
          <img src="https://cdn-icons-png.flaticon.com/128/1616/1616456.png" alt="" />
        </div>

        <h2 className="text-xl font-semibold mt-4">Congratulations!</h2>
        <p className="text-gray-600 mt-2">
          You have earned a new badge
        </p>

        <div className="mt-3 text-lg font-medium text-purple-600">
          <span>Badge Type: </span>
          <span className="font-bold">First Workout</span>
        </div>

        <button className="mt-5 bg-purple-600 text-white w-full py-3 rounded-xl font-medium hover:bg-purple-700 transition-all">
          Add to Profile
        </button>
      </motion.div>
    </div>
  );
}
