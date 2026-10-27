# Deploy this project to Vercel

The repository has two Vercel projects: the React app (`client`) and the Express API (`api`). Both projects can use the same GitHub repository.

## 1. Publish the deployment-ready source to GitHub

The original committed version is saved in `pre-vercel-deploy-backup.zip` (commit `d40e8435fefc282f59e1a9bc79118684a9c9e129`). Keep that archive somewhere safe; it is a local snapshot and is excluded from Git.

From a normal writable checkout of this repository, create a deployment branch, commit the source changes, and push it:

```bash
git switch -c codex/vercel-deploy
git add .gitignore DEPLOY_VERCEL.md api/index.js api/package.json api/package-lock.json client
git commit -m "Prepare app for Vercel deployment"
git push -u origin codex/vercel-deploy
```

Do not add `api/.env` or paste secrets into source files. The `.env` file is ignored by Git.

## 2. Deploy the API project

1. Sign in to [Vercel](https://vercel.com/) and choose **Add New → Project**.
2. Import the GitHub repository containing this project.
3. Set **Root Directory** to `api`.
4. Let Vercel detect the Express app. Use Node.js 20 or newer and leave the build command and output directory at their detected defaults unless Vercel asks you to override them.
5. In **Environment Variables**, add `MONGO_URL` with the connection string for your MongoDB database. Add it for Production and Preview (and Development if you use Vercel's local tooling).
6. Click **Deploy**. Copy the resulting API deployment URL, for example `https://your-api.vercel.app`.

The database must accept connections from Vercel. In MongoDB Atlas, use a database user with only the permissions this app needs and configure Atlas network access for your deployment. Never commit the connection string.

## 3. Enable image uploads

1. Open the API project in Vercel and choose **Storage**.
2. Create a **Blob** store and connect it to the API project.
3. Choose public access for this app's images. The API stores the returned Blob URL in each post, so uploaded images continue to work after deployments.

The upload endpoint accepts JPEG, PNG, WebP, and GIF images up to 4 MB. Vercel Blob authentication is supplied by the connected project. For local uploads, set a Blob read/write token in `api/.env`.

## 4. Deploy the React frontend

1. In Vercel, choose **Add New → Project** again and import the same repository.
2. Set **Root Directory** to `client`.
3. Confirm the framework is **Create React App** (or React). The build command should be `npm run build` and the output directory should be `build`.
4. Add this environment variable for Production and Preview:

   ```text
   REACT_APP_API_URL=https://your-api.vercel.app/api
   ```

   Replace the example host with the API URL from step 2. Do not add a trailing slash.
5. Optionally set `REACT_APP_QA_URL` if you have deployed the separate Q&A service. The Q&A link stays hidden when this variable is unset.
6. Click **Deploy**.

## 5. Confirm the deployment

Open the frontend deployment and check the home page, registration/login, database-backed pages, and image uploads. If the frontend cannot reach the API, check `REACT_APP_API_URL` and redeploy the frontend after changing it. If database requests fail, check the API project's `MONGO_URL` and MongoDB network access. If image uploads fail, check that the Blob store is connected to the API project.

The frontend uses Vercel rewrites so React Router routes such as `/profile/name` load directly. Pushing later commits to the connected branch triggers new deployments for each Vercel project.
