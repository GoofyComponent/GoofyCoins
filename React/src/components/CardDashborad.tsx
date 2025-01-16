import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CartesianGrid, Dot, Line, LineChart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  Default: {
    label: "Default",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface CardDashboardProps {
  title: string;
  description: string;
  chartData?: { date: string; value: number }[]; // Universal data format
  dataKey?: string; // Key to dynamically extract the data (e.g., 'eth', 'price', etc.)
}

const CardDashboard: React.FC<CardDashboardProps> = ({
  title,
  description,
  chartData = [],
  dataKey = "value", // Default key for chart data
}) => {
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle className="text-2xl font-black">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 && (
          <ChartContainer config={chartConfig} className="h-[150px] w-full">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 24,
                left: 24,
                right: 24,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  const day = date.getDate();
                  const month = date.toLocaleString("fr-FR", {
                    month: "short",
                  });
                  return `${day} ${month}`;
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    nameKey="date"
                    hideLabel
                  />
                }
              />
              <Line
                dataKey={dataKey} // Dynamically bind the data key
                type="natural"
                stroke="var(--color-Default)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-Default)",
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default CardDashboard;
