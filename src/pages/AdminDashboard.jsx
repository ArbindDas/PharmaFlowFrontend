import React, { useEffect, useState } from "react";
import axios from "axios";
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
  Pill,
  icons,
  Zap,
} from "lucide-react";
import authService from "../api/auth";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { ArrowUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import UserDetailsModal from "../components/UserDetailsModal";
import { X } from "lucide-react";
import UserEditModal from "../components/UserEditModal";
import ConfirmationModal from "../components/ConfirmationModal";
import { toast } from "react-toastify"; // or your toast library
import "react-toastify/dist/ReactToastify.css";
import AddMemberModal from "../components/AddMemberModal";
import { SearchX } from "lucide-react";
// import { useTheme } from "../context/ThemeContext";

import {
  ChartBarIcon,
  ArrowPathIcon,
  ArrowTrendingUpIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

import {
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getMedicines,
} from "../api/medicineApi";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Badge, Card, Typography, Empty, Spin } from "antd";
import ErrorBoundary from "../components/ErrorBoundary";
import { useTheme } from "../hooks/useTheme";

const { Title, Text } = Typography;

const ChartBar = ({ medicines = [], isLoading = false }) => {
  const { isDarkMode } = useTheme();

  // Process medicine data for the chart with fallback for undefined medicines
  const processStockData = () => {
    if (!medicines || !Array.isArray(medicines)) return [];

    return medicines.map((medicine) => {
      const status =
        medicine.stock === 0
          ? "Out of Stock"
          : medicine.stock <= 5
          ? "Low Stock"
          : medicine.stock <= 15
          ? "Medium Stock"
          : "High Stock";

      return {
        name: medicine.name || "Unknown",
        stock: medicine.stock || 0,
        status,
        price: medicine.price || 0,
        expiryDate: medicine.expiryDate
          ? new Date(medicine.expiryDate)
          : new Date(),
        isExpiringSoon: medicine.expiryDate
          ? new Date(medicine.expiryDate) <=
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          : false,
      };
    });
  };

  const stockData = processStockData();

  // Custom shape for the bars with enhanced styling
  const CustomBarShape = (props) => {
    const { x, y, width, height, status } = props;

    let fill, shadowColor;
    switch (status) {
      case "High Stock":
        fill = "#10b981";
        shadowColor = "rgba(16, 185, 129, 0.3)";
        break;
      case "Medium Stock":
        fill = "#f59e0b";
        shadowColor = "rgba(245, 158, 11, 0.3)";
        break;
      case "Low Stock":
        fill = "#ef4444";
        shadowColor = "rgba(239, 68, 68, 0.3)";
        break;
      default:
        fill = "#6b7280";
        shadowColor = "rgba(107, 114, 128, 0.3)";
    }

    return (
      <g>
        {/* Shadow effect */}
        <rect
          x={x + 2}
          y={y + 2}
          width={width}
          height={height}
          rx={8}
          ry={8}
          fill={shadowColor}
          style={{ filter: "blur(2px)" }}
        />
        {/* Main bar with gradient */}
        <defs>
          <linearGradient id={`gradient-${status}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={fill} stopOpacity={0.8} />
            <stop offset="100%" stopColor={fill} stopOpacity={1} />
          </linearGradient>
        </defs>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={8}
          ry={8}
          fill={`url(#gradient-${status})`}
          style={{
            transition: "all 0.3s ease",
            filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
          }}
        />
        {/* Shine effect */}
        <rect
          x={x + 4}
          y={y + 4}
          width={width - 8}
          height={height * 0.25}
          rx={4}
          ry={4}
          fill="white"
          fillOpacity={0.3}
        />
        {/* Subtle border */}
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={8}
          ry={8}
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={1}
        />
      </g>
    );
  };

  // Enhanced custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    return (
      <div
        className={`p-5 rounded-2xl shadow-2xl border backdrop-blur-xl transform transition-all duration-300
        ${
          isDarkMode
            ? "bg-slate-800/95 border-slate-600/50 shadow-slate-900/50"
            : "bg-white/95 border-slate-200/50 shadow-slate-800/10"
        }`}
        style={{
          background: isDarkMode
            ? "linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(51, 65, 85, 0.95))"
            : "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="space-y-3">
          <p
            className={`font-bold text-lg ${
              isDarkMode ? "text-white" : "text-slate-800"
            }`}
          >
            {label}
          </p>
          <div
            className={`flex items-center gap-3 p-3 rounded-lg ${
              data.status === "High Stock"
                ? "bg-emerald-500/20"
                : data.status === "Medium Stock"
                ? "bg-amber-500/20"
                : data.status === "Low Stock"
                ? "bg-red-500/20"
                : "bg-gray-500/20"
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full ${
                data.status === "High Stock"
                  ? "bg-emerald-500"
                  : data.status === "Medium Stock"
                  ? "bg-amber-500"
                  : data.status === "Low Stock"
                  ? "bg-red-500"
                  : "bg-gray-500"
              }`}
            ></div>
            <span
              className={`font-semibold ${
                data.status === "High Stock"
                  ? "text-emerald-600"
                  : data.status === "Medium Stock"
                  ? "text-amber-600"
                  : data.status === "Low Stock"
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {data.status} ({data.stock} units)
            </span>
          </div>
          <div className="space-y-2">
            <p
              className={`font-medium ${
                isDarkMode ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Price:{" "}
              <span className="font-bold text-blue-500">Rs{data.price}</span>
            </p>
            <p
              className={`font-medium ${
                data.isExpiringSoon
                  ? "text-red-500"
                  : isDarkMode
                  ? "text-slate-300"
                  : "text-slate-700"
              }`}
            >
              Expiry:{" "}
              <span className="font-bold">
                {data.expiryDate.toLocaleDateString()}
              </span>
              {data.isExpiringSoon && (
                <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                  Soon
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Stock summary statistics
  const stockSummary = {
    total: medicines?.length || 0,
    high: medicines?.filter((m) => m?.stock > 15).length || 0,
    medium:
      medicines?.filter((m) => m?.stock > 5 && m?.stock <= 15).length || 0,
    low: medicines?.filter((m) => m?.stock <= 5 && m?.stock > 0).length || 0,
    out: medicines?.filter((m) => m?.stock === 0).length || 0,
    expiringSoon:
      medicines?.filter(
        (m) =>
          m?.expiryDate &&
          new Date(m.expiryDate) <=
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      ).length || 0,
  };

  if (isLoading) {
    return (
      <div className="w-full p-4">
        <div
          className={`flex justify-center items-center h-80 rounded-2xl ${
            isDarkMode ? "bg-slate-800/50" : "bg-white/50"
          }`}
          style={{ backdropFilter: "blur(10px)" }}
        >
          <div className="text-center space-y-4">
            <Spin size="large" />
            <Text
              className={`${
                isDarkMode ? "text-slate-300" : "text-slate-600"
              } text-lg`}
            >
              Loading stock data...
            </Text>
          </div>
        </div>
      </div>
    );
  }

  if (!medicines || medicines.length === 0) {
    return (
      <div className="w-full p-4">
        <Card
          className={`rounded-2xl border-0 shadow-xl ${
            isDarkMode ? "bg-slate-800/80" : "bg-white/80"
          }`}
          style={{ backdropFilter: "blur(10px)" }}
        >
          <div className="py-12">
            <Empty
              description={
                <Text
                  className={`${
                    isDarkMode ? "text-slate-300" : "text-slate-600"
                  } text-lg`}
                >
                  No medicine data available
                </Text>
              }
            />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <Card
        className={`rounded-3xl overflow-hidden border-0 shadow-2xl transition-all duration-500 hover:shadow-3xl
          ${isDarkMode ? "shadow-slate-900/50" : "shadow-slate-200/50"}`}
        style={{
          background: isDarkMode
            ? "linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(51, 65, 85, 0.8))"
            : "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.8))",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div className="space-y-2">
            <Title
              level={2}
              className={`m-0 font-bold bg-gradient-to-r ${
                isDarkMode
                  ? "from-blue-400 to-purple-400"
                  : "from-blue-600 to-purple-600"
              } bg-clip-text text-transparent`}
            >
              Stock Overview
            </Title>
            <Text
              className={`${
                isDarkMode ? "text-slate-300" : "text-slate-500"
              } text-base`}
            >
              Visual representation of your medicine inventory
            </Text>
          </div>

          {/* Enhanced Badge Section */}
          <div className="flex flex-wrap gap-4">
            {/* High Stock Badge */}
            <div
              className={`group relative flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer
              ${
                stockSummary.high > 0
                  ? "bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 border border-emerald-500/40 shadow-lg shadow-emerald-500/20"
                  : "bg-gray-500/10 border border-gray-500/20"
              }`}
              style={{ backdropFilter: "blur(10px)" }}
            >
              <div
                className={`relative w-4 h-4 rounded-full ${
                  stockSummary.high > 0 ? "bg-emerald-500" : "bg-gray-400"
                }`}
              >
                {stockSummary.high > 0 && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"></div>
                  </>
                )}
              </div>
              <div className="flex flex-col">
                <Text
                  className={`font-bold text-lg leading-none ${
                    stockSummary.high > 0 ? "text-emerald-600" : "text-gray-500"
                  }`}
                >
                  {stockSummary.high}
                </Text>
                <Text
                  className={`text-xs font-medium ${
                    stockSummary.high > 0 ? "text-emerald-700" : "text-gray-500"
                  }`}
                >
                  High Stock
                </Text>
              </div>
              {stockSummary.high > 0 && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-400 rounded-full transform translate-x-1 -translate-y-1"></div>
              )}
            </div>

            {/* Medium Stock Badge */}
            <div
              className={`group relative flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer
              ${
                stockSummary.medium > 0
                  ? "bg-gradient-to-r from-amber-500/20 to-amber-400/20 border border-amber-500/40 shadow-lg shadow-amber-500/20"
                  : "bg-gray-500/10 border border-gray-500/20"
              }`}
              style={{ backdropFilter: "blur(10px)" }}
            >
              <div
                className={`relative w-4 h-4 rounded-full ${
                  stockSummary.medium > 0 ? "bg-amber-500" : "bg-gray-400"
                }`}
              >
                {stockSummary.medium > 0 && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-amber-500 animate-ping opacity-75"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-amber-500"></div>
                  </>
                )}
              </div>
              <div className="flex flex-col">
                <Text
                  className={`font-bold text-lg leading-none ${
                    stockSummary.medium > 0 ? "text-amber-600" : "text-gray-500"
                  }`}
                >
                  {stockSummary.medium}
                </Text>
                <Text
                  className={`text-xs font-medium ${
                    stockSummary.medium > 0 ? "text-amber-700" : "text-gray-500"
                  }`}
                >
                  Medium Stock
                </Text>
              </div>
              {stockSummary.medium > 0 && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-amber-400 rounded-full transform translate-x-1 -translate-y-1"></div>
              )}
            </div>

            {/* Low Stock Badge */}
            <div
              className={`group relative flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer
              ${
                stockSummary.low > 0
                  ? "bg-gradient-to-r from-red-500/20 to-red-400/20 border border-red-500/40 shadow-lg shadow-red-500/20"
                  : "bg-gray-500/10 border border-gray-500/20"
              }`}
              style={{ backdropFilter: "blur(10px)" }}
            >
              <div
                className={`relative w-4 h-4 rounded-full ${
                  stockSummary.low > 0 ? "bg-red-500" : "bg-gray-400"
                }`}
              >
                {stockSummary.low > 0 && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 to-red-500"></div>
                  </>
                )}
              </div>
              <div className="flex flex-col">
                <Text
                  className={`font-bold text-lg leading-none ${
                    stockSummary.low > 0 ? "text-red-600" : "text-gray-500"
                  }`}
                >
                  {stockSummary.low}
                </Text>
                <Text
                  className={`text-xs font-medium ${
                    stockSummary.low > 0 ? "text-red-700" : "text-gray-500"
                  }`}
                >
                  Low Stock
                </Text>
              </div>
              {stockSummary.low > 0 && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-red-400 rounded-full transform translate-x-1 -translate-y-1 animate-pulse"></div>
              )}
            </div>

            {/* Out of Stock Badge */}
            <div
              className={`group relative flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer
              ${
                stockSummary.out > 0
                  ? "bg-gradient-to-r from-gray-500/20 to-gray-400/20 border border-gray-500/40 shadow-lg shadow-gray-500/20"
                  : "bg-gray-500/10 border border-gray-500/20"
              }`}
              style={{ backdropFilter: "blur(10px)" }}
            >
              <div
                className={`relative w-4 h-4 rounded-full ${
                  stockSummary.out > 0 ? "bg-gray-500" : "bg-gray-400"
                }`}
              >
                {stockSummary.out > 0 && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-gray-500 animate-ping opacity-75"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-400 to-gray-500"></div>
                  </>
                )}
              </div>
              <div className="flex flex-col">
                <Text
                  className={`font-bold text-lg leading-none ${
                    stockSummary.out > 0 ? "text-gray-600" : "text-gray-500"
                  }`}
                >
                  {stockSummary.out}
                </Text>
                <Text
                  className={`text-xs font-medium ${
                    stockSummary.out > 0 ? "text-gray-700" : "text-gray-500"
                  }`}
                >
                  Out of Stock
                </Text>
              </div>
              {stockSummary.out > 0 && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-gray-400 rounded-full transform translate-x-1 -translate-y-1"></div>
              )}
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div
          className={`h-96 w-full p-6 rounded-2xl ${
            isDarkMode ? "bg-slate-900/30" : "bg-white/30"
          }`}
          style={{ backdropFilter: "blur(10px)" }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stockData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
              layout="vertical"
            >
              <CartesianGrid
                strokeDasharray="5 5"
                stroke={isDarkMode ? "#475569" : "#cbd5e1"}
                strokeOpacity={0.3}
                horizontal={false}
              />
              <XAxis
                type="number"
                stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                tickLine={false}
                axisLine={false}
                fontSize={12}
                fontWeight={500}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={140}
                stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 13, fontWeight: 500 }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  fill: isDarkMode
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.02)",
                  radius: 12,
                }}
                wrapperStyle={{ zIndex: 1000 }}
              />
              <Bar
                dataKey="stock"
                name="Stock Level"
                shape={<CustomBarShape />}
                barSize={40}
                radius={[0, 8, 8, 0]}
              >
                {stockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} status={entry.status} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Enhanced Stock Insights */}
        <div
          className={`mt-8 p-8 rounded-2xl border transition-all duration-300
          ${
            isDarkMode
              ? "bg-slate-800/40 border-slate-700/50"
              : "bg-slate-50/40 border-slate-200/50"
          }`}
          style={{ backdropFilter: "blur(10px)" }}
        >
          <Title
            level={3}
            className={`mb-6 flex items-center gap-3 ${
              isDarkMode ? "text-slate-100" : "text-slate-800"
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
            Stock Insights
          </Title>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Critical Items Card */}
            <div
              className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
              ${
                isDarkMode
                  ? "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70"
                  : "bg-white/50 border-slate-200/50 hover:bg-white/70"
              }`}
              style={{ backdropFilter: "blur(10px)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <Text
                  className={`font-bold text-lg ${
                    isDarkMode ? "text-slate-200" : "text-slate-700"
                  }`}
                >
                  Critical Items
                </Text>
                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full border border-red-500/30">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <Text className="text-red-600 font-bold">
                    {stockSummary.low}
                  </Text>
                </div>
              </div>
              <div className="space-y-3 max-h-32 overflow-y-auto">
                {stockData
                  .filter((item) => item.status === "Low Stock")
                  .map((item) => (
                    <div
                      key={item.name}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isDarkMode ? "bg-slate-900/30" : "bg-slate-100/30"
                      }`}
                    >
                      <Text
                        className={`font-medium ${
                          isDarkMode ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        {item.name}
                      </Text>
                      <div className="flex items-center gap-2">
                        <Text className="text-red-500 font-bold">
                          {item.stock}
                        </Text>
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                {stockSummary.low === 0 && (
                  <div className="text-center py-4">
                    <Text
                      className={`${
                        isDarkMode ? "text-slate-400" : "text-slate-500"
                      } italic`}
                    >
                      No critical items
                    </Text>
                  </div>
                )}
              </div>
            </div>

            {/* Expiring Soon Card */}
            <div
              className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
              ${
                isDarkMode
                  ? "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70"
                  : "bg-white/50 border-slate-200/50 hover:bg-white/70"
              }`}
              style={{ backdropFilter: "blur(10px)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <Text
                  className={`font-bold text-lg ${
                    isDarkMode ? "text-slate-200" : "text-slate-700"
                  }`}
                >
                  Expiring Soon
                </Text>
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/20 rounded-full border border-amber-500/30">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <Text className="text-amber-600 font-bold">
                    {stockSummary.expiringSoon}
                  </Text>
                </div>
              </div>
              <div className="space-y-3 max-h-32 overflow-y-auto">
                {stockData
                  .filter((item) => item.isExpiringSoon)
                  .map((item) => (
                    <div
                      key={item.name}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isDarkMode ? "bg-slate-900/30" : "bg-slate-100/30"
                      }`}
                    >
                      <Text
                        className={`font-medium ${
                          isDarkMode ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        {item.name}
                      </Text>
                      <Text className="text-amber-500 font-bold text-sm">
                        {item.expiryDate.toLocaleDateString()}
                      </Text>
                    </div>
                  ))}
                {stockSummary.expiringSoon === 0 && (
                  <div className="text-center py-4">
                    <Text
                      className={`${
                        isDarkMode ? "text-slate-400" : "text-slate-500"
                      } italic`}
                    >
                      No expiring items
                    </Text>
                  </div>
                )}
              </div>
            </div>

            {/* Stock Status Card */}
            <div
              className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
              ${
                isDarkMode
                  ? "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70"
                  : "bg-white/50 border-slate-200/50 hover:bg-white/70"
              }`}
              style={{ backdropFilter: "blur(10px)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <Text
                  className={`font-bold text-lg ${
                    isDarkMode ? "text-slate-200" : "text-slate-700"
                  }`}
                >
                  Stock Status
                </Text>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <Text className="text-emerald-600 font-bold">
                    {stockSummary.total
                      ? Math.round(
                          (stockSummary.high / stockSummary.total) * 100
                        )
                      : 0}
                    %
                  </Text>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Text
                      className={`font-medium ${
                        isDarkMode ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      High Stock
                    </Text>
                    <Text className="text-emerald-500 font-bold">
                      {stockSummary.high}
                    </Text>
                  </div>
                  <div
                    className={`flex-1 rounded-full h-3 overflow-hidden ${
                      isDarkMode ? "bg-slate-700" : "bg-slate-200"
                    }`}
                  >
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${
                          (stockSummary.high / (stockSummary.total || 1)) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Text
                      className={`font-medium ${
                        isDarkMode ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      Out of Stock
                    </Text>
                    <Text className="text-gray-500 font-bold">
                      {stockSummary.out}
                    </Text>
                  </div>
                  <div
                    className={`flex-1 rounded-full h-3 overflow-hidden ${
                      isDarkMode ? "bg-slate-700" : "bg-slate-200"
                    }`}
                  >
                    <div
                      className="bg-gradient-to-r from-gray-500 to-gray-400 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${
                          (stockSummary.out / (stockSummary.total || 1)) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// export default ChartBar;

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

  // NEW: Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // NEW: Filter and search logic
  const filteredAndSortedMembers = useMemo(() => {
    let filtered = localMembers.filter((member) => {
      const matchesSearch =
        member.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.id?.toString().includes(searchTerm);

      // const matchesRole = filterRole === "all" || member.roles?.toLowerCase().includes(filterRole.toLowerCase());
      const matchesRole =
        filterRole === "all" ||
        member.roles
          ?.toString()
          ?.toLowerCase()
          ?.includes(filterRole.toLowerCase()) ||
        false;

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && member.status !== "inactive") ||
        (filterStatus === "inactive" && member.status === "inactive");

      return matchesSearch && matchesRole && matchesStatus;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.fullName?.toLowerCase() || "";
          bValue = b.fullName?.toLowerCase() || "";
          break;
        case "email":
          aValue = a.email?.toLowerCase() || "";
          bValue = b.email?.toLowerCase() || "";
          break;
        case "role":
          aValue = Array.isArray(a.roles)
            ? a.roles.join(", ").toLowerCase()
            : "";
          bValue = Array.isArray(b.roles)
            ? b.roles.join(", ").toLowerCase()
            : "";
          break;
        case "date":
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
        default:
          aValue = a.fullName?.toLowerCase() || "";
          bValue = b.fullName?.toLowerCase() || "";
      }

      if (sortBy === "date") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [localMembers, searchTerm, filterRole, filterStatus, sortBy, sortOrder]);

  // NEW: Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilterRole("all");
    setFilterStatus("all");
    setSortBy("name");
    setSortOrder("asc");
  };

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
    // setDeletingUserId(userToDelete.id);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete?.id) {
      console.error("No user selected for deletion");
      toast.error("No user selected for deletion");
      return;
    }

    try {
      console.log("Attempting to delete user ID:", userToDelete.id);
      setIsDeleteModalOpen(false);

      // Using authService with admin flag
      await authService.deleteUser(userToDelete.id, true);

      console.log("Delete successful");

      // Close modal and reset selection
      // setIsDeleteModalOpen(false);
      setUserToDelete(null);

      // Update UI - choose ONE of these approaches:

      // OPTION 1: Optimistic update (faster UI response)
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userToDelete.id)
      );

      // Background refresh
      try {
        const response = await authService.getAllUsers();
        setUsers(response.data); // Update with fresh data
      } catch (refreshError) {
        console.warn("Background refresh failed:", refreshError);
      }

      // Reset states
      setUserToDelete(null);
      // setDeletingUserId(null);

      // OPTION 2: Full refresh (more reliable)
      // await fetchUsers();

      // Show success message
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.message || "Failed to delete user");
      // Re-fetch original state
      const response = await authService.getAllUsers();
      setUsers(response.data);
    } finally {
      setUserToDelete(null);
      // setDeletingUserId(null);
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
    <div className="space-y-8  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 ">
      {/* Enhanced Header Section */}
      <div className="flex justify-between items-start  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="space-y-2">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
            Medicare Members
          </h3>
          <p className="text-gray-600 text-base leading-relaxed">
            Manage and view all Medicare beneficiaries (
            {filteredAndSortedMembers?.length || 0} of {members?.length || 0}{" "}
            total)
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onRefreshMembers}
            className="group relative px-5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl transition-all duration-300 flex items-center space-x-2 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            disabled={loading}
          >
            <Activity
              className={`w-4 h-4 transition-transform duration-500 ${
                loading ? "animate-spin" : "group-hover:rotate-180"
              }`}
            />
            <span className="font-medium">Refresh</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white rounded-xl hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center space-x-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <Plus className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
            <span className="font-semibold relative z-10">Add Member</span>
          </button>
        </div>
      </div>

      {/* NEW: Beautiful Search and Filter Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="p-6 bg-gradient-to-r from-blue-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1 relative group  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              </div>
              <input
                type="text"
                placeholder="Search members by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors duration-200"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-4 items-center  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
              {/* Role Filter */}
              <div className="relative">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-700 font-medium shadow-sm hover:shadow-md cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="member">Member</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-700 font-medium shadow-sm hover:shadow-md cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-2  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
                <div className="relative ">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-700 font-medium shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="email">Sort by Email</option>
                    <option value="role">Sort by Role</option>
                    <option value="date">Sort by Date</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                  title={`Sort ${
                    sortOrder === "asc" ? "Descending" : "Ascending"
                  }`}
                >
                  {sortOrder === "asc" ? (
                    <ArrowUp className="h-4 w-4 text-gray-600" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              </div>

              {/* Clear Filters */}
              {(searchTerm ||
                filterRole !== "all" ||
                filterStatus !== "all" ||
                sortBy !== "name" ||
                sortOrder !== "asc") && (
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-300 font-medium shadow-sm hover:shadow-md"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || filterRole !== "all" || filterStatus !== "all") && (
            <div className="mt-4 flex flex-wrap gap-2  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
              <span className="text-sm text-gray-600 font-medium">
                Active filters:
              </span>
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filterRole !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Role: {filterRole}
                  <button
                    onClick={() => setFilterRole("all")}
                    className="ml-2 hover:bg-purple-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filterStatus !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Status: {filterStatus}
                  <button
                    onClick={() => setFilterStatus("all")}
                    className="ml-2 hover:bg-green-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
            {/* Sticky Enhanced Header */}
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-gray-50 via-blue-50/30 to-gray-50 backdrop-blur-sm border-b border-gray-200">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-800 tracking-wide">
                  Member
                </th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-800 tracking-wide">
                  Email
                </th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-800 tracking-wide">
                  Roles
                </th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-800 tracking-wide">
                  Status
                </th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-800 tracking-wide">
                  Created At
                </th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-800 tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
              {loading ? (
                // Enhanced Loading Skeleton with shimmer effect
                [...Array(3)].map((_, i) => (
                  <tr
                    key={i}
                    className="animate-pulse bg-white even:bg-gray-50/50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
                        </div>
                        <div className="space-y-3">
                          <div className="relative h-4 bg-gray-200 rounded-lg w-36 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
                          </div>
                          <div className="relative h-3 bg-gray-200 rounded-lg w-28 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="relative h-4 bg-gray-200 rounded-lg w-44 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="relative h-7 bg-gray-200 rounded-full w-20 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="relative h-6 bg-gray-200 rounded-full w-16 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="relative h-4 bg-gray-200 rounded-lg w-28 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex space-x-2">
                        {[...Array(3)].map((_, j) => (
                          <div
                            key={j}
                            className="relative w-9 h-9 bg-gray-200 rounded-lg overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredAndSortedMembers.length === 0 ? (
                // Enhanced Empty State
                <tr className=" from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
                  <td colSpan="6" className="px-6 py-16">
                    <div className="flex flex-col items-center space-y-6 text-center">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center animate-pulse">
                          {searchTerm ||
                          filterRole !== "all" ||
                          filterStatus !== "all" ? (
                            <SearchX className="w-10 h-10 text-blue-500" />
                          ) : (
                            <Users className="w-10 h-10 text-blue-500 animate-bounce" />
                          )}
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-xl font-semibold text-gray-800">
                          {searchTerm ||
                          filterRole !== "all" ||
                          filterStatus !== "all"
                            ? "No members match your filters"
                            : "No members found"}
                        </h4>
                        <p className="text-gray-500 max-w-md">
                          {searchTerm ||
                          filterRole !== "all" ||
                          filterStatus !== "all"
                            ? "Try adjusting your search terms or filters to find what you're looking for"
                            : "Get started by adding your first Medicare member to begin managing beneficiaries"}
                        </p>
                      </div>
                      {searchTerm ||
                      filterRole !== "all" ||
                      filterStatus !== "all" ? (
                        <button
                          onClick={clearFilters}
                          className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold"
                        >
                          Clear All Filters
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsAddModalOpen(true)}
                          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold"
                        >
                          Add Your First Member
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                // Enhanced Data Rows with alternating colors
                filteredAndSortedMembers.map((member, index) => (
                  <tr
                    key={member.id}
                    className={`group  hover:bg-gradient-to-r hover:from-blue-50/70 hover:via-blue-50/40 hover:to-transparent hover:shadow-sm  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    <td className="px-6 py-5 ">
                      <div className="flex items-center space-x-4 ">
                        <div className="relative ">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                            {getInitials(member.fullName)}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="space-y-1">
                          <div className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors duration-200">
                            {member.fullName}
                          </div>
                          <div className="text-sm text-gray-500 font-mono">
                            ID: {member.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-200">
                        {member.email}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-200">
                        {member.roles}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="inline-flex px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 shadow-sm">
                          Active
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-gray-700 font-medium">
                        {formatDate(member.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex space-x-2 opacity-70 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0">
                        <div className="relative group/tooltip">
                          <ActionButton
                            onClick={() => handleViewUser(member)}
                            icon={Eye}
                            variant="secondary"
                            className="hover:bg-blue-100 hover:text-blue-700 hover:scale-110 transition-all duration-200"
                          />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                            View Details
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>

                        <div className="relative group/tooltip">
                          <ActionButton
                            onClick={() => handleEditUser(member)}
                            icon={Edit}
                            variant="primary"
                            className="hover:bg-green-100 hover:text-green-700 hover:scale-110 transition-all duration-200"
                          />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                            Edit Member
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>

                        <div className="relative group/tooltip">
                          <ActionButton
                            onClick={() => handleDeleteClick(member)}
                            icon={Trash2}
                            variant="danger"
                            className="hover:bg-red-100 hover:text-red-700 hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg"
                          />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                            Remove Member
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals - unchanged functionality */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <UserEditModal
        user={selectedUser}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onUpdate={(updatedUser) => {
          console.log("Saving user data:", updatedUser);
          handleUpdateUser(updatedUser);
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
      />

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

      {/* Enhanced Collapsible Debug Section */}
      <div className="mt-8 ">
        <details className="group ">
          <summary className="cursor-pointer flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-amber-800">
                Debug Information
              </span>
            </div>
            <div className="transform group-open:rotate-180 transition-transform duration-200">
              <svg
                className="w-5 h-5 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </summary>

          <div className="mt-3 p-5 bg-white border border-amber-200 rounded-xl shadow-sm  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
            <h4 className="font-bold text-gray-800 text-lg mb-4">
              System Status
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 ">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-700 mb-1">
                  Loading State
                </div>
                <div
                  className={`font-mono ${
                    loading ? "text-orange-600" : "text-green-600"
                  }`}
                >
                  {loading?.toString() ?? "undefined"}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-700 mb-1 ">
                  Total Members
                </div>
                <div className="font-mono text-blue-600 text-lg font-bold">
                  {members?.length || 0}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-700 mb-1">
                  Filtered Members
                </div>
                <div className="font-mono text-purple-600 text-lg font-bold">
                  {filteredAndSortedMembers?.length || 0}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-700 mb-1">
                  Search Term
                </div>
                <div
                  className={`font-mono ${
                    searchTerm ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {searchTerm || "None"}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-700 mb-1">
                  Active Filters
                </div>
                <div className="font-mono text-purple-600">
                  {[
                    filterRole !== "all" ? `Role: ${filterRole}` : null,
                    filterStatus !== "all" ? `Status: ${filterStatus}` : null,
                    sortBy !== "name" ? `Sort: ${sortBy}` : null,
                  ].filter(Boolean).length || "None"}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-700 mb-1">
                  Data Status
                </div>
                <div
                  className={`font-mono ${
                    members.length > 0 ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {members.length > 0 ? "Loaded" : "Empty"}
                </div>
              </div>
            </div>
          </div>
        </details>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};




const statusIcons = {
  PLACED: "📝",
  APPROVED: "✅",
  SHIPPED: "🚚",
  DELIVERED: "📦",
  CANCELLED: "❌",
  PENDING: "⏳",
};

// Define the order status flow
const Status = {
  PLACED: "PLACED",
  APPROVED: "APPROVED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  PENDING: "PENDING",
};

const statusColors = {
  PLACED: "bg-blue-100/70 text-blue-800 border border-blue-200/50 backdrop-blur-md shadow-lg shadow-blue-500/10",
  APPROVED: "bg-emerald-100/70 text-emerald-800 border border-emerald-200/50 backdrop-blur-md shadow-lg shadow-emerald-500/10",
  SHIPPED: "bg-purple-100/70 text-purple-800 border border-purple-200/50 backdrop-blur-md shadow-lg shadow-purple-500/10", 
  DELIVERED: "bg-gray-100/70 text-gray-800 border border-gray-200/50 backdrop-blur-md shadow-lg shadow-gray-500/10",
  CANCELLED: "bg-red-100/70 text-red-800 border border-red-200/50 backdrop-blur-md shadow-lg shadow-red-500/10",
  PENDING: "bg-amber-100/70 text-amber-800 border border-amber-200/50 backdrop-blur-md shadow-lg shadow-amber-500/10",
};

const OrdersPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("No authentication token found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:8080/api/orders/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        }
      });

      // Debug the response
      console.log("Orders API Response:", response.data);

      // Ensure we have an array and transform data if needed
      const ordersData = Array.isArray(response.data) ? response.data : [];

      // Transform data to match frontend expectations
      const transformedOrders = ordersData.map((order) => ({
        id: order.id,
        totalPrice: order.totalPrice,
        status: order.status,
        orderDate: order.createdAt, // Use the actual field name from API
        userName: order.userName,
        items: order.items || [],
      }));

      setOrders(transformedOrders);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else {
        setError("Failed to fetch orders");
      }
      setLoading(false);
      console.error("Error fetching orders:", err);
    }
  };

  // Count orders by status
  const orderCounts = Object.values(Status).reduce((counts, status) => {
    const ordersArray = Array.isArray(orders) ? orders : [];
    counts[status] = ordersArray.filter(
      (order) => order.status === status
    ).length;
    return counts;
  }, {});

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("No authentication token found. Please login again.");
        return;
      }

      await axios.put(
        `http://localhost:8080/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      );

      // Update local state
      setOrders((prevOrders) =>
        Array.isArray(prevOrders)
          ? prevOrders.map((order) =>
              order.id === orderId ? { ...order, status: newStatus } : order
            )
          : []
      );

      setShowModal(false);
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status");
    }
  };

  // Open status update modal
  const openStatusModal = (order, newStatus) => {
    setSelectedOrder(order);
    setStatusUpdate(newStatus);
    setShowModal(true);
  };

  // Refresh orders
  const refreshOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("No authentication token found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:8080/api/orders/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        }
      });
      
      setOrders(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (err) {
      setError("Failed to refresh orders");
      setLoading(false);
      console.error("Error refreshing orders:", err);
    }
  };

  // Get available status transitions for an order
  const getAvailableStatusTransitions = (currentStatus) => {
    const allStatuses = Object.values(Status);
    
    // Admin can transition to any status except the current one
    return allStatuses.filter(status => status !== currentStatus);
  };

  // Filter orders based on active filter
  const filteredOrders = Array.isArray(orders) 
    ? activeFilter === "ALL" 
      ? orders 
      : orders.filter(order => order.status === activeFilter)
    : [];

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <div className="text-lg text-gray-600 dark:text-gray-300">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-96 space-y-4">
        <div className="text-xl text-red-600 dark:text-red-400">{error}</div>
        <button
          onClick={refreshOrders}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
        >
          <ArrowPathIcon className="w-5 h-5" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ClipboardDocumentListIcon className="w-8 h-8 text-blue-600" />
            PharmaFlow Orders
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage and process customer medication orders
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-300 flex items-center space-x-2 shadow-sm hover:shadow-md">
            <ChartBarIcon className="w-5 h-5" />
            <span>Reports</span>
          </button>
          <button className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-green-500/25">
            <ArrowTrendingUpIcon className="w-5 h-5" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {Object.entries(orderCounts).map(([status, count]) => (
          <div
            key={status}
            className="p-4 group cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100/50 dark:border-gray-700/50 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 uppercase tracking-wider">
                  {status}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                  {count}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
                <span className="text-white text-xl">
                  {statusIcons[status]}
                </span>
              </div>
            </div>
            <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out transform origin-left"
                style={{
                  width: `${
                    orders.length > 0
                      ? (count / orders.length) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders List */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-gray-100/50 dark:border-gray-700/50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            All Orders
            <span className="text-sm font-normal bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2.5 py-0.5 rounded-full">
              {filteredOrders.length}
            </span>
          </h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter("ALL")}
              className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                activeFilter === "ALL"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 border border-blue-200 dark:border-blue-700"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
              }`}
            >
              All Orders
            </button>
            {Object.keys(Status).map((status) => (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                  activeFilter === status
                    ? `${statusColors[status]} border`
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                }`}
              >
                {status}
              </button>
            ))}
            <button
              onClick={refreshOrders}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium flex items-center space-x-1 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 transition-colors"
            >
              <span>Refresh</span>
              <ArrowPathIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400 flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <ClipboardDocumentListIcon className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-lg font-medium">No orders found</p>
            <p className="text-sm mt-1">
              {activeFilter !== "ALL" ? `No orders with status "${activeFilter}"` : "No orders available"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-gradient-to-r from-white to-blue-50/50 dark:from-gray-800 dark:to-gray-700/50 rounded-xl hover:shadow-md group cursor-pointer transition-all duration-300 border border-gray-100/50 dark:border-gray-700/50 hover:-translate-y-0.5"
              >
                <div className="flex items-start space-x-4 mb-4 md:mb-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-medium shadow-md group-hover:shadow-lg transition-shadow duration-200 flex-shrink-0">
                    {order.userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {order.userName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Order #{order.id} •{" "}
                      {new Date(order.orderDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {order.items && order.items.length} item(s) • Total: $
                      {order.totalPrice}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto gap-4">
                  <div className="text-left md:text-right">
                    <div className="font-bold text-gray-900 dark:text-white text-lg">
                      ${order.totalPrice}
                    </div>
                    <div
                      className={`text-xs px-3 py-1.5 rounded-full inline-block mt-1 ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {/* Show all available status transitions */}
                    {getAvailableStatusTransitions(order.status).map((status) => (
                      <button
                        key={status}
                        onClick={() => openStatusModal(order, status)}
                        className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                          status === Status.CANCELLED 
                            ? "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50" 
                            : status === Status.DELIVERED
                            ? "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            : status === Status.SHIPPED
                            ? "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50"
                            : status === Status.APPROVED
                            ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
                            : "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                        }`}
                      >
                        {status === Status.CANCELLED ? "Cancel" : 
                         status === Status.DELIVERED ? "Mark Delivered" :
                         status === Status.SHIPPED ? "Ship" :
                         status === Status.APPROVED ? "Approve" :
                         status === Status.PLACED ? "Revert to Placed" :
                         status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Update Order Status</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Change order <span className="font-medium">#{selectedOrder.id}</span> from{" "}
              <span className={`font-semibold ${statusColors[selectedOrder.status].split(' ')[1]}`}>
                {selectedOrder.status}
              </span> to{" "}
              <span className={`font-semibold ${statusColors[statusUpdate]?.split(' ')[1] || 'text-gray-900 dark:text-white'}`}>
                {statusUpdate}
              </span>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  updateOrderStatus(selectedOrder.id, statusUpdate)
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};




// export default OrdersPanel;
const MedicineProductsPanel = () => {
  // At the top of your component
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      console.log("Loaded user:", user); // Debug log
      setCurrentUser(user);
    } else {
      console.error("No user data found in localStorage");
    }
  }, []);

  const [medicines, setMedicines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    expiryDate: "",
    imageUrl: "",
    status: "ADDED",
  });

  const [notification, setNotification] = useState({
    show: false,
    type: "", // 'success' or 'error'
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  // const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        const data = await getMedicines();
        setMedicines(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value) error = "Name is required";
        else if (value.length < 2) error = "Name must be at least 2 characters";
        break;
      case "description":
        if (!value) error = "Description is required";
        break;
      case "price":
        if (!value) error = "Price is required";
        else if (isNaN(value)) error = "Price must be a number";
        else if (Number(value) <= 0) error = "Price must be positive";
        break;
      case "stock":
        if (!value && value !== 0) error = "Stock is required";
        else if (isNaN(value)) error = "Stock must be a number";
        else if (Number(value) < 0) error = "Stock must be 0 or more";
        break;
      case "expiryDate":
        if (!value) error = "Expiry date is required";
        else if (new Date(value) < new Date())
          error = "Expiry date must be in the future";
        break;
      case "imageUrl":
        if (value && !/^https?:\/\/.+\..+/.test(value))
          error = "Please enter a valid URL";
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form status before submit:", formData.status); // Add this

    // Validate form data
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (
        key !== "id" &&
        key !== "createdAt" && // Removed createdBy from exclusion list
        key !== "imageUrl"
      ) {
        const error = validateField(key, value);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setIsLoading(true);

        // Prepare the data to send (simplified without createdBy)
        const medicineData = {
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          // Removed the createdBy logic completely
        };

        if (editingId) {
          // Update existing medicine
          const updatedMedicine = await updateMedicine(
            editingId,
            medicineData,
            imageFile
          );
          setMedicines((prev) =>
            prev.map((med) => (med.id === editingId ? updatedMedicine : med))
          );
        } else {
          // Add new medicine
          const newMedicine = await addMedicine(medicineData, imageFile);
          setMedicines((prev) => [...prev, newMedicine]);
        }

        // Reset form
        setShowForm(false);
        setEditingId(null);
        setFormData({
          name: "",
          description: "",
          price: "",
          stock: "",
          expiryDate: "",
          imageUrl: "",
          status: "ADDED",
        });
        setImageFile(null);

        // Show success message
        setNotification({
          show: true,
          type: "success",
          message: `Medicine ${editingId ? "updated" : "added"} successfully!`,
        });
      } catch (error) {
        console.error("Error saving medicine:", error);
        setNotification({
          show: true,
          type: "error",
          message:
            error.response?.data?.message ||
            error.message ||
            `Failed to ${editingId ? "update" : "add"} medicine`,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (medicine) => {
    const validStatuses = [
      "ADDED",
      "AVAILABLE",
      "OUT_OF_STOCK",
      "EXPIRED",
      "DISCONTINUED",
    ];
    const status = validStatuses.includes(medicine.status?.toUpperCase())
      ? medicine.status.toUpperCase()
      : "ADDED";
    setFormData({
      name: medicine.name,
      description: medicine.description,
      price: medicine.price,
      stock: medicine.stock,
      expiryDate: medicine.expiryDate,
      imageUrl: medicine.imageUrl || "",
      // status: medicine.status,
      status: status,
    });
    setEditingId(medicine.id);
    setShowForm(true);
  };

  const handleDelete = async  (id) => {
    try {
      setIsLoading(true);
      await deleteMedicine(id);
      setMedicines((prev) => prev.filter((med) => med.id !== id));
      setShowDeleteModal(false);
      setSelectedMedicine(null);
    } catch (error) {
      console.error("Error deleting medicine:", error);
      // You might want to show an error notification here
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (medicine) => {
    setSelectedMedicine(medicine);
    setShowDetailModal(true);
  };

  const getStockStatus = (stock) => {
    if (stock === 0)
      return { color: "text-red-500", bg: "bg-red-50", icon: AlertTriangle };
    if (stock <= 10)
      return { color: "text-yellow-500", bg: "bg-yellow-50", icon: Clock };
    return { color: "text-green-500", bg: "bg-green-50", icon: CheckCircle };
  };

  const getExpiryStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysDiff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysDiff <= 0)
      return { color: "text-red-500", bg: "bg-red-50", text: "Expired" };
    if (daysDiff <= 30)
      return {
        color: "text-orange-500",
        bg: "bg-orange-50",
        text: "Expiring Soon",
      };
    if (daysDiff <= 90)
      return { color: "text-yellow-500", bg: "bg-yellow-50", text: "Monitor" };
    return { color: "text-green-500", bg: "bg-green-50", text: "Good" };
  };

  // Loading state
  if (isLoading && medicines.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Medicine Products
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your pharmaceutical inventory with ease
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center space-x-3"
            disabled={isLoading}
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-semibold">Add Medicine</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Medicines</p>
                <p className="text-3xl font-bold text-gray-900">
                  {medicines.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">In Stock</p>
                <p className="text-3xl font-bold text-gray-900">
                  {medicines.filter((m) => m.stock > 0).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Low Stock</p>
                <p className="text-3xl font-bold text-gray-900">
                  {medicines.filter((m) => m.stock <= 10 && m.stock > 0).length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Medicine Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {editingId ? "Edit Medicine" : "Add New Medicine"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData({
                        name: "",
                        description: "",
                        price: "",
                        stock: "",
                        expiryDate: "",
                        imageUrl: "",
                        status: "ADDED",
                      });
                      setImageFile(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    disabled={isLoading}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medicine Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter medicine name"
                      disabled={isLoading}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.description
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      rows={3}
                      placeholder="Enter medicine description"
                      disabled={isLoading}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (Rs) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.price ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="0.00"
                      disabled={isLoading}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.price}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.stock ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="0"
                      disabled={isLoading}
                    />
                    {errors.stock && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.stock}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date *
                    </label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.expiryDate ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={isLoading}
                    />
                    {errors.expiryDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.expiryDate}
                      </p>
                    )}
                  </div>
                  // Notification component (add this to your render/return)
                  {notification.show && (
                    <div
                      className={`notification ${notification.type}`}
                      style={{
                        position: "fixed",
                        top: "20px",
                        right: "20px",
                        padding: "15px",
                        borderRadius: "4px",
                        zIndex: 1000,
                        backgroundColor:
                          notification.type === "success"
                            ? "#dff0d8"
                            : "#f2dede",
                        color:
                          notification.type === "success"
                            ? "#3c763d"
                            : "#a94442",
                        border: `1px solid ${
                          notification.type === "success"
                            ? "#d6e9c6"
                            : "#ebccd1"
                        }`,
                      }}
                    >
                      {notification.message}
                      <button
                        onClick={() =>
                          setNotification({ ...notification, show: false })
                        }
                        style={{
                          marginLeft: "15px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      disabled={isLoading}
                    >
                      {/* <option value="PLACED">PLACED</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="RETURNED">RETURNED</option> */}
                      <option value="ADDED">ADDED</option>
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="OUT_OF_STOCK">OUT OF STOCK</option>
                      <option value="EXPIRED">EXPIRED</option>
                      <option value="DISCONTINUED">DISCONTINUED</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      disabled={isLoading}
                    />
                    {imageFile && (
                      <p className="text-sm text-gray-500 mt-2">
                        {imageFile.name}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL (alternative)
                    </label>
                    <input
                      type="text"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.imageUrl ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="https://example.com/image.jpg"
                      disabled={isLoading}
                    />
                    {errors.imageUrl && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.imageUrl}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData({
                        name: "",
                        description: "",
                        price: "",
                        stock: "",
                        expiryDate: "",
                        imageUrl: "",
                        status: "ADDED",
                      });
                      setImageFile(null);
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {editingId ? "Updating..." : "Saving..."}
                      </>
                    ) : editingId ? (
                      "Update Medicine"
                    ) : (
                      "Save Medicine"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Medicine Detail Modal */}
        {showDetailModal && selectedMedicine && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Medicine Details
                  </h3>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <img
                  src={selectedMedicine.imageUrl} // S3 URL
                  alt={selectedMedicine.name}
                  onError={(e) => {
                    e.target.src = "/placeholder.jpg"; // Fallback to local
                    e.target.onerror = null; // Prevent infinite loop
                  }}
                />

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {selectedMedicine.name}
                    </h4>
                    <p className="text-gray-600">
                      {selectedMedicine.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="text-lg font-bold text-gray-900">
                        Rs{selectedMedicine.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600">Stock</p>
                      <p className="text-lg font-bold text-gray-900">
                        {selectedMedicine.stock}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600">Expiry Date</p>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(
                        selectedMedicine.expiryDate
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600">Status</p>
                    <span
                      className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                        selectedMedicine.status === "PLACED"
                          ? "bg-green-100 text-green-800"
                          : selectedMedicine.status === "CANCELLED"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedMedicine.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedMedicine && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6 text-center">
                <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Delete Medicine
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete "{selectedMedicine.name}"?
                  This action cannot be undone.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMedicine.id)}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medicine Products Grid */}
        {isLoading && medicines.length > 0 ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {medicines.map((medicine) => {
              const stockStatus = getStockStatus(medicine.stock);
              const expiryStatus = getExpiryStatus(medicine.expiryDate);
              const StockIcon = stockStatus.icon;

              return (
                <div
                  key={medicine.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden transform hover:scale-105"
                >
                  {/* Medicine Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
                    {medicine.imageUrl ? (
                      <img
                        src={medicine.imageUrl}
                        alt={medicine.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-16 h-16 text-gray-400" />
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          medicine.status === "PLACED"
                            ? "bg-green-100 text-green-800"
                            : medicine.status === "CANCELLED"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {medicine.status}
                      </span>
                    </div>
                  </div>

                  {/* Medicine Info */}
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {medicine.name}
                    </h4>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                      {medicine.description}
                    </p>

                    {/* Stats */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          {/* <p className="w-4 h-4 text-green-600">Rs</p> */}
                          <span className="text-sm text-gray-600">Price</span>
                        </div>
                        <span className="font-bold text-green-600">
                          Rs{medicine.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <StockIcon
                            className={`w-4 h-4 Rs{stockStatus.color}`}
                          />
                          <span className="text-sm text-gray-600">Stock</span>
                        </div>
                        <span className={`font-bold Rs{stockStatus.color}`}>
                          {medicine.stock}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-600">Expiry</span>
                        </div>
                        <span
                          className={`text-sm font-medium px-2 py-1 rounded-full ${expiryStatus.bg} ${expiryStatus.color}`}
                        >
                          {expiryStatus.text}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => handleView(medicine)}
                        className="p-3 text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 hover:scale-110"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(medicine)}
                        className="p-3 text-green-600 hover:bg-green-50 rounded-full transition-all duration-200 hover:scale-110"
                        title="Edit Medicine"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMedicine(medicine);
                          setShowDeleteModal(true);
                        }}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-110"
                        title="Delete Medicine"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && medicines.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No medicines found
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by adding your first medicine to the inventory.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Add Your First Medicine
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

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

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
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
          className="p-6 group cursor-pointer overflow-hidden relative  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
          ></div>
          <div className="relative z-10  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
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

            <div className="space-y-4 ">
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
  const { isDarkMode } = useTheme();

  // const { user, logout } = useAuth();
  const { user, logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  // Fetch medicines data
  useEffect(() => {
    const fetchMedicines = async () => {
      setIsLoading(true);
      try {
        const data = await getMedicines();
        setMedicines(data);
        console.log("Fetched medicines:", data); // Debug log
      } catch (error) {
        console.error("Error fetching medicines:", error);
        // Optional: show error to user
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === "chart") {
      fetchMedicines();
    }
  }, [activeTab]);

  const navigation = [
    { id: "dashboard", name: "Overview", icon: Activity },
    { id: "users", name: "Members", icon: Users },
    { id: "orders", name: "Claims", icon: ShoppingCart },
    { id: "products", name: "Plans", icon: Package },
    { id: "AddMed", name: "addMedicines", icon: Pill },
    { id: "chart", name: "ChartBar", icon: BarChart },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg    dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
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
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
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
              <div className="relative group"></div>
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
        <main className="p-6  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
          {activeTab === "dashboard" && (
            <div className="space-y-8  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
              <div className="flex items-center justify-between ">
                <div className="space-y-2 ">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
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
                      className={`p-6 bg-gradient-to-br ${metric.bg} border-0 group cursor-pointer overflow-hidden relative  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                      ></div>
                      <div className="relative z-10  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
                        <div className="flex items-start justify-between ">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-600">
                              {metric.label}
                            </p>
                            <p className="text-3xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300">
                              {metric.value}
                            </p>
                            <p
                              className={`text-sm font-semibold flex items-center space-x-1 from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 ${
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
                <AnimatedCard className="p-6  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      Recent Claims
                    </h3>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1 hover:underline transition-all duration-200 hover:scale-105">
                      <span>View All</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
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
                        className="flex items-center justify-between p-4 bg-gradient-to-r rounded-xl hover:from-blue-50 hover:shadow-md transition-all duration-300 group cursor-pointer  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 "
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-medium shadow-md group-hover:shadow-lg transition-shadow duration-200">
                            {claim.member
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 ">
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
                              className={`text-xs px-2 py-1 rounded-full  ${
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

                <AnimatedCard className="p-6  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 ">
                    Plan Enrollment Trends
                  </h3>
                  <div className="space-y-6  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
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
                      <div
                        key={i}
                        className="space-y-3 group  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300"
                      >
                        <div className="flex justify-between items-center  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
                          <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                            {plan.plan}
                          </span>
                          <span className="text-sm text-gray-500 font-medium">
                            {plan.members.toLocaleString()} members
                          </span>
                        </div>
                        <div className="relative  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
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
          {activeTab === "AddMed" && <MedicineProductsPanel />}
          {/* {activeTab === "chart" && <ChartBar/>} */}
          {activeTab === "chart" && (
            <ErrorBoundary
              fallback={
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h3 className="text-red-800 font-medium">Chart Error</h3>
                  <p className="text-red-700">Could not display the chart</p>
                </div>
              }
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <ChartBar medicines={medicines} />
              )}
            </ErrorBoundary>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
export { MedicineProductsPanel }; // Named export
export { OrdersPanel };
export {ChartBar}