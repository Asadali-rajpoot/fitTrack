"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogFooter } from "@/components/ui/dialog"
import { membersAPI } from "@/lib/api"

export default function AddMemberForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    membershipType: "",
  })
  const [submitting, setSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, membershipType: value }))
  }

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.membershipType) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)
    try {
      const newMember = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone || "(Not provided)",
        membershipType: formData.membershipType,
        status: "pending",
      }

      const response = await membersAPI.create(newMember)
      toast.success("Member added successfully")

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        membershipType: "",
      })

      // Call the success callback with the new member data
      if (onSuccess) onSuccess(response)
    } catch (err) {
      console.error("Error adding member:", err)
      toast.error("Failed to add member. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" placeholder="First name" value={formData.firstName} onChange={handleInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" placeholder="Last name" value={formData.lastName} onChange={handleInputChange} />
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
          <Input id="phone" placeholder="Phone number" type="tel" value={formData.phone} onChange={handleInputChange} />
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
        <Button variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Saving..." : "Save Member"}
        </Button>
      </DialogFooter>
    </>
  )
}
