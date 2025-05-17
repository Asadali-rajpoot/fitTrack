"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import { LoadingState } from "@/components/dashboard/design/loading-spinner";
import { toast } from "sonner";
import AppLayout from "@/components/dashboard/layout/app-layout";
import { membersAPI, analyticsAPI } from "@/lib/api";


// DataTable component adapted from DataTableDemo
function DataTable({ columns, data }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue()) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
  );
}

export default function MembersPage() {
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    newThisMonth: 0,
    premium: 0,
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    membershipType: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, membershipType: value }));
  };

  const handleSubmit = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.membershipType
    ) {
      toast.error("Please fill in all required fields", {
        description: "Error",
      });
      return;
    }

    setSubmitting(true);
    try {
      const newMember = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone || "(Not provided)",
        membershipType: formData.membershipType,
        status: "pending",
      };

      const response = await membersAPI.create(newMember);

      // Add the new member to the list
      setMembers((prev) => [response, ...prev]);

      // Update stats
      setStats((prev) => ({
        ...prev,
        total: prev.total + 1,
        newThisMonth: prev.newThisMonth + 1,
        ...(newMember.membershipType === "Premium"
          ? { premium: prev.premium + 1 }
          : {}),
      }));

      toast.success("Member added successfully", {
        description: "Success",
      });

      // Reset form and close dialog
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        membershipType: "",
      });
      setShowAddMemberDialog(false);
    } catch (err) {
      console.error("Error adding member:", err);
      toast.error("Failed to add member. Please try again.", {
        description: "Error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await membersAPI.getAll();
        setMembers(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching members:", err);
        setError(true);
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const analytics = await analyticsAPI.getAll();
        setStats({
          total: analytics.membershipStats.total,
          active: analytics.membershipStats.active,
          newThisMonth: analytics.membershipStats.newThisMonth,
          premium: analytics.membershipStats.distribution.premium,
        });
      } catch (err) {
        console.error("Error fetching analytics:", err);
      }
    };

    fetchMembers();
    fetchStats();
  }, []);

  // Define columns for DataTable
  const columns = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const initials = row
          .getValue("name")
          .split(" ")
          .map((n) => n[0])
          .join("");

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`/placeholder.svg?height=32&width=32&text=${initials}`}
                alt={row.getValue("name")}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="font-medium">{row.getValue("name")}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "membershipType",
      header: "Membership",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue<"active" | "inactive" | "pending">("status");
        const statusMap = {
          active: { label: "Active", variant: "default"},
          inactive: { label: "Inactive", variant: "destructive"},
          pending: { label: "Pending", variant: "outline"},
        };

        return <Badge variant={statusMap[status]?.variant}>{statusMap[status]?.label}</Badge>;
      },
    },
    {
      accessorKey: "lastVisit",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Visit
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("lastVisit"));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const member = row.original;

        const handleDeleteMember = async () => {
          try {
            await membersAPI.delete(member.id);
            setMembers((prev) => prev.filter((m) => m.id !== member.id));
            toast.success("Member deleted successfully", {
              description: "Success",
            });
          } catch (err) {
            console.error("Error deleting member:", err);
            toast.error("Failed to delete member", {
              description: "Error",
            });
          }
        };

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
              <DropdownMenuItem>Edit member</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Send message</DropdownMenuItem>
              <DropdownMenuItem>Manage membership</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleDeleteMember}
              >
                Delete member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <AppLayout
      action={{
        label: "Add Member",
        onClick: () => setShowAddMemberDialog(true),
      }}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground">
            Manage your gym members, view their profiles, and track their activity.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-500">+12%</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0
                  ? Math.round((stats.active / stats.total) * 100)
                  : 0}
                % of total members
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newThisMonth}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-500">+8</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Premium Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.premium}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0
                  ? Math.round((stats.premium / stats.total) * 100)
                  : 0}
                % of total members
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Members</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
          </div>
          {loading ? (
            <div className="mt-4">
              <LoadingState message="Loading members..." />
            </div>
          ) : error ? (
            <div className="mt-4 rounded-md border border-destructive/50 bg-destructive/10 p-4 text-center">
              <p className="text-destructive">Failed to load members. Please try again.</p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              <TabsContent value="all" className="mt-4">
                <DataTable columns={columns} data={members} />
              </TabsContent>
              <TabsContent value="active" className="mt-4">
                <DataTable
                  columns={columns}
                  data={members.filter((member) => member.status === "active")}
                />
              </TabsContent>
              <TabsContent value="inactive" className="mt-4">
                <DataTable
                  columns={columns}
                  data={members.filter((member) => member.status === "inactive")}
                />
              </TabsContent>
              <TabsContent value="pending" className="mt-4">
                <DataTable
                  columns={columns}
                  data={members.filter((member) => member.status === "pending")}
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
            <DialogDescription>
              Enter the details of the new member. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
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
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="Phone number"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="membershipType">Membership Type</Label>
              <Select value={formData.membershipType} onValueChange={handleSelectChange}>
                <SelectTrigger id="membershipType">
                  <SelectValue placeholder="Select membership type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Family">Family</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddMemberDialog(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Saving..." : "Save Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}