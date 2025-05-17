"use client"

import { useEffect, useState } from "react"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Search, Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
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
import AddTrainerForm from "@/components/dashboard/trainers/add-trainer-form"
import { trainersAPI } from "@/lib/api"

// DataTable component
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
          placeholder="Filter trainers..."
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
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
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
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
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
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} trainer(s) selected.
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function TrainersPage() {
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddTrainerDialog, setShowAddTrainerDialog] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    avgRating: 0,
  })

  useEffect(() => {
    fetchTrainers()
  }, [])

  const fetchTrainers = async () => {
    try {
      setLoading(true)
      const data = await trainersAPI.getAll()

      // Add avatar initials
      const trainersWithAvatars = data.map((trainer) => ({
        ...trainer,
        avatarInitials: trainer.name
          .split(" ")
          .map((n) => n[0])
          .join(""),
      }))

      setTrainers(trainersWithAvatars)

      // Calculate stats
      const totalTrainers = data.length
      const activeTrainers = data.filter((trainer) => trainer.status === "active").length
      const inactiveTrainers = data.filter((trainer) => trainer.status === "inactive").length

      // Calculate average rating
      const totalRating = data.reduce((sum, trainer) => sum + trainer.rating, 0)
      const avgRating = totalRating / totalTrainers || 0

      setStats({
        total: totalTrainers,
        active: activeTrainers,
        inactive: inactiveTrainers,
        avgRating: avgRating.toFixed(1),
      })

      setError(null)
    } catch (err) {
      setError("Failed to fetch trainers. Please try again later.")
      toast.error("Failed to fetch trainers. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddTrainer = (newTrainer) => {
    setShowAddTrainerDialog(false)
    fetchTrainers() // Refresh the trainers list
  }

  const handleDeleteTrainer = async (id) => {
    if (confirm("Are you sure you want to delete this trainer?")) {
      try {
        await trainersAPI.delete(id)
        toast.success("Trainer deleted successfully")
        fetchTrainers()
      } catch (err) {
        toast.error("Failed to delete trainer. Please try again.")
      }
    }
  }

  const columns = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const avatarInitials = row.original.avatarInitials || ""

        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`/placeholder.svg?height=32&width=32&text=${avatarInitials}`}
                alt={row.getValue("name")}
              />
              <AvatarFallback>{avatarInitials}</AvatarFallback>
            </Avatar>
            <div>{row.getValue("name")}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "specialties",
      header: "Specialties",
      cell: ({ row }) => {
        const specialties = row.getValue("specialties")
        return (
          <div className="flex flex-wrap gap-1">
            {specialties.map((specialty, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        )
      },
    },
    {
      accessorKey: "experience",
      header: "Experience",
      cell: ({ row }) => <div>{row.getValue("experience")}</div>,
    },
    {
      accessorKey: "rating",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Rating
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const rating = row.getValue("rating")
        return (
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
            <span>{rating.toFixed(1)}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status")
        return (
          <Badge variant={status === "active" ? "default" : "secondary"}>
            {status === "active" ? "Active" : "Inactive"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "classes",
      header: "Classes",
      cell: ({ row }) => <div className="text-center">{row.getValue("classes")}</div>,
    },
    {
      accessorKey: "clients",
      header: "Clients",
      cell: ({ row }) => <div className="text-center">{row.getValue("clients")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const trainer = row.original

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(trainer.id)}>
                Copy trainer ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View profile</DropdownMenuItem>
              <DropdownMenuItem>Edit trainer</DropdownMenuItem>
              <DropdownMenuItem>View classes</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDeleteTrainer(trainer.id)} className="text-destructive">
                Delete trainer
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
        label: "Add Trainer",
        onClick: () => setShowAddTrainerDialog(true),
      }}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Trainers</h1>
          <p className="text-muted-foreground">Manage your gym trainers and their schedules.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Trainers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Across all specialties</p>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Trainers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.active / stats.total) * 100).toFixed(1)}% of total trainers
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-2xl font-bold">
                {stats.avgRating}
                <Star className="ml-1 h-5 w-5 fill-primary text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Based on member feedback</p>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trainers.reduce((sum, trainer) => sum + trainer.classes, 0)}</div>
              <p className="text-xs text-muted-foreground">Scheduled this week</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Trainers</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search trainers..." className="w-[250px] pl-8 md:w-[300px]" />
            </div>
          </div>
          {loading ? (
            <LoadingState message="Loading trainers..." />
          ) : error ? (
            <div className="mt-4 rounded-md border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
              {error}
            </div>
          ) : (
            <>
              <TabsContent value="all" className="mt-4">
                <DataTable columns={columns} data={trainers} />
              </TabsContent>
              <TabsContent value="active" className="mt-4">
                <DataTable columns={columns} data={trainers.filter((t) => t.status === "active")} />
              </TabsContent>
              <TabsContent value="inactive" className="mt-4">
                <DataTable columns={columns} data={trainers.filter((t) => t.status === "inactive")} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      <Dialog open={showAddTrainerDialog} onOpenChange={setShowAddTrainerDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Trainer</DialogTitle>
            <DialogDescription>Enter the details of the new trainer. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <AddTrainerForm onSuccess={handleAddTrainer} onCancel={() => setShowAddTrainerDialog(false)} />
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
