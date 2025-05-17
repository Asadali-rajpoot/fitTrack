"use client"

import { useEffect, useState } from "react"
import { ArrowUpDown, MoreHorizontal, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { DataTable } from "@/components/ui/data-table"
import { LoadingState } from "@/components/dashboard/design/loading-spinner"
import AppLayout from "@/components/dashboard/layout/app-layout"
import { trainersAPI } from "@/lib/api"

export default function TrainersPage() {
  const [showAddTrainerDialog, setShowAddTrainerDialog] = useState(false)
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    avgRating: 0,
    topSpecialty: "",
  })

  // Form state for new trainer
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialties: "",
    experience: "",
    bio: "",
  })

  useEffect(() => {
    fetchTrainers()
  }, [])

  const fetchTrainers = async () => {
    try {
      setLoading(true)
      const data = await trainersAPI.getAll()
      setTrainers(data)

      // Calculate stats
      const totalTrainers = data.length
      const activeTrainers = data.filter((t) => t.status === "active").length

      // Calculate average rating
      const totalRating = data.reduce((sum, trainer) => sum + trainer.rating, 0)
      const avgRating = Math.round((totalRating / totalTrainers) * 10) / 10

      // Find top specialty
      const specialtyCounts = {}
      data.forEach((trainer) => {
        trainer.specialties.forEach((specialty) => {
          specialtyCounts[specialty] = (specialtyCounts[specialty] || 0) + 1
        })
      })

      let topSpecialty = ""
      let maxCount = 0
      Object.entries(specialtyCounts).forEach(([specialty, count]) => {
        if (count > maxCount) {
          maxCount = count
          topSpecialty = specialty
        }
      })

      setStats({
        total: totalTrainers,
        active: activeTrainers,
        avgRating: avgRating,
        topSpecialty: topSpecialty,
      })

      setError(null)
    } catch (err) {
      setError("Failed to fetch trainers. Please try again later.")
      toast.error({
        title: "Error",
        description: "Failed to fetch trainers. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTrainer = async () => {
    try {
      const specialtiesArray = formData.specialties
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s)

      const newTrainer = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        specialties: specialtiesArray,
        experience: formData.experience,
        bio: formData.bio,
        status: "active",
        rating: 5.0, // Default rating for new trainers
      }

      await trainersAPI.create(newTrainer)
      toast.success({
        title: "Success",
        description: "Trainer created successfully",
      })
      setShowAddTrainerDialog(false)
      resetForm()
      fetchTrainers()
    } catch (err) {
      toast.error({
        title: "Error",
        description: "Failed to create trainer. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTrainer = async (id) => {
    if (confirm("Are you sure you want to delete this trainer?")) {
      try {
        await trainersAPI.delete(id)
        toast.success({
          title: "Success",
          description: "Trainer deleted successfully",
        })
        fetchTrainers()
      } catch (err) {
        toast.error({
          title: "Error",
          description: "Failed to delete trainer. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialties: "",
      experience: "",
      bio: "",
    })
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
        const initials = row
          .getValue<string>("name")
          .split(" ")
          .map((n) => n[0])
          .join("")

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${initials}`} alt={row.getValue("name")} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="font-medium">{row.getValue("name")}</div>
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
        const rating = row.getValue<number>("rating")
        return (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span>{rating.toFixed(1)}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "classes",
      header: "Classes",
    },
    {
      accessorKey: "clients",
      header: "Clients",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue<"active" | "on-leave" | "former">("status")
        const statusMap = {
          active: { label: "Active", variant: "default" },
          "on-leave": { label: "On Leave", variant: "outline" },
          former: { label: "Former", variant: "destructive" },
        }

        return <Badge variant={statusMap[status].variant}>{statusMap[status].label}</Badge>
      },
    },
    {
      id: "actions",
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
              <DropdownMenuItem>View profile</DropdownMenuItem>
              <DropdownMenuItem>Edit trainer</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View schedule</DropdownMenuItem>
              <DropdownMenuItem>View clients</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDeleteTrainer(trainer.id)} className="text-destructive">
                Deactivate trainer
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
          <p className="text-muted-foreground">Manage your gym trainers, their specialties, and client assignments.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Trainers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-500">+1</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Trainers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% of total trainers
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgRating}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-500">+0.1</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Top Specialty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.topSpecialty || "N/A"}</div>
              <p className="text-xs text-muted-foreground">Most common specialization</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Trainers</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="on-leave">On Leave</TabsTrigger>
            </TabsList>
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
                <DataTable
                  columns={columns}
                  data={trainers}
                  searchColumn="name"
                  searchPlaceholder="Search trainers..."
                />
              </TabsContent>
              <TabsContent value="active" className="mt-4">
                <DataTable
                  columns={columns}
                  data={trainers.filter((trainer) => trainer.status === "active")}
                  searchColumn="name"
                  searchPlaceholder="Search active trainers..."
                />
              </TabsContent>
              <TabsContent value="on-leave" className="mt-4">
                <DataTable
                  columns={columns}
                  data={trainers.filter((trainer) => trainer.status === "on-leave")}
                  searchColumn="name"
                  searchPlaceholder="Search trainers on leave..."
                />
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
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div classNameName="grid gap-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Email address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="Phone number"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="specialties">Specialties</Label>
              <Input
                id="specialties"
                placeholder="e.g. Yoga, HIIT, Strength"
                value={formData.specialties}
                onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Enter specialties separated by commas</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                placeholder="e.g. 5 years"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Trainer bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddTrainerDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleCreateTrainer}>
              Save Trainer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
