"use client";

import { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import MessageDialog from "../app/components/messagedialog";
import PulseLoader  from "react-spinners/PulseLoader";
interface Country {
  id: number;
  continent: string;
  region: string;
  countryName: string;
  countryCode: string;
  code: string;
  networks: {
    [networkName: string]: string[];
  };
}

export default function MobileNetworkFinder() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [searchCountry, setSearchCountry] = useState<string>("");
  const [selectedCountryName, setSelectedCountryName] = useState<string>("Select Country");
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(""); // New state to hold the countryCode
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [networkResult, setNetworkResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // New state for loading
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    type: "info" as "error" | "success" | "info",
    message: "",
  });

  // Fetch countries and networks from the API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch("https://network-finder-api.vercel.app/api/v1/network");
        const result = await response.json();

        // Deduplicate countries by `countryName`
        const uniqueCountries = result.data.filter(
            (country: Country, index: number, self: Country[]) =>
                index === self.findIndex((c) => c.countryName === country.countryName)
        );

        setCountries(uniqueCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoading(false); // Stop loading once the fetch is complete
      }
    };

    fetchData();
  }, []);

  const closeDialog = () => {
    setDialogState({ ...dialogState, isOpen: false });
  };
  // Filtered countries for search
  const filteredCountries = countries.filter((country) =>
      country.countryName.toLowerCase().includes(searchCountry.toLowerCase())
  );

  const handleCountrySelect = (countryName: string, countryCode: string) => {
    setSelectedCountryName(countryName);
    setSelectedCountryCode(countryCode); // Store countryCode as well
    setIsModalOpen(false);
  };

  const handleResultNetwork = async () => {
    try {
      // Ensure we have a valid selected country
      if (!selectedCountryCode || selectedCountryCode === "Select Country" || selectedCountryCode === "") {
        setDialogState({
          isOpen: true,
          type: "error",
          message: "Please select a valid country.",
        });
        return;
      }

      if (mobileNumber === "") {
        setDialogState({
          isOpen: true,
          type: "error",
          message: "Please enter a valid mobile number.",
        });
        return;
      }

      const response = await fetch(
          `https://network-finder-api.vercel.app/api/v1/network/searchnetwork?countryCode=${selectedCountryCode}&mobileNumber=${mobileNumber}`
      );
      const result = await response.json();
      // Assuming result.data is an object, check and display the necessary field
      setNetworkResult(result.data ? result.data.networkName || "No network found" : "No network found");
    } catch (error) {
      console.error("Error fetching network data:", error);
    }
  };

  const clearFields = () => {
    setSearchCountry("");
    setSelectedCountryName("Select Country");
    setMobileNumber("");
    setNetworkResult("");
  };

  return (
      <div className="h-screen w-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md transition-colors duration-300 space-y-6">
          <div className="space-y-4">
            {/* Country Name Selection */}
            <label className="font-medium text-black dark:text-gray-200">Country Name</label>
            <button
                onClick={() => setIsModalOpen(true)} // Open modal on button click
                className="w-full border border-gray-300 dark:border-gray-700 text-black dark:text-gray-200 bg-white dark:bg-gray-700 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 dark:focus:ring-blue-700 transition-colors duration-300 flex items-center justify-between"
            >
              {/* Display selected country name on the button */}
              <span>{selectedCountryName}</span>
              <FaChevronDown className="ml-2"/>
            </button>
          </div>

          {isModalOpen && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-black dark:text-gray-200">Select Country</h2>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="text-sm text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 transition-colors duration-300"
                    >
                      X
                    </button>
                  </div>
                  <input
                      type="text"
                      placeholder="Search country..."
                      value={searchCountry}
                      onChange={(e) => setSearchCountry(e.target.value)}
                      className="w-full mb-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-gray-200 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 dark:focus:ring-blue-700"
                  />
                  {/* Loading indicator */}
                  {loading ? (
                      <div className="flex justify-center items-center">
                        <PulseLoader
                            color={"#beadad"}
                            loading={loading}
                            size={6}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                      </div>
                  ) : (
                      <ul className="max-h-48 overflow-y-auto custom-scrollbar">
                        {filteredCountries.map((country, index) => (
                            <li
                                key={`${country.countryCode}-${index}`}
                                onClick={() => handleCountrySelect(country.countryName, country.countryCode)}
                                className="cursor-pointer px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300"
                            >
                              {country.countryName}
                            </li>
                        ))}
                      </ul>
                  )}
                </div>
              </div>
          )}

          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }

            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #4A5568; /* Dark grey */
              border-radius: 10px;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #2D3748; /* Slightly darker grey */
            }

            .custom-scrollbar::-webkit-scrollbar-button {
              display: none;
            }
          `}
          </style>
          <div className="space-y-4">
            {/* Mobile Number Input */}
            <label className="font-medium text-black dark:text-gray-200">Mobile Number</label>
            <input
                type="text"
                placeholder="Enter mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 dark:focus:ring-blue-700 transition-colors duration-300"
            />
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
                onClick={handleResultNetwork}
                className="w-full bg-blue-500 dark:bg-blue-700 text-white rounded px-4 py-2 hover:bg-blue-600 dark:hover:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 dark:focus:ring-blue-700 transition-colors duration-300"
            >
              Find Network
            </button>
            <button
                onClick={clearFields}
                className="w-full bg-gray-700 text-white rounded px-4 py-2"
            >
              Clear Fields
            </button>
          </div>

          {/* Network Result */}
          {networkResult && (
              <div className="mt-4 p-3 text-center">
                <p className="text-black dark:text-white ">Network Result: {networkResult}</p>
              </div>
          )}
        </div>
        <MessageDialog
            isOpen={dialogState.isOpen}
            type={dialogState.type}
            message={dialogState.message}
            onClose={closeDialog}
        />
      </div>
  );
}
