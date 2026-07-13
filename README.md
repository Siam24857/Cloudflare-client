# Clodfare — Crowdfunding Platform

**Clodfare** is a full-stack crowdfunding platform where creators raise platform
credits from supporters. It supports three roles — **Supporter**, **Creator**, and
**Admin** — each with tailored dashboards and workflows.

- **Live Site:** https://clodfare.vercel.app *(replace with your deployed URL)*
- **Client Repository (this repo):** https://github.com/your-username/clodfare-client
- **Server Repository:** https://github.com/your-username/clodfare-server

## Admin Credentials
| Field | Value |
|-------|-------|
| Email | `admin@clodfare.com` |
| Password | `Admin@123` |

> The admin account is auto-seeded on first server start. You can change the
> credentials via the `ADMIN_EMAIL` / `ADMIN_PASSWORD` environment variables.

## Tech Stack
- **Frontend:** React 18, Vite, React Router, Tailwind CSS, Swiper, Axios, @react-oauth/google
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs
- **Image Upload:** imgBB
- **Payments:** simuled credit purchase (saves record + adds credits) · **Email:** nodemailer SMTP/SendGrid

## Key Features
- 🎨 Fully responsive design (mobile, tablet, desktop) for both the site and dashboard.
- 🔐 JWT-based authentication with role-based authorization middleware (Supporter / Creator / Admin).
- 🪙 Default credits on registration — 50 for Supporters, 20 for Creators — stored once.
- 🖼️ imgBB image uploading on registration and on the Add Campaign form.
- 🏠 Engaging home page with a Swiper hero slider, top-funded campaigns, testimonials, and 3 extra sections (How It Works, Explore by Category, Platform Impact in Numbers).
- 👤 Three tailored dashboards with role-based side navigation.
- 📊 Creator stats (campaign count, active campaigns, total raised) and contribution review (approve/reject with refunds).
- 💸 Creator withdrawals (200-credit minimum, 20 credits = $1) with admin payout processing.
- 🛒 Supporter credit purchase with a **simulated payment** that saves the payment record and instantly adds credits.
- 📧 **Automated email notifications** (campaign approval/rejection, contribution confirmation, withdrawal processing) via SMTP / SendGrid.
- 🔔 Real-time notification system (floating popup) for contributions, approvals, withdrawals, and reports.
- 📄 Pagination on the "My Contributions" page.
- 🚩 Campaign reporting system with admin suspend/delete actions.
- ♻️ Automatic refund of approved supporters when a campaign is deleted.
- 🔎 Public campaign search & category filter.
- 🔒 Environment variables used for all secrets and MongoDB credentials.

## Role Capabilities
| Feature | Supporter | Creator | Admin |
|---------|-----------|---------|-------|
| Explore & contribute to campaigns | ✅ | ✅ | ✅ |
| Purchase credits | ✅ | — | — |
| Launch & manage campaigns | — | ✅ | — |
| Review contributions & withdraw | — | ✅ | — |
| Approve campaigns / payouts | — | — | ✅ |
| Manage users & campaigns | — | — | ✅ |
| Resolve reports | — | — | ✅ |

## Environment Variables

### Server (`server/.env`)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/clodfare
ACCESS_TOKEN_SECRET=your_long_random_secret
IMGIBB_API_KEY=your_imgbb_key
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@clodfare.com
ADMIN_PASSWORD=Admin@123
```

### Client (`client/.env`)
```
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_DEVELOPER_REPO=https://github.com/your-username/clodfare-client
```

## Local Development
```bash
# Server
cd server && npm install && npm run dev

# Client (new terminal)
cd client && npm install && npm run dev
```

## Deployment
- **Client:** Deploy `client/` to Vercel (build: `npm run build`, output: `dist`).
- **Server:** Deploy `server/` to Render / Railway / Cyclic and set the env vars above.
- Use a MongoDB Atlas connection string in `MONGODB_URI` for production.

---
Built as a Junior MERN Stack Developer assessment project.
