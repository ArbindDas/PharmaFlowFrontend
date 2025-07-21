import { useState, useEffect, useMemo } from "react";
import {
  Row,
  Col,
  Spin,
  message,
  Input,
  Select,
  Button,
  Empty,
  Alert,
  Card,
  Space,
  Badge,
  ConfigProvider,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import { getPublicMedicines } from "../api/publicApi";
import PublicMedicineCard from "../components/PublicMedicineCard";
import { useTheme } from "../context/ThemeContext";

const { Search } = Input;
const { Option } = Select;

function PublicMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("name");
  const [refreshing, setRefreshing] = useState(false);
  const { isDarkMode } = useTheme();

  const fetchMedicines = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) setRefreshing(true);
      else setLoading(true);

      setError(null);

      const data = await getPublicMedicines();
      setMedicines(data);
      console.log("All medicines:", data);

      const approved = data.filter((med) => {
        const status = med.medicineStatus; // Check both variants
        return status === "ADDED" || status === "AVAILABLE";
      });

      console.log("Filterd medicines: ", approved);
      setMedicines(approved);

      if (showRefreshIndicator) {
        message.success("Medicines refreshed successfully");
      }
    } catch (err) {
      const errorMessage = err.message || "Failed to load medicines";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    console.log("Fetching medicines..."); // 👈 Track when fetch starts
    fetchMedicines();
  }, []);

  // Filter and sort medicines
  const filteredAndSortedMedicines = useMemo(() => {
    let filtered = medicines;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (medicine) =>
          medicine.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          medicine.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(
        (medicine) => medicine.status === statusFilter
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "price":
          return (a.price || 0) - (b.price || 0);
        case "stock":
          return (b.stock || 0) - (a.stock || 0);
        case "recent":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [medicines, searchTerm, statusFilter, sortBy]);

  const handleRefresh = () => {
    fetchMedicines(true);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setSortBy("name");
  };

  if (loading && !refreshing) {
    return (
      <div
        className={`min-h-screen p-6 ${
          isDarkMode
            ? "bg-gradient-to-br from-slate-800 to-slate-900"
            : "bg-gradient-to-br from-white to-slate-50"
        }`}
      >
        <div className="flex justify-center items-center min-h-[50vh] flex-col">
          <Spin size="large" />
          <p
            className={`mt-4 ${
              isDarkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Loading medicines...
          </p>
        </div>
      </div>
    );
  }

  if (error && !medicines.length) {
    return (
      <div
        className={`min-h-screen p-6 ${
          isDarkMode
            ? "bg-gradient-to-br from-slate-800 to-slate-900"
            : "bg-gradient-to-br from-white to-slate-50"
        }`}
      >
        <Alert
          message="Error Loading Medicines"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => fetchMedicines()}>
              Try Again
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: isDarkMode
            ? "rgba(30, 41, 59, 0.8)"
            : "rgba(255, 255, 255, 0.95)",
          colorText: isDarkMode ? "#f8fafc" : "#1e293b",
          colorBorder: isDarkMode
            ? "rgba(71, 85, 105, 0.6)"
            : "rgba(226, 232, 240, 0.6)",
          colorPrimary: "#3b82f6",
          colorTextPlaceholder: isDarkMode ? "#64748b" : "#94a3b8",
          colorBgElevated: isDarkMode ? "#1e293b" : "#ffffff",
          colorTextQuaternary: isDarkMode ? "#94a3b8" : "#64748b",
        },
        components: {
          Card: {
            colorBgContainer: isDarkMode
              ? "rgba(30, 41, 59, 0.8)"
              : "rgba(255, 255, 255, 0.95)",
            colorBorderSecondary: isDarkMode
              ? "rgba(71, 85, 105, 0.5)"
              : "rgba(226, 232, 240, 0.5)",
          },
          Select: {
            optionSelectedBg: isDarkMode
              ? "rgba(59, 130, 246, 0.2)"
              : "#e6f7ff",
            optionActiveBg: isDarkMode ? "rgba(59, 130, 246, 0.1)" : "#f5f5f5",
          },
          Input: {
            colorBgContainer: isDarkMode ? "rgba(15, 23, 42, 0.5)" : "#ffffff",
            colorBorder: isDarkMode ? "rgba(71, 85, 105, 0.6)" : "#d9d9d9",
            hoverBorderColor: isDarkMode ? "#3b82f6" : "#40a9ff",
          },
          Button: {
            defaultBg: isDarkMode ? "rgba(30, 41, 59, 0.8)" : "#ffffff",
            defaultBorderColor: isDarkMode
              ? "rgba(71, 85, 105, 0.6)"
              : "#d9d9d9",
            defaultColor: isDarkMode ? "#f8fafc" : "#1e293b",
          },
        },
      }}
    >
      <div
        className={`min-h-screen p-6 ${
          isDarkMode
            ? "bg-gradient-to-br from-slate-800 to-slate-900 text-slate-100"
            : "bg-gradient-to-br from-white to-slate-50 text-slate-900"
        }`}
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <MedicineBoxOutlined className="text-2xl text-blue-500" />
              <h1
                className={`m-0 ${
                  isDarkMode ? "text-slate-100" : "text-slate-900"
                }`}
              >
                Available Medicines
              </h1>
              <Badge
                count={medicines.length}
                className={`${
                  isDarkMode ? "bg-emerald-500" : "bg-green-500"
                } text-white`}
              />
            </div>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={refreshing}
              type="default"
            >
              Refresh
            </Button>
          </div>

          <Card
            className={`${
              isDarkMode
                ? "bg-slate-800/80 border-slate-600/50"
                : "bg-slate-50/80 border-slate-200/50"
            } backdrop-blur-md`}
            styles={{
              body: { padding: "16px" },
            }}
          >
            <Space size="middle" wrap>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                className="min-w-[120px]"
                size="middle"
              >
                <Option value="ALL">All Status</Option>
                <Option value="ADDED">ADDED</Option>
                <Option value="AVAILABLE">AVAILABLE</Option>
              </Select>

              <Select
                value={sortBy}
                onChange={setSortBy}
                className="min-w-[140px]"
                size="middle"
                prefix={<FilterOutlined />}
              >
                <Option value="name">Sort by Name</Option>
                <Option value="price">Sort by Price</Option>
                <Option value="stock">Sort by Stock</Option>
                <Option value="recent">Most Recent</Option>
              </Select>

              {(searchTerm || statusFilter !== "ALL" || sortBy !== "name") && (
                <Button
                  onClick={handleClearFilters}
                  type="link"
                  className={isDarkMode ? "text-blue-500" : "text-blue-600"}
                >
                  Clear Filters
                </Button>
              )}
            </Space>
          </Card>
        </div>

        {/* Results Info */}
        <div className="mb-4">
          <p
            className={`m-0 ${
              isDarkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {filteredAndSortedMedicines.length === medicines.length
              ? `Showing all ${medicines.length} medicines`
              : `Showing ${filteredAndSortedMedicines.length} of ${medicines.length} medicines`}
          </p>
        </div>

        {/* Medicine Grid */}
        {filteredAndSortedMedicines.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              searchTerm || statusFilter !== "ALL"
                ? "No medicines found matching your filters"
                : "No medicines available at the moment"
            }
            styles={{
              image: {
                height: 60,
                filter: isDarkMode ? "invert(0.8)" : "none",
              },
            }}
          >
            {(searchTerm || statusFilter !== "ALL") && (
              <Button type="primary" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            )}
          </Empty>
        ) : (
          <Row gutter={[16, 16]}>
            {filteredAndSortedMedicines.map((medicine) => (
              <Col key={medicine.id} xs={24} sm={12} md={8} lg={6}>
                <PublicMedicineCard medicine={medicine} />
              </Col>
            ))}
          </Row>
        )}

        {/* Loading overlay for refresh */}
        {refreshing && (
          <div
            className={`fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm ${
              isDarkMode ? "bg-slate-900/80" : "bg-white/80"
            }`}
          >
            <Spin size="large" />
          </div>
        )}
      </div>
    </ConfigProvider>
  );
}

export default PublicMedicines;
