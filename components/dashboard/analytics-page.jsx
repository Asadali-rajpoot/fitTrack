"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, CreditCard, DollarSign, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { LoadingState } from "@/components/dashboard/design/loading-spinner";
import AppLayout from "@/components/dashboard/layout/app-layout";
import { analyticsAPI } from "@/lib/api";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState("month");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsAPI.getAll();
      setAnalytics(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch analytics data. Please try again later.");
      toast.error(err.message || "Failed to load analytics data.");
      if (err.message.includes("401")) {
        router.push("/auth/login");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <LoadingState message="Loading analytics data..." />
      </AppLayout>
    );
  }

  if (error || !analytics) {
    return (
      <AppLayout>
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
          {error || "Failed to load analytics data"}
        </div>
      </AppLayout>
    );
  }

  const filterDataByTimeRange = (data, key) => {
    const today = new Date();
    let startDate;
    switch (timeRange) {
      case "week":
        startDate = new Date(today.setDate(today.getDate() - 7));
        break;
      case "month":
        startDate = new Date(today.setDate(today.getDate() - 30));
        break;
      case "quarter":
        startDate = new Date(today.setDate(today.getDate() - 90));
        break;
      case "year":
        startDate = new Date(today.setDate(today.getDate() - 365));
        break;
      default:
        startDate = new Date(today.setDate(today.getDate() - 30));
    }
    return data[key]?.filter((item) => new Date(item.date) >= startDate);
  };

  const revenueData = filterDataByTimeRange(analytics, "memberGrowth")?.map((item) => ({
    date: item.date,
    value: item.count * 100, // Mock revenue: $100 per member
  }));

  const memberGrowthData = filterDataByTimeRange(analytics, "memberGrowth");
  const attendanceData = filterDataByTimeRange(analytics, "dailyAttendance");
  const classAttendanceData = analytics.classAttendance;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const revenueChartData = {
    labels: revenueData?.map((d) => new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })),
    datasets: [
      {
        label: "Revenue ($)",
        data: revenueData?.map((d) => d.value),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
    ],
  };

  const membersChartData = {
    labels: memberGrowthData?.map((d) => new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })),
    datasets: [
      {
        label: "New Members",
        data: memberGrowthData?.map((d) => d.count),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const attendanceChartData = {
    labels: attendanceData?.map((d) => new Date(d.date).toLocaleDateString("en-US", { weekday: "short" })),
    datasets: [
      {
        label: "Attendance (%)",
        data: attendanceData?.map((d) => d.attendance),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgb(153, 102, 255)",
        borderWidth: 1,
      },
    ],
  };

  const classesChartData = {
    labels: classAttendanceData?.map((c) => c.name),
    datasets: [
      {
        label: "Attendance (%)",
        data: classAttendanceData?.map((c) => c.attendance),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgb(255, 159, 64)",
        borderWidth: 1,
      },
    ],
  };

  const membershipDistribution = {
    basic: Math.floor(analytics.totalMembers * 0.4),
    standard: Math.floor(analytics.totalMembers * 0.35),
    premium: Math.floor(analytics.totalMembers * 0.25),
  };

  const membershipPieChartData = {
    labels: ["Basic", "Standard", "Premium"],
    datasets: [
      {
        data: [membershipDistribution.basic, membershipDistribution.standard, membershipDistribution.premium],
        backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)"],
        borderColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(255, 206, 86)"],
        borderWidth: 1,
      },
    ],
  };

  const peakHoursData = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 6;
    const attendance = hour >= 9 && hour <= 11 ? 80 + Math.random() * 20 : hour >= 16 && hour <= 19 ? 80 + Math.random() * 20 : 30 + Math.random() * 40;
    return { hour, attendance };
  });

  const peakHoursChartData = {
    labels: peakHoursData?.map((d) => `${d.hour % 12 === 0 ? 12 : d.hour % 12}${d.hour < 12 ? "am" : "pm"}`),
    datasets: [
      {
        label: "Attendance (%)",
        data: peakHoursData?.map((d) => Math.round(d.attendance)),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
    ],
  };

  const retentionData = [
    { duration: "<1m", value: 20 },
    { duration: "1-3m", value: 30 },
    { duration: "3-6m", value: 25 },
    { duration: "6-12m", value: 15 },
    { duration: ">12m", value: 10 },
  ];

  const retentionChartData = {
    labels: retentionData?.map((d) => d.duration),
    datasets: [
      {
        label: "Members (%)",
        data: retentionData?.map((d) => d.value),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
              <p className="text-muted-foreground">Track your gym's performance and growth metrics.</p>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="quarter">Last 90 days</SelectItem>
                <SelectItem value="year">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${revenueData.reduce((sum, d) => sum + d.value, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-500">+10%</span> from last period
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">New Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {memberGrowthData.reduce((sum, d) => sum + d.count, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-500">+12%</span> from last period
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Class Attendance</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {classAttendanceData.reduce((sum, c) => sum + c.attendance, 0).toLocaleString()}%
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-500">+5%</span> from last period
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg. Transaction</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(revenueData.reduce((sum, d) => sum + d.value, 0) / (memberGrowthData.length || 1)).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-500">+2.5%</span> from last period
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue" className="w-full">
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
          </TabsList>
          <TabsContent value="revenue" className="mt-4">
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Revenue breakdown for the selected period</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <Bar data={revenueChartData} options={chartOptions} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="members" className="mt-4">
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Membership Growth</CardTitle>
                <CardDescription>New members over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <Line data={membersChartData} options={chartOptions} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="attendance" className="mt-4">
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Attendance Trends</CardTitle>
                <CardDescription>Daily attendance patterns</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <Bar data={attendanceChartData} options={chartOptions} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="classes" className="mt-4">
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Class Popularity</CardTitle>
                <CardDescription>Attendance by class</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <Bar data={classesChartData} options={chartOptions} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Membership Distribution</CardTitle>
              <CardDescription>Breakdown by membership type</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Pie data={membershipPieChartData} options={chartOptions} />
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Peak Hours</CardTitle>
              <CardDescription>Gym attendance by time of day</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Bar data={peakHoursChartData} options={chartOptions} />
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Member Retention</CardTitle>
              <CardDescription>Membership duration statistics</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Bar data={retentionChartData} options={chartOptions} />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}