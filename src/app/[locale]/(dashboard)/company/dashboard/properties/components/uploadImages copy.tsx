import {
  getDownloadURL,
  ref,
  uploadBytesResumable
} from "firebase/storage";
import { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";

import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";

registerPlugin(FilePondPluginImagePreview);

import { storage } from "@/lib/firebaseConfig";

type TImages = {
  isPrimary: boolean;
  url: string;
  path?: string; // Track Firebase storage path for deletion
};

export interface IFilesUrlPayload {
  images: Array<TImages>;
}

interface IUploadFilesProps {
  setUploadedFilesUrls: React.Dispatch<React.SetStateAction<IFilesUrlPayload>>;
}

export const UploadImages1 = (props: IUploadFilesProps) => {
  const { setUploadedFilesUrls } = props;
  const [files, setFiles] = useState<any[]>([]);

  // This maps FilePond's internal file IDs to Firebase storage paths

  // useEffect(() => {

  //   const dummyUrl = [
  //     "https://firebasestorage.googleapis.com/v0/b/property-explorer-3f0f3.firebasestorage.app/o/images%2F1742543287007-Screenshot%202025-03-20%20004140.png?alt=media&token=e160b00c-3c88-4ca7-8cc9-1887233d6968",
  //   ];
  //   (async () => {
  //     dummyUrl.forEach(async (url) => {
  //       const fileRef = ref(storage, url);
  //       const blob = await getBlob(fileRef);
  //       setFiles((prev) => [...prev, blob]);
  //     });
  //   })();
  // }, []);

  return (
    <FilePond
      //allowReorder={true}
      files={files}
      onupdatefiles={setFiles}
      allowMultiple={true}
      maxFiles={20}
      server={{
        process: (fieldName, file, metadata, load, error, progress, abort) => {
          // Create a unique file path in Firebase Storage
          const fileName = `${Date.now()}-${file.name}`;
          const storagePath = `images/${fileName}`;
          const storageRef = ref(storage, storagePath);

          // Start uploading the file
          const uploadTask = uploadBytesResumable(storageRef, file);

          // Track upload progress
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const percent =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              progress(true, percent, 100);
            },
            (err) => {
              error(err.message);
            },
            async () => {
              try {
                // Get the download URL
                const downloadURL = await getDownloadURL(
                  uploadTask.snapshot.ref
                );
                //file.id ||
                // Store the file's path for later deletion
                // const fileId = Math.random().toString(36).substring(2, 15);
                // setFilePathMap((prev) => ({
                //   ...prev,
                //   [fileId]: storagePath,
                // }));

                // Update the images array in the parent component
                setUploadedFilesUrls((prev) => ({
                  images: [
                    ...prev.images,
                    {
                      isPrimary: prev.images.length === 0,
                      url: downloadURL,
                      path: storagePath,
                    },
                  ],
                }));

                // Tell FilePond the upload is complete
                load(storagePath);
              } catch (err: any) {
                error(err.message);
              }
            }
          );

          // Return an abort function to cancel the upload if needed
          return {
            abort: () => {
              uploadTask.cancel();
              abort();
            },
          };
        },
        // revert: async (uniqueFileId, load, error) => {
        //   try {
        //     // Get the file path from our map
        //     const storagePath = filePathMap[uniqueFileId];
        //     if (!storagePath) {
        //       error("File path not found");
        //       return;
        //     }

        //     // Create a reference to the file in Firebase Storage
        //     const fileRef = ref(storage, storagePath);

        //     // Delete the file
        //     await deleteObject(fileRef);

        //     // Remove the file from our uploaded files state
        //     setUploadedFilesUrls((prev) => ({
        //       images: prev.images.filter((img) => img.path !== storagePath),
        //     }));

        //     // Remove from our path map
        //     setFilePathMap((prev) => {
        //       const newMap = { ...prev };
        //       delete newMap[uniqueFileId];
        //       return newMap;
        //     });

        //     // Tell FilePond the revert is complete
        //     //load();
        //   } catch (err: any) {
        //     error(err.message);
        //   }
        // },
      }}
      name="file"
      labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
    />
  );
};
