"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DayData {
  tanggal: string;
  pengunjung: number;
}

interface Props {
  data: DayData[];
  month: string;
}

export default function VisitorChart({ data, month }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-800">Pengunjung Bulan Ini — {month}</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Total: <span className="font-semibold text-blue-600">{data.reduce((s, d) => s + d.pengunjung, 0).toLocaleString()}</span> kunjungan
        </p>
      </div>
      <div className="px-4 py-4">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="visitorGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="tanggal"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#94a3b8", marginBottom: "4px" }}
              formatter={(val) => [Number(val).toLocaleString(), "Pengunjung"]}
            />
            <Area
              type="monotone"
              dataKey="pengunjung"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#visitorGrad)"
              dot={{ r: 3, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 5, fill: "#3b82f6" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
