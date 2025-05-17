"use client"
import { CreditCard } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import AppLayout from "@/components/dashboard/layout/app-layout"

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="gym">Gym Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="mt-4">
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Manage your public profile information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex flex-col items-center gap-2 sm:w-1/3">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                  </div>
                  <div className="flex flex-1 flex-col gap-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input id="firstName" defaultValue="John" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input id="lastName" defaultValue="Doe" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue="john.doe@example.com" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself"
                        defaultValue="Gym administrator and fitness enthusiast."
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="account" className="mt-4">
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Manage your account settings and security.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Security</h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="currentPassword">Current password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="newPassword">New password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">Confirm password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Two-factor authentication</div>
                      <div className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </div>
                    </div>
                    <Switch />
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Account Management</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Delete account</div>
                      <div className="text-sm text-muted-foreground">Permanently delete your account and all data</div>
                    </div>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="notifications" className="mt-4">
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage how you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-medium">New member registrations</div>
                        <div className="text-sm text-muted-foreground">
                          Receive notifications when new members register
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-medium">Class bookings</div>
                        <div className="text-sm text-muted-foreground">
                          Receive notifications for class bookings and cancellations
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-medium">Payment notifications</div>
                        <div className="text-sm text-muted-foreground">
                          Receive notifications for payments and invoices
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-medium">System updates</div>
                        <div className="text-sm text-muted-foreground">
                          Receive notifications about system updates and maintenance
                        </div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Push Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-medium">Enable push notifications</div>
                        <div className="text-sm text-muted-foreground">Receive push notifications on your device</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="billing" className="mt-4">
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Billing</CardTitle>
                <CardDescription>Manage your billing information and subscription.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Current Plan</h3>
                  <div className="rounded-lg border border-border/40 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Premium Plan</div>
                        <div className="text-sm text-muted-foreground">$99/month, billed monthly</div>
                      </div>
                      <Button variant="outline">Change Plan</Button>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payment Method</h3>
                  <div className="rounded-lg border border-border/40 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <CreditCard className="h-6 w-6" />
                        <div>
                          <div className="font-medium">Visa ending in 4242</div>
                          <div className="text-sm text-muted-foreground">Expires 12/2025</div>
                        </div>
                      </div>
                      <Button variant="outline">Update</Button>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Billing History</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
                      <div>
                        <div className="font-medium">Invoice #12345</div>
                        <div className="text-sm text-muted-foreground">May 1, 2023 - $99.00</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
                      <div>
                        <div className="font-medium">Invoice #12344</div>
                        <div className="text-sm text-muted-foreground">April 1, 2023 - $99.00</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
                      <div>
                        <div className="font-medium">Invoice #12343</div>
                        <div className="text-sm text-muted-foreground">March 1, 2023 - $99.00</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancel Subscription</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="gym" className="mt-4">
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Gym Settings</CardTitle>
                <CardDescription>Configure your gym's general settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">General Information</h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="gymName">Gym Name</Label>
                      <Input id="gymName" defaultValue="FLEX GYM" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="gymAddress">Address</Label>
                      <Textarea id="gymAddress" defaultValue="123 Fitness Street, Workout City, WO 12345" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="gymPhone">Phone</Label>
                      <Input id="gymPhone" defaultValue="(555) 123-4567" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="gymEmail">Email</Label>
                      <Input id="gymEmail" defaultValue="info@flexgym.com" />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Business Hours</h3>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="font-medium">Day</div>
                      <div className="font-medium">Opening Time</div>
                      <div className="font-medium">Closing Time</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>Monday - Friday</div>
                      <Input defaultValue="5:00 AM" />
                      <Input defaultValue="11:00 PM" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>Saturday</div>
                      <Input defaultValue="6:00 AM" />
                      <Input defaultValue="10:00 PM" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>Sunday</div>
                      <Input defaultValue="7:00 AM" />
                      <Input defaultValue="8:00 PM" />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Membership Settings</h3>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="membershipTypes">Membership Types</Label>
                      <div className="rounded-lg border border-border/40 p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">Basic</div>
                            <Input className="w-24" defaultValue="$29.99" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="font-medium">Standard</div>
                            <Input className="w-24" defaultValue="$49.99" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="font-medium">Premium</div>
                            <Input className="w-24" defaultValue="$79.99" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
