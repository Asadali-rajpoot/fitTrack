"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Activity,
  Calendar,
  Clock,
  Dumbbell,
  Flame,
  Heart,
  MoreHorizontal,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingState } from "@/components/dashboard/design/loading-spinner";
import AppLayout from "@/components/dashboard/layout/app-layout";
import { analyticsAPI, classesAPI, membersAPI } from "@/lib/api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const router = useRouter();
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [recentMembers, setRecentMembers] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState({
    members: true,
    classes: true,
    analytics: true,
  });
  const [error, setError] = useState({
    members: false,
    classes: false,
    analytics: false,
  });

  useEffect(() => {
    // Fetch recent members
    const fetchMembers = async () => {
      try {
        const allMembers = await membersAPI.getAll();
        // Sort by join date (newest first) and take the first 4
        const sortedMembers = [...allMembers]
          .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
          .slice(0, 4);
        setRecentMembers(sortedMembers);
        setLoading((prev) => ({ ...prev, members: false }));
      } catch (err) {
        console.error("Error fetching members:", err);
        setError((prev) => ({ ...prev, members: true }));
        setLoading((prev) => ({ ...prev, members: false }));
        toast.error(err.message || "Failed to load members.");
        if (err.message.includes("401")) {
          router.push("/auth/login");
        }
      }
    };

    // Fetch upcoming classes
    const fetchClasses = async () => {
      try {
        const allClasses = await classesAPI.getAll();
        // Filter classes within the next 7 days and take the first 4
        const today = new Date();
        const sevenDaysLater = new Date();
        sevenDaysLater.setDate(today.getDate() + 7);
        const scheduledClasses = allClasses
          .filter(
            (c) =>
              c.date &&
              new Date(c.date) >= today &&
              new Date(c.date) <= sevenDaysLater &&
              c.status === "scheduled"
          )
          .slice(0, 4)
          .map((c) => ({
            ...c,
            badgeVariant: c.status === "in-progress" ? "default" : "outline",
          }));
        setUpcomingClasses(scheduledClasses);
        setLoading((prev) => ({ ...prev, classes: false }));
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError((prev) => ({ ...prev, classes: true }));
        setLoading((prev) => ({ ...prev, classes: false }));
        toast.error(err.message || "Failed to load classes.");
        if (err.message.includes("401")) {
          router.push("/auth/login");
        }
      }
    };

    // Fetch analytics
    const fetchAnalytics = async () => {
      try {
        const analyticsData = await analyticsAPI.getAll();
        setAnalytics(analyticsData);
        setLoading((prev) => ({ ...prev, analytics: false }));
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError((prev) => ({ ...prev, analytics: true }));
        setLoading((prev) => ({ ...prev, analytics: false }));
        toast.error(err.message || "Failed to load analytics.");
        if (err.message.includes("401")) {
          router.push("/auth/login");
        }
      }
    };

    fetchMembers();
    fetchClasses();
    fetchAnalytics();
  }, [router]);

  // Activity chart data
  const activityChartData = {
    labels: analytics?.dailyAttendance?.map((a) => {
      const date = new Date(a.date);
      return date.toLocaleDateString("en-US", { weekday: "short" });
    }) || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Attendance (%)",
        data: analytics?.dailyAttendance?.map((a) => a.attendance) || [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  return (
    <AppLayout
      action={{
        label: "New Member",
        onClick: () => setShowAddMemberDialog(true),
      }}
    >
      <div className="flex flex-col w-full gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your gym's performance.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {loading.analytics ? (
            Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="border-border/40 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Loading...</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 w-24 animate-pulse rounded-md bg-muted"></div>
                  </CardContent>
                </Card>
              ))
          ) : error.analytics ? (
            <Card className="col-span-4 border-border/40 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">Failed to load analytics data. Please try again.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalMembers.toLocaleString() || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-emerald-500">+{analytics?.memberGrowth.length || 0}</span> new this month
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalClasses || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-emerald-500">+{analytics?.classAttendance.length || 0}</span> scheduled
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Trainers</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalTrainers || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-emerald-500">+{analytics?.trainerPerformance.length || 0}</span> active
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                  <Flame className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics?.classAttendance.length > 0
                      ? Math.round(
                          analytics.classAttendance.reduce((sum, c) => sum + c.attendance, 0) /
                            analytics.classAttendance.length
                        ) + "%"
                      : "0%"}
                  </div>
                  <p className="text-xs text-muted-foreground">Average this week</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm lg:col-span-4">
            <CardHeader>
              <CardTitle>Member Activity</CardTitle>
              <CardDescription>Daily gym attendance over the past week</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[200px] sm:h-[300px]">
                {loading.analytics || error.analytics ? (
                  <p className="text-center text-muted-foreground">Loading attendance data...</p>
                ) : (
                  <Bar data={activityChartData} options={chartOptions} />
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm lg:col-span-3">
            <CardHeader>
              <CardTitle>Popular Classes</CardTitle>
              <CardDescription>Most attended classes this month</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.analytics ? (
                <LoadingState message="Loading class data..." />
              ) : error.analytics ? (
                <p className="text-center text-muted-foreground">Failed to load class data.</p>
              ) : analytics?.classAttendance.length === 0 ? (
                <p className="text-center text-muted-foreground">No class attendance data available.</p>
              ) : (
                <div className="space-y-4">
                  {analytics.classAttendance
                    .sort((a, b) => b.attendance - a.attendance)
                    .slice(0, 4)
                    .map((cls, i) => {
                      const icons = [
                        <Flame key="flame" className="h-4 w-4 text-rose-500" />,
                        <Heart key="heart" className="h-4 w-4 text-pink-500" />,
                        <Dumbbell key="dumbbell" className="h-4 w-4 text-purple-500" />,
                        <Activity key="activity" className="h-4 w-4 text-cyan-500" />,
                      ];
                      return (
                        <div key={cls.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {icons[i]}
                              <span className="text-sm font-medium">{cls.name}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{Math.round(cls.attendance)}%</span>
                          </div>
                          <Progress value={cls.attendance} className="h-2" />
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm lg:col-span-4">
            <Tabs defaultValue="upcoming">
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle>Classes</CardTitle>
                  <TabsList className="grid w-full max-w-[200px] grid-cols-2">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="popular">Popular</TabsTrigger>
                  </TabsList>
                </div>
              </CardHeader>
              <CardContent>
                <TabsContent value="upcoming" className="mt-0 space-y-4">
                  {loading.classes ? (
                    <LoadingState message="Loading classes..." />
                  ) : error.classes ? (
                    <p className="text-center text-muted-foreground">Failed to load class data.</p>
                  ) : upcomingClasses.length === 0 ? (
                    <p className="text-center text-muted-foreground">No upcoming classes found.</p>
                  ) : (
                    upcomingClasses.map((classItem, i) => {
                      const icons = {
                        Cardio: Flame,
                        Yoga: Heart,
                        Strength: Dumbbell,
                        Core: Activity,
                        Combat: Activity,
                        Dance: Activity,
                        Mind: Heart,
                        General: Activity,
                      };
                      const Icon = icons[classItem.type] || Activity;

                      return (
                        <div key={i} className="flex items-center gap-4 rounded-lg border border-border/40 p-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{classItem.name}</p>
                              <Badge variant={classItem.badgeVariant}>
                                {classItem.status === "in-progress" ? "In Progress" : "Scheduled"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{classItem.time || "TBD"}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{classItem.enrolled || 0} attendees</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })
                  )}
                </TabsContent>
                <TabsContent value="popular" className="mt-0 space-y-4">
                  {loading.analytics ? (
                    <LoadingState message="Loading popular classes..." />
                  ) : error.analytics ? (
                    <p className="text-center text-muted-foreground">Failed to load popular classes.</p>
                  ) : analytics?.classAttendance.length === 0 ? (
                    <p className="text-center text-muted-foreground">No popular classes found.</p>
                  ) : (
                    analytics.classAttendance
                      .sort((a, b) => b.attendance - a.attendance)
                      .slice(0, 4)
                      .map((cls, i) => {
                        const icons = {
                          Cardio: Flame,
                          Yoga: Heart,
                          Strength: Dumbbell,
                          Core: Activity,
                          Combat: Activity,
                          Dance: Activity,
                          Mind: Heart,
                          General: Activity,
                        };
                        const Icon = icons[cls.type] || Activity;

                        return (
                          <div
                            key={i}
                            className="flex items-center gap-4 rounded-lg border border-border/40 p-3"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">{cls.name}</p>
                                <Badge variant="outline">{Math.round(cls.attendance)}%</Badge>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{cls.time || "TBD"}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Members</CardTitle>
              <CardDescription>New members who joined this month</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.members ? (
                <LoadingState message="Loading members..." />
              ) : error.members ? (
                <p className="text-center text-muted-foreground">Failed to load member data.</p>
              ) : recentMembers.length === 0 ? (
                <p className="text-center text-muted-foreground">No recent members found.</p>
              ) : (
                <div className="space-y-4">
                  {recentMembers.map((member, i) => {
                    const initials = member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("");

                    return (
                      <div key={i} className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${initials}`} alt={member.name} />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View profile</DropdownMenuItem>
                            <DropdownMenuItem>Send message</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Edit membership</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/members")}>
                View All Members
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}