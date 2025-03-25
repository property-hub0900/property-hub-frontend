import axios from "axios";

export const fetchUrl = (url: string): Promise<Blob> => {
  return axios.get(url);
};
