// import { useState, useEffect } from "react";
// import { Row, Col, Spin, message } from "antd";
// import { getPublicMedicines } from "../api/publicApi";
// import PublicMedicineCard from "../components/PublicMedicineCard";

// function PublicMedicines() {
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchMedicines() {
//       try {
//         const data = await getPublicMedicines();
//         const approvedMedicines = data.filter(
//           (med) => med.status === "APPROVED" || med.status === "PLACED"
//         );
//         setMedicines(approvedMedicines);
//       } catch (err) {
//         setError(err.message);
//         message.error("Failed to load medicines");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchMedicines();
//   }, []);

//   if (loading)
//     return (
//       <Spin
//         size="large"
//         style={{ display: "flex", justifyContent: "center", marginTop: "20%" }}
//       />
//     );
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="public-container" style={{ padding: "24px" }}>
//       <h1>Available Medicines</h1>
//       <Row gutter={[16, 16]}>
//         {medicines.map((medicine) => (
//           <Col key={medicines.id} xs={24} sm={12} md={8} lg={6}>
//             <PublicMedicineCard medicine={medicine} />
//           </Col>
//         ))}
//       </Row>

      
//     </div>
//   );
// }

// export default PublicMedicines;

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
  Badge
} from "antd";
import { 
  SearchOutlined, 
  ReloadOutlined, 
  FilterOutlined,
  MedicineBoxOutlined 
} from "@ant-design/icons";
import { getPublicMedicines } from "../api/publicApi";
import PublicMedicineCard from "../components/PublicMedicineCard";

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
      <div className="public-container" style={{ padding: "24px" }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: "50vh",
          flexDirection: "column"
        }}>
          <Spin size="large" />
          <p style={{ marginTop: "16px", color: "#666" }}>Loading medicines...</p>
        </div>
      </div>
    );
  }

  if (error && !medicines.length) {
    return (
      <div className="public-container" style={{ padding: "24px" }}>
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
    <div className="public-container" style={{ padding: "24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "16px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MedicineBoxOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
            <h1 style={{ margin: 0 }}>Available Medicines</h1>
            <Badge count={medicines.length} style={{ backgroundColor: "#52c41a" }} />
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
        <Card>
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
              <Button onClick={handleClearFilters} type="link">
                Clear Filters
              </Button>
            )}
          </Space>
        </Card>
      </div>

      {/* Results Info */}
      <div style={{ marginBottom: "16px" }}>
        <p style={{ color: "#666", margin: 0 }}>
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
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <Spin size="large" />
        </div>
      )}
    </div>
  );
}

export default PublicMedicines;