import { Loader2, Upload } from "lucide-react";
import type React from "react";
import { type ChangeEvent, useRef, useState } from "react";

interface BlobUploadProps {
  onUpload: (bytes: Uint8Array<ArrayBuffer>, file: File) => void;
  accept?: string;
  label?: string;
  className?: string;
  isUploading?: boolean;
  uploadProgress?: number;
}

export function BlobUpload({
  onUpload,
  accept = "image/*",
  label = "Upload File",
  className = "",
  isUploading = false,
  uploadProgress,
}: BlobUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const bytes = new Uint8Array(arrayBuffer) as Uint8Array<ArrayBuffer>;

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreview(url);

      onUpload(bytes, file);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        data-ocid="upload_button"
      />
      <button
        type="button"
        onClick={() => !isUploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        data-ocid="dropzone"
        className={`
          w-full border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all
          flex flex-col items-center justify-center gap-3 min-h-[140px]
          ${
            isDragOver
              ? "border-gold bg-gold/5"
              : "border-border hover:border-gold/50 hover:bg-muted/30"
          }
          ${isUploading ? "opacity-60 cursor-not-allowed" : ""}
        `}
        disabled={isUploading}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
            <p className="text-sm text-muted-foreground">
              {uploadProgress !== undefined
                ? `Uploading... ${uploadProgress}%`
                : "Uploading..."}
            </p>
          </div>
        ) : preview ? (
          <div className="flex flex-col items-center gap-2 w-full">
            <img
              src={preview}
              alt="Preview"
              className="max-h-40 object-contain rounded"
            />
            <p className="text-xs text-muted-foreground">
              Click or drag to change
            </p>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Drag &amp; drop or click to browse
              </p>
            </div>
          </>
        )}
      </button>
    </div>
  );
}
