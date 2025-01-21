import React from "react";

type DialogProps = {
    isOpen: boolean;
    type: "error" | "success" | "info";
    message: string;
    onClose: () => void;
};

export default function MessageDialog({ isOpen, type, message, onClose }: DialogProps) {
    if (!isOpen) return null;

    // Determine if dark mode is enabled
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Styles based on dialog type and theme
    const typeStyles = {
        error: isDarkMode
            ? "text-black"
            : "text-white",
        success: isDarkMode
            ? "text-black"
            : "text-white",
        info: isDarkMode
            ? "text-black"
            : "text-white",
    };

    const icon = {
        error: isDarkMode ? "⚠️" : "⚠️",
        success: isDarkMode ? "✅" : "✅",
        info: isDarkMode ? "ℹ️" : "ℹ️",
    };

    const dialogBackground = isDarkMode ?  "bg-white" : "bg-gray-800";
    const textColor = isDarkMode ? "text-black" : "text-white";

    return (
        <div className="fixed inset-0 flex text-center items-center justify-center bg-black bg-opacity-50 z-50">
            <div
                className={`w-full max-w-md p-6 rounded-lg shadow-lg ${typeStyles[type]} ${dialogBackground} relative`}
            >
                <div className="text-5xl">{icon[type]}</div>
                <p className={`mb-4 mt-5 ${textColor}`}>{message}</p>
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 bg-white text-black rounded-full px-3 py-1 hover:bg-gray-300"
                >
                    ✕
                </button>
                <button
                    onClick={onClose}
                    className={`mt-4 w-full rounded px-4 py-2 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black" } hover:bg-gray-300 hover:text-white hover:dark:bg-gray-300 hover:dark:text-black`}
                >
                    Close
                </button>
            </div>
        </div>
    );
}
