import { useEffect, useState, useCallback, useRef } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(FilePondPluginImagePreview);

import { storage } from "@/lib/firebaseConfig";

export type TImages = {
  url: string;
  path: string;
};

export interface IFilesUrlPayload {
  images: Array<TImages>;
}

interface IUploadFilesProps {
  setUploadedFilesUrls: React.Dispatch<React.SetStateAction<IFilesUrlPayload>>;
  initialImages?: TImages[];
}

export const UploadImages = (props: IUploadFilesProps) => {
  const { setUploadedFilesUrls, initialImages } = props;
  const [files, setFiles] = useState<any[]>([]);
  const initialized = useRef(false);
  const filesRef = useRef(files);

  // Sync filesRef with current files state
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  // Initialize files and parent state
  useEffect(() => {
    if (initialized.current || !initialImages) return;

    const initFiles = async () => {
      const filePromises = initialImages.map(async (img) => {
        const response = await fetch(img.url);
        const blob = await response.blob();
        return {
          source: img.url,
          options: {
            type: "local",
            serverId: img.path,
            metadata: {
              firebasePath: img.path,
              downloadURL: img.url,
            },
          },
        };
      });

      const initialFiles = await Promise.all(filePromises);
      setFiles(initialFiles);
      setUploadedFilesUrls((prev) => ({
        images: initialImages.map((img) => ({
          url: img.url,
          path: img.path,
        })),
      }));
      initialized.current = true;
    };

    initFiles();
  }, [initialImages, setUploadedFilesUrls]);

  return (
    <FilePond
      files={files}
      onupdatefiles={(fileItems) => setFiles(fileItems)}
      allowMultiple={true}
      maxFiles={20}
      server={{
        process: (fieldName, file, metadata, load, error, progress, abort) => {
          const fileName = `${Date.now()}-${file.name}`;
          const storagePath = `images/${fileName}`;
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
                setUploadedFilesUrls((prev) => ({
                  images: [
                    ...prev.images,
                    {
                      url: downloadURL,
                      path: storagePath,
                    },
                  ],
                }));
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
            const fileRef = ref(storage, uniqueFileId);
            await deleteObject(fileRef);
            setUploadedFilesUrls((prev) => ({
              images: prev.images.filter((img) => img.path !== uniqueFileId),
            }));
            const updatedFiles = filesRef.current.filter(
              (file) => file.serverId !== uniqueFileId
            );
            setFiles(updatedFiles);
            load();
          } catch (err: any) {
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
      name="files"
      labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
    />
  );
};
