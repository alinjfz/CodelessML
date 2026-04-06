# ModelForge — Frontend

React single-page application for the ModelForge ML training platform.

---

## Setup

### Requirements
- Node.js 16+
- npm

### Install & Run

```bash
cd frontend
npm install
npm start
```

The app runs at `http://localhost:3000`. API requests are proxied to `http://localhost:5000` (configured in `package.json` → `"proxy"`).

### Build for production

```bash
npm run build
```

Output goes to `build/`.

---

## Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `DashboardPage.js` | Landing page with feature overview |
| `/login` | `LoginPage.js` | Login form |
| `/register` | `RegisterPage.js` | Registration form |
| `/verify_email/:token` | `VerifyEmailPage.js` | Email verification |
| `/reset_password` | `ResetPassPage.js` | Send password reset email |
| `/reset_password_confirm/:token` | `ConfirmResetPassPage.js` | Set new password with token |
| `/change_password` | `ChangePassPage.js` | Change password (authenticated) |
| `/profile` | `ProfilePage.js` | User profile |
| `/new_model` | `NewModelPage.js` | Multi-step model training wizard |
| `/train_list` | `TrainListPage.js` | All trained models |
| `/predict` | `PredictPage.js` | Make predictions with a trained model |
| `/blog/:blog_url` | `BlogPage.js` | Algorithm info articles |
| `/404` | `NotFoundPage.js` | 404 page |

### New Model Wizard (`/new_model`)

The core feature — a multi-step flow:

1. **Upload** — upload a CSV file
2. **Analyze** — preview data, column types, and sample rows
3. **Choose Features** — select feature columns and target column
4. **Choose Algorithm** — pick manually or request a smart suggestion
5. **Customize** — adjust hyperparameters and train/test split
6. **Results** — view accuracy, download the trained model

---

## State Management (Redux)

### Auth slice — `src/reducers/auth.js`

```
{
  user: { email, name },
  loggedin: bool,
  loading: bool,
  error: string | null,
  message: string | null
}
```

Actions (`src/actions/auth.js`): `api_login`, `api_logout`, `api_register`, `api_verify_email`, `api_reset_password`, `api_change_password`, `api_profile`

### Train slice — `src/reducers/train.js`

```
{
  upload_list: [],        // user's uploaded datasets
  feature_columns: [],    // selected feature columns
  target_column: null,    // selected target column
  dataset_analysis: null, // CSV analysis result from backend
  trained_list: [],       // training history
  ...training results
}
```

Actions (`src/actions/train.js`): upload, analyze, train, predict

Redux state is persisted to `localStorage` via `redux-persist` (see `src/store.js`).

---

## API Layer — `src/api/`

| File | Covers |
|------|--------|
| `rawApi.js` | Base `fetch` wrapper — sets `credentials: 'include'` and JSON headers |
| `auth.js` | Login, register, verify email, reset/change password, profile |
| `upload.js` | Upload CSV, list datasets, analyze dataset |
| `train.js` | Train model, get training history |
| `predict.js` | Run predictions |

All endpoint URLs are defined as constants in `src/constants/ApiRoutes.js`.
All page routes are in `src/constants/routes.js`.

---

## Adding a New Page

1. Create `src/pages/MyPage.js`
2. Add a route constant to `src/constants/routes.js`:
   ```js
   export const MY_PAGE_URL = "/my-page";
   ```
3. Register it in `src/App.js`:
   ```jsx
   <Route path={MY_PAGE_URL} element={<MyPage />} />
   ```
4. Add a nav link in `src/components/MyNavbar.js` if needed.

---

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `react-router-dom` v6 | Client-side routing |
| `@reduxjs/toolkit` | Redux state management |
| `redux-persist` | Persist Redux state to localStorage |
| `react-bootstrap` | Bootstrap 5 UI components |
| `bootstrap-icons` | Icon set |
| `sass` | SCSS stylesheet compilation |
