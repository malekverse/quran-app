"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XIcon } from "@heroicons/react/solid";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

const Toast = ({ message, type, isVisible, onClose }: ToastProps) => {
  const icons = {
    success: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
    error: <XCircleIcon className="w-6 h-6 text-red-500" />,
    info: <InformationCircleIcon className="w-6 h-6 text-blue-500" />,
  };

  const bgColors = {
    success: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
    error: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800",
    info: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          className="fixed top-4 right-4 z-[100] max-w-sm"
        >
          <div
            className={`${bgColors[type]} border rounded-xl shadow-2xl p-4 flex items-start gap-3 backdrop-blur-sm`}
          >
            {icons[type]}
            <div className="flex-1">
              <p className="font-medium text-sm">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close notification"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
