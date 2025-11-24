import { useEffect, useState } from "react";
import { useRoleRequestStore } from "../store/useRoleRequestStore";
import { useAuthStore } from "../store/useAuthStore";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminRoleRequestsPage({ isNavbarOpen }) {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { roleRequests, isLoading, fetchRoleRequests, approveRoleRequest, rejectRoleRequest } = useRoleRequestStore();
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (authUser && authUser.role !== "admin") {
      navigate("/", { replace: true });
      toast.error("Anda tidak memiliki akses ke halaman ini");
    }
  }, [authUser, navigate]);

  useEffect(() => {
    fetchRoleRequests("pending");
  }, [fetchRoleRequests]);

  const handleApprove = async (requestId) => {
    try {
      await approveRoleRequest(requestId);
      fetchRoleRequests("pending");
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (requestId) => {
    if (!rejectionReason.trim()) {
      toast.error("Mohon berikan alasan penolakan");
      return;
    }
    try {
      await rejectRoleRequest(requestId, rejectionReason);
      setRejectingId(null);
      setRejectionReason("");
      fetchRoleRequests("pending");
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <div className={`transition-all duration-300 ${isNavbarOpen ? "ml-64" : "ml-22"} p-4 md:p-6 relative `}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content">Persetujuan Permintaan Role</h1>
        <p className="text-base-content/60 mt-2">Kelola permintaan user untuk upgrade role</p>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : roleRequests.length === 0 ? (
        /* Empty State */
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body text-center py-12">
            <h2 className="card-title justify-center text-base-content/70">Tidak ada permintaan pending</h2>
            <p className="text-base-content/60">Semua permintaan role sudah diproses</p>
          </div>
        </div>
      ) : (
        /* Role Requests List */
        <div className="space-y-4">
          {roleRequests.map((request) => (
            <div key={request._id} className="card bg-base-200 shadow-md">
              <div className="card-body">
                {/* User Info */}
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={request.userId.profilePic || "/images/avatar.png"}
                    alt={request.userId.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-base-content">{request.userId.fullName}</h3>
                    <p className="text-sm text-base-content/60">{request.userId.email}</p>
                  </div>
                  <div className="badge badge-lg badge-info">
                    {request.requestedRole === "contributor" ? "Kontributor" : "Admin"}
                  </div>
                </div>

                {/* Request Details */}
                <div className="bg-base-100 p-3 rounded-lg mb-4">
                  <p className="text-sm text-base-content/70 mb-2">
                    <strong>Alasan:</strong> {request.reason || "-"}
                  </p>
                  <p className="text-xs text-base-content/50">
                    Dibuat: {new Date(request.createdAt).toLocaleDateString("id-ID")}
                  </p>
                </div>

                {/* Action Buttons */}
                {rejectingId === request._id ? (
                  /* Reject Form */
                  <div className="space-y-3">
                    <textarea
                      placeholder="Alasan penolakan (opsional)"
                      className="textarea textarea-bordered w-full text-sm"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleReject(request._id)} className="btn btn-sm btn-error flex-1">
                        Konfirmasi Penolakan
                      </button>
                      <button
                        onClick={() => {
                          setRejectingId(null);
                          setRejectionReason("");
                        }}
                        className="btn btn-sm btn-ghost flex-1 bg-gray-700"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Approve/Reject Buttons */
                  <div className="flex gap-3">
                    <button onClick={() => handleApprove(request._id)} className="btn btn-sm btn-success flex-1 gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Setujui
                    </button>
                    <button onClick={() => setRejectingId(request._id)} className="btn btn-sm btn-error flex-1 gap-2">
                      <XCircle className="w-4 h-4" />
                      Tolak
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
