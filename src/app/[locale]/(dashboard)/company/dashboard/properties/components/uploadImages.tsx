import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";

registerPlugin(FilePondPluginImagePreview);

import { storage } from "@/lib/firebaseConfig";

type TImages = {
  //isPrimary: boolean;
  url: string;
  path?: string;
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

  // Initialize files and parent state
  useEffect(() => {
    if (initialized.current || !initialImages) return;

    const initFiles = async () => {
      const filePromises = initialImages.map(async (img) => {
        const response = await fetch(img.url);
        await response.blob();
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
      setUploadedFilesUrls(() => ({
        images: initialImages.map((img) => ({
          //isPrimary: img.isPrimary,
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
          console.log("fieldName", fieldName, "metadata", metadata, "aboart", abort);
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
                      //isPrimary: false,
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
