import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute, { RoleRoute } from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Campaigns from "./pages/Campaigns.jsx";
import NotFound from "./pages/NotFound.jsx";

import DashboardLayout from "./pages/dashboard/DashboardLayout.jsx";
import SupporterHome from "./pages/dashboard/SupporterHome.jsx";
import ExploreCampaigns from "./pages/dashboard/ExploreCampaigns.jsx";
import CampaignDetails from "./pages/dashboard/CampaignDetails.jsx";
import MyContributions from "./pages/dashboard/MyContributions.jsx";
import PurchaseCredit from "./pages/dashboard/PurchaseCredit.jsx";
import SupporterPaymentHistory from "./pages/dashboard/SupporterPaymentHistory.jsx";
import CreatorHome from "./pages/dashboard/CreatorHome.jsx";
import AddCampaign from "./pages/dashboard/AddCampaign.jsx";
import MyCampaigns from "./pages/dashboard/MyCampaigns.jsx";
import Withdrawals from "./pages/dashboard/Withdrawals.jsx";
import AdminHome from "./pages/dashboard/AdminHome.jsx";
import CampaignApprovals from "./pages/dashboard/CampaignApprovals.jsx";
import WithdrawalRequests from "./pages/dashboard/WithdrawalRequests.jsx";
import ManageUsers from "./pages/dashboard/ManageUsers.jsx";
import ManageCampaigns from "./pages/dashboard/ManageCampaigns.jsx";
import Reports from "./pages/dashboard/Reports.jsx";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              <Home />
            </main>
            <Footer />
          </div>
        }
      />
      <Route
        path="/campaigns"
        element={
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              <Campaigns />
            </main>
            <Footer />
          </div>
        }
      />
      <Route
        path="/login"
        element={
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              <Login />
            </main>
            <Footer />
          </div>
        }
      />
      <Route
        path="/register"
        element={
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              <Register />
            </main>
            <Footer />
          </div>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardIndex />} />
        <Route path="supporter-home" element={<SupporterHome />} />
        <Route path="explore-campaigns" element={<ExploreCampaigns />} />
        <Route path="campaign/:id" element={<CampaignDetails />} />
        <Route path="my-contributions" element={<MyContributions />} />
        <Route path="purchase-credit" element={<PurchaseCredit />} />
        <Route path="payment-history" element={<SupporterPaymentHistory />} />
        <Route
          path="creator-home"
          element={
            <RoleRoute roles={["Creator", "Admin"]}>
              <CreatorHome />
            </RoleRoute>
          }
        />
        <Route
          path="add-campaign"
          element={
            <RoleRoute roles={["Creator"]}>
              <AddCampaign />
            </RoleRoute>
          }
        />
        <Route
          path="my-campaigns"
          element={
            <RoleRoute roles={["Creator"]}>
              <MyCampaigns />
            </RoleRoute>
          }
        />
        <Route
          path="withdrawals"
          element={
            <RoleRoute roles={["Creator"]}>
              <Withdrawals />
            </RoleRoute>
          }
        />
        <Route
          path="admin-home"
          element={
            <RoleRoute roles={["Admin"]}>
              <AdminHome />
            </RoleRoute>
          }
        />
        <Route
          path="campaign-approvals"
          element={
            <RoleRoute roles={["Admin"]}>
              <CampaignApprovals />
            </RoleRoute>
          }
        />
        <Route
          path="withdrawal-requests"
          element={
            <RoleRoute roles={["Admin"]}>
              <WithdrawalRequests />
            </RoleRoute>
          }
        />
        <Route
          path="manage-users"
          element={
            <RoleRoute roles={["Admin"]}>
              <ManageUsers />
            </RoleRoute>
          }
        />
        <Route
          path="manage-campaigns"
          element={
            <RoleRoute roles={["Admin"]}>
              <ManageCampaigns />
            </RoleRoute>
          }
        />
        <Route
          path="reports"
          element={
            <RoleRoute roles={["Admin"]}>
              <Reports />
            </RoleRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function DashboardIndex() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "Creator") return <Navigate to="/dashboard/creator-home" replace />;
  if (user.role === "Admin") return <Navigate to="/dashboard/admin-home" replace />;
  return <Navigate to="/dashboard/supporter-home" replace />;
}
