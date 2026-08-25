# Azure App Service deployment

This repository is configured to deploy as one Node.js App Service: Express serves
the built React client and the API from the same hostname.

1. Push this repository to GitHub, then create an **Azure App Service** using a
   current Node.js LTS runtime (Node 20 or newer) and connect it to the repository.
2. In the App Service **Environment variables** page, add `MONGO_URL` with the
   MongoDB connection string. Save the setting and restart the app.
3. Leave the startup command empty. Azure runs the root `npm start`, which starts
   `api/index.js`; the root `postinstall` builds the React application during
   deployment.
4. Set the Health check path to `/api/health`.

The client automatically calls `/api` and `/images` on its own origin, so no
production URL needs to be hard-coded. If the API is ever moved to a different
hostname, set `REACT_APP_API_URL` and `REACT_APP_IMAGE_URL` before the client build.

## Important upload note

Azure App Service local storage is not durable. Images uploaded through `/api/upload`
can disappear after a restart or scale-out. Use Azure Blob Storage for persistent
production uploads.
