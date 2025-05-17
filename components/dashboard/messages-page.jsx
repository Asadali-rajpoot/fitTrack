"use client"

import { useState } from "react"
import { MoreHorizontal, PaperclipIcon, Plus, Search, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import AppLayout from "@/components/dashboard/layout/app-layout"


const messages = [
  {
    id: "M001",
    sender: "Alex Johnson",
    senderAvatar: "AJ",
    subject: "Membership Renewal",
    preview: "I'd like to renew my membership for another year. Can you please provide me with the details?",
    date: "2023-05-10T10:30:00",
    read: false,
    category: "inbox",
  },
  {
    id: "M002",
    sender: "Samantha Lee",
    senderAvatar: "SL",
    subject: "Personal Training Inquiry",
    preview: "I'm interested in personal training sessions. What are your rates and availability?",
    date: "2023-05-09T14:15:00",
    read: false,
    category: "inbox",
  },
  {
    id: "M003",
    sender: "Michael Chen",
    senderAvatar: "MC",
    subject: "Class Cancellation",
    preview: "I need to cancel my registration for tomorrow's yoga class due to a scheduling conflict.",
    date: "2023-05-08T09:45:00",
    read: true,
    category: "inbox",
  },
  {
    id: "M004",
    sender: "Emma Wilson",
    senderAvatar: "EW",
    subject: "Locker Issue",
    preview: "I'm having trouble with my locker. The key doesn't seem to be working properly.",
    date: "2023-05-07T16:20:00",
    read: true,
    category: "inbox",
  },
  {
    id: "M005",
    sender: "James Rodriguez",
    senderAvatar: "JR",
    subject: "Membership Upgrade",
    preview: "I'd like to upgrade from my basic membership to the premium plan. What are the additional benefits?",
    date: "2023-05-06T11:10:00",
    read: true,
    category: "inbox",
  },
  {
    id: "S001",
    sender: "John Doe",
    senderAvatar: "JD",
    subject: "Re: Class Schedule Update",
    preview: "We've updated the class schedule for next week. Please check the attached document for details.",
    date: "2023-05-09T15:30:00",
    read: true,
    category: "sent",
  },
  {
    id: "S002",
    sender: "John Doe",
    senderAvatar: "JD",
    subject: "Re: Membership Inquiry",
    preview: "Thank you for your interest in our gym. Here are the membership options we currently offer.",
    date: "2023-05-08T10:45:00",
    read: true,
    category: "sent",
  },
  {
    id: "A001",
    sender: "Olivia Taylor",
    senderAvatar: "OT",
    subject: "Gym Equipment Suggestion",
    preview: "I'd like to suggest adding more free weights to the strength training area.",
    date: "2023-04-20T13:25:00",
    read: true,
    category: "archived",
  },
]

export default function MessagesPage() {
  const [showComposeDialog, setShowComposeDialog] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [activeCategory, setActiveCategory] = useState("inbox")

  const unreadCount = messages.filter((m) => !m.read && m.category === "inbox").length

  return (
    <AppLayout
      action={{
        label: "Compose",
        onClick: () => setShowComposeDialog(true),
      }}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">Communicate with your members and staff.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-3">
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader className="p-4">
                <CardTitle className="text-lg">Folders</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-1">
                  <Button
                    variant={activeCategory === "inbox" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveCategory("inbox")}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span>Inbox</span>
                      {unreadCount > 0 && <Badge className="ml-auto">{unreadCount}</Badge>}
                    </div>
                  </Button>
                  <Button
                    variant={activeCategory === "sent" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveCategory("sent")}
                  >
                    Sent
                  </Button>
                  <Button
                    variant={activeCategory === "archived" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveCategory("archived")}
                  >
                    Archived
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full" onClick={() => setShowComposeDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Compose
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div className="md:col-span-9">
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg capitalize">{activeCategory}</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search messages..." className="w-[200px] pl-8" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  {messages
                    .filter((message) => message.category === activeCategory)
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`flex cursor-pointer items-center gap-4 border-b border-border/40 p-4 hover:bg-muted/50 ${
                          !message.read && activeCategory === "inbox" ? "bg-primary/5" : ""
                        } ${selectedMessage?.id === message.id ? "bg-muted" : ""}`}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={`/placeholder.svg?height=40&width=40&text=${message.senderAvatar}`}
                            alt={message.sender}
                          />
                          <AvatarFallback>{message.senderAvatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p
                              className={`font-medium ${!message.read && activeCategory === "inbox" ? "font-semibold" : ""}`}
                            >
                              {message.sender}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(message.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm font-medium">{message.subject}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{message.preview}</p>
                        </div>
                        {!message.read && activeCategory === "inbox" && (
                          <Badge className="ml-2 h-2 w-2 rounded-full p-0" />
                        )}
                      </div>
                    ))}
                  {messages.filter((message) => message.category === activeCategory).length === 0 && (
                    <div className="flex h-40 items-center justify-center">
                      <p className="text-muted-foreground">No messages in this folder</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {selectedMessage && (
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={`/placeholder.svg?height=40&width=40&text=${selectedMessage.senderAvatar}`}
                    alt={selectedMessage.sender}
                  />
                  <AvatarFallback>{selectedMessage.senderAvatar}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{selectedMessage.subject}</CardTitle>
                  <CardDescription>
                    From: {selectedMessage.sender} • {new Date(selectedMessage.date).toLocaleString()}
                  </CardDescription>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Reply</DropdownMenuItem>
                  <DropdownMenuItem>Forward</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                  <DropdownMenuItem>Archive</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="min-h-[200px] space-y-4">
                <p>{selectedMessage.preview}</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl
                  nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl
                  nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
                </p>
                <p>
                  Best regards,
                  <br />
                  {selectedMessage.sender}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between p-4">
              <div className="flex gap-2">
                <Button>Reply</Button>
                <Button variant="outline">Forward</Button>
              </div>
              <Button variant="destructive">Delete</Button>
            </CardFooter>
          </Card>
        )}
      </div>

      <Dialog open={showComposeDialog} onOpenChange={setShowComposeDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Compose Message</DialogTitle>
            <DialogDescription>Create a new message to send to members or staff.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="recipient">To</Label>
              <Select>
                <SelectTrigger id="recipient">
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-members">All Members</SelectItem>
                  <SelectItem value="all-staff">All Staff</SelectItem>
                  <SelectItem value="alex-johnson">Alex Johnson</SelectItem>
                  <SelectItem value="samantha-lee">Samantha Lee</SelectItem>
                  <SelectItem value="michael-chen">Michael Chen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Message subject" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Type your message here..." className="min-h-[200px]" />
            </div>
          </div>
          <DialogFooter className="flex items-center justify-between">
            <Button variant="outline" size="sm" className="gap-1">
              <PaperclipIcon className="h-4 w-4" />
              Attach
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowComposeDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={() => setShowComposeDialog(false)}>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
