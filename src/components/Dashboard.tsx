/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from "react";
import { useRoads } from "../context/RoadContext";
import {
  Milestone,
  Layers,
  FileCheck,
  Coins,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  BarChart2
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

export const Dashboard: React.FC = () => {
  const { segments, documents } = useRoads();

  // Dynamic statistics calculations
  const stats = useMemo(() => {
    let totalLength = 0;
    segments.forEach((seg) => {
      totalLength += seg.lengthKm;
    });

    return {
      totalLength: Math.round(totalLength * 10) / 10,
      totalCount: segments.length,
    };
  }, [segments]);

  const segmentsWithCertificates = useMemo(() => {
    const uploadedSegmentIds = new Set(
      documents
        .filter((d) => d.type === "sertifikat_jalan" || d.type === "kartu_leger")
        .map((d) => d.segmentId)
    );
    return segments.filter((seg) => uploadedSegmentIds.has(seg.id));
  }, [segments, documents]);

  const retributionStats = useMemo(() => {
    let saved = localStorage.getItem("lentera_utility_retribution");
    let retributionList = saved ? JSON.parse(saved) : [
      { totalRetributionRp: 48625000, status: "Lunas" },
      { totalRetributionRp: 76500000, status: "Belum Dibayar" },
      { totalRetributionRp: 22500000, status: "Lunas" },
      { totalRetributionRp: 14000000, status: "Jatuh Tempo" }
    ];

    let totalPotential = 0;
    let totalPaid = 0;
    let totalUnpaid = 0;
    let totalOverdue = 0;

    retributionList.forEach((item: any) => {
      const val = Number(item.totalRetributionRp) || 0;
      totalPotential += val;
      if (item.status === "Lunas") totalPaid += val;
      if (item.status === "Belum Dibayar") totalUnpaid += val;
      if (item.status === "Jatuh Tempo") totalOverdue += val;
    });

    return { totalPotential, totalPaid, totalUnpaid, totalOverdue };
  }, []);

  const chartData = useMemo(() => {
    return [
      { name: "Lunas", value: retributionStats.totalPaid, color: "#10b981" }, // emerald-500
      { name: "Belum Dibayar", value: retributionStats.totalUnpaid, color: "#f59e0b" }, // amber-500
      { name: "Jatuh Tempo", value: retributionStats.totalOverdue, color: "#ef4444" }, // red-500
    ];
  }, [retributionStats]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-outline-variant/60 p-3 rounded-lg shadow-lg">
          <p className="font-bold text-on-surface mb-1">{label}</p>
          <p className="text-primary font-mono font-medium">
            {formatRp(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const formatRp = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 px-4 sm:p-gutter pt-6 md:pt-8 pb-16 md:pb-24">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">Dashboard Statistik</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
            Ringkasan data infrastruktur jalan provinsi (NTT).
          </p>
        </div>
      </div>

      {/* Bento Grid Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* KPI Card 1: Total Length */}
        <div className="relative bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 sm:p-7 flex flex-col justify-between shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-0.5 cursor-default group">
          {/* Decorative glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative">
            <div className="p-3 bg-primary/5 rounded-lg inline-block mb-4 transition-all duration-300 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-md group-hover:shadow-primary/30">
              <Milestone className="text-primary w-6 h-6 transition-colors duration-300 group-hover:text-on-primary" />
            </div>
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Total Panjang Jalan
            </h3>
          </div>
          <div className="relative mt-4">
            <div className="font-display-lg text-display-lg text-on-surface flex items-baseline gap-2 transition-transform duration-300 group-hover:translate-x-0.5">
              {stats.totalLength.toLocaleString("id-ID")}{" "}
              <span className="font-body-md text-body-md text-on-surface-variant font-normal">KM</span>
            </div>
          </div>
          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 h-0.5 bg-primary w-0 group-hover:w-full transition-all duration-500 ease-out"></div>
        </div>

        {/* KPI Card 2: Segments */}
        <div className="relative bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 sm:p-7 flex flex-col justify-between shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-secondary/5 hover:border-secondary/30 hover:-translate-y-0.5 cursor-default group">
          {/* Decorative glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative">
            <div className="p-3 bg-secondary-fixed rounded-lg inline-block mb-4 transition-all duration-300 group-hover:bg-secondary group-hover:scale-110 group-hover:-rotate-3 group-hover:shadow-md group-hover:shadow-secondary/30">
              <Layers className="text-secondary w-6 h-6 transition-colors duration-300 group-hover:text-on-secondary" />
            </div>
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Total Ruas Jalan
            </h3>
          </div>
          <div className="relative mt-4">
            <div className="font-display-lg text-display-lg text-on-surface transition-transform duration-300 group-hover:translate-x-0.5">
              {stats.totalCount}
            </div>
          </div>
          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 h-0.5 bg-secondary w-0 group-hover:w-full transition-all duration-500 ease-out"></div>
        </div>
      </div>

      {/* Retribusi Utilitas Panel */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl flex flex-col shadow-sm overflow-hidden mt-6">
        <div className="p-5 sm:p-6 border-b border-outline-variant/60 flex justify-between items-center bg-surface-container-low/50">
          <div>
            <h3 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-500" />
              Rekapan Retribusi Utilitas
            </h3>
            <p className="text-body-sm text-on-surface-variant mt-1">
              Ringkasan tagihan pemanfaatan ruang milik jalan.
            </p>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Potential */}
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/40">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                <DollarSign className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Potensi</p>
            </div>
            <p className="text-lg font-black text-on-surface">{formatRp(retributionStats.totalPotential)}</p>
          </div>

          {/* Total Paid */}
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/40">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Lunas</p>
            </div>
            <p className="text-lg font-black text-emerald-600">{formatRp(retributionStats.totalPaid)}</p>
          </div>

          {/* Total Unpaid */}
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/40">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                <Coins className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Belum Dibayar</p>
            </div>
            <p className="text-lg font-black text-amber-600">{formatRp(retributionStats.totalUnpaid)}</p>
          </div>

          {/* Total Overdue */}
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/40">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-red-100 text-red-700 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Jatuh Tempo</p>
            </div>
            <p className="text-lg font-black text-red-600">{formatRp(retributionStats.totalOverdue)}</p>
          </div>
        </div>

        {/* Retribution Chart */}
        <div className="p-6 border-t border-outline-variant/60 bg-surface-container-low/30">
          <h4 className="font-label-md text-on-surface-variant uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4" /> Grafik Pembayaran
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tickFormatter={(value) => `Rp${(value / 1000000).toFixed(0)}Jt`}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Ruas dengan Sertifikat Panel */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl flex flex-col shadow-sm overflow-hidden mt-6">
        <div className="p-5 sm:p-6 border-b border-outline-variant/60 flex justify-between items-center bg-surface-container-low/50">
          <div>
            <h3 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-tertiary" />
              Ruas Jalan yang Sudah Diupload Sertifikatnya
            </h3>
            <p className="text-body-sm text-on-surface-variant mt-1">
              Total: <strong className="text-on-surface">{segmentsWithCertificates.length} Ruas</strong>
            </p>
          </div>
        </div>
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          {segmentsWithCertificates.length > 0 ? (
            <table className="w-full text-left border-collapse text-sm">
              <thead className="sticky top-0 bg-surface-container-low border-b border-outline-variant shadow-sm z-10">
                <tr className="text-on-surface-variant font-label-sm uppercase tracking-wider">
                  <th className="p-3 sm:p-4 font-bold w-16 text-center">No</th>
                  <th className="p-3 sm:p-4 font-bold">Kode Ruas</th>
                  <th className="p-3 sm:p-4 font-bold">Nama Ruas</th>
                  <th className="p-3 sm:p-4 font-bold">Kabupaten/Kota</th>
                  <th className="p-3 sm:p-4 font-bold text-right">Panjang (KM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {segmentsWithCertificates.map((seg, index) => (
                  <tr key={seg.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="p-3 sm:p-4 text-on-surface-variant text-center">{index + 1}</td>
                    <td className="p-3 sm:p-4 font-mono font-medium text-primary">{seg.code}</td>
                    <td className="p-3 sm:p-4 font-semibold text-on-surface">{seg.name}</td>
                    <td className="p-3 sm:p-4 text-on-surface-variant">{seg.district}</td>
                    <td className="p-3 sm:p-4 text-right font-mono font-medium">
                      {seg.lengthKm.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-on-surface-variant">
              Belum ada ruas jalan yang diupload sertifikatnya.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
