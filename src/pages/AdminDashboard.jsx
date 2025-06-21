import React, { useEffect, useState } from "react";
import {
  Users,
  ShoppingCart,
  Package,
  Activity,
  TrendingUp,
  Calendar,
  Bell,
  Search,
  Settings,
  LogOut,
  ChevronDown,
  Heart,
  Shield,
  DollarSign,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  ArrowUpRight,
  MoreVertical,
  Menu,
} from "lucide-react";
import authService from "../api/auth";
import { useAuth } from "../context/AuthContext";
import UserDetailsModal from "../components/UserDetailsModal";
import UserEditModal from "../components/UserEditModal";
import ConfirmationModal from "../components/ConfirmationModal";
import { toast } from "react-toastify"; // or your toast library
import "react-toastify/dist/ReactToastify.css";
import AddMemberModal from "../components/AddMemberModal";

const AnimatedCard = ({
  children,
  className = "",
  hoverScale = true,
  ...props
}) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 ease-out hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 ${
      hoverScale ? "hover:scale-[1.02]" : ""
    } ${className}`}
    {...props}
  >
    {children}
  </div>
);

const TooltipWrapper = ({ children, tooltip, position = "top" }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "-top-2 left-1/2 transform -translate-x-1/2 -translate-y-full",
    bottom: "-bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full",
    left: "top-1/2 -left-2 transform -translate-y-1/2 -translate-x-full",
    right: "top-1/2 -right-2 transform -translate-y-1/2 translate-x-full",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap transition-all duration-200 ease-out transform ${positionClasses[position]} animate-in fade-in slide-in-from-bottom-2`}
        >
          {tooltip}
          <div
            className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === "top"
                ? "top-full left-1/2 -translate-x-1/2 -translate-y-1/2"
                : position === "bottom"
                ? "bottom-full left-1/2 -translate-x-1/2 translate-y-1/2"
                : position === "left"
                ? "left-full top-1/2 -translate-y-1/2 -translate-x-1/2"
                : "right-full top-1/2 -translate-y-1/2 translate-x-1/2"
            }`}
          ></div>
        </div>
      )}
    </div>
  );
};

const ActionButton = ({
  icon: Icon,
  onClick,
  variant = "primary",
  tooltip,
  ...props
}) => {
  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/25",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:shadow-md",
    danger:
      "bg-red-500 hover:bg-red-600 text-white hover:shadow-lg hover:shadow-red-500/25",
    success:
      "bg-green-500 hover:bg-green-600 text-white hover:shadow-lg hover:shadow-green-500/25",
  };

  const button = (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-all duration-200 ease-out transform hover:scale-110 active:scale-95 ${variants[variant]}`}
      {...props}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return tooltip ? (
    <TooltipWrapper tooltip={tooltip}>{button}</TooltipWrapper>
  ) : (
    button
  );
};

const UsersPanel = ({ members = [], loading, onRefreshMembers }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  // Initialize with empty array if members is falsy
  const [localMembers, setLocalMembers] = useState(
    Array.isArray(members) ? members : []
  );

  useEffect(() => {
    if (Array.isArray(members)) {
      setLocalMembers(members);
    }
  }, [members]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user, updateUserProfile, adminUpdateUserProfile } = useAuth();
  const [success, setSuccess] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [users, setUsers] = useState([]); // Add this line with your other state declarations

  // Add this state to your UsersPanel component
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add this function to handle member creation
  // const handleAddMember = async (memberData) => {
  //   try {
  //     // Call your API service to add the member
  //     const response = await authService.register({
  //       fullname: memberData.fullname,
  //       email: memberData.email,
  //       password: memberData.password,
  //     });

  //     // Update local state
  //     setUsers((prev) => [...prev, response]);
  //     return response;
  //   } catch (error) {
  //     throw new Error(error.message || "Failed to add member");
  //   }
  // };


  const handleAddMember = async (memberData) => {
  try {
    // Destructure the memberData object and pass individual parameters
    const response = await authService.register(
      memberData.fullname,
      memberData.email,
      memberData.password
    );

    // Update local state
    setUsers((prev) => [...prev, response]);
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to add member");
  }
};

  const handleDeleteClick = (user) => {
    console.log("Setting user to delete:", user); // Check user data
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete?.id) {
      console.error("No user selected for deletion");
      toast.error("No user selected for deletion");
      return;
    }

    try {
      console.log("Attempting to delete user ID:", userToDelete.id);

      // Using authService with admin flag
      await authService.deleteUser(userToDelete.id, true);

      console.log("Delete successful");

      // Close modal and reset selection
      setIsDeleteModalOpen(false);
      setUserToDelete(null);

      // Update UI - choose ONE of these approaches:

      // OPTION 1: Optimistic update (faster UI response)
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userToDelete.id)
      );

      // OPTION 2: Full refresh (more reliable)
      // await fetchUsers();

      // Show success message
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.message || "Failed to delete user");
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleEditUser = (member) => {
    console.log("Edit button clicked, user:", member); // <-- Check if this logs
    setSelectedUser(member);
    setIsEditModalOpen(true);
    setError(null); // Reset error when opening modal
  };

  const handleUpdateUser = async (updatedData) => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);
      setError(null);

      const { user: currentUser } = useAuth();

      const isAdmin = currentUser?.roles?.some(
        (role) => role === "ADMIN" || role === "ROLE_ADMIN"
      );

      const isAdminUpdate = isAdmin && selectedUser.id !== currentUser?.id;

      // Force fresh update with all required fields
      const updatePayload = {
        id: selectedUser.id,
        fullName: updatedData.fullName,
        email: updatedData.email,
        roles: updatedData.roles,
        authProvider: updatedData.authProvider,
      };

      const updatedUser = isAdminUpdate
        ? await adminUpdateUserProfile(updatePayload)
        : await updateUserProfile(updatePayload);

      // DEBUG: Verify the updated user data
      console.log("Updated user from API:", updatedUser);

      // DEEP STATE UPDATE
      setUsers((prevUsers) => {
        const newUsers = prevUsers.map((user) =>
          user.id === updatedUser.id
            ? { ...user, ...updatedUser } // COMPLETE overwrite
            : user
        );
        console.log("New users state:", newUsers);
        return newUsers;
      });

      setIsEditModalOpen(false);
      setSuccess("User updated successfully!");
    } catch (error) {
      setError({
        type: "update",
        message: error.message || "Update failed. Please try again.",
        details: error.response?.data || null,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6 ">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Medicare Members</h3>
          <p className="text-gray-600 mt-1">
            Manage and view all Medicare beneficiaries ({members?.length || 0}{" "}
            total)
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onRefreshMembers}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 flex items-center space-x-2"
            disabled={loading}
          >
            <Activity className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          {/* <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button> */}
          // Update your Add Member button to open the modal
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>
      <AnimatedCard className="overflow-hidden border border-red-500">
        {" "}
        {/* Temporary border */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Member
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Roles
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  createdAt
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                // Loading skeleton
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-32"></div>
                          <div className="h-3 bg-gray-300 rounded w-24"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded w-40"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <div className="w-8 h-8 bg-gray-300 rounded"></div>
                        <div className="w-8 h-8 bg-gray-300 rounded"></div>
                        <div className="w-8 h-8 bg-gray-300 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : members.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <Users className="w-12 h-12 text-gray-400" />
                      <p className="text-gray-500 text-lg">No members found</p>
                      <p className="text-gray-400 text-sm">
                        Get started by adding your first Medicare member
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Actual data
                localMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-200 group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium shadow-md">
                          {getInitials(member.fullName)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {member.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {member.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {member.email}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {member.roles}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(member.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {/* <ActionButton  icon={Eye} variant="secondary" tooltip="View Details" /> */}
                        <ActionButton
                          onClick={() => handleViewUser(member)}
                          icon={Eye}
                          variant="secondary"
                          tooltip="View Details"
                        />
                        <ActionButton
                          onClick={() => handleEditUser(member)}
                          icon={Edit}
                          variant="primary"
                          tooltip="Edit Member"
                        />
                        <ActionButton
                          onClick={() => handleDeleteClick(member)}
                          icon={Trash2}
                          variant="danger"
                          tooltip="Remove Member"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AnimatedCard>
      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
      {/* Edit Modal */}
      <UserEditModal
        user={selectedUser}
        isOpen={isEditModalOpen}
        onClose={() => {
          // console.log("Closing modal from parent");
          setIsEditModalOpen(false);
          setSelectedUser(null); // Clear selection
        }}
        onUpdate={(updatedUser) => {
          console.log("Saving user data:", updatedUser);
          handleUpdateUser(updatedUser);
          setIsEditModalOpen(false); // Close after save
          setSelectedUser(null); // Clear selection
        }}
      />
      {/* // Add the modal component at the bottom of your UsersPanel return */}
      {/* statement */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddMember={handleAddMember}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
      >
        <p>Are you sure you want to delete {userToDelete?.name}?</p>
        <p className="text-sm text-gray-500">This action cannot be undone.</p>
      </ConfirmationModal>
      {/* Debug output */}
      <div className="mt-4 p-4 bg-yellow-50 text-sm">
        <h4 className="font-bold">Debug Info:</h4>
        <p>Loading: {loading?.toString() ?? "undefined"}</p>
        <p>Member Count: {members?.length}</p>
        {members.length > 0 && (
          <p>First Member: {JSON.stringify(members[0])}</p>
        )}
      </div>
    </div>
  );
};

const OrdersPanel = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-2xl font-bold text-gray-900">Claims & Requests</h3>
        <p className="text-gray-600 mt-1">
          Monitor and process Medicare claims
        </p>
      </div>
      <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 flex items-center space-x-2">
        <Plus className="w-4 h-4" />
        <span>Process Claim</span>
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {[
        {
          label: "Pending Claims",
          value: "47",
          color: "from-orange-500 to-orange-600",
          icon: AlertCircle,
          trend: "+12%",
        },
        {
          label: "Approved Today",
          value: "23",
          color: "from-green-500 to-green-600",
          icon: Shield,
          trend: "+5%",
        },
        {
          label: "Under Review",
          value: "12",
          color: "from-blue-500 to-blue-600",
          icon: Activity,
          trend: "-2%",
        },
        {
          label: "Rejected",
          value: "3",
          color: "from-red-500 to-red-600",
          icon: AlertCircle,
          trend: "-8%",
        },
      ].map((stat, i) => {
        const Icon = stat.icon;
        return (
          <AnimatedCard key={i} className="p-6 group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  {stat.value}
                </p>
                <p
                  className={`text-sm font-medium mt-1 ${
                    stat.trend.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.trend} vs yesterday
                </p>
              </div>
              <div
                className={`p-4 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000 ease-out transform origin-left`}
                style={{ width: `${Math.random() * 80 + 20}%` }}
              ></div>
            </div>
          </AnimatedCard>
        );
      })}
    </div>

    <AnimatedCard className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-lg font-semibold text-gray-900">Recent Claims</h4>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1 hover:underline">
          <span>View All</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-3">
        {[
          {
            member: "John Smith",
            type: "Prescription",
            amount: "$245",
            status: "Approved",
            priority: "Normal",
          },
          {
            member: "Mary Johnson",
            type: "Hospital Visit",
            amount: "$1,850",
            status: "Under Review",
            priority: "High",
          },
          {
            member: "Robert Brown",
            type: "Lab Work",
            amount: "$120",
            status: "Pending",
            priority: "Low",
          },
        ].map((claim, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-xl hover:from-blue-50 hover:shadow-md transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-medium shadow-md group-hover:shadow-lg transition-shadow duration-200">
                {claim.member
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  {claim.member}
                </div>
                <div className="text-sm text-gray-500">{claim.type}</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="font-bold text-gray-900">{claim.amount}</div>
                <div
                  className={`text-xs px-2 py-1 rounded-full transition-all duration-200 ${
                    claim.status === "Approved"
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : claim.status === "Under Review"
                      ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  }`}
                >
                  {claim.status}
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <TooltipWrapper tooltip="More Actions">
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                </TooltipWrapper>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AnimatedCard>
  </div>
);

const ProductsPanel = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-2xl font-bold text-gray-900">Medicare Plans</h3>
        <p className="text-gray-600 mt-1">
          Manage available Medicare coverage options
        </p>
      </div>
      <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2">
        <Plus className="w-4 h-4" />
        <span>Add Plan</span>
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        {
          name: "Medicare Advantage",
          members: 1247,
          premium: "$0",
          type: "Part C",
          color: "from-blue-500 to-blue-600",
          satisfaction: 94,
        },
        {
          name: "Medicare Supplement",
          members: 834,
          premium: "$156",
          type: "Medigap",
          color: "from-green-500 to-green-600",
          satisfaction: 89,
        },
        {
          name: "Medicare Part D",
          members: 2103,
          premium: "$32",
          type: "Prescription",
          color: "from-purple-500 to-purple-600",
          satisfaction: 92,
        },
      ].map((plan, i) => (
        <AnimatedCard
          key={i}
          className="p-6 group cursor-pointer overflow-hidden relative"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
          ></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                {plan.name}
              </h4>
              <span
                className={`px-3 py-1 bg-gradient-to-r ${plan.color} text-white text-xs font-medium rounded-full shadow-sm group-hover:shadow-md transition-shadow duration-200`}
              >
                {plan.type}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Members</span>
                <span className="text-lg font-bold text-gray-900">
                  {plan.members.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Premium</span>
                <span className="text-lg font-bold text-green-600">
                  {plan.premium}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Satisfaction</span>
                  <span className="font-medium text-gray-900">
                    {plan.satisfaction}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 bg-gradient-to-r ${plan.color} rounded-full transition-all duration-1000 ease-out transform origin-left group-hover:shadow-sm`}
                    style={{ width: `${plan.satisfaction}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <ActionButton
                icon={Eye}
                variant="secondary"
                tooltip="View Details"
              />
              <ActionButton icon={Edit} variant="primary" tooltip="Edit Plan" />
              <ActionButton
                icon={Settings}
                variant="secondary"
                tooltip="Plan Settings"
              />
            </div>
          </div>
        </AnimatedCard>
      ))}
    </div>
  </div>
);

const AdminDashboard = () => {
  // const { user, logout } = useAuth();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      setLoading(true); // Add this line
      const data = await authService.getAllUsers();
      console.log("API Response:", data); // Add this to debug
      setMembers(data);
    } catch (error) {
      console.error("Error fetching medicare memebers ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const navigation = [
    { id: "dashboard", name: "Overview", icon: Activity },
    { id: "users", name: "Members", icon: Users },
    { id: "orders", name: "Claims", icon: ShoppingCart },
    { id: "products", name: "Plans", icon: Package },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Medicare Admin</span>
          </div>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ease-out group ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 hover:shadow-sm hover:scale-102"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mr-3 transition-transform duration-200 ${
                    isActive ? "text-white" : "group-hover:scale-110"
                  }`}
                />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`lg:ml-64 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
            {/* Left side - search and menu button */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile menu button - only shows on small screens */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Search bar - adjusts for mobile */}
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors duration-200 group-hover:text-blue-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-3 py-1.5 sm:pl-10 sm:pr-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:shadow-md focus:shadow-lg w-36 sm:w-48 md:w-64"
                />
              </div>
            </div>

            {/* Right side - notifications and user profile */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Notifications - hidden on smallest screens */}
              <TooltipWrapper tooltip="Notifications">
                <button className="hidden xs:inline-flex p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 relative">
                  <Bell className="w-5 h-5" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </button>
              </TooltipWrapper>

              {/* User profile - compact on mobile */}
              <div className="flex items-center space-x-1 sm:space-x-3 group cursor-pointer">
                {/* Email and role - hidden on mobile, shown on sm+ */}
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 truncate max-w-[120px] md:max-w-none">
                    {user.email}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-[120px] md:max-w-none">
                    {user.roles}
                  </div>
                </div>

                {/* Avatar - always visible */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-110">
                  <span className="text-white text-xs sm:text-sm font-medium">
                    {user.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>

                {/* Logout button - hidden on mobile, shown on sm+ */}
                <TooltipWrapper tooltip="Logout">
                  <button
                    onClick={logout}
                    className="hidden sm:inline-flex p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 hover:scale-110"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </TooltipWrapper>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                    Dashboard Overview
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Welcome back, {user.fullName?.split(" ")[0]}! Here's what's
                    happening with Medicare today.
                  </p>
                </div>
                <div className="flex items-center space-x-3 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    label: "Total Members",
                    value: "4,184",
                    change: "+12%",
                    icon: Users,
                    color: "from-blue-500 to-blue-600",
                    bg: "from-blue-50 to-blue-100",
                  },
                  {
                    label: "Active Claims",
                    value: "47",
                    change: "-8%",
                    icon: ShoppingCart,
                    color: "from-orange-500 to-orange-600",
                    bg: "from-orange-50 to-orange-100",
                  },
                  {
                    label: "Monthly Revenue",
                    value: "$1.2M",
                    change: "+23%",
                    icon: DollarSign,
                    color: "from-green-500 to-green-600",
                    bg: "from-green-50 to-green-100",
                  },
                  {
                    label: "Satisfaction Score",
                    value: "94%",
                    change: "+2%",
                    icon: TrendingUp,
                    color: "from-purple-500 to-purple-600",
                    bg: "from-purple-50 to-purple-100",
                  },
                ].map((metric, i) => {
                  const Icon = metric.icon;
                  return (
                    <AnimatedCard
                      key={i}
                      className={`p-6 bg-gradient-to-br ${metric.bg} border-0 group cursor-pointer overflow-hidden relative`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                      ></div>
                      <div className="relative z-10">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-600">
                              {metric.label}
                            </p>
                            <p className="text-3xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300">
                              {metric.value}
                            </p>
                            <p
                              className={`text-sm font-semibold flex items-center space-x-1 ${
                                metric.change.startsWith("+")
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              <ArrowUpRight
                                className={`w-4 h-4 ${
                                  !metric.change.startsWith("+")
                                    ? "rotate-90"
                                    : ""
                                }`}
                              />
                              <span>{metric.change} from last month</span>
                            </p>
                          </div>
                          <div
                            className={`p-4 rounded-2xl bg-gradient-to-br ${metric.color} shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 group-hover:-rotate-3`}
                          >
                            <Icon className="w-7 h-7 text-white" />
                          </div>
                        </div>
                      </div>
                    </AnimatedCard>
                  );
                })}
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AnimatedCard className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      Recent Claims
                    </h3>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1 hover:underline transition-all duration-200 hover:scale-105">
                      <span>View All</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {[
                      {
                        member: "John Smith",
                        type: "Prescription",
                        amount: "$245",
                        status: "Approved",
                      },
                      {
                        member: "Mary Johnson",
                        type: "Hospital Visit",
                        amount: "$1,850",
                        status: "Under Review",
                      },
                      {
                        member: "Robert Brown",
                        type: "Lab Work",
                        amount: "$120",
                        status: "Pending",
                      },
                    ].map((claim, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-xl hover:from-blue-50 hover:shadow-md transition-all duration-300 group cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-medium shadow-md group-hover:shadow-lg transition-shadow duration-200">
                            {claim.member
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                              {claim.member}
                            </div>
                            <div className="text-sm text-gray-500">
                              {claim.type}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-bold text-gray-900">
                              {claim.amount}
                            </div>
                            <div
                              className={`text-xs px-2 py-1 rounded-full ${
                                claim.status === "Approved"
                                  ? "bg-green-100 text-green-800"
                                  : claim.status === "Under Review"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {claim.status}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AnimatedCard>

                <AnimatedCard className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Plan Enrollment Trends
                  </h3>
                  <div className="space-y-6">
                    {[
                      {
                        plan: "Medicare Advantage",
                        percentage: 78,
                        members: 1247,
                        color: "from-blue-500 to-blue-600",
                      },
                      {
                        plan: "Medicare Supplement",
                        percentage: 45,
                        members: 834,
                        color: "from-green-500 to-green-600",
                      },
                      {
                        plan: "Medicare Part D",
                        percentage: 92,
                        members: 2103,
                        color: "from-purple-500 to-purple-600",
                      },
                    ].map((plan, i) => (
                      <div key={i} className="space-y-3 group">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                            {plan.plan}
                          </span>
                          <span className="text-sm text-gray-500 font-medium">
                            {plan.members.toLocaleString()} members
                          </span>
                        </div>
                        <div className="relative">
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-3 bg-gradient-to-r ${plan.color} rounded-full transition-all duration-1000 ease-out transform origin-left shadow-sm group-hover:shadow-md`}
                              style={{ width: `${plan.percentage}%` }}
                            ></div>
                          </div>
                          <div className="absolute right-0 top-0 transform translate-y-4 opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg">
                              {plan.percentage}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AnimatedCard>
              </div>
            </div>
          )}
          {activeTab === "users" && (
            <UsersPanel
              members={members}
              loading={loading}
              onRefreshMembers={fetchMembers}
            />
          )}
          {activeTab === "orders" && <OrdersPanel />}
          {activeTab === "products" && <ProductsPanel />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
