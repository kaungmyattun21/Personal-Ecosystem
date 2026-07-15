import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setActiveTab } from "@/lib/store/features/health/health-slice";

export function useHealthController() {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.health.activeTab);

  // Local state for workouts log
  const [workouts, setWorkouts] = useState([
    {
      id: "1",
      type: "Cardio",
      name: "Morning Outdoor Run",
      duration: 32,
      calories: 380,
      date: "Today, 7:30 AM",
    },
    {
      id: "2",
      type: "Strength",
      name: "Upper Body Strength",
      duration: 45,
      calories: 240,
      date: "Yesterday, 6:00 PM",
    },
    {
      id: "3",
      type: "Yoga",
      name: "Flexibility & Flow",
      duration: 30,
      calories: 90,
      date: "May 18, 8:15 PM",
    },
  ]);

  // Local form state for adding a workout
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [newWorkoutType, setNewWorkoutType] = useState("Cardio");
  const [newWorkoutDuration, setNewWorkoutDuration] = useState("30");

  // Local state for water tracker
  const [waterIntake, setWaterIntake] = useState(1250); // in ml
  const waterGoal = 2500; // in ml

  const handleAddWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkoutName.trim()) return;

    const durationNum = parseInt(newWorkoutDuration, 10) || 30;
    // Estimate calories burned
    let calMultiplier = 8; // default cardio
    if (newWorkoutType === "Strength") calMultiplier = 5.5;
    if (newWorkoutType === "Yoga") calMultiplier = 3;
    const calories = Math.round(durationNum * calMultiplier);

    const newWorkout = {
      id: Date.now().toString(),
      type: newWorkoutType,
      name: newWorkoutName,
      duration: durationNum,
      calories,
      date: "Just now",
    };

    setWorkouts([newWorkout, ...workouts]);
    setNewWorkoutName("");
    setShowAddForm(false);
  };

  const handleAddWater = (amount: number) => {
    setWaterIntake((prev) => Math.min(prev + amount, 5000));
  };

  const handleResetWater = () => {
    setWaterIntake(0);
  };

  const handleTabChange = (value: "overview" | "workouts" | "metrics") => {
    dispatch(setActiveTab(value));
  };

  return {
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
  };
}
