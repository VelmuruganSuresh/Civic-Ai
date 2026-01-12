import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Webcam from "react-webcam";
import { BASE_URL } from "../services/api";
import { Camera, RefreshCw, Send, AlertTriangle, CheckCircle, Info } from "lucide-react";

const PostComplaint = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusText, setStatusText] = useState("Analyze Image");

  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setPreview(imageSrc);
      const file = dataURLtoFile(imageSrc, "captured_complaint.jpg");
      setSelectedFile(file);
      setIsCameraOpen(false);
    }
  }, [webcamRef]);

  const handleRetake = () => {
    setPreview(null);
    setSelectedFile(null);
    setIsCameraOpen(true);
  };

  const handleAnalyze = async () => {
    // 1. Check if Image Exists (Camera Check)
    if (!selectedFile)
      return Swal.fire("Missing Image", "Please capture an image first.", "warning");

    setIsAnalyzing(true);
    setStatusText("Requesting Location...");

    // Helper function to handle the actual API call
    const sendToBackend = async (lat, long) => {
      setStatusText("Analyzing Image...");
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("lat", lat);
      formData.append("long", long);

      try {
        const response = await axios.post(
          `${BASE_URL}/predict/image`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.data.status === "rejected") {
          Swal.fire({
            title: "Image Rejected",
            text: response.data.message,
            icon: "warning",
            confirmButtonColor: "#F59E0B",
          });
          setIsAnalyzing(false);
          setStatusText("Analyze Image");
          return;
        }

        navigate("/review-complaint", {
          state: {
            aiResult: response.data,
            imageFile: selectedFile,
            previewUrl: preview,
          },
        });
      } catch (error) {
        console.error(error);
        Swal.fire("Connection Error", "Could not reach the analysis server.", "error");
        setIsAnalyzing(false);
        setStatusText("Analyze Image");
      }
    };

    // 2. Check Location Permission (Strict Mode)
    if (!navigator.geolocation) {
      Swal.fire("Error", "Geolocation is not supported by this browser.", "error");
      setIsAnalyzing(false);
      setStatusText("Analyze Image");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // ✅ SUCCESS: Location found, proceed to backend
        sendToBackend(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        // ❌ ERROR: Location denied or unavailable. STOP PROCESS.
        console.warn("Location Error:", error);
        setIsAnalyzing(false);
        setStatusText("Analyze Image");

        let errorMessage = "Location access is required to report an issue.";
        if (error.code === 1) {
            errorMessage = "You denied location permission. Please allow location access in your browser settings to proceed.";
        } else if (error.code === 2) {
            errorMessage = "Location unavailable. Please check your GPS signal or try again.";
        } else if (error.code === 3) {
            errorMessage = "Location request timed out. Please try again.";
        }

        Swal.fire({
            title: "Location Required",
            text: errorMessage,
            icon: "error",
            confirmButtonText: "Okay",
            confirmButtonColor: "#d33"
        });
      },
      { 
        enableHighAccuracy: false, // ✅ CHANGED: False prevents timeouts indoors
        timeout: 20000,            // ✅ CHANGED: Increased to 20 seconds
        maximumAge: 60000          // ✅ CHANGED: Accepts cached position from last 1 min
      }
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-extrabold text-slate-800">Report an Issue</h1>
          <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
            Help us improve the community. Capture a photo of the civic issue. 
            <br/>
            <span className="text-xs text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded-full border border-orange-100 mt-2 inline-block">
               ⚠️ Location Access Required
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Action Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative group min-h-[400px] flex flex-col">
              
              {/* Camera/Preview Container */}
              <div className="relative flex-grow bg-slate-900 flex items-center justify-center overflow-hidden">
                {!isCameraOpen && !preview && (
                  <button
                    onClick={() => setIsCameraOpen(true)}
                    className="flex flex-col items-center justify-center group p-8 transition-transform transform hover:scale-105"
                  >
                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm group-hover:bg-white/20 transition">
                      <Camera size={40} className="text-white" />
                    </div>
                    <span className="text-white font-semibold text-lg">Tap to Start Camera</span>
                    <span className="text-slate-400 text-sm mt-2">Ensure good lighting</span>
                  </button>
                )}

                {isCameraOpen && !preview && (
                  <>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="absolute inset-0 w-full h-full object-cover"
                      videoConstraints={{ facingMode: "environment" }}
                    />
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
                      <button
                        onClick={capture}
                        className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center shadow-lg transform active:scale-90 transition"
                      >
                        <div className="w-12 h-12 bg-red-500 rounded-full"></div>
                      </button>
                    </div>
                  </>
                )}

                {preview && (
                  <img
                    src={preview}
                    alt="Captured"
                    className="absolute inset-0 w-full h-full object-contain bg-black"
                  />
                )}
              </div>

              {/* Action Bar */}
              {preview && (
                <div className="bg-white p-4 border-t border-gray-100 flex gap-4">
                  <button
                    onClick={handleRetake}
                    disabled={isAnalyzing}
                    className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-slate-700 font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={18} />
                    Retake
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:shadow-none"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        {statusText}
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Analyze Image
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Guidelines */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Info size={20} className="text-indigo-500" />
                Submission Guidelines
              </h3>
              
              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2 text-green-800 font-semibold mb-2">
                    <CheckCircle size={16} />
                    <span>Do's</span>
                  </div>
                  <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                    <li>Clear, well-lit photos</li>
                    <li>Focus on the specific issue</li>
                    <li>Show surrounding context</li>
                  </ul>
                </div>

                <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-center gap-2 text-red-800 font-semibold mb-2">
                    <AlertTriangle size={16} />
                    <span>Dont's</span>
                  </div>
                  <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                    <li> blurry or dark images</li>
                    <li>Selfies or people's faces</li>
                    <li>Images unrelated to civic issues</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PostComplaint;