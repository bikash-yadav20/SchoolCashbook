import React from "react";

const DuplicateWarning = ({ showPopup, onClose, existing }) => {
  if (!showPopup) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 
               transform transition-all duration-300 ease-out
               animate-[fadeIn_0.3s_ease-out_forwards]"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-yellow-100 text-yellow-600 p-2 rounded-full">
            ⚠️
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            Possible Duplicate
          </h2>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          A similar entry already exists. Please review before continuing.
        </p>

        {existing && (
          <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-700 mb-4">
            <p>
              <strong>Reason:</strong> {existing.reason}
            </p>
            <p>
              <strong>Total:</strong> ₹{existing.total_amount}
            </p>
            <p>
              <strong>Online:</strong> ₹{existing.online_amount}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
          >
            Cancel
          </button>

          {/* <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
          >
            Continue Anyway
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default DuplicateWarning;
