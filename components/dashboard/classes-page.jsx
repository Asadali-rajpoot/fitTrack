"use client"

import { useEffect, useState } from "react"
import { ArrowUpDown, ChevronDown, Clock, MoreHorizontal, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LoadingState } from "@/components/dashboard/design/loading-spinner"
import AppLayout from "@/components/dashboard/layout/app-layout"
import { classesAPI, trainersAPI } from "@/lib/api"

// DataTable component adapted from DataTableDemo
function DataTable({ columns, data }) {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter classes..."
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} class(es)
          selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ClassesPage() {
  const [showAddClassDialog, setShowAddClassDialog] = useState(false)
  const [date, setDate] = useState(new Date())
  const [classes, setClasses] = useState([])
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    instructors: 0,
    avgAttendance: 0,
    mostPopular: "",
  })

  // Form state for new class
  const [formData, setFormData] = useState({
    name: "",
    instructorId: "",
    type: "",
    day: "",
    time: "",
    duration: "",
    capacity: "",
    room: "",
  })

  useEffect(() => {
    fetchClasses()
    fetchTrainers()
  }, [])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const data = await classesAPI.getAll()

      // Add instructor avatar initials
      const classesWithAvatars = data.map((cls) => ({
        ...cls,
        instructorAvatar: cls.instructor
          .split(" ")
          .map((n) => n[0])
          .join(""),
      }))

      setClasses(classesWithAvatars)

      // Calculate stats
      const totalClasses = data.length
      const uniqueInstructors = new Set(data.map((cls) => cls.instructorId)).size

      // Calculate average attendance percentage
      const totalAttendancePercentage = data.reduce((sum, cls) => {
        return sum + (cls.enrolled / cls.capacity) * 100
      }, 0)
      const avgAttendance = Math.round(totalAttendancePercentage / totalClasses) || 0

      // Find most popular class
      let mostPopularClass = data[0]
      data.forEach((cls) => {
        if (cls.enrolled / cls.capacity > (mostPopularClass?.enrolled / mostPopularClass?.capacity || 0)) {
          mostPopularClass = cls
        }
      })

      setStats({
        total: totalClasses,
        instructors: uniqueInstructors,
        avgAttendance: avgAttendance,
        mostPopular: mostPopularClass?.name || "",
      })

      setError(null)
    } catch (err) {
      setError("Failed to fetch classes. Please try again later.")
      // Fix: Use toast correctly for sonner
      toast.error("Failed to fetch classes. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const fetchTrainers = async () => {
    try {
      const data = await trainersAPI.getAll()
      setTrainers(data.map((trainer) => ({ id: trainer.id, name: trainer.name })))
    } catch (err) {
      // Fix: Use toast correctly for sonner
      toast.error("Failed to fetch trainers. Some features may be limited.")
    }
  }

  const handleCreateClass = async () => {
    try {
      // Find the instructor name from the selected ID
      const instructor = trainers.find((t) => t.id === formData.instructorId)?.name || ""

      const newClass = {
        name: formData.name,
        instructor: instructor,
        instructorId: formData.instructorId,
        type: formData.type,
        day: formData.day,
        time: formData.time,
        duration: formData.duration,
        capacity: Number.parseInt(formData.capacity),
        room: formData.room,
        status: "scheduled",
      }

      await classesAPI.create(newClass)
      // Fix: Use toast correctly for sonner
      toast.success("Class created successfully")
      setShowAddClassDialog(false)
      resetForm()
      fetchClasses()
    } catch (err) {
      // Fix: Use toast correctly for sonner
      toast.error("Failed to create class. Please try again.")
    }
  }

  const handleDeleteClass = async (id) => {
    if (confirm("Are you sure you want to delete this class?")) {
      try {
        await classesAPI.delete(id)
        // Fix: Use toast correctly for sonner
        toast.success("Class deleted successfully")
        fetchClasses()
      } catch (err) {
        // Fix: Use toast correctly for sonner
        toast.error("Failed to delete class. Please try again.")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      instructorId: "",
      type: "",
      day: "",
      time: "",
      duration: "",
      capacity: "",
      room: "",
    })
  }

  const columns = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Class Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "instructor",
      header: "Instructor",
      cell: ({ row }) => {
        const avatar = row.original.instructorAvatar || ""

        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`/placeholder.svg?height=32&width=32&text=${avatar}`}
                alt={row.getValue("instructor")}
              />
              <AvatarFallback>{avatar}</AvatarFallback>
            </Avatar>
            <div>{row.getValue("instructor")}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type")
        const typeColorMap = {
          Cardio: "bg-red-500",
          Yoga: "bg-purple-500",
          Strength: "bg-blue-500",
          Core: "bg-yellow-500",
          Combat: "bg-orange-500",
          Dance: "bg-pink-500",
          Mind: "bg-green-500",
        }

        return (
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${typeColorMap[type] || "bg-gray-500"}`} />
            <span>{type}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "day",
      header: "Day",
      cell: ({ row }) => <div>{row.getValue("day")}</div>,
    },
    {
      accessorKey: "time",
      header: "Time",
      cell: ({ row }) => <div>{row.getValue("time")}</div>,
    },
    {
      accessorKey: "enrolled",
      header: "Enrollment",
      cell: ({ row }) => {
        const enrolled = row.getValue("enrolled")
        const capacity = row.original.capacity
        const percentage = (enrolled / capacity) * 100

        return (
          <div className="flex items-center gap-2">
            <div className="w-24 bg-muted rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  percentage >= 90 ? "bg-red-500" : percentage >= 70 ? "bg-yellow-500" : "bg-green-500"
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <span className="text-xs">
              {enrolled}/{capacity}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status")
        const statusMap = {
          scheduled: { label: "Scheduled", variant: "outline" },
          "in-progress": { label: "In Progress", variant: "default" },
          completed: { label: "Completed", variant: "secondary" },
          cancelled: { label: "Cancelled", variant: "destructive" },
        }

        return <Badge variant={statusMap[status].variant}>{statusMap[status].label}</Badge>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const gymClass = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit class</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View attendees</DropdownMenuItem>
              <DropdownMenuItem>Manage waitlist</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDeleteClass(gymClass.id)} className="text-destructive">
                Cancel class
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <AppLayout
      action={{
        label: "Add Class",
        onClick: () => setShowAddClassDialog(true),
      }}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground">Manage your gym classes, schedules, and instructor assignments.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-500">+4</span> new this week
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Instructors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.instructors}</div>
              <p className="text-xs text-muted-foreground">Across all classes</p>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgAttendance}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-500">+3%</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Most Popular Class</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.mostPopular}</div>
              <p className="text-xs text-muted-foreground">Based on enrollment rate</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>
          </div>
          {loading ? (
            <LoadingState message="Loading classes..." />
          ) : error ? (
            <div className="mt-4 rounded-md border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
              {error}
            </div>
          ) : (
            <>
              <TabsContent value="list" className="mt-4">
                <DataTable columns={columns} data={classes} />
              </TabsContent>
              <TabsContent value="calendar" className="mt-4">
                <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-5">
                  <Card className="col-span-3 border-border/40 bg-card/50 backdrop-blur-sm md:col-span-3 lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Calendar</CardTitle>
                      <CardDescription>Select a date to view classes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                      />
                    </CardContent>
                  </Card>
                  <Card className="col-span-4 border-border/40 bg-card/50 backdrop-blur-sm md:col-span-4 lg:col-span-3">
                    <CardHeader>
                      <CardTitle>
                        Classes for{" "}
                        {date?.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {classes
                          .filter((c) => c.day === date?.toLocaleDateString(undefined, { weekday: "long" }))
                          .map((classItem, i) => (
                            <div key={i} className="flex items-center gap-4 rounded-lg border border-border/40 p-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                <Clock className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium">{classItem.name}</p>
                                  <Badge variant="outline">{classItem.type}</Badge>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                      {classItem.time} ({classItem.duration})
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    <span>
                                      {classItem.enrolled}/{classItem.capacity}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        {classes.filter((c) => c.day === date?.toLocaleDateString(undefined, { weekday: "long" }))
                          .length === 0 && (
                          <div className="flex h-40 items-center justify-center rounded-lg border border-border/40 p-4">
                            <p className="text-sm text-muted-foreground">No classes scheduled for this day.</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      <Dialog open={showAddClassDialog} onOpenChange={setShowAddClassDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Class</DialogTitle>
            <DialogDescription>Enter the details of the new class. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="className">Class Name</Label>
              <Input
                id="className"
                placeholder="Class name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Select
                  value={formData.instructorId}
                  onValueChange={(value) => setFormData({ ...formData, instructorId: value })}
                >
                  <SelectTrigger id="instructor">
                    <SelectValue placeholder="Select instructor" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainers.map((trainer) => (
                      <SelectItem key={trainer.id} value={trainer.id}>
                        {trainer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Class Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cardio">Cardio</SelectItem>
                    <SelectItem value="Strength">Strength</SelectItem>
                    <SelectItem value="Yoga">Yoga</SelectItem>
                    <SelectItem value="Core">Core</SelectItem>
                    <SelectItem value="Combat">Combat</SelectItem>
                    <SelectItem value="Dance">Dance</SelectItem>
                    <SelectItem value="Mind">Mind</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="day">Day</Label>
                <Select value={formData.day} onValueChange={(value) => setFormData({ ...formData, day: value })}>
                  <SelectTrigger id="day">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monday">Monday</SelectItem>
                    <SelectItem value="Tuesday">Tuesday</SelectItem>
                    <SelectItem value="Wednesday">Wednesday</SelectItem>
                    <SelectItem value="Thursday">Thursday</SelectItem>
                    <SelectItem value="Friday">Friday</SelectItem>
                    <SelectItem value="Saturday">Saturday</SelectItem>
                    <SelectItem value="Sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  placeholder="e.g. 10:00 AM"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g. 45 min"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  placeholder="e.g. 20"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="room">Room</Label>
              <Select value={formData.room} onValueChange={(value) => setFormData({ ...formData, room: value })}>
                <SelectTrigger id="room">
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Studio A">Studio A</SelectItem>
                  <SelectItem value="Studio B">Studio B</SelectItem>
                  <SelectItem value="Weights Room">Weights Room</SelectItem>
                  <SelectItem value="Spin Studio">Spin Studio</SelectItem>
                  <SelectItem value="Boxing Area">Boxing Area</SelectItem>
                  <SelectItem value="CrossFit Area">CrossFit Area</SelectItem>
                  <SelectItem value="TRX Area">TRX Area</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddClassDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleCreateClass}>
              Save Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
