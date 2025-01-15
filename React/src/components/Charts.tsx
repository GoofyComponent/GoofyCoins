import React from "react";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", eth: 1200, btc: 35000 },
  { month: "February", eth: 1300, btc: 36000 },
  { month: "March", eth: 1250, btc: 34000 },
  { month: "April", eth: 1400, btc: 37000 },
  { month: "May", eth: 1500, btc: 38000 },
  { month: "June", eth: 1450, btc: 37500 },
  { month: "July", eth: 1600, btc: 39000 },
  { month: "August", eth: 1550, btc: 38500 },
  { month: "September", eth: 1650, btc: 40000 },
  { month: "October", eth: 1700, btc: 41000 },
  { month: "November", eth: 1750, btc: 42000 },
  { month: "December", eth: 1800, btc: 43000 },
];

const chartConfig = {
  eth: {
    label: "ETH",
    color: "hsl(var(--chart-1))",
  },
  btc: {
    label: "BTC",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function Charts() {
  return (
    <ChartContainer config={chartConfig} className="h-full">
      <AreaChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />

        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Area
          dataKey="btc"
          type="natural"
          fill="var(--color-btc)"
          fillOpacity={0.4}
          stroke="var(--color-btc)"
          stackId="a"
        />
        <Area
          dataKey="eth"
          type="natural"
          fill="var(--color-eth)"
          fillOpacity={0.4}
          stroke="var(--color-eth)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
