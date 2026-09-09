"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, Plus, UserPlus } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader, StatCard } from "@/components/admin/admin-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Attendance {
  id: string;
  employee: string;
  employee_name?: string;
  date: string;
  status: string;
  check_in?: string;
  check_out?: string;
  notes?: string;
}

const statusTone: Record<string, string> = {
  present: "success",
  absent: "danger",
  half_day: "warning",
  leave: "gray",
  late: "info",
};

export default function AttendancePage() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({ employee: "", date: "", status: "present" });
  const [saving, setSaving] = useState(false);
  const [showEmployee, setShowEmployee] = useState(false);
  const [empForm, setEmpForm] = useState({ name: "", phone: "", designation: "", joined_on: "" });

  useEffect(() => {
    api
      .listAttendances<{ results?: Attendance[] }>()
      .then((d) => setRecords(d.results ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
    api.listEmployees<{ results?: { id: string; name: string }[] }>()
      .then((d) => setEmployees(d.results ?? []))
      .catch(() => {});
  }, []);

  const present = records.filter((r) => r.status === "present").length;
  const today = new Date().toISOString().slice(0, 10);
  const todayRecords = records.filter((r) => r.date === today).length;

  const saveAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.employee || !form.date) return;
    setSaving(true);
    try {
      await api.createAttendance({ ...form });
      setForm({ employee: "", date: "", status: "present" });
      const d = await api.listAttendances<{ results?: Attendance[] }>();
      setRecords(d.results ?? []);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const addEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createEmployee({ ...empForm });
      setEmpForm({ name: "", phone: "", designation: "", joined_on: "" });
      setShowEmployee(false);
      const d = await api.listEmployees<{ results?: { id: string; name: string }[] }>();
      setEmployees(d.results ?? []);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Employee Attendance"
        description="Save daily attendance for employees"
        actions={
          <Button variant="outline" onClick={() => setShowEmployee(!showEmployee)}>
            <UserPlus className="h-4 w-4" /> Add Employee
          </Button>
        }
      />

      {showEmployee && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>New Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addEmployee} className="grid gap-3 sm:grid-cols-4">
              <Input placeholder="Name *" value={empForm.name} onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })} required />
              <Input placeholder="Phone" value={empForm.phone} onChange={(e) => setEmpForm({ ...empForm, phone: e.target.value })} />
              <Input placeholder="Designation" value={empForm.designation} onChange={(e) => setEmpForm({ ...empForm, designation: e.target.value })} />
              <Input type="date" value={empForm.joined_on} onChange={(e) => setEmpForm({ ...empForm, joined_on: e.target.value })} required />
              <div className="sm:col-span-4">
                <Button type="submit" variant="success" disabled={saving}>
                  Save Employee
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Logs" value={String(records.length)} icon={CalendarCheck} tone="primary" />
        <StatCard label="Present (all)" value={String(present)} icon={CalendarCheck} tone="success" />
        <StatCard label="Logs Today" value={String(todayRecords)} icon={CalendarCheck} tone="info" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : records.length === 0 ? (
              <p className="text-sm text-gray-400">No attendance records yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border-color text-xs uppercase tracking-wide text-gray-400">
                      <th className="pb-2">Employee</th>
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2">Check-in</th>
                      <th className="pb-2">Check-out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r) => (
                      <tr key={r.id} className="border-b border-border-color last:border-0">
                        <td className="py-3 font-medium text-dark">{r.employee_name || r.employee}</td>
                        <td className="py-3">{r.date}</td>
                        <td className="py-3">
                          <Badge variant={(statusTone[r.status] || "gray") as "success" | "danger" | "warning" | "info" | "gray"}>
                            {r.status}
                          </Badge>
                        </td>
                        <td className="py-3">{r.check_in || "-"}</td>
                        <td className="py-3">{r.check_out || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mark Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveAttendance} className="space-y-3">
              <Select value={form.employee} onChange={(e) => setForm({ ...form, employee: e.target.value })} required>
                <option value="" disabled>Select employee</option>
                {employees.map((em) => (
                  <option key={em.id} value={em.id}>{em.name}</option>
                ))}
              </Select>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="half_day">Half Day</option>
                <option value="leave">Leave</option>
                <option value="late">Late</option>
              </Select>
              <Button type="submit" className="w-full" disabled={saving}>
                <Plus className="h-4 w-4" /> {saving ? "Saving..." : "Save Attendance"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
