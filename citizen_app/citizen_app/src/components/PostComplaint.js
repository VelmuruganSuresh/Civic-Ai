import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Webcam from "react-webcam";
import { BASE_URL } from "../services/api";

const PostComplaint = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // This state is now used correctly in the button below
  const [statusText, setStatusText] = useState("Analyze Image ✨");

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
    if (!selectedFile)
      return Swal.fire(
        "Missing Image",
        "Please capture an image first.",
        "warning"
      );

    setIsAnalyzing(true);
    setStatusText("Requesting Location..."); // Update status 1

    const sendToBackend = async (lat, long) => {
      setStatusText("Analyzing Image..."); // Update status 2
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("lat", lat);
      formData.append("long", long);

      try {
        const response = await axios.post(
          `${BASE_URL}/predict/image`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (response.data.status === "rejected") {
          Swal.fire({
            title: "Image Rejected",
            text: response.data.message,
            icon: "warning",
            confirmButtonColor: "#F59E0B",
          });
          setIsAnalyzing(false);
          setStatusText("Analyze Image ✨");
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
        Swal.fire("Error", "Backend is not reachable.", "error");
        setIsAnalyzing(false);
        setStatusText("Analyze Image ✨");
      }
    };

    if (!navigator.geolocation) {
      sendToBackend("0.0", "0.0");
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          sendToBackend(position.coords.latitude, position.coords.longitude),
        (error) => {
          console.warn("Location denied:", error);
          sendToBackend("0.0", "0.0");
        },
        { enableHighAccuracy: true }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-20">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Post a Complaint
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Capture a clear photo of the civic issue.
        </p>

        {/* CAMERA AREA */}
        <div className="bg-black rounded-xl overflow-hidden mb-6 relative flex items-center justify-center min-h-[300px]">
          {isCameraOpen && !preview && (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                videoConstraints={{ facingMode: "environment" }}
              />
              <button
                onClick={capture}
                className="absolute bottom-4 bg-white rounded-full p-4 shadow-lg border-4 border-gray-300 hover:border-indigo-500 transition"
              >
                <div className="w-4 h-4 bg-red-600 rounded-full"></div>
              </button>
            </>
          )}

          {preview && (
            <img
              src={preview}
              alt="Captured"
              className="w-full h-full object-contain"
            />
          )}

          {!isCameraOpen && !preview && (
            <div
              className="flex flex-col items-center justify-center h-64 w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50"
              onClick={() => setIsCameraOpen(true)}
            >
              <span className="text-5xl mb-2">📷</span>
              <span className="text-gray-500 font-medium">
                Tap to Open Camera
              </span>
            </div>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3">
          {preview && (
            <button
              onClick={handleRetake}
              disabled={isAnalyzing}
              className="flex-1 py-3 rounded-lg text-gray-700 font-bold bg-gray-200 hover:bg-gray-300 transition"
            >
              Retake 🔄
            </button>
          )}

          {preview && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex-1 py-3 rounded-lg text-white font-bold bg-indigo-600 hover:bg-indigo-700 transition shadow-md disabled:bg-gray-400"
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  {/* FIX: Using the variable here instead of hardcoded text */}
                  {statusText}
                </span>
              ) : (
                "Analyze Image ✨"
              )}
            </button>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Submission Guidelines
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-green-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs">
                  ✓
                </span>
                <span className="font-bold text-green-800">Correct Format</span>
              </div>
              <div className="h-32 bg-gray-200 rounded-lg overflow-hidden mb-3">
                <img
                  src="/assets/correct-example.png"
                  alt="Good Example"
                  className="w-full h-full object-cover"
                />
              </div>
              <ul className="text-sm text-green-800 space-y-1 list-disc pl-4">
                <li>Clear visibility of the issue.</li>
                <li>Taken during daylight or well-lit.</li>
                <li>Focuses on the specific problem (e.g., Garbage).</li>
              </ul>
            </div>

            <div className="bg-red-50 p-4 rounded-xl border border-red-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs">
                  ✕
                </span>
                <span className="font-bold text-red-800">Wrong Format</span>
              </div>
              <div className="h-32 bg-gray-200 rounded-lg overflow-hidden mb-3">
                <img
                  src="/assets/wrong-example.png"
                  alt="Bad Example"
                  className="w-full h-full object-cover"
                />
              </div>
              <ul className="text-sm text-red-800 space-y-1 list-disc pl-4">
                <li>Blurry, dark, or normal images.</li>
                <li>Random objects or selfies.</li>
                <li>Images unrelated to civic issues (e.g., empty bin).</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800">
            <strong>⚠️ Note:</strong> Uploading irrelevant or fake images
            repeatedly may lead to account suspension. Please use this platform
            responsibly.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComplaint;
