
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
  ConfigProvider
} from "antd";
import { 
  SearchOutlined, 
  ReloadOutlined, 
  FilterOutlined,
  MedicineBoxOutlined 
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

  // Theme-aware styles matching PublicMedicineCard
  const themeStyles = {
    container: {
      background: isDarkMode ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      color: isDarkMode ? '#f8fafc' : '#1e293b',
      minHeight: '100vh',
      padding: '24px'
    },
    header: {
      color: isDarkMode ? '#f8fafc' : '#1e293b'
    },
    card: {
      background: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.95)',
      borderColor: isDarkMode ? 'rgba(71, 85, 105, 0.6)' : 'rgba(226, 232, 240, 0.6)',
      backdropFilter: 'blur(20px)'
    },
    filterCard: {
      background: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(248, 250, 252, 0.8)',
      borderColor: isDarkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(226, 232, 240, 0.5)',
      backdropFilter: 'blur(20px)'
    },
    textMuted: {
      color: isDarkMode ? '#94a3b8' : '#64748b'
    },
    divider: {
      backgroundColor: isDarkMode ? '#334155' : '#e2e8f0'
    }
  };

  const fetchMedicines = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) setRefreshing(true);
      else setLoading(true);
      
      setError(null);
      
      const data = await getPublicMedicines();
      const approvedMedicines = data.filter(
        (med) => med.status === "APPROVED" || med.status === "PLACED"
      );
      
      setMedicines(approvedMedicines);
      
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
    fetchMedicines();
  }, []);

  // Filter and sort medicines
  const filteredAndSortedMedicines = useMemo(() => {
    let filtered = medicines;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(medicine =>
        medicine.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(medicine => medicine.status === statusFilter);
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
      <div style={themeStyles.container}>
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: "50vh",
          flexDirection: "column"
        }}>
          <Spin size="large" />
          <p style={{ marginTop: "16px", ...themeStyles.textMuted }}>Loading medicines...</p>
        </div>
      </div>
    );
  }

  if (error && !medicines.length) {
    return (
      <div style={themeStyles.container}>
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
          colorBgContainer: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.95)',
          colorText: isDarkMode ? '#f8fafc' : '#1e293b',
          colorBorder: isDarkMode ? 'rgba(71, 85, 105, 0.6)' : 'rgba(226, 232, 240, 0.6)',
          colorPrimary: '#3b82f6',
          colorTextPlaceholder: isDarkMode ? '#64748b' : '#94a3b8',
          colorBgElevated: isDarkMode ? '#1e293b' : '#ffffff',
          colorTextQuaternary: isDarkMode ? '#94a3b8' : '#64748b',
        },
        components: {
          Card: {
            colorBgContainer: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.95)',
            colorBorderSecondary: isDarkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(226, 232, 240, 0.5)',
          },
          Select: {
            optionSelectedBg: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : '#e6f7ff',
            optionActiveBg: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : '#f5f5f5',
          },
          Input: {
            colorBgContainer: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : '#ffffff',
            colorBorder: isDarkMode ? 'rgba(71, 85, 105, 0.6)' : '#d9d9d9',
            hoverBorderColor: isDarkMode ? '#3b82f6' : '#40a9ff',
          },
          Button: {
            defaultBg: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : '#ffffff',
            defaultBorderColor: isDarkMode ? 'rgba(71, 85, 105, 0.6)' : '#d9d9d9',
            defaultColor: isDarkMode ? '#f8fafc' : '#1e293b',
          }
        }
      }}
    >
      <div style={themeStyles.container}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "16px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <MedicineBoxOutlined style={{ fontSize: "24px", color: "#3b82f6" }} />
              <h1 style={{ margin: 0, color: themeStyles.header.color }}>Available Medicines</h1>
              <Badge 
                count={medicines.length} 
                style={{ 
                  backgroundColor: isDarkMode ? '#10b981' : '#52c41a',
                  color: '#fff'
                }} 
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

          {/* Filters */}
          {/* <Card style={themeStyles.filterCard} bodyStyle={{ padding: '16px' }}>
            <Space size="middle" wrap>
              <Search
                placeholder="Search medicines, manufacturers..."
                allowClear
                enterButton={<SearchOutlined />}
                size="middle"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ minWidth: "300px" }}
              />
              
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ minWidth: "120px" }}
                size="middle"
              >
                <Option value="ALL">All Status</Option>
                <Option value="APPROVED">Approved</Option>
                <Option value="PLACED">Placed</Option>
              </Select>

              <Select
                value={sortBy}
                onChange={setSortBy}
                style={{ minWidth: "140px" }}
                size="middle"
                prefix={<FilterOutlined />}
              >
                <Option value="name">Sort by Name</Option>
                <Option value="price">Sort by Price</Option>
                <Option value="stock">Sort by Stock</Option>
                <Option value="recent">Most Recent</Option>
              </Select>

              {(searchTerm || statusFilter !== "ALL" || sortBy !== "name") && (
                <Button onClick={handleClearFilters} type="link" style={{ color: isDarkMode ? '#3b82f6' : '#1890ff' }}>
                  Clear Filters
                </Button>
              )}
            </Space>
          </Card> */}
          <Card 
  style={themeStyles.filterCard}
  styles={{
    body: { 
      padding: '16px' 
    }
  }}
>
  <Space size="middle" wrap>
    <Search
      placeholder="Search medicines, manufacturers..."
      allowClear
      enterButton={<SearchOutlined />}
      size="middle"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{ minWidth: "300px" }}
    />
    
    <Select
      value={statusFilter}
      onChange={setStatusFilter}
      style={{ minWidth: "120px" }}
      size="middle"
    >
      <Option value="ALL">All Status</Option>
      <Option value="APPROVED">Approved</Option>
      <Option value="PLACED">Placed</Option>
    </Select>

    <Select
      value={sortBy}
      onChange={setSortBy}
      style={{ minWidth: "140px" }}
      size="middle"
      prefix={<FilterOutlined />}
    >
      <Option value="name">Sort by Name</Option>
      <Option value="price">Sort by Price</Option>
      <Option value="stock">Sort by Stock</Option>
      <Option value="recent">Most Recent</Option>
    </Select>

    {(searchTerm || statusFilter !== "ALL" || sortBy !== "name") && (
      <Button onClick={handleClearFilters} type="link" style={{ color: isDarkMode ? '#3b82f6' : '#1890ff' }}>
        Clear Filters
      </Button>
    )}
  </Space>
</Card>
        </div>

        {/* Results Info */}
        <div style={{ marginBottom: "16px" }}>
          <p style={{ ...themeStyles.textMuted, margin: 0 }}>
            {filteredAndSortedMedicines.length === medicines.length
              ? `Showing all ${medicines.length} medicines`
              : `Showing ${filteredAndSortedMedicines.length} of ${medicines.length} medicines`
            }
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
            imageStyle={{ height: 60, filter: isDarkMode ? 'invert(0.8)' : 'none' }}
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
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isDarkMode ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            backdropFilter: 'blur(8px)'
          }}>
            <Spin size="large" />
          </div>
        )}
      </div>
    </ConfigProvider>
  );
}

export default PublicMedicines;