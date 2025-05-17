"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter } from "@/components/ui/dialog"
import { trainersAPI } from "@/lib/api"

export default function AddTrainerForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialties: "",
    experience: "",
    bio: "",
  })
  const [submitting, setSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)
    try {
      const specialtiesArray = formData.specialties
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s)

      const newTrainer = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone || "(Not provided)",
        specialties: specialtiesArray,
        experience: formData.experience,
        bio: formData.bio,
        status: "active",
        rating: 5.0, // Default rating for new trainers
      }

      const response = await trainersAPI.create(newTrainer)
      toast.success("Trainer added successfully")

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        specialties: "",
        experience: "",
        bio: "",
      })

      // Call the success callback with the new trainer data
      if (onSuccess) onSuccess(response)
    } catch (err) {
      console.error("Error adding trainer:", err)
      toast.error("Failed to add trainer. Please try again.")
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
          <Label htmlFor="specialties">Specialties</Label>
          <Input
            id="specialties"
            placeholder="e.g. Yoga, HIIT, Strength"
            value={formData.specialties}
            onChange={handleInputChange}
          />
          <p className="text-xs text-muted-foreground">Enter specialties separated by commas</p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="experience">Experience</Label>
          <Input id="experience" placeholder="e.g. 5 years" value={formData.experience} onChange={handleInputChange} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" placeholder="Trainer bio" value={formData.bio} onChange={handleInputChange} />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Saving..." : "Save Trainer"}
        </Button>
      </DialogFooter>
    </>
  )
}
