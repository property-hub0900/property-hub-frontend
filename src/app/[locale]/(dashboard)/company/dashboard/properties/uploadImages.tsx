import { FilePond, registerPlugin } from "react-filepond";

import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(FilePondPluginImagePreview);

type TImages = {
  isPrimary: boolean;
  url: string;
};
export interface IFilesUrlPayload {
  images: Array<TImages>;
}

interface IUploadFilesProps {
  setUploadedFilesUrls: React.Dispatch<React.SetStateAction<IFilesUrlPayload>>;
}
export const UploadImages = (props: IUploadFilesProps) => {
  const { setUploadedFilesUrls } = props;

  return (
    <FilePond
      allowMultiple={true}
      maxFiles={3}
      server={{
        url: "https://tmpfiles.org/api/v1",
        process: {
          url: "/upload",
          onload: (response) => {
            console.log("File uploaded====", response);
            const parsed = JSON.parse(response);
            // Mapp according to the response type
            setUploadedFilesUrls((prev) => ({
              images: [
                ...prev.images,
                { isPrimary: prev.images.length === 0, url: parsed.data.url },
              ],
            }));
            return parsed.data.url;
          },
        },
        // This manages the delete scenario replace with orignal endpoints
        revert: {
          url: "/revert",
          ondata: (formData) => {
            // You can write the logic here to alter the request payload
            return formData;
          },
          onload: (response) => {
            // Use this to remove the file from state as well
            return response;
          },
        },
      }}
      name="file" // This is the name of the key that will be used in API payload
      labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
    />
  );
};
