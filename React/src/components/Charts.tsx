import React, { use, useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, Loader } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { API } from "@/services/api";
import axios from "axios";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function Charts({
  height = "70vh",
  className,
}: {
  height?: string;
  className?: string;
}) {
  const [chartData, setChartData] = useState<{ date: string; value: number }[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>("90d");
  const [currency, setCurrency] = useState<string>("usd");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const today = new Date();

  const fetchChartData = async (): Promise<void> => {
    let startDate: string;
    let endDate: string = format(new Date(), "yyyy-MM-dd");

    // Déterminer les dates de début et de fin
    if (
      timeRange === "dateRange" &&
      dateRange &&
      dateRange.from &&
      dateRange.to
    ) {
      startDate = format(dateRange.from, "yyyy-MM-dd");
      endDate = format(dateRange.to, "yyyy-MM-dd");
    } else {
      let daysToSubtract = 90; // Valeur par défaut
      if (timeRange === "30d") {
        daysToSubtract = 30;
      } else if (timeRange === "7d") {
        daysToSubtract = 7;
      }
      startDate = format(addDays(new Date(), -daysToSubtract), "yyyy-MM-dd");
    }

    try {
      setLoading(true);
      setError(null);

      // Appel à l'API via le service `API`
      const response = await API.get<Record<string, Record<string, number>>>(
        `/eth/balances/${startDate}/${endDate}`
      );
      if (response.data) {
        const formattedData = Object.entries(response.data)
          .map(([key, value]) => ({
            date: key,
            value: value[currency] || 0, // Utiliser la clé `currency` pour extraire les valeurs
          }))
          .reverse();

        setChartData(formattedData);
      }
    } catch (err) {
      console.error("Error fetching chart data:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to fetch chart data.");
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [timeRange, currency, dateRange]);

  useEffect(() => {
    console.log("dateRange", dateRange);
  }, [dateRange]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{`Your wallet - ${currency.toUpperCase()} Data`}</CardTitle>
          <CardDescription>
            {`Showing ETH balances in ${currency.toUpperCase()} for the ${
              timeRange === "select"
                ? `selected date range`
                : timeRange === "90d"
                ? "last 3 months"
                : timeRange === "30d"
                ? "last 30 days"
                : "last 7 days"
            }.`}
          </CardDescription>
        </div>
        <div className="flex flex-col-reverse items-center gap-2 space-y-0 md:flex-row">
          {/* Date Range Selector */}
          {timeRange === "dateRange" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className="w-[280px] justify-start text-left font-normal"
                >
                  <CalendarIcon />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange as any}
                  numberOfMonths={2}
                  toDate={today}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                />
              </PopoverContent>
            </Popover>
          )}

          {/* Select for Time Range */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[200px] rounded-lg sm:ml-auto"
              aria-label="Select a time range"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
              <SelectItem value="dateRange" className="rounded-lg">
                Select a date range
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Select for Currency */}
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger
              className="w-[200px] rounded-lg"
              aria-label="Select a currency"
            >
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="usd" className="rounded-lg">
                USD
              </SelectItem>
              <SelectItem value="eur" className="rounded-lg">
                EUR
              </SelectItem>
              <SelectItem value="eth" className="rounded-lg">
                ETH
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading && (
          <div
            className="flex justify-center items-center w-full"
            style={{ height }}
          >
            <Loader className="w-8 h-8 animate-spin opacity-30" />
          </div>
        )}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto w-full"
            style={{ height }}
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={8}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="value"
                type="natural"
                fill="url(#fillDesktop)"
                stroke="var(--color-desktop)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
