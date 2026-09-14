# Firebase setup & deploy — VastraVedh

The app's backend now uses **Firebase**:

- **Cloud Firestore** — products, uploaded-image maps, category images, orders
- **Firebase Storage** — the actual image files (product & category photos)
- **Firebase Analytics** — client-side page-view tracking

The admin login (password + signed cookie) is unchanged.

---

## 1. One-time console setup

In the [Firebase console](https://console.firebase.google.com) for your project
(project number `306736641116`):

1. **Firestore Database** → Create database → Production mode → pick a region.
2. **Storage** → Get started → note the bucket name (looks like
   `your-project.appspot.com`).
3. **Project settings → General → Your apps** → open the Web app and copy the
   `firebaseConfig` values (apiKey, authDomain, projectId, storageBucket,
   messagingSenderId, appId, measurementId).
4. **Project settings → Service accounts → Generate new private key** →
   downloads a JSON file (used for local dev only; App Hosting doesn't need it).

## 2. Fill in `.env.local` (local development)

Open `.env.local` and set:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=306736641116   # already set
NEXT_PUBLIC_FIREBASE_APP_ID=1:306736641116:web:...       # already set
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXX

FIREBASE_STORAGE_BUCKET=your-project.appspot.com
# Paste the ENTIRE service-account JSON on one line:
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...", ...}
```

`.env.local` and any `*serviceAccount*.json` file are gitignored — never commit them.

Then run the app:

```
npm run dev
```

Add a product in `/admin` and confirm images appear on the store — they now live
in Firebase Storage and metadata in Firestore.

## 3. Deploy security rules

```
npm install -g firebase-tools   # if not installed
firebase login
firebase use your-project-id
firebase deploy --only firestore:rules,storage
```

Rules are locked down: public read for catalogue/images, no direct client
writes (all writes go through the server via the Admin SDK).

## 4. Deploy the app (Firebase App Hosting)

App Hosting runs the full Next.js server (needed for the API routes / SSR) and
gives the Admin SDK credentials automatically — no service-account key required
in production.

1. Edit `apphosting.yaml` and replace every `REPLACE_WITH_...` with your real
   values (the `NEXT_PUBLIC_*` config and `FIREBASE_STORAGE_BUCKET`).
2. Store the admin secrets:
   ```
   firebase apphosting:secrets:set ADMIN_PASSWORD
   firebase apphosting:secrets:set ADMIN_SESSION_SECRET
   ```
3. Create the backend (links your GitHub repo; pushes auto-deploy):
   ```
   firebase apphosting:backends:create --project your-project-id
   ```
   Follow the prompts to connect the repo and branch. Firebase builds and
   deploys on every push.

## Where the data lives

| Data                | Firestore location            | Storage location            |
| ------------------- | ----------------------------- | --------------------------- |
| Custom products     | `products/{id}`               | `uploads/{id}/...`          |
| Uploaded image maps | `meta/uploads`                | `uploads/{baseId}/...`      |
| Category images     | `meta/categoryImages`         | `uploads/categories/...`    |
| Orders              | `orders/{id}`                 | —                           |

Nothing above the store layer (`src/lib/*Store.ts`) changed — the rest of the
app calls the same functions as before.
