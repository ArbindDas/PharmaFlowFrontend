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
// Add this with your other icon imports
import { Upload } from 'lucide-react';
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

import { Sun, Moon } from "lucide-react";

import DarkModeToggle from "../components/DarkModeToggle";

import { Sparkles, Star, Filter, Check } from "lucide-react";
import { color, motion } from "framer-motion";

import {
  User,
  UserPlus,
  FileText,
  BarChart3,
  TrendingDown,
  HelpCircle,
} from "lucide-react";

import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XCircleIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";

import {
  ChartBarIcon,
  ArrowPathIcon,
  ArrowTrendingUpIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

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
    <div className="space-y-8 from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Enhanced Header Section */}
      <div className="flex justify-between items-start from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="space-y-2">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent dark:from-blue-400 dark:via-blue-500 dark:to-blue-600">
            Medicare Members
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
            Manage and view all Medicare beneficiaries (
            {filteredAndSortedMembers?.length || 0} of {members?.length || 0}{" "}
            total)
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onRefreshMembers}
            className="group relative px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-300 flex items-center space-x-2 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-gray-900/50 dark:to-gray-800/50">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1 relative group from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors duration-200" />
              </div>
              <input
                type="text"
                placeholder="Search members by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm hover:shadow-md focus:shadow-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 dark:hover:bg-gray-600 rounded-r-xl transition-colors duration-200"
                >
                  <X className="h-4 w-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
                </button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-4 items-center from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
              {/* Role Filter */}
              <div className="relative">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-700 dark:text-gray-300 font-medium shadow-sm hover:shadow-md cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="member">Member</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-700 dark:text-gray-300 font-medium shadow-sm hover:shadow-md cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-2 from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-700 dark:text-gray-300 font-medium shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="email">Sort by Email</option>
                    <option value="role">Sort by Role</option>
                    <option value="date">Sort by Date</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>

                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                  title={`Sort ${
                    sortOrder === "asc" ? "Descending" : "Ascending"
                  }`}
                >
                  {sortOrder === "asc" ? (
                    <ArrowUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
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
                  className="flex items-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-300 font-medium shadow-sm hover:shadow-md"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || filterRole !== "all" || filterStatus !== "all") && (
            <div className="mt-4 flex flex-wrap gap-2 from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Active filters:
              </span>
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-2 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filterRole !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                  Role: {filterRole}
                  <button
                    onClick={() => setFilterRole("all")}
                    className="ml-2 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filterStatus !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                  Status: {filterStatus}
                  <button
                    onClick={() => setFilterStatus("all")}
                    className="ml-2 hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5"
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
            {/* Sticky Enhanced Header */}
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-800 dark:via-gray-700/30 dark:to-gray-800 backdrop-blur-sm border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wide">
                  Member
                </th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wide">
                  Email
                </th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wide">
                  Roles
                </th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wide">
                  Status
                </th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wide">
                  Created At
                </th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
              {loading ? (
                // Enhanced Loading Skeleton with shimmer effect
                [...Array(3)].map((_, i) => (
                  <tr
                    key={i}
                    className="animate-pulse bg-white dark:bg-gray-800 even:bg-gray-50/50 dark:even:bg-gray-700/50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 dark:via-gray-500/60 to-transparent animate-shimmer"></div>
                        </div>
                        <div className="space-y-3">
                          <div className="relative h-4 bg-gray-200 dark:bg-gray-600 rounded-lg w-36 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 dark:via-gray-500/60 to-transparent animate-shimmer"></div>
                          </div>
                          <div className="relative h-3 bg-gray-200 dark:bg-gray-600 rounded-lg w-28 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 dark:via-gray-500/60 to-transparent animate-shimmer"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="relative h-4 bg-gray-200 dark:bg-gray-600 rounded-lg w-44 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 dark:via-gray-500/60 to-transparent animate-shimmer"></div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="relative h-7 bg-gray-200 dark:bg-gray-600 rounded-full w-20 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 dark:via-gray-500/60 to-transparent animate-shimmer"></div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="relative h-6 bg-gray-200 dark:bg-gray-600 rounded-full w-16 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 dark:via-gray-500/60 to-transparent animate-shimmer"></div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="relative h-4 bg-gray-200 dark:bg-gray-600 rounded-lg w-28 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 dark:via-gray-500/60 to-transparent animate-shimmer"></div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex space-x-2">
                        {[...Array(3)].map((_, j) => (
                          <div
                            key={j}
                            className="relative w-9 h-9 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 dark:via-gray-500/60 to-transparent animate-shimmer"></div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredAndSortedMembers.length === 0 ? (
                // Enhanced Empty State
                <tr className="from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
                  <td colSpan="6" className="px-6 py-16">
                    <div className="flex flex-col items-center space-y-6 text-center">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full flex items-center justify-center animate-pulse">
                          {searchTerm ||
                          filterRole !== "all" ||
                          filterStatus !== "all" ? (
                            <SearchX className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                          ) : (
                            <Users className="w-10 h-10 text-blue-500 dark:text-blue-400 animate-bounce" />
                          )}
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
                          {searchTerm ||
                          filterRole !== "all" ||
                          filterStatus !== "all"
                            ? "No members match your filters"
                            : "No members found"}
                        </h4>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md">
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
                    className={`group hover:bg-gradient-to-r hover:from-blue-50/70 hover:via-blue-50/40 hover:to-transparent hover:shadow-sm dark:hover:from-blue-900/20 dark:hover:via-blue-900/10 dark:hover:to-transparent from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 ${
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : "bg-gray-50/30 dark:bg-gray-700/30"
                    }`}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                            {getInitials(member.fullName)}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                        </div>
                        <div className="space-y-1">
                          <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors duration-200">
                            {member.fullName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                            ID: {member.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                        {member.email}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-700">
                        {member.roles}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="inline-flex px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700 shadow-sm">
                          Active
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
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
                            className="hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 hover:scale-110 transition-all duration-200"
                          />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                            View Details
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                          </div>
                        </div>

                        <div className="relative group/tooltip">
                          <ActionButton
                            onClick={() => handleEditUser(member)}
                            icon={Edit}
                            variant="primary"
                            className="hover:bg-green-100 dark:hover:bg-green-900 hover:text-green-700 dark:hover:text-green-300 hover:scale-110 transition-all duration-200"
                          />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                            Edit Member
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                          </div>
                        </div>

                        <div className="relative group/tooltip">
                          <ActionButton
                            onClick={() => handleDeleteClick(member)}
                            icon={Trash2}
                            variant="danger"
                            className="hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-700 dark:hover:text-red-300 hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg"
                          />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                            Remove Member
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
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
        <p className="text-gray-700 dark:text-gray-300">
          Are you sure you want to delete {userToDelete?.name}?
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This action cannot be undone.
        </p>
      </ConfirmationModal>

      {/* Enhanced Collapsible Debug Section */}
      <div className="mt-8">
        <details className="group">
          <summary className="cursor-pointer flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/30 from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-amber-800 dark:text-amber-400">
                Debug Information
              </span>
            </div>
            <div className="transform group-open:rotate-180 transition-transform duration-200">
              <svg
                className="w-5 h-5 text-amber-600 dark:text-amber-500"
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

          <div className="mt-3 p-5 bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700 rounded-xl shadow-sm from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
            <h4 className="font-bold text-gray-800 dark:text-white text-lg mb-4">
              System Status
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Loading State
                </div>
                <div
                  className={`font-mono ${
                    loading
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {loading?.toString() ?? "undefined"}
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Total Members
                </div>
                <div className="font-mono text-blue-600 dark:text-blue-400 text-lg font-bold">
                  {members?.length || 0}
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Filtered Members
                </div>
                <div className="font-mono text-purple-600 dark:text-purple-400 text-lg font-bold">
                  {filteredAndSortedMembers?.length || 0}
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Search Term
                </div>
                <div
                  className={`font-mono ${
                    searchTerm
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {searchTerm || "None"}
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Active Filters
                </div>
                <div className="font-mono text-purple-600 dark:text-purple-400">
                  {[
                    filterRole !== "all" ? `Role: ${filterRole}` : null,
                    filterStatus !== "all" ? `Status: ${filterStatus}` : null,
                    sortBy !== "name" ? `Sort: ${sortBy}` : null,
                  ].filter(Boolean).length || "None"}
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Data Status
                </div>
                <div
                  className={`font-mono ${
                    members.length > 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-500 dark:text-gray-400"
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

const Status = {
  PLACED: "PLACED",
  APPROVED: "APPROVED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  PENDING: "PENDING",
};

const statusColors = {
  PLACED:
    "bg-blue-100/70 text-blue-800 border border-blue-200/50 backdrop-blur-md shadow-lg shadow-blue-500/10",
  APPROVED:
    "bg-emerald-100/70 text-emerald-800 border border-emerald-200/50 backdrop-blur-md shadow-lg shadow-emerald-500/10",
  SHIPPED:
    "bg-purple-100/70 text-purple-800 border border-purple-200/50 backdrop-blur-md shadow-lg shadow-purple-500/10",
  DELIVERED:
    "bg-gray-100/70 text-gray-800 border border-gray-200/50 backdrop-blur-md shadow-lg shadow-gray-500/10",
  CANCELLED:
    "bg-red-100/70 text-red-800 border border-red-200/50 backdrop-blur-md shadow-lg shadow-red-500/10",
  PENDING:
    "bg-amber-100/70 text-amber-800 border border-amber-200/50 backdrop-blur-md shadow-lg shadow-amber-500/10",
};

const OrdersPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  // NEW UI STATE (doesn't affect logic)
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:8080/api/orders/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const ordersData = Array.isArray(data) ? data : [];
      const transformedOrders = ordersData.map((order) => ({
        id: order.id,
        totalPrice: order.totalPrice,
        status: order.status,
        orderDate: order.createdAt,
        userName: order.userName,
        items: order.items || [],
      }));

      setOrders(transformedOrders);
      setLoading(false);
    } catch (err) {
      if (err.message.includes("401")) {
        setError("Session expired. Please login again.");
      } else {
        setError("Failed to fetch orders");
      }
      setLoading(false);
      console.error("Error fetching orders:", err);
    }
  };

  const orderCounts = Object.values(Status).reduce((counts, status) => {
    const ordersArray = Array.isArray(orders) ? orders : [];
    counts[status] = ordersArray.filter(
      (order) => order.status === status
    ).length;
    return counts;
  }, {});

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("No authentication token found. Please login again.");
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

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

  const openStatusModal = (order, newStatus) => {
    setSelectedOrder(order);
    setStatusUpdate(newStatus);
    setShowModal(true);
  };

  const refreshOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:8080/api/orders/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      setError("Failed to refresh orders");
      setLoading(false);
      console.error("Error refreshing orders:", err);
    }
  };

  const getAvailableStatusTransitions = (currentStatus) => {
    const allStatuses = Object.values(Status);
    return allStatuses.filter((status) => status !== currentStatus);
  };

  // ENHANCED FILTERING & SEARCH (UI only)
  let filteredOrders = Array.isArray(orders)
    ? activeFilter === "ALL"
      ? orders
      : orders.filter((order) => order.status === activeFilter)
    : [];

  // Search filter
  if (searchQuery) {
    filteredOrders = filteredOrders.filter(
      (order) =>
        order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toString().includes(searchQuery)
    );
  }

  // Date range filter
  if (dateRange.start && dateRange.end) {
    filteredOrders = filteredOrders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      return (
        orderDate >= new Date(dateRange.start) &&
        orderDate <= new Date(dateRange.end)
      );
    });
  }

  // Sorting
  filteredOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.orderDate) - new Date(a.orderDate);
      case "oldest":
        return new Date(a.orderDate) - new Date(b.orderDate);
      case "amount-high":
        return b.totalPrice - a.totalPrice;
      case "amount-low":
        return a.totalPrice - b.totalPrice;
      default:
        return 0;
    }
  });

  // Skeleton Loader
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-20 bg-white/50 dark:bg-gray-800/50 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-white/50 dark:bg-gray-800/50 rounded-xl animate-pulse"
              />
            ))}
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-200/50 dark:bg-gray-700/50 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
            <XCircleIcon className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Error Loading Orders
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={refreshOrders}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center space-x-2 mx-auto shadow-lg hover:shadow-xl"
          >
            <ArrowPathIcon className="w-5 h-5" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <ClipboardDocumentListIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  PharmaFlow Orders
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Manage and track all medication orders
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:shadow-md transition-all duration-300 flex items-center space-x-2">
                <ChartBarIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Reports</span>
              </button>
              <button className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 flex items-center space-x-2">
                <ArrowTrendingUpIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(orderCounts).map(([status, count]) => (
            <div
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`group cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border p-5 hover:-translate-y-1 ${
                activeFilter === status
                  ? "border-blue-500 ring-2 ring-blue-500/20"
                  : "border-white/20 dark:border-gray-700/50"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-3xl">{statusIcons[status]}</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {count}
                </div>
              </div>
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                {status}
              </div>
              <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000"
                  style={{
                    width: `${
                      orders.length > 0 ? (count / orders.length) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <ArrowsUpDownIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-12 pr-10 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer text-gray-900 dark:text-white min-w-[180px]"
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">Amount: High to Low</option>
                <option value="amount-low">Amount: Low to High</option>
              </select>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-5 py-3 rounded-xl transition-all flex items-center space-x-2 ${
                showFilters
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300"
                  : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
              }`}
            >
              <FunnelIcon className="w-5 h-5" />
              <span>Filters</span>
            </button>

            <button
              onClick={refreshOrders}
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <ArrowPathIcon className="w-5 h-5" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Status Filter Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setActiveFilter("ALL")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === "ALL"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              All Orders ({orders.length})
            </button>
            {Object.keys(Status).map((status) => (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === status
                    ? statusColors[status]
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {status} ({orderCounts[status]})
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table/Cards */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Orders List
              </h2>
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
                {filteredOrders.length} Results
              </span>
            </div>
          </div>

          <div className="p-6">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardDocumentListIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Orders Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery
                    ? "Try adjusting your search criteria"
                    : activeFilter !== "ALL"
                    ? `No orders with status "${activeFilter}"`
                    : "No orders available"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="group bg-gradient-to-r from-white to-blue-50/30 dark:from-gray-800 dark:to-gray-700/50 rounded-xl p-5 hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:-translate-y-0.5"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                          {order.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {order.userName}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <span className="font-mono">#{order.id}</span>
                            <span>•</span>
                            <span>
                              {new Date(order.orderDate).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span>{order.items?.length || 0} items</span>
                          </div>
                        </div>
                      </div>

                      {/* Price & Status */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            ${order.totalPrice}
                          </div>
                          <div
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                              statusColors[order.status]
                            }`}
                          >
                            {statusIcons[order.status]} {order.status}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          {getAvailableStatusTransitions(order.status)
                            .slice(0, 3)
                            .map((status) => (
                              <button
                                key={status}
                                onClick={() => openStatusModal(order, status)}
                                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all hover:shadow-md ${
                                  status === Status.CANCELLED
                                    ? "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300"
                                    : status === Status.DELIVERED
                                    ? "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                                    : status === Status.SHIPPED
                                    ? "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300"
                                    : "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300"
                                }`}
                              >
                                {status === Status.CANCELLED
                                  ? "Cancel"
                                  : status === Status.DELIVERED
                                  ? "Deliver"
                                  : status === Status.SHIPPED
                                  ? "Ship"
                                  : status}
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <h3 className="text-2xl font-bold">Update Order Status</h3>
              <p className="text-blue-100 mt-1">Order #{selectedOrder.id}</p>
            </div>
            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Change status from{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {selectedOrder.status}
                </span>{" "}
                to{" "}
                <span className="font-bold text-green-600 dark:text-green-400">
                  {statusUpdate}
                </span>
                ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    updateOrderStatus(selectedOrder.id, statusUpdate)
                  }
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// const MedicineProductsPanel = () => {
//   // At the top of your component
//   const [currentUser, setCurrentUser] = useState(null);

//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (userData) {
//       const user = JSON.parse(userData);
//       console.log("Loaded user:", user); // Debug log
//       setCurrentUser(user);
//     } else {
//       console.error("No user data found in localStorage");
//     }
//   }, []);

//   useEffect(() => {
//     console.log("✅ MedicineProductsPanel MOUNTED");

//     return () => {
//       console.log("❌ MedicineProductsPanel UNMOUNTING");
//     };
//   }, []);

//   const [medicines, setMedicines] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [selectedMedicine, setSelectedMedicine] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     stock: "",
//     expiryDate: "",
//     imageUrl: "",
//     medicineStatus: "ADDED",
//   });

//   const [notification, setNotification] = useState({
//     show: false,
//     type: "", // 'success' or 'error'
//     message: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [editingId, setEditingId] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [imageFile, setImageFile] = useState(null);

//   const [error, setError] = useState(null);

//   // Add this function after your state declarations
//   const resetForm = () => {
//     setFormData({
//       name: "",
//       description: "",
//       price: "",
//       stock: "",
//       expiryDate: "",
//       imageUrl: "",
//       medicineStatus: "ADDED",
//     });
//     setImageFile(null);
//     setEditingId(null);
//     setErrors({});
//   };

//   useEffect(() => {
//     const fetchMedicines = async () => {
//       try {
//         setIsLoading(true); // Use setIsLoading instead of setLoading
//         const data = await getMedicines();
//         setMedicines(data);
//       } catch (err) {
//         console.error("Error fetching medicines:", err);
//         setNotification({
//           show: true,
//           type: "error",
//           message: "Failed to fetch medicines. Please try again.",
//         });
//       } finally {
//         setIsLoading(false); // Use setIsLoading
//       }
//     };

//     fetchMedicines();
//   }, []);

//   const validateField = (name, value) => {
//     let error = "";

//     switch (name) {
//       case "name":
//         if (!value) error = "Name is required";
//         else if (value.length < 2) error = "Name must be at least 2 characters";
//         break;
//       case "description":
//         if (!value) error = "Description is required";
//         break;
//       case "price":
//         if (!value) error = "Price is required";
//         else if (isNaN(value)) error = "Price must be a number";
//         else if (Number(value) <= 0) error = "Price must be positive";
//         break;
//       case "stock":
//         if (!value && value !== 0) error = "Stock is required";
//         else if (isNaN(value)) error = "Stock must be a number";
//         else if (Number(value) < 0) error = "Stock must be 0 or more";
//         break;
//       case "expiryDate":
//         if (!value) error = "Expiry date is required";
//         else if (new Date(value) < new Date())
//           error = "Expiry date must be in the future";
//         break;
//       case "imageUrl":
//         if (value && !/^https?:\/\/.+\..+/.test(value))
//           error = "Please enter a valid URL";
//         break;
//     }

//     return error;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const error = validateField(name, value);
//     setErrors((prev) => ({ ...prev, [name]: error }));

//     setFormData((prev) => ({
//       ...prev,
//       [name]:
//         name === "price" || name === "stock"
//           ? value === ""
//             ? ""
//             : Number(value)
//           : value,
//     }));
//   };

//   const handleImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setImageFile(e.target.files[0]);
//     }
//   };


//   const handleSubmit = async (e) => {
//     console.log("=== FORM SUBMIT START ===");

//     // Check first, then prevent
//     if (e.defaultPrevented) {
//       console.log("⚠️ Event was already prevented by something else");
//       console.trace("Who prevented it?");
//       return;
//     }

//     e.preventDefault();
//     e.stopPropagation();

//     console.log("✅ Event prevented successfully");
//     console.log("Form status before submit:", formData.medicineStatus);
//     console.log("Form data:", JSON.stringify(formData, null, 2));
//     console.log("Editing ID:", editingId);
//     console.log("Has image file:", !!imageFile);
//     console.log("Is loading?", isLoading);

//     // Validate form data
//     const newErrors = {};
//     Object.entries(formData).forEach(([key, value]) => {
//       if (
//         key !== "id" &&
//         key !== "createdAt" &&
//         key !== "imageUrl" &&
//         key !== "medicineStatus"
//       ) {
//         const error = validateField(key, value);
//         if (error) newErrors[key] = error;
//       }
//     });

//     console.log("Validation errors:", newErrors);
//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//       console.log("✅ Validation passed");

//       try {
//         setIsLoading(true);
//         console.log("🔄 Setting loading to true");

//         // Ensure medicineStatus is included and uppercase
//         const medicineData = {
//           name: formData.name,
//           description: formData.description,
//           price: parseFloat(formData.price),
//           stock: parseInt(formData.stock),
//           expiryDate: formData.expiryDate,
//           medicineStatus: (formData.medicineStatus || "ADDED").toUpperCase(),
//         };

//         console.log("📤 Sending to API:", medicineData);

 

//         console.log(editingId ? "✏️ UPDATE MODE" : "➕ ADD MODE");

//         if (editingId) {
//           console.log("✏️ Updating medicine with ID:", editingId);
//           const updatedMedicine = await updateMedicine(
//             editingId,
//             medicineData,
//             imageFile
//           );
//           console.log("✅ Update response:", updatedMedicine);
//           setMedicines((prev) =>
//             prev.map((med) => (med.id === editingId ? updatedMedicine : med))
//           );
//         } else {
//           console.log("➕ Adding new medicine");
//           console.log("Medicine data for ADD:", medicineData);

//           try {
//             const newMedicine = await addMedicine(medicineData, imageFile);
//             console.log("✅ Add response:", newMedicine);
        
//             setTimeout(() => {
//               console.log("🔄 Now updating medicines state");
//               setMedicines((prev) => [...prev, newMedicine]);
//             }, 1000);
//           } catch (error) {
//             console.error("❌ ADD Error:", error);
//             console.error("Error response:", error.response?.data);
//             throw error;
//           }
//         }

//         // Reset everything
//         console.log("🔄 Resetting form");
//         resetForm();
//         setShowForm(false);

//         // Show success message
//         setNotification({
//           show: true,
//           type: "success",
//           message: `Medicine ${editingId ? "updated" : "added"} successfully!`,
//         });

//         // Auto-hide notification after 3 seconds
//         setTimeout(() => {
//           setNotification((prev) => ({ ...prev, show: false }));
//         }, 3000);

//         console.log("✅ Form submitted successfully!");
//       } catch (error) {
//         console.error("❌ Error saving medicine:", error);
//         console.error("Error details:", {
//           message: error.message,
//           response: error.response?.data,
//           status: error.response?.status,
//           headers: error.response?.headers,
//         });

//         setNotification({
//           show: true,
//           type: "error",
//           message:
//             error.response?.data?.message ||
//             error.message ||
//             `Failed to ${editingId ? "update" : "add"} medicine`,
//         });
//       } finally {
//         setIsLoading(false);
//         console.log("🔄 Setting loading to false");
//       }
//     } else {
//       console.log("❌ Validation failed with errors:", newErrors);
//     }

//     console.log("=== FORM SUBMIT END ===");
//   };
//   const handleEdit = (medicine) => {
//     const validStatuses = [
//       "ADDED",
//       "AVAILABLE",
//       "OUT_OF_STOCK",
//       "EXPIRED",
//       "DISCONTINUED",
//     ];
//     // Check both possible status fields
//     const statusValue = medicine.medicineStatus || medicine.status;
//     const status = validStatuses.includes(statusValue?.toUpperCase())
//       ? statusValue.toUpperCase()
//       : "ADDED";

//     setFormData({
//       name: medicine.name,
//       description: medicine.description,
//       price: medicine.price,
//       stock: medicine.stock,
//       expiryDate: medicine.expiryDate,
//       imageUrl: medicine.imageUrl || "",
//       medicineStatus: status,
//     });

//     setEditingId(medicine.id);
//     setShowForm(true);
//   };

//   const handleDelete = async (id) => {
//     try {
//       setIsLoading(true);
//       await deleteMedicine(id);
//       setMedicines((prev) => prev.filter((med) => med.id !== id));
//       setShowDeleteModal(false);
//       setSelectedMedicine(null);
//     } catch (error) {
//       console.error("Error deleting medicine:", error);
//       // You might want to show an error notification here
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleView = (medicine) => {
//     setSelectedMedicine(medicine);
//     setShowDetailModal(true);
//   };

//   const getStockStatus = (stock) => {
//     if (stock === 0)
//       return { color: "text-red-500", bg: "bg-red-50", icon: AlertTriangle };
//     if (stock <= 10)
//       return { color: "text-yellow-500", bg: "bg-yellow-50", icon: Clock };
//     return { color: "text-green-500", bg: "bg-green-50", icon: CheckCircle };
//   };

//   const getExpiryStatus = (expiryDate) => {
//     const today = new Date();
//     const expiry = new Date(expiryDate);
//     const daysDiff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

//     if (daysDiff <= 0)
//       return { color: "text-red-500", bg: "bg-red-50", text: "Expired" };
//     if (daysDiff <= 30)
//       return {
//         color: "text-orange-500",
//         bg: "bg-orange-50",
//         text: "Expiring Soon",
//       };
//     if (daysDiff <= 90)
//       return { color: "text-yellow-500", bg: "bg-yellow-50", text: "Monitor" };
//     return { color: "text-green-500", bg: "bg-green-50", text: "Good" };
//   };

//   // Loading state
//   if (isLoading && medicines.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <div className="space-y-2">
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
//               Medicine Products
//             </h1>
//             <p className="text-gray-600 dark:text-gray-400 text-lg">
//               Manage your pharmaceutical inventory with ease
//             </p>
//           </div>
//           <button
//             onClick={() => setShowForm(true)}
//             className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center space-x-3"
//             disabled={isLoading}
//           >
//             <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
//             <span className="font-semibold">Add Medicine</span>
//           </button>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">
//                   Total Medicines
//                 </p>
//                 <p className="text-3xl font-bold text-gray-900 dark:text-white">
//                   {medicines.length}
//                 </p>
//               </div>
//               <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
//                 <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-600">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">
//                   In Stock
//                 </p>
//                 <p className="text-3xl font-bold text-gray-900 dark:text-white">
//                   {/* //{medicines.filter((m) => m.stock > 0).length} */}
//                 </p>
//               </div>
//               <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
//                 <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-600">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">
//                   Low Stock
//                 </p>
//                 <p className="text-3xl font-bold text-gray-900 dark:text-white">
//                   {medicines.filter((m) => m.stock <= 10 && m.stock > 0).length}
//                 </p>
//               </div>
//               <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
//                 <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Add/Edit Medicine Form Modal */}
//         {showForm && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//                 <div className="flex justify-between items-center">
//                   <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//                     {editingId ? "Edit Medicine" : "Add New Medicine"}
//                   </h3>
//                   <button
//                     onClick={() => {
//                       setShowForm(false);
//                       setEditingId(null);
//                       setFormData({
//                         name: "",
//                         description: "",
//                         price: "",
//                         stock: "",
//                         expiryDate: "",
//                         imageUrl: "",
//                         medicineStatus: "ADDED",
//                       });
//                       setImageFile(null);
//                     }}
//                     className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
//                     disabled={isLoading}
//                   >
//                     <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
//                   </button>
//                 </div>
//               </div>

//               {/* Notification component */}
//               {notification.show && (
//                 <div
//                   className={`notification ${notification.type}`}
//                   style={{
//                     position: "fixed",
//                     top: "20px",
//                     right: "20px",
//                     padding: "15px",
//                     borderRadius: "4px",
//                     zIndex: 1000,
//                     backgroundColor:
//                       notification.type === "success" ? "#dff0d8" : "#f2dede",
//                     color:
//                       notification.type === "success" ? "#3c763d" : "#a94442",
//                     border: `1px solid ${
//                       notification.type === "success" ? "#d6e9c6" : "#ebccd1"
//                     }`,
//                   }}
//                 >
//                   {notification.message}
//                   <button
//                     onClick={() =>
//                       setNotification({ ...notification, show: false })
//                     }
//                     style={{
//                       marginLeft: "15px",
//                       background: "none",
//                       border: "none",
//                       cursor: "pointer",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     ×
//                   </button>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="p-6 space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Medicine Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
//                         errors.name
//                           ? "border-red-500"
//                           : "border-gray-300 dark:border-gray-600"
//                       }`}
//                       placeholder="Enter medicine name"
//                       disabled={isLoading}
//                     />
//                     {errors.name && (
//                       <p className="text-red-500 text-sm mt-1">{errors.name}</p>
//                     )}
//                   </div>
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Description *
//                     </label>
//                     <textarea
//                       name="description"
//                       value={formData.description}
//                       onChange={handleChange}
//                       className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
//                         errors.description
//                           ? "border-red-500"
//                           : "border-gray-300 dark:border-gray-600"
//                       }`}
//                       rows={3}
//                       placeholder="Enter medicine description"
//                       disabled={isLoading}
//                     />
//                     {errors.description && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.description}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Price (Rs) *
//                     </label>
//                     <input
//                       type="number"
//                       name="price"
//                       value={formData.price}
//                       onChange={handleChange}
//                       step="0.01"
//                       min="0"
//                       className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
//                         errors.price
//                           ? "border-red-500"
//                           : "border-gray-300 dark:border-gray-600"
//                       }`}
//                       placeholder="0.00"
//                       disabled={isLoading}
//                     />
//                     {errors.price && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.price}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Stock Quantity *
//                     </label>
//                     <input
//                       type="number"
//                       name="stock"
//                       value={formData.stock}
//                       onChange={handleChange}
//                       min="0"
//                       className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
//                         errors.stock
//                           ? "border-red-500"
//                           : "border-gray-300 dark:border-gray-600"
//                       }`}
//                       placeholder="0"
//                       disabled={isLoading}
//                     />
//                     {errors.stock && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.stock}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Expiry Date *
//                     </label>
//                     <input
//                       type="date"
//                       name="expiryDate"
//                       value={formData.expiryDate}
//                       onChange={handleChange}
//                       className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
//                         errors.expiryDate
//                           ? "border-red-500"
//                           : "border-gray-300 dark:border-gray-600"
//                       }`}
//                       disabled={isLoading}
//                     />
//                     {errors.expiryDate && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.expiryDate}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Status
//                     </label>
//                     <select
//                       // name="status"
//                       name="medicineStatus"
//                       // value={formData.status}
//                       value={formData.medicineStatus}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
//                       disabled={isLoading}
//                     >
//                       <option value="ADDED">ADDED</option>
//                       <option value="AVAILABLE">AVAILABLE</option>
//                       <option value="OUT_OF_STOCK">OUT OF STOCK</option>
//                       <option value="EXPIRED">EXPIRED</option>
//                       <option value="DISCONTINUED">DISCONTINUED</option>
//                     </select>
//                   </div>
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Image
//                     </label>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                       className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
//                       disabled={isLoading}
//                     />
//                     {imageFile && (
//                       <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
//                         {imageFile.name}
//                       </p>
//                     )}
//                   </div>
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Image URL (alternative)
//                     </label>
//                     <input
//                       type="text"
//                       name="imageUrl"
//                       value={formData.imageUrl}
//                       onChange={handleChange}
//                       className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
//                         errors.imageUrl
//                           ? "border-red-500"
//                           : "border-gray-300 dark:border-gray-600"
//                       }`}
//                       placeholder="https://example.com/image.jpg"
//                       disabled={isLoading}
//                     />
//                     {errors.imageUrl && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.imageUrl}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">


//                   <button
//                     // type="button"
//                      type="submit"
//                     onClick={() => {
//                       setShowForm(false);
//                       resetForm();
//                     }}
//                     className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
//                     disabled={isLoading}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center"
//                     disabled={isLoading}
//                   >
//                     {isLoading ? (
//                       <>
//                         <svg
//                           className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                         >
//                           <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                           ></circle>
//                           <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                           ></path>
//                         </svg>
//                         {editingId ? "Updating..." : "Saving..."}
//                       </>
//                     ) : editingId ? (
//                       "Update Medicine"
//                     ) : (
//                       "Save Medicine"
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Medicine Detail Modal */}
//         {showDetailModal && selectedMedicine && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full">
//               <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//                 <div className="flex justify-between items-center">
//                   <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//                     Medicine Details
//                   </h3>
//                   <button
//                     onClick={() => setShowDetailModal(false)}
//                     className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
//                   >
//                     <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6">
//                 <img
//                   src={selectedMedicine.imageUrl} // S3 URL
//                   alt={selectedMedicine.name}
//                   onError={(e) => {
//                     e.target.src = "/placeholder.jpg"; // Fallback to local
//                     e.target.onerror = null; // Prevent infinite loop
//                   }}
//                 />

//                 <div className="space-y-4">
//                   <div>
//                     <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
//                       {selectedMedicine.name}
//                     </h4>
//                     <p className="text-gray-600 dark:text-gray-400">
//                       {selectedMedicine.description}
//                     </p>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
//                       <p className="text-sm text-gray-600 dark:text-gray-400">
//                         Price
//                       </p>
//                       <p className="text-lg font-bold text-gray-900 dark:text-white">
//                         Rs{selectedMedicine.price.toFixed(2)}
//                       </p>
//                     </div>
//                     <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
//                       <p className="text-sm text-gray-600 dark:text-gray-400">
//                         Stock
//                       </p>
//                       <p className="text-lg font-bold text-gray-900 dark:text-white">
//                         {selectedMedicine.stock}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
//                     <p className="text-sm text-gray-600 dark:text-gray-400">
//                       Expiry Date
//                     </p>
//                     <p className="text-lg font-bold text-gray-900 dark:text-white">
//                       {new Date(
//                         selectedMedicine.expiryDate
//                       ).toLocaleDateString()}
//                     </p>
//                   </div>

//                   <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
//                     <p className="text-sm text-gray-600 dark:text-gray-400">
//                       Status
//                     </p>
//                     <span
//                       className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
//                         selectedMedicine.status === "PLACED"
//                           ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
//                           : selectedMedicine.status === "CANCELLED"
//                           ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
//                           : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
//                       }`}
//                     >
//                       {selectedMedicine.status}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Delete Confirmation Modal */}
//         {showDeleteModal && selectedMedicine && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
//               <div className="p-6 text-center">
//                 <div className="bg-red-100 dark:bg-red-900 p-4 rounded-full w-fit mx-auto mb-4">
//                   <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
//                   Delete Medicine
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-400 mb-6">
//                   Are you sure you want to delete "{selectedMedicine.name}"?
//                   This action cannot be undone.
//                 </p>
//                 <div className="flex justify-center space-x-4">
//                   <button
//                     onClick={() => setShowDeleteModal(false)}
//                     className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
//                     disabled={isLoading}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={() => handleDelete(selectedMedicine.id)}
//                     className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all flex items-center justify-center"
//                     disabled={isLoading}
//                   >
//                     {isLoading ? (
//                       <>
//                         <svg
//                           className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                         >
//                           <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                           ></circle>
//                           <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                           ></path>
//                         </svg>
//                         Deleting...
//                       </>
//                     ) : (
//                       "Delete"
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Medicine Products Grid */}
//         {isLoading && medicines.length > 0 ? (
//           <div className="flex justify-center py-20">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {medicines.map((medicine) => {
//               const stockStatus = getStockStatus(medicine.stock);
//               const expiryStatus = getExpiryStatus(medicine.expiryDate);
//               const StockIcon = stockStatus.icon;

//               return (
//                 <div
//                   key={medicine.id}
//                   className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 overflow-hidden transform hover:scale-105"
//                 >
//                   {/* Medicine Image */}
//                   <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 overflow-hidden">
//                     {medicine.imageUrl ? (
//                       <img
//                         src={medicine.imageUrl}
//                         alt={medicine.name}
//                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center">
//                         <Package className="w-16 h-16 text-gray-400 dark:text-gray-500" />
//                       </div>
//                     )}

//                     {/* Status Badge */}
//                     <div className="absolute top-4 right-4">
//                       <span
//                         className={`px-3 py-1 text-xs font-medium rounded-full ${
//                           medicine.status === "PLACED"
//                             ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
//                             : medicine.status === "CANCELLED"
//                             ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
//                             : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
//                         }`}
//                       >
//                         {medicine.status}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Medicine Info */}
//                   <div className="p-6">
//                     <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
//                       {medicine.name}
//                     </h4>
//                     <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-2">
//                       {medicine.description}
//                     </p>

//                     {/* Stats */}
//                     <div className="space-y-3 mb-6">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-2">
//                           <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
//                           <span className="text-sm text-gray-600 dark:text-gray-400">
//                             Price
//                           </span>
//                         </div>
//                         <span className="font-bold text-green-600 dark:text-green-400">
//                           Rs{medicine.price.toFixed(2)}
//                         </span>
//                       </div>

//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-2">
//                           <StockIcon
//                             className={`w-4 h-4 ${stockStatus.color}`}
//                           />
//                           <span className="text-sm text-gray-600 dark:text-gray-400">
//                             Stock
//                           </span>
//                         </div>
//                         <span className={`font-bold ${stockStatus.color}`}>
//                           {medicine.stock}
//                         </span>
//                       </div>

//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-2">
//                           <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//                           <span className="text-sm text-gray-600 dark:text-gray-400">
//                             Expiry
//                           </span>
//                         </div>
//                         <span
//                           className={`text-sm font-medium px-2 py-1 rounded-full ${expiryStatus.bg} ${expiryStatus.color}`}
//                         >
//                           {expiryStatus.text}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex justify-between items-center">
//                       <button
//                         onClick={() => handleView(medicine)}
//                         className="p-3 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-full transition-all duration-200 hover:scale-110"
//                         title="View Details"
//                       >
//                         <Eye className="w-5 h-5" />
//                       </button>
//                       <button
//                         onClick={() => handleEdit(medicine)}
//                         className="p-3 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/50 rounded-full transition-all duration-200 hover:scale-110"
//                         title="Edit Medicine"
//                       >
//                         <Edit className="w-5 h-5" />
//                       </button>
//                       <button
//                         onClick={() => {
//                           setSelectedMedicine(medicine);
//                           setShowDeleteModal(true);
//                         }}
//                         className="p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-full transition-all duration-200 hover:scale-110"
//                         title="Delete Medicine"
//                       >
//                         <Trash2 className="w-5 h-5" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Empty State */}
//         {!isLoading && medicines.length === 0 && (
//           <div className="text-center py-20">
//             <Package className="w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
//             <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//               No medicines found
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400 mb-6">
//               Get started by adding your first medicine to the inventory.
//             </p>
//             <button
//               onClick={() => setShowForm(true)}
//               className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
//             >
//               Add Your First Medicine
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };


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

  useEffect(() => {
    console.log("✅ MedicineProductsPanel MOUNTED");

    return () => {
      console.log("❌ MedicineProductsPanel UNMOUNTING");
    };
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
    medicineStatus: "ADDED",
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

  const [error, setError] = useState(null);

  // Add this function after your state declarations
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      expiryDate: "",
      imageUrl: "",
      medicineStatus: "ADDED",
    });
    setImageFile(null);
    setEditingId(null);
    setErrors({});
  };

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setIsLoading(true); // Use setIsLoading instead of setLoading
        const data = await getMedicines();
        setMedicines(data);
      } catch (err) {
        console.error("Error fetching medicines:", err);
        setNotification({
          show: true,
          type: "error",
          message: "Failed to fetch medicines. Please try again.",
        });
      } finally {
        setIsLoading(false); // Use setIsLoading
      }
    };

    fetchMedicines();
  }, []);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required";
        else if (value.length < 2) error = "Name must be at least 2 characters";
        else if (value.length > 100) error = "Name must be less than 100 characters";
        break;
      case "description":
        if (!value.trim()) error = "Description is required";
        else if (value.length < 10) error = "Description must be at least 10 characters";
        else if (value.length > 500) error = "Description must be less than 500 characters";
        break;
      case "price":
        if (!value && value !== 0) error = "Price is required";
        else if (isNaN(value)) error = "Price must be a number";
        else if (Number(value) <= 0) error = "Price must be positive";
        else if (Number(value) > 999999) error = "Price must be less than 1,000,000";
        break;
      case "stock":
        if (!value && value !== 0) error = "Stock is required";
        else if (isNaN(value)) error = "Stock must be a number";
        else if (!Number.isInteger(Number(value))) error = "Stock must be a whole number";
        else if (Number(value) < 0) error = "Stock must be 0 or more";
        else if (Number(value) > 99999) error = "Stock must be less than 100,000";
        break;
      case "expiryDate":
        if (!value) error = "Expiry date is required";
        else if (new Date(value) < new Date())
          error = "Expiry date must be in the future";
        else if (new Date(value) > new Date(new Date().setFullYear(new Date().getFullYear() + 10)))
          error = "Expiry date must be within 10 years";
        break;
      case "imageUrl":
        if (value && value.trim() !== "") {
          if (!/^https?:\/\/.+\..+/.test(value))
            error = "Please enter a valid URL";
          else if (value.length > 500) error = "URL must be less than 500 characters";
        }
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate the field immediately
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

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Re-validate on blur for better UX
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({ 
          ...prev, 
          imageFile: 'Please upload a valid image (JPEG, PNG, GIF, WebP)' 
        }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ 
          ...prev, 
          imageFile: 'Image size must be less than 5MB' 
        }));
        return;
      }
      
      setImageFile(file);
      setErrors((prev) => ({ ...prev, imageFile: '' }));
    }
  };


  const handleSubmit = async (e) => {
    console.log("=== FORM SUBMIT START ===");

    // Check first, then prevent
    if (e.defaultPrevented) {
      console.log("⚠️ Event was already prevented by something else");
      console.trace("Who prevented it?");
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    console.log("✅ Event prevented successfully");
    console.log("Form status before submit:", formData.medicineStatus);
    console.log("Form data:", JSON.stringify(formData, null, 2));
    console.log("Editing ID:", editingId);
    console.log("Has image file:", !!imageFile);
    console.log("Is loading?", isLoading);

    // Validate all fields on submit
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (
        key !== "id" &&
        key !== "createdAt" &&
        key !== "imageUrl" &&
        key !== "medicineStatus"
      ) {
        const error = validateField(key, value);
        if (error) newErrors[key] = error;
      }
    });

    // Validate image URL if no file uploaded
    if (!imageFile && formData.imageUrl && formData.imageUrl.trim() !== "") {
      const imageUrlError = validateField("imageUrl", formData.imageUrl);
      if (imageUrlError) newErrors.imageUrl = imageUrlError;
    }

    // Validate that either image file or image URL is provided
    if (!imageFile && (!formData.imageUrl || formData.imageUrl.trim() === "")) {
      newErrors.imageUrl = "Please upload an image or provide an image URL";
    }

    console.log("Validation errors:", newErrors);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("✅ Validation passed");

      try {
        setIsLoading(true);
        console.log("🔄 Setting loading to true");

        // Ensure medicineStatus is included and uppercase
        const medicineData = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          expiryDate: formData.expiryDate,
          medicineStatus: (formData.medicineStatus || "ADDED").toUpperCase(),
        };

        console.log("📤 Sending to API:", medicineData);

 

        console.log(editingId ? "✏️ UPDATE MODE" : "➕ ADD MODE");

        if (editingId) {
          console.log("✏️ Updating medicine with ID:", editingId);
          const updatedMedicine = await updateMedicine(
            editingId,
            medicineData,
            imageFile
          );
          console.log("✅ Update response:", updatedMedicine);
          setMedicines((prev) =>
            prev.map((med) => (med.id === editingId ? updatedMedicine : med))
          );
        } else {
          console.log("➕ Adding new medicine");
          console.log("Medicine data for ADD:", medicineData);

          try {
            const newMedicine = await addMedicine(medicineData, imageFile);
            console.log("✅ Add response:", newMedicine);
        
            setTimeout(() => {
              console.log("🔄 Now updating medicines state");
              setMedicines((prev) => [...prev, newMedicine]);
            }, 1000);
          } catch (error) {
            console.error("❌ ADD Error:", error);
            console.error("Error response:", error.response?.data);
            throw error;
          }
        }

        // Reset everything
        console.log("🔄 Resetting form");
        resetForm();
        setShowForm(false);

        // Show success message
        setNotification({
          show: true,
          type: "success",
          message: `Medicine ${editingId ? "updated" : "added"} successfully!`,
        });

        // Auto-hide notification after 3 seconds
        setTimeout(() => {
          setNotification((prev) => ({ ...prev, show: false }));
        }, 3000);

        console.log("✅ Form submitted successfully!");
      } catch (error) {
        console.error("❌ Error saving medicine:", error);
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
        });

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
        console.log("🔄 Setting loading to false");
      }
    } else {
      console.log("❌ Validation failed with errors:", newErrors);
    }

    console.log("=== FORM SUBMIT END ===");
  };
  const handleEdit = (medicine) => {
    const validStatuses = [
      "ADDED",
      "AVAILABLE",
      "OUT_OF_STOCK",
      "EXPIRED",
      "DISCONTINUED",
    ];
    // Check both possible status fields
    const statusValue = medicine.medicineStatus || medicine.status;
    const status = validStatuses.includes(statusValue?.toUpperCase())
      ? statusValue.toUpperCase()
      : "ADDED";

    setFormData({
      name: medicine.name,
      description: medicine.description,
      price: medicine.price,
      stock: medicine.stock,
      expiryDate: medicine.expiryDate,
      imageUrl: medicine.imageUrl || "",
      medicineStatus: status,
    });

    setEditingId(medicine.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
              Medicine Products
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Total Medicines
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {medicines.length}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  In Stock
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {/* //{medicines.filter((m) => m.stock > 0).length} */}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Low Stock
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {medicines.filter((m) => m.stock <= 10 && m.stock > 0).length}
                </p>
              </div>
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Medicine Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingId ? "Edit Medicine" : "Add New Medicine"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      resetForm();
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    disabled={isLoading}
                  >
                    <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Notification component */}
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
                      notification.type === "success" ? "#dff0d8" : "#f2dede",
                    color:
                      notification.type === "success" ? "#3c763d" : "#a94442",
                    border: `1px solid ${
                      notification.type === "success" ? "#d6e9c6" : "#ebccd1"
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

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Medicine Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                        errors.name
                          ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:border-transparent dark:focus:border-transparent"
                      }`}
                      placeholder="Enter medicine name"
                      disabled={isLoading}
                    />
                    {errors.name && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.name}</p>
                    )}
                    {!errors.name && formData.name && (
                      <p className="text-green-500 dark:text-green-400 text-sm mt-1">
                        {formData.name.length}/100 characters
                      </p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                        errors.description
                          ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:border-transparent dark:focus:border-transparent"
                      }`}
                      rows={3}
                      placeholder="Enter medicine description"
                      disabled={isLoading}
                    />
                    {errors.description && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                        {errors.description}
                      </p>
                    )}
                    {!errors.description && formData.description && (
                      <p className={`text-sm mt-1 ${
                        formData.description.length > 500 
                          ? "text-red-500 dark:text-red-400" 
                          : "text-green-500 dark:text-green-400"
                      }`}>
                        {formData.description.length}/500 characters
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price (Rs) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500 dark:text-gray-400">Rs</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        step="0.01"
                        min="0"
                        max="999999"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                          errors.price
                            ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:border-transparent dark:focus:border-transparent"
                        }`}
                        placeholder="0.00"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.price && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                        {errors.price}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      min="0"
                      max="99999"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                        errors.stock
                          ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:border-transparent dark:focus:border-transparent"
                      }`}
                      placeholder="0"
                      disabled={isLoading}
                    />
                    {errors.stock && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                        {errors.stock}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Expiry Date *
                    </label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      min={new Date().toISOString().split('T')[0]}
                      max={new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        errors.expiryDate
                          ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:border-transparent dark:focus:border-transparent"
                      }`}
                      disabled={isLoading}
                    />
                    {errors.expiryDate && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                        {errors.expiryDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status *
                    </label>
                    <select
                      name="medicineStatus"
                      value={formData.medicineStatus}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      disabled={isLoading}
                    >
                      <option value="ADDED">ADDED</option>
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="OUT_OF_STOCK">OUT OF STOCK</option>
                      <option value="EXPIRED">EXPIRED</option>
                      <option value="DISCONTINUED">DISCONTINUED</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Image Upload *
                    </label>
                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                      errors.imageFile 
                        ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500'
                    }`}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                        disabled={isLoading}
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        {imageFile ? (
                          <div className="flex items-center justify-center space-x-3">
                            <img 
                              src={URL.createObjectURL(imageFile)} 
                              alt="Preview" 
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="text-left">
                              <p className="text-gray-900 dark:text-white font-medium">{imageFile.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {(imageFile.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                            <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                              Click to upload image
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              PNG, JPG, GIF up to 5MB
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                    {errors.imageFile && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-2">{errors.imageFile}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      OR - Image URL
                    </label>
                    <input
                      type="text"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                        errors.imageUrl
                          ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:border-transparent dark:focus:border-transparent"
                      }`}
                      placeholder="https://example.com/image.jpg"
                      disabled={isLoading || !!imageFile}
                    />
                    {errors.imageUrl && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                        {errors.imageUrl}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Provide either an image file or URL
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all bg-white dark:bg-gray-800"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    disabled={isLoading || Object.keys(errors).some(key => errors[key])}
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Medicine Details
                  </h3>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <img
                  src={selectedMedicine.imageUrl} // S3 URL
                  alt={selectedMedicine.name}
                  className="w-full h-64 object-cover rounded-xl mb-6"
                  onError={(e) => {
                    e.target.src = "/placeholder.jpg"; // Fallback to local
                    e.target.onerror = null; // Prevent infinite loop
                  }}
                />

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedMedicine.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedMedicine.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Price
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        Rs{selectedMedicine.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Stock
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {selectedMedicine.stock}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Expiry Date
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {new Date(
                        selectedMedicine.expiryDate
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Status
                    </p>
                    <span
                      className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                        selectedMedicine.status === "PLACED"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : selectedMedicine.status === "CANCELLED"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6 text-center">
                <div className="bg-red-100 dark:bg-red-900 p-4 rounded-full w-fit mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Delete Medicine
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to delete "{selectedMedicine.name}"?
                  This action cannot be undone.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all bg-white dark:bg-gray-800"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMedicine.id)}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 overflow-hidden transform hover:scale-105"
                >
                  {/* Medicine Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 overflow-hidden">
                    {medicine.imageUrl ? (
                      <img
                        src={medicine.imageUrl}
                        alt={medicine.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          medicine.status === "PLACED"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : medicine.status === "CANCELLED"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {medicine.status}
                      </span>
                    </div>
                  </div>

                  {/* Medicine Info */}
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {medicine.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-2">
                      {medicine.description}
                    </p>

                    {/* Stats */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Price
                          </span>
                        </div>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          Rs{medicine.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <StockIcon
                            className={`w-4 h-4 ${stockStatus.color}`}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Stock
                          </span>
                        </div>
                        <span className={`font-bold ${stockStatus.color}`}>
                          {medicine.stock}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Expiry
                          </span>
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
                        className="p-3 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-full transition-all duration-200 hover:scale-110"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(medicine)}
                        className="p-3 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/50 rounded-full transition-all duration-200 hover:scale-110"
                        title="Edit Medicine"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMedicine(medicine);
                          setShowDeleteModal(true);
                        }}
                        className="p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-full transition-all duration-200 hover:scale-110"
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
            <Package className="w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No medicines found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
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

// Plan Badge Component
const PlanBadge = ({ type, color }) => {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${color} shadow-sm`}
    >
      {type}
    </span>
  );
};

// Benefit Item Component
const BenefitItem = ({ icon: Icon, text }) => (
  <div className="flex items-center space-x-2 text-sm text-gray-600">
    <Icon className="w-4 h-4 text-teal-500 flex-shrink-0" />
    <span>{text}</span>
  </div>
);

// Filter Chip Component
const FilterChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
      active
        ? "bg-sky-500 text-white shadow-md"
        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
    }`}
  >
    {label}
  </button>
);

// Compare Bar Component
const CompareBar = ({ selectedPlans, onClear }) => {
  if (selectedPlans.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-sky-200 shadow-2xl z-50 p-4 animate-slide-up">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-gray-900">
            {selectedPlans.length} plan{selectedPlans.length > 1 ? "s" : ""}{" "}
            selected
          </span>
          <button
            onClick={onClear}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
          Compare Plans
        </button>
      </div>
    </div>
  );
};

// / Main ProductsPanel Component with Dark Mode
const ProductsPanel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [showFilters, setShowFilters] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode from system preference or localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };


  const plans = [
    {
      name: "Medicare Advantage",
      members: 1247,
      premium: "$0",
      type: "Part C",
      color: "bg-gradient-to-br from-[#090040] to-[#0a0a80]",
      darkBg:
        "bg-gradient-to-br from-sky-900/20 to-blue-900/20 border-gray-600",
      badgeColor:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      iconColor: "from-blue-500 to-blue-600",
      satisfaction: 94,
      deductible: "$500",
      ageEligibility: "65+",
      benefits: [
        "Hospital Coverage",
        "Doctor Visits",
        "Preventive Care",
        "Prescription Drugs",
      ],
      category: "advantage",
    },
    {
      name: "Medicare Supplement",
      members: 834,
      premium: "$156",
      type: "Medigap",
      color: "bg-gradient-to-br from-[#090040] to-[#0a0a80]",
      darkBg:
        "bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-gray-600",
      badgeColor:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      iconColor: "from-green-500 to-green-600",
      satisfaction: 89,
      deductible: "$226",
      ageEligibility: "65+",
      benefits: [
        "Medicare Gaps",
        "Foreign Travel",
        "Out-of-Pocket Costs",
        "Coinsurance",
      ],
      category: "supplement",
    },
    {
      name: "Medicare Part D",
      members: 2103,
      premium: "$32",
      type: "Prescription",
      color: "bg-gradient-to-br from-[#090040] to-[#0a0a80]",
      darkBg:
        "bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-gray-600",
      badgeColor:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      iconColor: "from-purple-500 to-purple-600",
      satisfaction: 92,
      deductible: "$505",
      ageEligibility: "65+",
      benefits: [
        "Brand Drugs",
        "Generic Drugs",
        "Pharmacy Network",
        "Mail Order",
      ],
      category: "prescription",
    },
  ];

  const togglePlanSelection = (planName) => {
    setSelectedPlans((prev) =>
      prev.includes(planName)
        ? prev.filter((p) => p !== planName)
        : [...prev, planName]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header with Dark Mode Toggle */}
      <div className="bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 dark:from-sky-600 dark:via-teal-600 dark:to-emerald-600 text-white py-16 px-6 rounded-b-3xl shadow-xl mb-8 relative">
        <div className="max-w-7xl mx-auto">
          {/* Dark Mode Toggle in top right */}
          <div className="absolute top-6 right-6">
            <DarkModeToggle
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
            />
          </div>

          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-12 h-12" />
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </div>
          <h1 className="text-5xl font-bold mb-4">Medicare Plans</h1>
          <p className="text-xl text-sky-50 dark:text-sky-100 max-w-2xl">
            Find the perfect Medicare plan that fits your healthcare needs and
            budget
          </p>
          <div className="mt-8 flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>4,184+ Active Members</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              <span>4.8/5 Average Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>Trusted Healthcare Partner</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Medicare plans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center space-x-2 font-medium"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 font-semibold">
              <Plus className="w-4 h-4" />
              <span>Add Plan</span>
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600 space-y-4 transition-all duration-300">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Plan Type
                </label>
                <div className="flex flex-wrap gap-2">
                  <FilterChip
                    label="All Plans"
                    active={activeFilter === "all"}
                    onClick={() => setActiveFilter("all")}
                  />
                  <FilterChip
                    label="Advantage"
                    active={activeFilter === "advantage"}
                    onClick={() => setActiveFilter("advantage")}
                  />
                  <FilterChip
                    label="Supplement"
                    active={activeFilter === "supplement"}
                    onClick={() => setActiveFilter("supplement")}
                  />
                  <FilterChip
                    label="Prescription"
                    active={activeFilter === "prescription"}
                    onClick={() => setActiveFilter("prescription")}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Monthly Premium: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: Users,
              label: "Total Members",
              value: "4,184",
              color: "from-blue-500 to-blue-600",
            },
            {
              icon: TrendingUp,
              label: "Avg Satisfaction",
              value: "92%",
              color: "from-green-500 to-green-600",
            },
            {
              icon: Shield,
              label: "Active Plans",
              value: "3",
              color: "from-purple-500 to-purple-600",
            },
            {
              icon: Heart,
              label: "Coverage Rate",
              value: "98%",
              color: "from-pink-500 to-pink-600",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <AnimatedCard
              key={i}
              className={`p-8 group cursor-pointer overflow-hidden relative border-2 ${
                selectedPlans.includes(plan.name)
                  ? "border-sky-500 shadow-xl dark:border-sky-400"
                  : "border-transparent"
              }`}
            >
              {/* Selection Checkbox */}
              <div className="absolute top-4 right-4 z-20">
                <button
                  onClick={() => togglePlanSelection(plan.name)}
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                    selectedPlans.includes(plan.name)
                      ? "bg-sky-500 border-sky-500 dark:bg-sky-400 dark:border-sky-400"
                      : "border-gray-300 dark:border-gray-600 hover:border-sky-400 dark:hover:border-sky-400"
                  }`}
                >
                  {selectedPlans.includes(plan.name) && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>

              {/* Background Gradient */}
              <div
                className={`absolute inset-0 ${plan.color} opacity-60 group-hover:opacity-80 transition-opacity duration-300`}
              ></div>

              <div className="relative z-10">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${plan.iconColor} rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-200">
                    {plan.name}
                  </h4>
                  <PlanBadge type={plan.type} color={plan.badgeColor} />
                </div>

                {/* Key Metrics */}
                <div className="space-y-4 mb-6">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Monthly Premium
                      </span>
                      <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {plan.premium}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Deductible
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {plan.deductible}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Active Members
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {plan.members.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Age Eligibility
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {plan.ageEligibility}
                    </span>
                  </div>

                  {/* Satisfaction Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Member Satisfaction
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {plan.satisfaction}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 bg-gradient-to-r ${plan.iconColor} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                        style={{ width: `${plan.satisfaction}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-6">
                  <h5 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Check className="w-4 h-4 mr-2 text-teal-500" />
                    Coverage Benefits
                  </h5>
                  <div className="space-y-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4">
                    {plan.benefits.map((benefit, idx) => (
                      <BenefitItem key={idx} icon={Check} text={benefit} />
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button className="w-full py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                    View Details
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="py-2 px-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all duration-200 text-sm">
                      Compare
                    </button>
                    <button className="py-2 px-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-sky-600 dark:text-sky-400 rounded-lg font-medium hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all duration-200 text-sm">
                      Enroll Now
                    </button>
                  </div>
                </div>

                {/* Hover Action Icons */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <ActionButton
                    icon={Eye}
                    variant="secondary"
                    tooltip="View Details"
                  />
                  <ActionButton
                    icon={Edit}
                    variant="primary"
                    tooltip="Edit Plan"
                  />
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

        {/* Trust Badge */}
        <div className="mt-12 bg-gradient-to-r from-sky-500 to-teal-500 dark:from-sky-600 dark:to-teal-600 rounded-2xl p-8 text-white text-center shadow-xl">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 mr-3" />
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-bold mb-2">
            Trusted by Over 1 Million Users
          </h3>
          <p className="text-sky-50 dark:text-sky-100 text-lg">
            Join thousands of satisfied members who trust us with their
            healthcare coverage
          </p>
        </div>
      </div>

      {/* Compare Bar */}
      <CompareBar
        selectedPlans={selectedPlans}
        onClear={() => setSelectedPlans([])}
      />

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

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

  // ✅ Or fix it to only run once:
  useEffect(() => {
    console.log("🔄 AdminDashboard mounted");
  }, []);

  // In your MedicineProductsPanel, add:
  useEffect(() => {
    console.log("🏥 MedicineProductsPanel mounted");
    console.log("Active tab when mounted:", activeTab);

    return () => {
      console.log("💥 MedicineProductsPanel unmounting - WHY???");
      console.trace("Trace of unmount");
    };
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
    {
      id: "dashboard",
      name: "Overview",
      icon: Activity,
      className:
        "text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/50",
    },
    {
      id: "users",
      name: "Members",
      icon: Users,
      className:
        "text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/50",
    },
    {
      id: "orders",
      name: "Claims",
      icon: ShoppingCart,
      className:
        "text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/50",
    },
    {
      id: "products",
      name: "Plans",
      icon: Package,
      className:
        "text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/50",
    },
    {
      id: "AddMed",
      name: "addMedicines",
      icon: Pill,
      className:
        "text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/50",
    },
    {
      id: "chart",
      name: "ChartBar",
      icon: BarChart,
      className:
        "text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br  from-blue-50 via-white to-purple-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-lg transition-colors duration-300">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-white/20 dark:bg-gray-700/50 rounded-lg backdrop-blur-sm">
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
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white shadow-lg transform scale-105"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:text-blue-700 dark:hover:text-blue-300 hover:shadow-sm hover:scale-102"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mr-3 transition-transform duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-110"
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

        {/* Main Content Area */}
        <main className="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
          {activeTab === "dashboard" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent"
                  >
                    Dashboard Overview
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg text-gray-600 dark:text-gray-300"
                  >
                    Welcome back, {user.fullName?.split(" ")[0]}! Here's what's
                    happening with Medicare today.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row items-center gap-4"
                >
                  {/* Date Card */}
                  <div className="flex items-center space-x-3 px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 hover:shadow-md transition-all duration-300">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Admin Badge */}
                  <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg text-white group cursor-pointer hover:shadow-xl transition-all duration-300">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold">Admin</span>
                  </div>
                </motion.div>
              </div>

              {/* Quick Actions Panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
              >
                {[
                  {
                    label: "Add Member",
                    icon: UserPlus,
                    color: "from-green-500 to-emerald-600",
                  },
                  {
                    label: "Add Claim",
                    icon: FileText,
                    color: "from-blue-500 to-cyan-600",
                  },
                  {
                    label: "Manage Plans",
                    icon: Shield,
                    color: "from-purple-500 to-indigo-600",
                  },
                  {
                    label: "View Reports",
                    icon: BarChart3,
                    color: "from-orange-500 to-red-600",
                  },
                  {
                    label: "Manage Users",
                    icon: Users,
                    color: "from-teal-500 to-blue-600",
                  },
                ].map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 bg-gradient-to-br ${action.color} rounded-2xl shadow-lg text-white cursor-pointer group hover:shadow-xl transition-all duration-300`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm group-hover:rotate-12 transition-transform duration-300">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-semibold text-center">
                          {action.label}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    label: "Total Members",
                    value: "4,184",
                    change: "+12%",
                    icon: Users,
                    color: "from-blue-500 to-blue-600",
                    bg: "from-blue-50/80 to-blue-100/80 dark:from-blue-900/20 dark:to-blue-800/20",
                    trend: "up",
                    description: "Active enrolled members",
                  },
                  {
                    label: "Active Claims",
                    value: "47",
                    change: "-8%",
                    icon: FileText,
                    color: "from-orange-500 to-orange-600",
                    bg: "from-orange-50/80 to-orange-100/80 dark:from-orange-900/20 dark:to-orange-800/20",
                    trend: "down",
                    description: "Claims being processed",
                  },
                  {
                    label: "Monthly Revenue",
                    value: "$1.2M",
                    change: "+23%",
                    icon: DollarSign,
                    color: "from-green-500 to-green-600",
                    bg: "from-green-50/80 to-green-100/80 dark:from-green-900/20 dark:to-green-800/20",
                    trend: "up",
                    description: "Current month revenue",
                  },
                  {
                    label: "Satisfaction Score",
                    value: "94%",
                    change: "+2%",
                    icon: TrendingUp,
                    color: "from-purple-500 to-purple-600",
                    bg: "from-purple-50/80 to-purple-100/80 dark:from-purple-900/20 dark:to-purple-800/20",
                    trend: "up",
                    description: "Member satisfaction rate",
                  },
                ].map((metric, i) => {
                  const Icon = metric.icon;
                  return (
                    <AnimatedCard key={i} delay={i * 0.1}>
                      <motion.div
                        whileHover={{ scale: 1.02, y: -4 }}
                        className={`p-6 bg-gradient-to-br ${metric.bg} backdrop-blur-sm border border-white/50 dark:border-gray-700/50 rounded-2xl shadow-sm hover:shadow-xl cursor-pointer group relative overflow-hidden transition-all duration-300`}
                      >
                        {/* Hover Gradient Overlay */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                        ></div>

                        <div className="relative z-10">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <p className="text-3xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300">
                                {metric.value}
                              </p>

                              <div
                                className={`flex items-center space-x-1 text-sm font-semibold ${
                                  metric.trend === "up"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {metric.trend === "up" ? (
                                  <TrendingUp className="w-4 h-4" />
                                ) : (
                                  <TrendingDown className="w-4 h-4" />
                                )}
                                <span>{metric.change} from last month</span>
                              </div>
                            </div>

                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className={`p-3 rounded-xl bg-gradient-to-br ${metric.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}
                            >
                              <Icon className="w-6 h-6 text-white" />
                            </motion.div>
                          </div>

                          {/* Mini Chart */}
                          <div className="mt-4 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "70%" }}
                              transition={{ delay: i * 0.1 + 0.5, duration: 1 }}
                              className={`h-full bg-gradient-to-r ${metric.color} rounded-full`}
                            />
                          </div>
                        </div>
                      </motion.div>
                    </AnimatedCard>
                  );
                })}
              </div>

              {/* Charts and Analytics Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Claims Activity */}
                <AnimatedCard delay={0.4}>
                  <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Recent Claims Activity
                      </h3>
                      <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium flex items-center space-x-1 hover:underline transition-all duration-200">
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
                          status: "approved",
                          time: "2 hours ago",
                          avatar: "JS",
                        },
                        {
                          member: "Mary Johnson",
                          type: "Hospital Visit",
                          amount: "$1,850",
                          status: "review",
                          time: "4 hours ago",
                          avatar: "MJ",
                        },
                        {
                          member: "Robert Brown",
                          type: "Lab Work",
                          amount: "$120",
                          status: "pending",
                          time: "1 day ago",
                          avatar: "RB",
                        },
                      ].map((claim, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ x: 4 }}
                          className="flex items-center justify-between p-4 bg-white dark:bg-gray-700/50 rounded-xl hover:shadow-md transition-all duration-300 group cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-medium shadow-md group-hover:shadow-lg transition-shadow duration-200">
                              {claim.avatar}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                {claim.member}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {claim.type}
                              </div>
                              <div className="text-xs text-gray-400 dark:text-gray-500">
                                {claim.time}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="font-bold text-gray-900 dark:text-white">
                                {claim.amount}
                              </div>
                              <div
                                className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  claim.status === "approved"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                    : claim.status === "review"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                }`}
                              >
                                {claim.status.charAt(0).toUpperCase() +
                                  claim.status.slice(1)}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </AnimatedCard>

                {/* Plan Enrollment Trends */}
                <AnimatedCard delay={0.5}>
                  <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 hover:shadow-md transition-all duration-300">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                      Plan Enrollment Trends
                    </h3>

                    <div className="space-y-6">
                      {[
                        {
                          plan: "Medicare Advantage",
                          percentage: 78,
                          members: 1247,
                          color: "from-blue-500 to-blue-600",
                          trend: "+5%",
                        },
                        {
                          plan: "Medicare Supplement",
                          percentage: 45,
                          members: 834,
                          color: "from-green-500 to-green-600",
                          trend: "+2%",
                        },
                        {
                          plan: "Medicare Part D",
                          percentage: 92,
                          members: 2103,
                          color: "from-purple-500 to-purple-600",
                          trend: "+8%",
                        },
                      ].map((plan, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.02 }}
                          className="space-y-3 group cursor-pointer"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                {plan.plan}
                              </span>
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                                {plan.trend}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                              {plan.members.toLocaleString()} members
                            </span>
                          </div>

                          <div className="relative">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${plan.percentage}%` }}
                                transition={{
                                  delay: i * 0.2 + 0.7,
                                  duration: 1,
                                }}
                                className={`h-3 bg-gradient-to-r ${plan.color} rounded-full shadow-sm group-hover:shadow-md transition-all duration-300`}
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </AnimatedCard>
              </div>

              {/* Alerts & Notices */}
              <AnimatedCard delay={0.6}>
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200/60 dark:border-blue-700/60">
                  <div className="flex items-center space-x-3 mb-4">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      System Alerts & Notices
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        type: "warning",
                        message: "3 claims pending for over 48 hours",
                        action: "Review Now",
                      },
                      {
                        type: "info",
                        message: "Medicare policy update effective next week",
                        action: "View Details",
                      },
                      {
                        type: "success",
                        message: "System maintenance completed successfully",
                        action: "Dismiss",
                      },
                    ].map((alert, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              alert.type === "warning"
                                ? "bg-yellow-500"
                                : alert.type === "info"
                                ? "bg-blue-500"
                                : "bg-green-500"
                            }`}
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {alert.message}
                          </span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium hover:underline transition-colors duration-200">
                          {alert.action}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </AnimatedCard>

              {/* Support Widget */}
              <AnimatedCard delay={0.7}>
                <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Need Help?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Our support team is here to help you
                  </p>
                  <div className="flex justify-center space-x-3">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 hover:shadow-lg">
                      Contact Support
                    </button>
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-200 hover:shadow-lg">
                      View FAQ
                    </button>
                  </div>
                </div>
              </AnimatedCard>
            </motion.div>
          )}
          
          {/* Other panels remain exactly the same */}
          {activeTab === "users" && (
            <UsersPanel
              members={members}
              loading={loading}
              onRefreshMembers={fetchMembers}
            />
          )}
          {activeTab === "orders" && <OrdersPanel />}
          {activeTab === "products" && <ProductsPanel />}
          {/* {activeTab === "AddMed" && <MedicineProductsPanel />} */}
          // Use:
          <div style={{ display: activeTab === "AddMed" ? "block" : "none" }}>
            <MedicineProductsPanel />
          </div>
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
export { ChartBar };
