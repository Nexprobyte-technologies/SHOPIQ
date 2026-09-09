"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Store, Bell, Shield, Smartphone, Globe, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-dark">Settings</h1>
        <p className="text-sm text-gray-500">Manage your shop and account preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Shop profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Store className="h-4 w-4 text-primary" /> Shop Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Shop Name</label>
              <Input defaultValue="Sri Vinayaka Stores" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Shop Type</label>
              <Select defaultValue="grocery">
                <option value="grocery">Grocery</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="restaurant">Restaurant</option>
                <option value="clothing">Clothing</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">GST Number</label>
              <Input defaultValue="33ABCDE1234F1Z5" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">City</label>
              <Input defaultValue="Chennai" />
            </div>
            <Button className="w-full"><Save className="h-4 w-4" /> Save Changes</Button>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /> Language & Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Interface Language</label>
              <Select defaultValue="en">
                <option value="en">English</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Currency</label>
              <Select defaultValue="inr">
                <option value="inr">₹ INR</option>
                <option value="usd">$ USD</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Time Zone</label>
              <Select defaultValue="ist">
                <option value="ist">Asia/Kolkata (IST)</option>
                <option value="gmt">GMT</option>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border-color p-3">
              <div>
                <p className="flex items-center gap-2 text-sm font-medium text-dark"><Smartphone className="h-4 w-4 text-success" /> Voice Billing</p>
                <p className="text-xs text-gray-400">Tamil + English support</p>
              </div>
              <span className="rounded-full bg-success-50 px-2 py-0.5 text-xs font-medium text-success">On</span>
            </div>
          </CardContent>
        </Card>

        {/* Notifications & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="h-4 w-4 text-primary" /> Notifications & Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border-color p-3">
              <div>
                <p className="text-sm font-medium text-dark">Low Stock Alerts</p>
                <p className="text-xs text-gray-400">WhatsApp + push</p>
              </div>
              <span className="rounded-full bg-success-50 px-2 py-0.5 text-xs font-medium text-success">On</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border-color p-3">
              <div>
                <p className="text-sm font-medium text-dark">Daily Summary</p>
                <p className="text-xs text-gray-400">8 PM WhatsApp report</p>
              </div>
              <span className="rounded-full bg-success-50 px-2 py-0.5 text-xs font-medium text-success">On</span>
            </div>
            <div className="rounded-lg border border-border-color p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-dark"><Shield className="h-4 w-4 text-primary" /> Change Password</p>
              <div className="mt-3 space-y-2">
                <Input type="password" placeholder="Current password" />
                <Input type="password" placeholder="New password" />
              </div>
              <Button variant="outline" size="sm" className="mt-3">Update Password</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
