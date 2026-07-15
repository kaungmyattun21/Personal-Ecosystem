"use client";

import React from "react";
import { useHealthController } from "../hooks/useHealthController";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Flame,
  Activity,
  Heart,
  Moon,
  Plus,
  Dumbbell,
  Droplet,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// Mock data for weekly activity chart
const weeklyHealthData = [
  { name: "Mon", steps: 6200, calories: 310 },
  { name: "Tue", steps: 8400, calories: 420 },
  { name: "Wed", steps: 9100, calories: 460 },
  { name: "Thu", steps: 7200, calories: 350 },
  { name: "Fri", steps: 10500, calories: 530 },
  { name: "Sat", steps: 12000, calories: 600 },
  { name: "Sun", steps: 8432, calories: 420 },
];

// Mock data for weight tracking
const weightData = [
  { date: "May 1", weight: 78.5 },
  { date: "May 5", weight: 78.2 },
  { date: "May 10", weight: 77.9 },
  { date: "May 15", weight: 77.6 },
  { date: "May 20", weight: 77.2 },
];

export function HealthView() {
  const {
    activeTab,
    workouts,
    showAddForm,
    setShowAddForm,
    newWorkoutName,
    setNewWorkoutName,
    newWorkoutType,
    setNewWorkoutType,
    newWorkoutDuration,
    setNewWorkoutDuration,
    waterIntake,
    waterGoal,
    handleAddWorkout,
    handleAddWater,
    handleResetWater,
    handleTabChange,
  } = useHealthController();

  return (
    <div className="flex flex-col gap-8 pb-20 pt-2 lg:pb-10 max-w-7xl mx-auto w-full p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-brand-teal dark:text-white">
          Health & Wellness
        </h2>
        <p className="text-xs font-bold uppercase tracking-widest text-brand-teal-light dark:text-zinc-500">
          Track workouts, body metrics, and daily energy levels
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          handleTabChange(value as "overview" | "workouts" | "metrics")
        }
        className="w-full space-y-8"
      >
        <div className="flex items-center justify-between">
          <TabsList className="bg-slate-100/50 dark:bg-white/5 p-1 rounded-2xl h-14 border border-black/[0.02] dark:border-white/[0.02] backdrop-blur-md">
            <TabsTrigger
              value="overview"
              className="px-6 rounded-xl data-[state=active]:bg-brand-teal data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-brand-teal/20 transition-all text-xs font-black uppercase tracking-widest gap-2 h-full"
            >
              <Activity size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="workouts"
              className="px-6 rounded-xl data-[state=active]:bg-brand-teal data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-brand-teal/20 transition-all text-xs font-black uppercase tracking-widest gap-2 h-full"
            >
              <Dumbbell size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Workouts</span>
            </TabsTrigger>
            <TabsTrigger
              value="metrics"
              className="px-6 rounded-xl data-[state=active]:bg-brand-teal data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-brand-teal/20 transition-all text-xs font-black uppercase tracking-widest gap-2 h-full"
            >
              <Heart size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Metrics</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-8 outline-none">
          {/* Health Stats Overview Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Steps Card */}
            <Card className="p-6 flex flex-col justify-between relative overflow-hidden border border-black/[0.02] dark:border-white/[0.02] bg-white dark:bg-zinc-900/50 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-teal-light dark:text-zinc-500">
                  Daily Steps
                </span>
                <div className="p-2.5 rounded-xl bg-brand-emerald-light dark:bg-brand-emerald/10 text-brand-emerald">
                  <TrendingUp size={16} />
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-black italic uppercase tracking-tighter text-brand-teal dark:text-white">
                  8,432
                </h4>
                <p className="text-[10px] font-bold text-zinc-500 mt-1 uppercase tracking-wide">
                  Goal: 10,000 steps (84%)
                </p>
                <div className="w-full bg-slate-100 dark:bg-white/5 h-2 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-brand-emerald h-full rounded-full transition-all duration-500"
                    style={{ width: "84.3%" }}
                  />
                </div>
              </div>
            </Card>

            {/* Heart Rate Card */}
            <Card className="p-6 flex flex-col justify-between relative overflow-hidden border border-black/[0.02] dark:border-white/[0.02] bg-white dark:bg-zinc-900/50 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-teal-light dark:text-zinc-500">
                  Heart Rate
                </span>
                <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-500/10 text-rose-500 animate-pulse">
                  <Heart size={16} fill="currentColor" />
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-black italic uppercase tracking-tighter text-brand-teal dark:text-white">
                  72 <span className="text-xs font-normal lowercase text-zinc-400">bpm</span>
                </h4>
                <p className="text-[10px] font-bold text-zinc-500 mt-1 uppercase tracking-wide">
                  Resting Avg: 64 bpm
                </p>
                <div className="flex gap-1 items-end h-6 mt-3">
                  {[20, 24, 22, 28, 25, 30, 24, 21, 26, 29, 22, 25, 27].map((h, i) => (
                    <div
                      key={i}
                      className="bg-rose-400/70 dark:bg-rose-500/50 flex-1 rounded-sm"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Calories Card */}
            <Card className="p-6 flex flex-col justify-between relative overflow-hidden border border-black/[0.02] dark:border-white/[0.02] bg-white dark:bg-zinc-900/50 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-teal-light dark:text-zinc-500">
                  Active Calories
                </span>
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-500/10 text-amber-500">
                  <Flame size={16} />
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-black italic uppercase tracking-tighter text-brand-teal dark:text-white">
                  420 <span className="text-xs font-normal lowercase text-zinc-400">kcal</span>
                </h4>
                <p className="text-[10px] font-bold text-zinc-500 mt-1 uppercase tracking-wide">
                  Target: 600 kcal
                </p>
                <div className="w-full bg-slate-100 dark:bg-white/5 h-2 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: "70%" }}
                  />
                </div>
              </div>
            </Card>

            {/* Sleep Card */}
            <Card className="p-6 flex flex-col justify-between relative overflow-hidden border border-black/[0.02] dark:border-white/[0.02] bg-white dark:bg-zinc-900/50 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-teal-light dark:text-zinc-500">
                  Sleep Duration
                </span>
                <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 text-indigo-500">
                  <Moon size={16} />
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-black italic uppercase tracking-tighter text-brand-teal dark:text-white">
                  7h 45m
                </h4>
                <p className="text-[10px] font-bold text-zinc-500 mt-1 uppercase tracking-wide">
                  Deep Sleep: 2h 12m (86% quality)
                </p>
                <div className="w-full bg-slate-100 dark:bg-white/5 h-2 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: "86%" }}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Chart Section */}
          <Card className="p-8 border border-black/[0.02] dark:border-white/[0.02] bg-white dark:bg-zinc-900/50 shadow-sm">
            <div className="mb-6">
              <h3 className="text-base font-black italic uppercase tracking-tighter text-brand-teal dark:text-white">
                Weekly Activity Pulse
              </h3>
              <p className="text-[9px] font-bold uppercase tracking-widest text-brand-teal-light dark:text-zinc-500 mt-1">
                Steps & Calories Burned Trend
              </p>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyHealthData}>
                  <defs>
                    <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#089172" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#089172" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="6 6" vertical={false} strokeOpacity={0.05} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#7c959a", fontWeight: 800 }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      background: "rgba(26,60,66,0.95)",
                      color: "white",
                      fontSize: "11px",
                      fontWeight: "800",
                      padding: "12px",
                      boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="steps"
                    name="Steps"
                    stroke="#089172"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSteps)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 2: Workouts Log */}
        <TabsContent value="workouts" className="space-y-6 outline-none">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side: Workouts List */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black italic uppercase tracking-tighter text-brand-teal dark:text-white">
                  Recent Workouts
                </h3>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-2 rounded-xl bg-brand-emerald px-4 py-2 text-xs font-black uppercase italic text-white shadow-lg shadow-brand-emerald/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Plus size={14} strokeWidth={3} />
                  <span>Log Workout</span>
                </button>
              </div>

              {showAddForm && (
                <Card className="p-6 border border-brand-emerald/20 bg-brand-emerald/5 dark:bg-brand-emerald/5 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                  <form onSubmit={handleAddWorkout} className="space-y-4">
                    <h4 className="text-sm font-black uppercase tracking-wider text-brand-teal dark:text-white">
                      Log New Workout
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                          Workout Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newWorkoutName}
                          onChange={(e) => setNewWorkoutName(e.target.value)}
                          placeholder="e.g. HIIT, Swim, Walk"
                          className="w-full bg-white dark:bg-zinc-800 rounded-xl px-3 py-2 text-xs border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-brand-emerald"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                          Type
                        </label>
                        <select
                          value={newWorkoutType}
                          onChange={(e) => setNewWorkoutType(e.target.value)}
                          className="w-full bg-white dark:bg-zinc-800 rounded-xl px-3 py-2 text-xs border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-brand-emerald"
                        >
                          <option>Cardio</option>
                          <option>Strength</option>
                          <option>Yoga</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                          Duration (mins)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="300"
                          value={newWorkoutDuration}
                          onChange={(e) => setNewWorkoutDuration(e.target.value)}
                          className="w-full bg-white dark:bg-zinc-800 rounded-xl px-3 py-2 text-xs border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-brand-emerald"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="rounded-xl px-4 py-2 text-xs font-black uppercase text-zinc-500 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-brand-emerald px-4 py-2 text-xs font-black uppercase text-white shadow-lg shadow-brand-emerald/20 transition-all cursor-pointer"
                      >
                        Add Log
                      </button>
                    </div>
                  </form>
                </Card>
              )}

              <div className="space-y-3">
                {workouts.map((workout) => (
                  <Card
                    key={workout.id}
                    className="p-5 flex items-center justify-between border border-black/[0.02] dark:border-white/[0.02] bg-white dark:bg-zinc-900/50 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl ${
                          workout.type === "Cardio"
                            ? "bg-brand-emerald-light dark:bg-brand-emerald/10 text-brand-emerald"
                            : workout.type === "Strength"
                            ? "bg-blue-100 dark:bg-blue-500/10 text-blue-500"
                            : "bg-indigo-100 dark:bg-indigo-500/10 text-indigo-500"
                        }`}
                      >
                        <Dumbbell size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-tight text-brand-teal dark:text-white">
                          {workout.name}
                        </h4>
                        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-0.5">
                          {workout.date} &bull; {workout.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-sm font-black italic uppercase text-brand-teal dark:text-white">
                          {workout.duration} mins
                        </span>
                        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-0.5">
                          {workout.calories} kcal
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-zinc-300 dark:text-zinc-650" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right side: Summary / Insights */}
            <div className="w-full lg:w-80 space-y-6">
              <Card className="p-6 border border-black/[0.02] dark:border-white/[0.02] bg-white dark:bg-zinc-900/50">
                <h3 className="text-sm font-black italic uppercase tracking-tighter text-brand-teal dark:text-white mb-4">
                  Weekly Workout Target
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-zinc-500">Workouts Logged</span>
                    <span className="font-black text-brand-teal dark:text-white">
                      {workouts.length} / 5
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-white/5 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-emerald h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((workouts.length / 5) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-medium text-zinc-500 leading-normal">
                    You've burned an estimated{" "}
                    <strong className="text-brand-emerald">
                      {workouts.reduce((sum, w) => sum + w.calories, 0)} kcal
                    </strong>{" "}
                    across {workouts.reduce((sum, w) => sum + w.duration, 0)} minutes of active training this week!
                  </p>
                </div>
              </Card>

              {/* Achievement Placeholder */}
              <Card className="p-6 border border-black/[0.02] dark:border-white/[0.02] bg-white dark:bg-zinc-900/50 flex items-start gap-4">
                <div className="p-3 bg-amber-150 dark:bg-amber-500/10 text-amber-500 rounded-xl">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-brand-teal dark:text-white">
                    Consistency Streak
                  </h4>
                  <p className="text-[10px] font-medium text-zinc-500 leading-normal mt-1">
                    Logged workouts 3 days in a row! Keep it up to level up.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Metrics Tracker */}
        <TabsContent value="metrics" className="space-y-8 outline-none">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Water Hydration Intake Tracker */}
            <Card className="p-8 border border-black/[0.02] dark:border-white/[0.02] bg-white dark:bg-zinc-900/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-black italic uppercase tracking-tighter text-brand-teal dark:text-white">
                    Hydration Log
                  </h3>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-brand-teal-light dark:text-zinc-500 mt-1">
                    Track daily water consumption
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500">
                  <Droplet size={18} fill="currentColor" />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative flex items-center justify-center h-32 w-32 rounded-full border-4 border-blue-100 dark:border-blue-500/10">
                  <div className="absolute inset-2 rounded-full bg-blue-50/50 dark:bg-blue-500/5 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black italic text-brand-teal dark:text-white">
                      {waterIntake}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
                      ml of {waterGoal}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => handleAddWater(250)}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-500 hover:bg-blue-600 px-4 py-2.5 text-xs font-black uppercase italic text-white shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus size={14} strokeWidth={3} />
                    <span>+250ml</span>
                  </button>
                  <button
                    onClick={() => handleAddWater(500)}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-650 hover:bg-blue-700 px-4 py-2.5 text-xs font-black uppercase italic text-white shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus size={14} strokeWidth={3} />
                    <span>+500ml</span>
                  </button>
                  <button
                    onClick={handleResetWater}
                    className="rounded-xl px-3 py-2 text-xs font-black uppercase text-zinc-450 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </Card>

            {/* Weight Tracker */}
            <Card className="p-8 border border-black/[0.02] dark:border-white/[0.02] bg-white dark:bg-zinc-900/50">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h3 className="text-base font-black italic uppercase tracking-tighter text-brand-teal dark:text-white">
                    Weight Progress
                  </h3>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-brand-teal-light dark:text-zinc-500 mt-1">
                    Last recorded: 77.2 kg (May 20)
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-brand-emerald">
                    -1.3 kg
                  </span>
                  <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">
                    This Month
                  </p>
                </div>
              </div>

              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="6 6" vertical={false} strokeOpacity={0.05} />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 9, fill: "#7c959a", fontWeight: 800 }}
                    />
                    <YAxis
                      domain={[76, 80]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 9, fill: "#7c959a", fontWeight: 800 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        background: "rgba(26,60,66,0.95)",
                        color: "white",
                        fontSize: "10px",
                        fontWeight: "800",
                        padding: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#089172"
                      strokeWidth={3}
                      dot={{ r: 4, stroke: "#089172", strokeWidth: 2, fill: "white" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
