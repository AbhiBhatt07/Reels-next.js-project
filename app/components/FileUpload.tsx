"use client"; // This makes sure the component runs on the client-side (browser), not on the server.

import { IKUpload } from "imagekitio-next"; // ImageKit upload component for React
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props"; // Type for successful upload response
import { useState } from "react"; // React hook for managing component state
import { Loader2 } from "lucide-react"; // A loading spinner icon

// Define the props (inputs) that this component accepts
interface FileUploadProps {
  onSuccess: (res: IKUploadResponse) => void; // Required function to call on successful upload
  onProgress?: (progress: number) => void;    // Optional function to report upload progress
  fileType?: "image" | "video";               // Optional file type (defaults to "image")
}

// Main component
export default function FileUpload({
  onSuccess,
  onProgress,
  fileType = "image", // If fileType is not provided, default to "image"
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);       // Track if a file is being uploaded
  const [error, setError] = useState<string | null>(null); // Store any error message

  // Handle upload errors
  const onError = (err: { message: string }) => {
    setError(err.message);  // Show the error message
    setUploading(false);    // Stop showing "Uploading..." state
  };

  // Handle successful upload
  const handleSuccess = (response: IKUploadResponse) => {
    setUploading(false); // Stop uploading spinner
    setError(null);       // Clear any previous errors
    onSuccess(response);  // Call the provided success handler
  };

  // Start uploading
  const handleStartUpload = () => {
    setUploading(true); // Show the uploading spinner
    setError(null);     // Clear old errors
  };

  // Report upload progress
  const handleProgress = (evt: ProgressEvent) => {
    if (evt.lengthComputable && onProgress) {
      const percentComplete = (evt.loaded / evt.total) * 100;
      onProgress(Math.round(percentComplete)); // Send progress as a percentage
    }
  };

  // Validate the file before uploading
  const validateFile = (file: File) => {
    if (fileType === "video") {
      // Only allow video files and limit size to 100MB
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("Video size must be less than 100MB");
        return false;
      }
    } else {
      // Only allow certain image types and limit size to 5MB
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, or WebP)");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return false;
      }
    }
    return true; // File is valid
  };

  // JSX: What the component displays
  return (
    <div className="space-y-2">
      <IKUpload
        fileName={fileType === "video" ? "video" : "image"}  // File name
        onError={onError}                                    // Error handler
        onSuccess={handleSuccess}                            // Success handler
        onUploadStart={handleStartUpload}                    // Called when upload starts
        onUploadProgress={handleProgress}                    // Progress handler
        accept={fileType === "video" ? "video/*" : "image/*"}// Accept only specific types
        className="file-input file-input-bordered w-full"    // Styling for file input
        validateFile={validateFile}                          // File validation before upload
        useUniqueFileName={true}                             // Prevent name conflicts
        folder={fileType === "video" ? "/videos" : "/images"}// Folder to store the file
      />

      {/* Show loader while uploading */}
      {uploading && (
        <div className="flex items-center gap-2 text-sm text-primary">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Uploading...</span>
        </div>
      )}

      {/* Show error if there is any */}
      {error && <div className="text-error text-sm">{error}</div>}
    </div>
  );
}
