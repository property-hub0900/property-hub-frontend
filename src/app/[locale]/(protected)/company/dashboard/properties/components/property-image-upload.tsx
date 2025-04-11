"use client";

import { useEffect, useRef, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "@/lib/firebaseConfig";

// Register FilePond plugins
registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType
);

export type PropertyImage = {
  url: string;
};

interface PropertyImageUploadProps {
  value: PropertyImage[];
  onChange: any;
  maxFiles?: number;
  maxFileSize?: string; // in MB, e.g., "5MB"
  disabled?: boolean;
  onMaxFilesError?: () => void;
}

export const PropertyImageUpload = ({
  value = [],
  onChange,
  maxFiles = 3,
  maxFileSize = "5MB",
  disabled = false,
  onMaxFilesError,
}: PropertyImageUploadProps) => {
  const [files, setFiles] = useState<any[]>([]);
  const initialized = useRef(false);
  const filesRef = useRef(files);

  // Map to keep track of serverId to URL mapping
  const serverIdToUrlMap = useRef(new Map<string, string>());
  // Map to keep track of URL to serverId mapping (for deletion)
  const urlToServerIdMap = useRef(new Map<string, string>());

  // Sync filesRef with current files state
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  // Initialize files from value prop (for edit case)
  useEffect(() => {
    if (initialized.current || value.length === 0) return;

    const initFiles = async () => {
      try {
        const filePromises = value.map(async (img, index) => {
          const response = await fetch(img.url);
          await response.blob();
          // Generate a unique serverId for each initial image
          const serverId = `initial-image-${index}-${Date.now()}`;

          // Store the mappings
          serverIdToUrlMap.current.set(serverId, img.url);
          urlToServerIdMap.current.set(img.url, serverId);

          return {
            source: img.url,
            options: {
              type: "local",
              serverId: serverId,
              metadata: {
                downloadURL: img.url,
              },
            },
          };
        });

        const initialFiles = await Promise.all(filePromises);
        setFiles(initialFiles);
        initialized.current = true;
      } catch (error) {
        console.error("Error initializing files:", error);
      }
    };

    initFiles();
  }, [value]);

  // Handle file upload
  const handleFileUpload = (downloadURL: string, serverId: string) => {
    // Check if we've reached the maximum number of files
    if (value.length >= maxFiles) {
      if (onMaxFilesError) {
        onMaxFilesError();
      }
      return;
    }

    // Store the mappings
    serverIdToUrlMap.current.set(serverId, downloadURL);
    urlToServerIdMap.current.set(downloadURL, serverId);

    // Update the value
    const newImages = [...value, { url: downloadURL }];
    onChange(newImages);
  };

  // Handle file deletion
  const handleFileDelete = (serverId: string) => {
    // Get the URL associated with this serverId
    const urlToRemove = serverIdToUrlMap.current.get(serverId);

    if (urlToRemove) {
      // Remove the mappings
      serverIdToUrlMap.current.delete(serverId);
      urlToServerIdMap.current.delete(urlToRemove);

      // Update the value
      const newImages = value.filter((img) => img.url !== urlToRemove);
      onChange(newImages);
    }
  };

  // Handle FilePond's beforeAddFile to check max files
  const handleBeforeAddFile = () => {
    if (value.length >= maxFiles) {
      if (onMaxFilesError) {
        onMaxFilesError();
      }
      return false;
    }
    return true;
  };

  return (
    <div className="property-image-upload">
      <FilePond
        files={files}
        onupdatefiles={(fileItems) => setFiles(fileItems)}
        allowMultiple={true}
        maxFiles={maxFiles}
        disabled={disabled}
        allowFileTypeValidation={true}
        acceptedFileTypes={["image/png", "image/jpeg", "image/jpg"]}
        labelFileTypeNotAllowed="Only images are allowed"
        fileValidateTypeLabelExpectedTypes="Expects image/jpeg, image/png"
        allowFileSizeValidation={true}
        maxFileSize={maxFileSize}
        labelMaxFileSizeExceeded="File is too large"
        labelMaxFileSize={`Maximum file size is ${maxFileSize}`}
        labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
        beforeAddFile={handleBeforeAddFile}
        server={{
          process: (
            fieldName,
            file,
            metadata,
            load,
            error,
            progress,
            // abort
          ) => {
            // Double-check if we've reached the maximum number of files
            if (value.length >= maxFiles) {
              error(`Maximum ${maxFiles} images allowed`);
              if (onMaxFilesError) {
                onMaxFilesError();
              }
              return { abort: () => { } };
            }

            const fileName = `${Date.now()}-${file.name}`;
            const storagePath = `property-images/${fileName}`;
            const storageRef = ref(storage, storagePath);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const percent =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progress(true, percent, 100);
              },
              (err) => error(err.message),
              async () => {
                try {
                  const downloadURL = await getDownloadURL(
                    uploadTask.snapshot.ref
                  );
                  handleFileUpload(downloadURL, storagePath);
                  load(storagePath);
                } catch (err: any) {
                  error(err.message);
                }
              }
            );

            return { abort: () => uploadTask.cancel() };
          },
          revert: async (uniqueFileId, load, error) => {
            try {
              // Delete from Firebase storage
              // Only delete if it's not an initial image (which might be shared elsewhere)
              if (!uniqueFileId.startsWith("initial-image-")) {
                const fileRef = ref(storage, uniqueFileId);
                await deleteObject(fileRef);
              }

              handleFileDelete(uniqueFileId);
              load();
            } catch (err: any) {
              console.error("Error deleting file:", err);
              error(err.message);
            }
          },
          load: (source, load, error) => {
            fetch(source)
              .then((res) => res.blob())
              .then(load)
              .catch(error);
          },
        }}
      />

      {/* Optional: Show current count */}
      <div className="text-sm text-muted-foreground mt-2">
        {value.length} of {maxFiles} images uploaded
      </div>
    </div>
  );
};
