import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { parkingStats } from "./Overview";
import { useEffect, useState } from "react";

type statsType = {
  name: string;
  total: number;
};

const initialStats: statsType[] = [
  { name: "Jan", total: 0 },
  { name: "Feb", total: 0 },
  { name: "Mar", total: 0 },
  { name: "Apr", total: 0 },
  { name: "May", total: 0 },
  { name: "Jun", total: 0 },
  { name: "Jul", total: 0 },
  { name: "Aug", total: 0 },
  { name: "Sep", total: 0 },
  { name: "Oct", total: 0 },
  { name: "Nov", total: 0 },
  { name: "Dec", total: 0 },
];

export function ChartOverview({ data }: { data: parkingStats[] }) {
  const [stats, setStats] = useState<statsType[]>([]);

  useEffect(() => {
    const statsData = initialStats.map((stat) => {
      const dataStat = data.find(
        (d) => d.month === initialStats.indexOf(stat) + 1
      );
      if (dataStat) {
        return { name: stat.name, total: dataStat.totalPayment };
      }
      return stat;
    });
    setStats(statsData);
  }, [data]);
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={stats}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip />

        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-[#4F46E5]"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PieOverview() {
  const data = [
    { name: "Group A", value: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Group B", value: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Group C", value: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Group D", value: Math.floor(Math.random() * 5000) + 1000 },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Tooltip />

        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
