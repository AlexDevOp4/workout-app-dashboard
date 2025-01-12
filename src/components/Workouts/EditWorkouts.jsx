import { useState, useEffect, useCallback } from "react";
import { useParams,  useNavigate } from "react-router-dom";
import {  ArrowLeftIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const EditWorkouts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const workoutApi = import.meta.env.VITE_WORKOUTS_API_URL;

  const [loading, setLoading] = useState(true);
  const [workout, setWorkout] = useState({
    programName: "New Workout Program",
    weeks: [
      {
        weekNumber: 1,
        days: [
          {
            dayNumber: 1,
            exercises: [
              {
                name: "Bench Press",
                sets: 4,
                targetReps: 10,
                weight: 135,
                rpe: 8,
              },
            ],
          },
        ],
      },
    ],
  });

  // Handle key down (Enter key detection)
  const handleKeyDown = async (
    event,
    workoutId,
    weekIndex,
    dayIndex,
    exerciseIndex
  ) => {
    if (event.key === "Enter") {
      try {
        const exercise =
          workout.weeks[weekIndex].days[dayIndex].exercises[exerciseIndex];
        await axios.put(
          `${workoutApi}/${workoutId}/weeks/${workout.weeks[weekIndex].weekNumber}/days/${workout.weeks[weekIndex].days[dayIndex].dayNumber}/exercises/${exercise._id}`,
          {
            name: exercise.name,
            weight: exercise.weight,
            sets: exercise.sets,
            targetReps: exercise.targetReps,
            rpe: exercise.rpe,
          }
        );

        alert("Exercise updated successfully!");

        fetchWorkouts(); // Refresh the workout data
      } catch (error) {
        return error;
      }
    }
  };

  const updateExercise = (weekIndex, dayIndex, exerciseIndex, field, value) => {
    setWorkout((prevWorkout) => {
      const updatedWorkout = { ...prevWorkout };
      const exercise =
        updatedWorkout.weeks[weekIndex].days[dayIndex].exercises[exerciseIndex];
      exercise[field] = value; // Update the specific field
      return updatedWorkout;
    });
  };

  const fetchWorkouts = useCallback(async () => {
    try {
      const response = await axios.get(`${workoutApi}/${id}`);

      setWorkout(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return error;
    }
  }, [workoutApi, id]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const updateWorkout = (updater) => {
    setWorkout((prev) => {
      const updated = { ...prev };
      updater(updated);
      return updated;
    });
  };

  const addWeek = async (workoutId) => {
    try {
      await axios.post(`${workoutApi}/${workoutId}/add-week`);

      fetchWorkouts();
    } catch (error) {
      return error;
    }
  };

  const deleteWeek = async (workoutId, weekNumber) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the week?"
    );

    if (!confirmDelete) {
      return;
    }
    try {
      await axios.delete(`${workoutApi}/${workoutId}/weeks/${weekNumber}`);

      fetchWorkouts();
    } catch (error) {
      return error;
    }
  };

  const addDay = async (workoutId, weekNumber) => {
    try {
      await axios.post(
        `${workoutApi}/${workoutId}/weeks/${weekNumber}/add-day`
      );

      fetchWorkouts();
    } catch (error) {
      return error;
    }
  };

  const deleteDay = async (workoutId, weekNumber, dayNumber) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this the day?"
    );

    if (!confirmDelete) {
      return;
    }
    try {
      await axios.delete(
        `${workoutApi}/${workoutId}/weeks/${weekNumber}/days/${dayNumber}`
      );

      fetchWorkouts();
    } catch (error) {
      return error;
    }
  };

  const addExercise = (weekIndex, dayIndex) => {
    updateWorkout((workout) => {
      const day = workout.weeks[weekIndex].days[dayIndex];
      day.exercises.push({
        name: "New Exercise",
        sets: 1,
        targetReps: 0,
        weight: 0,
        rpe: 0,
      });
    });
  };

  if (loading) {
    return <div>Loading data...</div>; // Show loading state
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 text-gray-900 dark:text-gray-100">
        <div className="flex items-center gap-2  mb-6">
          <button className="w-8 " onClick={() => navigate(-1)}>
            <ArrowLeftIcon />
          </button>
        </div>
        <h1 className="text-2xl font-bold text-center mb-6 ">
          Edit Program: {workout.programName}
        </h1>

        {/* Program Name */}
        {/* <div className="mb-4">
          <label className="block text-sm font-medium">Program Name</label>
          <input
            type="text"
            value={workout.programName}
            onChange={(e) =>
              updateWorkout((workout) => {
                workout.programName = e.target.value;
              })
            }
            className="mt-1 block w-80 px-4 border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-2xl"
          />
        </div> */}

        {/* Weeks */}
        {workout.weeks.map((week, weekIndex) => (
          <div
            key={weekIndex}
            className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 mb-4 bg-gray-50 dark:bg-gray-700"
          >
            <div className="flex  items-center">
              <h2 className="text-lg font-semibold">Week {week.weekNumber}</h2>
              <div className="flex justify-items-end ml-auto gap-4 mb-4">
                <button
                  onClick={() => addDay(id, week.weekNumber)}
                  className=" px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                >
                  + Add Day
                </button>
                <button
                  onClick={() => deleteWeek(id, week.weekNumber)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                >
                  Delete Week
                </button>
              </div>
            </div>

            <ul
              role="list"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              {/* Days */}
              {week.days.map((day, dayIndex) => (
                <li
                  key={dayIndex}
                  className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg dark:bg-gray-800 text-center shadow"
                >
                  <div
                    key={dayIndex}
                    className=" border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-md font-medium">
                        Day {day.dayNumber}
                      </h3>
                    </div>

                    {/* Exercises */}
                    <div className="space-y-4 mt-4">
                      {day.exercises.map((exercise, exerciseIndex) => (
                        <div
                          key={exerciseIndex}
                          className="border border-gray-300 dark:border-gray-700 p-4 rounded-md space-y-2 bg-gray-50 dark:bg-gray-900"
                        >
                          <div className="flex justify-between items-center">
                            <input
                              type="text"
                              value={exercise.name}
                              onChange={(e) =>
                                updateExercise(
                                  weekIndex,
                                  dayIndex,
                                  exerciseIndex,
                                  "name",
                                  e.target.value
                                )
                              }
                              onKeyDown={(e) =>
                                handleKeyDown(
                                  e,
                                  id,
                                  weekIndex,
                                  dayIndex,
                                  exerciseIndex
                                )
                              } // Save on Enter
                              className="text-center block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium">
                                Sets
                              </label>
                              <input
                                type="number"
                                value={exercise.sets}
                                onChange={(e) =>
                                  updateExercise(
                                    weekIndex,
                                    dayIndex,
                                    exerciseIndex,
                                    "sets",
                                    parseInt(e.target.value)
                                  )
                                }
                                onKeyDown={(e) =>
                                  handleKeyDown(
                                    e,
                                    id,
                                    weekIndex,
                                    dayIndex,
                                    exerciseIndex
                                  )
                                } // Save on Enter
                                className="text-center block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium">
                                Target Reps
                              </label>
                              <input
                                type="number"
                                value={exercise.targetReps}
                                onChange={(e) =>
                                  updateExercise(
                                    weekIndex,
                                    dayIndex,
                                    exerciseIndex,
                                    "targetReps",
                                    parseInt(e.target.value)
                                  )
                                }
                                onKeyDown={(e) =>
                                  handleKeyDown(
                                    e,
                                    id,
                                    weekIndex,
                                    dayIndex,
                                    exerciseIndex
                                  )
                                } // Save on Enter
                                className="text-center block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium">
                                Weight
                              </label>
                              <input
                                type="number"
                                value={exercise.weight}
                                onChange={(e) =>
                                  updateExercise(
                                    weekIndex,
                                    dayIndex,
                                    exerciseIndex,
                                    "weight",
                                    parseFloat(e.target.value)
                                  )
                                }
                                onKeyDown={(e) =>
                                  handleKeyDown(
                                    e,
                                    id,
                                    weekIndex,
                                    dayIndex,
                                    exerciseIndex
                                  )
                                } // Save on Enter
                                className="text-center block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium">
                                RPE
                              </label>
                              <input
                                type="number"
                                value={exercise.rpe}
                                onChange={(e) =>
                                  updateExercise(
                                    weekIndex,
                                    dayIndex,
                                    exerciseIndex,
                                    "rpe",
                                    parseFloat(e.target.value)
                                  )
                                }
                                onKeyDown={(e) =>
                                  handleKeyDown(
                                    e,
                                    id,
                                    weekIndex,
                                    dayIndex,
                                    exerciseIndex
                                  )
                                } // Save on Enter
                                className="text-center block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              deleteDay(id, week.weekNumber, day.dayNumber)
                            }
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                          >
                            Delete Day
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => addExercise(weekIndex, dayIndex)}
                      className="px-2  bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
                    >
                      + Add Exercise
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <button
          onClick={() => addWeek(id)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md mt-4"
        >
          + Add Week
        </button>
      </div>
    </div>
  );
};

export default EditWorkouts;
