import axios from "axios";

// Leave REACT_APP_API_URL unset for the Azure single-app deployment. The API
// then uses the current site origin, e.g. https://<app-name>.azurewebsites.net.
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
});

export const imageBaseUrl = process.env.REACT_APP_IMAGE_URL || "/images/";

export default apiClient;
