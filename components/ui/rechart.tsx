"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Sector,
  AreaChart,
  Area,
} from "recharts";
import { TableOverflow } from "./table";
import Dropdown from "./dropdown";
import Text from "./text";
import Cookies from "js-cookie";
import StatusItem from "./status";
import Image from "next/image";
import { LOCAL_ICONS } from "@/constants/icons";
import SlideToggler from "./slides-toggler";
import { rechartDummies } from "@/constants/constant";

// ---------- Shared ----------
type PriorityKey = "P1" | "P2" | "P3" | "P4";

const COLORS: Record<PriorityKey, string> = {
  P1: "#B31217", // Critical - deep red
  P2: "#24A148", // High - green
  P3: "#F5C042", // Medium - amber
  P4: "#676C75", // Low - slate/gray
};

const PRIO_LABEL: Record<PriorityKey, string> = {
  P1: "Critical (P1)",
  P2: "High (P2)",
  P3: "Medium (P3)",
  P4: "Low (P4)",
};

const Dot = ({ color }: { color: string }) => (
  <span
    style={{
      display: "inline-block",
      width: 6,
      height: 6,
      borderRadius: 999,
      background: color,
      marginRight: 2,
    }}
  />
);

// ---------- Chart 1: Backlog of Overdue Incidents ----------
const backlogData = [
  { key: "P1" as PriorityKey, label: "P1", value: 40 },
  { key: "P2" as PriorityKey, label: "P2", value: 20 },
  { key: "P3" as PriorityKey, label: "P3", value: 45 },
  { key: "P4" as PriorityKey, label: "P4", value: 60, callout: "10hrs" }, // callout bubble example
];

const BacklogTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload as (typeof backlogData)[number];
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #E5E7EB",
        borderRadius: 8,
        padding: "8px 10px",
        boxShadow:
          "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
      }}
      // className="hidden hover:flex duration-300 transition-all"
    >
      <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 2 }}>
        {PRIO_LABEL[p.key]}
      </div>
      <div style={{ fontSize: 12, color: "#4B5563" }}>Backlog: {p.value}</div>
    </div>
  );
};

const Callout = ({ x, y, text }: { x: number; y: number; text: string }) => {
  // red speech-bubble above bar
  const padX = 10;
  const padY = 6;
  const radius = 14;
  const bubbleWidth = 48;
  const bubbleHeight = 26;
  const bubbleX = x - bubbleWidth / 2;
  const bubbleY = y - bubbleHeight - 10;

  return (
    <g>
      <rect
        x={bubbleX}
        y={bubbleY}
        rx={999}
        ry={999}
        width={bubbleWidth}
        height={bubbleHeight}
        fill="#B31217"
      />
      {/* little pointer */}
      <path
        d={`M ${x - 6} ${bubbleY + bubbleHeight} L ${x} ${
          bubbleY + bubbleHeight + 8
        } L ${x + 6} ${bubbleY + bubbleHeight} Z`}
        fill="#B31217"
      />
      <text
        x={x}
        y={bubbleY + bubbleHeight / 2 + 4}
        textAnchor="middle"
        fontSize={12}
        fill="#fff"
        fontWeight={700}
      >
        {text}
      </text>
    </g>
  );
};

// 1) custom tick component (goes above your component)
const XTickWithValue = (props: any) => {
  const { x, y, payload, index } = props;
  // assumes your BarChart `data` has { label, value }
  const d = (props?.payload?.payload ?? {}) as {
    label?: string;
    value?: number;
  };

  return (
    <g transform={`translate(${x},${y})`}>
      {/* category label */}
      <text dy={14} textAnchor="middle" fontSize={12} fill="#111827">
        {payload.value}
      </text>
      {/* value UNDER the axis */}
      <text
        dy={30}
        textAnchor="middle"
        fontSize={12}
        fill="#6B7280"
        fontWeight={600}
      >
        {d?.value ?? ""}
      </text>
    </g>
  );
};

export function BacklogOfOverdueIncidents({
  data,
  fullLog,
}: {
  data?: any[];
  fullLog: boolean;
}) {
  const { dept, cat } = rechartDummies;

  return (
    <div className="tech-container min-h-[400px]">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
        }}
        className=""
      >
        <div
          className={
            fullLog ? "flex items-center justify-between gap-10" : "gap-0"
          }
        >
          <Text.SmallHeading className="text-lg font-semibold">
            Backlog of Overdue Incidents
          </Text.SmallHeading>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <Dot color={COLORS.P4} />
              P4: Low
            </div>
            <div>
              <Dot color={COLORS.P3} />
              P3: Medium
            </div>
            <div>
              <Dot color={COLORS.P2} />
              P2: High
            </div>
            <div>
              <Dot color={COLORS.P1} />
              P1: Critical
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <Dropdown>
            <Dropdown.Trigger className="flex items-center justify-between">
              Department
            </Dropdown.Trigger>
            <Dropdown.Content>
              {dept.map((de, i) => (
                <Dropdown.Item key={i}>{de}</Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>
          <Dropdown>
            <Dropdown.Trigger className="flex items-center justify-between">
              Category
            </Dropdown.Trigger>
            <Dropdown.Content>
              {cat.map((de, i) => (
                <Dropdown.Item key={i}>{de}</Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>

          {fullLog && (
            <SlideToggler
              slides={["This Week", "This Year", "This Month"]}
              paramKey={"duration"}
            />
          )}
        </div>
      </div>

      <div style={{ height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={backlogData}
            margin={{ top: 24, right: 12, left: 4, bottom: 48 }} // extra room for the second line
          >
            <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 6" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
              // 👇 custom renderer shows category + value under the axis
              tick={<XTickWithValue />}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip
              content={<BacklogTooltip />}
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={56}>
              {backlogData.map((d, i) => (
                <Cell key={i} fill={COLORS[d.key]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
// --- keep your imports & shared code as-is ---

// ---------- Chart 2: Donut (Total Opened) ----------
const donutData = [
  { key: "P1" as PriorityKey, name: "Critical (P1)", value: 8 },
  { key: "P2" as PriorityKey, name: "High (P2)", value: 78 },
  { key: "P3" as PriorityKey, name: "Medium (P3)", value: 22 },
  { key: "P4" as PriorityKey, name: "Low (P4)", value: 28 },
];
const totalOpened = donutData.reduce((s, d) => s + d.value, 0);

const PercentageLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#FFFFFF"
      textAnchor="middle"
      dominantBaseline="central"
      fontWeight={700}
      fontSize={12}
      style={{
        paintOrder: "stroke",
        stroke: "rgba(0,0,0,0.25)",
        strokeWidth: 3,
        strokeLinejoin: "round",
      }}
    >
      {`${Math.round(percent * 100)}%`}
    </text>
  );
};

export function PriorityDonut() {
  // Animate the center number on mount
  const [displayTotal, setDisplayTotal] = React.useState(0);
  React.useEffect(() => {
    const start = performance.now();
    const duration = 900; // ms
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayTotal(Math.round(totalOpened * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const { dept, cat } = rechartDummies;

  return (
    <div className="tech-container min-h-[400px]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Text.SmallHeading>Open Issue count</Text.SmallHeading>
          <Text.Paragraph className="text-gray-400 text-sm">
            Current number of unresolved tickets
          </Text.Paragraph>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Dropdown>
            <Dropdown.Trigger className="flex items-center justify-between">
              Department
            </Dropdown.Trigger>

            <Dropdown.Content>
              {dept.map((de, i) => (
                <Dropdown.Item key={i}>{de}</Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>
          <Dropdown>
            <Dropdown.Trigger className="flex items-center justify-between">
              Category
            </Dropdown.Trigger>

            <Dropdown.Content>
              {cat.map((de, i) => (
                <Dropdown.Item key={i}>{de}</Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-[1fr_0.4fr] w-full items-center p-4 gap-4">
        <div className="flex-1 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={"58%"}
                outerRadius={"82%"}
                paddingAngle={2}
                labelLine={false}
                label={<PercentageLabel />}
                // --- animation props ---
                isAnimationActive
                animationBegin={0}
                animationDuration={900}
                animationEasing="ease-out"
              >
                {donutData.map((d, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[d.key]} />
                ))}
              </Pie>

              {/* center label (animated count) */}
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={32}
                fontWeight={800}
                fill="#111827"
              >
                {displayTotal}
              </text>
              <text
                x="50%"
                y="50%"
                dy={22}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={12}
                fill="#6B7280"
                fontWeight={600}
              >
                Total Opened
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="">
          {donutData.map((d) => (
            <div key={d.key} className="flex items-center gap-2">
              <Dot color={COLORS[d.key]} />
              <div
                style={{ fontWeight: 600, minWidth: 140 }}
                className="text-xs"
              >
                {PRIO_LABEL[d.key]}
              </div>
              <div style={{ color: "#6B7280" }} className="text-xs">
                {d.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
const data = [
  { name: "Jan", uv: 1200, pv: 900, amt: 1100 },
  { name: "Feb", uv: 1050, pv: 250, amt: 1180 },
  { name: "Mar", uv: 1200, pv: 900, amt: 1400 },
  { name: "Apr", uv: 1050, pv: 300, amt: 1600 },
  { name: "May", uv: 1900, pv: 950, amt: 1780 },
  { name: "Jun", uv: 2100, pv: 450, amt: 1950 },
  { name: "Jul", uv: 2250, pv: 900, amt: 2100 },
  { name: "Aug", uv: 2400, pv: 400, amt: 2250 },
  { name: "Sep", uv: 2000, pv: 800, amt: 2050 },
  { name: "Oct", uv: 1850, pv: 900, amt: 1880 },
  { name: "Nov", uv: 1650, pv: 200, amt: 1680 },
  { name: "Dec", uv: 1800, pv: 950, amt: 1900 },
];

export const VolumeCharts = () => {
  const color = Cookies.get("app-theme");
  // console.log();

  const { dept, priority } = rechartDummies;

  const primaryColor = color && JSON.parse(color as string)?.primary;
  return (
    <div className="tech-container p-4">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
        }}
        className=""
      >
        <div>
          <Text.SmallHeading className="text-lg font-semibold">
            Issue Volume Trend
          </Text.SmallHeading>

          <div className="flex items-center gap-2">
            <Text.Paragraph className="text-xs text-gray-400">
              Ticket creation Volume over time
            </Text.Paragraph>
            <StatusItem
              status="resolved"
              name="21%"
              icon
              iconComponent={
                <Image
                  src={LOCAL_ICONS.incIcon}
                  alt="Inc or dec icon"
                  height={16}
                  width={16}
                />
              }
            />
            <Text.Paragraph className="text-xs text-gray-400">
              Since last year
            </Text.Paragraph>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Dropdown className="">
            <Dropdown.Trigger className="flex items-center justify-between">
              Department
            </Dropdown.Trigger>
            <Dropdown.Content>
              {dept.map((de, i) => (
                <Dropdown.Item key={i}>{de}</Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>
          <Dropdown className="">
            <Dropdown.Trigger className="flex items-center justify-between">
              Priority
            </Dropdown.Trigger>

            <Dropdown.Content>
              {priority.map((de, i) => (
                <Dropdown.Item key={i}>{de}</Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>

          <SlideToggler
            slides={["Daily", "Weekly", "Monthly"]}
            paramKey="timeFrame"
          />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          width={500}
          height={200}
          data={data}
          syncId="anyId"
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="pv"
            stroke={primaryColor?.[900]}
            fill={primaryColor?.[500]}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function IncidentOverview() {
  return (
    <TableOverflow className="grid grid-cols-2 gap-4 !min-h-[400px]">
      <PriorityDonut />
      <BacklogOfOverdueIncidents fullLog={false} />
    </TableOverflow>
  );
}

export const LengthRep = () => {
  const { dept, cat } = rechartDummies;
  return (
    <div className="tech-container flex-col flex gap-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Text.SmallHeading>SLA compliance rate</Text.SmallHeading>
          <Text.Paragraph className="text-gray-400 text-sm">
            Percentage of resolved Ticket within SLA time limits
          </Text.Paragraph>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div className="">
            <div className="flex items-center gap-1">
              <Dot color={COLORS.P4} />
              <p className="text-sm">poor</p>
            </div>
            <p className="text-sm">P4: 4hrs</p>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <Dot color={COLORS.P3} />
              <p className="text-sm">fair</p>
            </div>
            <p className="text-sm">P3: 3hrs</p>
          </div>
          <div className="mr-2">
            <div className="flex items-center ">
              <Dot color={COLORS.P2} />
              <p className="text-sm">Excellent</p>
            </div>
            <p className="text-sm">P2: 6hrs</p>
          </div>
          <div>
            <div className="flex items-center">
              <Dot color={COLORS.P1} />
              <p className="text-sm">good</p>
            </div>
            <p className="text-sm">P1: 2hrs</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Dropdown>
            <Dropdown.Trigger className="flex items-center justify-between">
              Department
            </Dropdown.Trigger>

            <Dropdown.Content className="min-w-[160px]">
              {dept.map((de, i) => (
                <Dropdown.Item key={i}>{de}</Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>
          <Dropdown>
            <Dropdown.Trigger className="flex items-center justify-between">
              Category
            </Dropdown.Trigger>

            <Dropdown.Content className="min-w-[140px]">
              {cat.map((de, i) => (
                <Dropdown.Item key={i}>{de}</Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>
        </div>
      </div>

      {donutData?.map((dn, i) => (
        <div key={i} className="flex gap-2">
          <Text.Paragraph>{dn.key}</Text.Paragraph>
          <RangeBar
            currentRange={dn.value}
            fullRange={100}
            color={COLORS[dn.key as "P1" | "P2" | "P3" | "P4"]} // optional
            durationMs={900}
          />
          <Text.Paragraph>{dn.value}%</Text.Paragraph>
        </div>
      ))}
    </div>
  );
};

type RangeBarProps = {
  currentRange: number; // e.g. 42
  fullRange: number; // e.g. 100
  color?: string; // tailwind or hex, default uses brand
  durationMs?: number; // animation duration
};

export const RangeBar: React.FC<RangeBarProps> = ({
  currentRange,
  fullRange,
  color = "#2563EB", // fallback blue-600
  durationMs = 900,
}) => {
  const clamp = (n: number, min = 0, max = 100) =>
    Math.min(max, Math.max(min, n));
  const targetPct = clamp((currentRange / Math.max(1, fullRange)) * 100);

  const [pct, setPct] = React.useState(0);

  // Animate on mount & whenever the value changes
  React.useEffect(() => {
    // Respect reduced motion
    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;
    if (prefersReduced) {
      setPct(targetPct);
      return;
    }

    // set to 0 first (if you want to re-trigger), then move to target on next frame
    setPct(0);
    const raf = requestAnimationFrame(() => setPct(targetPct));
    return () => cancelAnimationFrame(raf);
  }, [targetPct]);

  return (
    <div
      className="h-6 w-full rounded-lg bg-gray-200 overflow-hidden"
      aria-label="progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
    >
      <div
        className="h-full rounded-lg"
        style={{
          width: `${pct}%`,
          background: color,
          transition: `width ${durationMs}ms ease-out`,
        }}
      />
    </div>
  );
};
