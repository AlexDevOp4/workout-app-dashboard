import { useState, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Dialog } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const NewWorkoutForm = ({ isVisible, onClose, user }) => {
  const workoutApi = import.meta.env.VITE_WORKOUTS_API_URL;
  const navigate = useNavigate();

  console.log(user);

  const getDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  const [formData, setFormData] = useState({
    clientId: user[0].clientId,
    startDate: getDateString(new Date()),
    programName: "New Workout Program",
    currentWeek: 1,
    completed: false,
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

  const updateWorkout = (updater) => {
    setFormData((prev) => {
      const updated = { ...prev };
      updater(updated);
      return updated;
    });
  };

  const addWeek = () => {
    updateWorkout((workout) => {
      workout.weeks.push({
        weekNumber: workout.weeks.length + 1,
        days: [
          {
            dayNumber: 1,
            exercises: [
              {
                name: "New Exercise",
                sets: 1,
                targetReps: 0,
                weight: 0,
                rpe: 0,
              },
            ],
          },
        ],
      });
    });
  };

  const addDayToWeek = useCallback(
    (weekIndex) => {
      setFormData((prev) => {
        const updated = { ...prev };

        const newDayNumber = updated.weeks[weekIndex].days.length + 1;

        const newDay = {
          dayNumber: newDayNumber,
          exercises: [
            {
              name: "New Exercise",
              sets: 1,
              targetReps: 0,
              weight: 0,
              rpe: 0,
            },
          ],
        };

        updated.weeks[weekIndex].days.push(newDay);

        return updated;
      });
    },
    [setFormData]
  );

  const deleteExercise = (weekIndex, dayIndex, exerciseIndex) => {
    if (formData.weeks[weekIndex].days[dayIndex].exercises.length === 1) {
      alert("Cannot delete the only exercise in a day.");
      return;
    }
    updateWorkout((workout) => {
      workout.weeks[weekIndex].days[dayIndex].exercises.splice(
        exerciseIndex,
        1
      );
    });
  };

  const deleteDay = (weekIndex, dayIndex) => {
    const weekDayLength = formData.weeks[weekIndex].days.length;
    if (weekDayLength === 1) {
      alert("Cannot delete the only day in a week.");
      return;
    }
    updateWorkout((workout) => {
      workout.weeks[weekIndex].days.splice(dayIndex, 1);
    });
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

  const handleSubmit = async () => {
    try {
      await axios.post(workoutApi, formData);
      alert("Workout created successfully!");
      onClose();
    } catch (error) {
      onclose();
      alert("Failed to create workout.", error);
    }
  };

  const copyWeek = (weekIndex) => {
    console.log(formData.weeks[weekIndex].days);
    updateWorkout((workout) => {
      workout.weeks.push({
        weekNumber: workout.weeks.length + 1,
        days: formData.weeks[weekIndex].days,
      });
    });
  };

  if (!isVisible) return null;

  return (
    <Dialog open={isVisible} onClose={onClose} className="relative z-10">
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-gray-800 text-white rounded-lg shadow-lg w-full max-w-5xl max-h-screen overflow-y-auto">
          <div className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-900 ">
            <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 text-gray-900 dark:text-gray-100">
              <h1 className="text-2xl font-bold mb-6">Create New Workout</h1>

              {/* Program Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Program Name
                </label>
                <input
                  type="text"
                  value={formData.programName}
                  onChange={(e) =>
                    updateWorkout((workout) => {
                      workout.programName = e.target.value;
                    })
                  }
                  className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* Weeks */}
              {formData.weeks.map((week, weekIndex) => (
                <div
                  key={weekIndex}
                  className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 mb-4 bg-gray-50 dark:bg-gray-700"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">
                      Week {week.weekNumber}
                    </h2>
                    <button
                      onClick={() => addDayToWeek(weekIndex)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                    >
                      + Add Day
                    </button>
                    <button
                      onClick={() => copyWeek(weekIndex)}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md text-sm"
                    >
                      Copy Week
                    </button>
                  </div>

                  <ul
                    role="list"
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1"
                  >
                    {week.days.map((day, dayIndex) => (
                      <li
                        key={dayIndex}
                        className="justify- flex flex-col divide-y divide-gray-200 rounded-lg dark:bg-gray-800 text-center shadow"
                      >
                        <div
                          key={dayIndex}
                          className=" border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 w-auto px-2 "
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="text-md font-medium">
                              Day {day.dayNumber}
                            </h3>
                          </div>

                          <div className="">
                            {day.exercises.map((exercise, exerciseIndex) => (
                              <div
                                key={exerciseIndex}
                                className="border mb-4 border-gray-300 dark:border-gray-700  rounded-md space-y-2 bg-gray-50 dark:bg-gray-900 py-4 px-2 w-52"
                              >
                                <div className="flex flex-col items-center relative">
                                  <TrashIcon
                                    onClick={() =>
                                      deleteExercise(weekIndex, dayIndex)
                                    }
                                    className="w-4 absolute -top-3 -right-2"
                                  />
                                  <input
                                    type="text"
                                    onChange={(e) =>
                                      updateWorkout((workout) => {
                                        workout.weeks[weekIndex].days[
                                          dayIndex
                                        ].exercises[exerciseIndex].name =
                                          e.target.value;
                                      })
                                    }
                                    placeholder={exercise.name}
                                    className="text-center block w-26 border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2 ">
                                  <div className="flex flex-col items-center">
                                    <label className="block text-sm font-medium">
                                      Sets
                                    </label>
                                    <input
                                      type="number"
                                      onChange={(e) =>
                                        updateWorkout((workout) => {
                                          workout.weeks[weekIndex].days[
                                            dayIndex
                                          ].exercises[exerciseIndex].sets =
                                            e.target.value;
                                        })
                                      }
                                      placeholder={exercise.sets}
                                      className="text-center block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <label className="block text-sm font-medium">
                                      Target Reps
                                    </label>
                                    <input
                                      type="number"
                                      onChange={(e) =>
                                        updateWorkout((workout) => {
                                          workout.weeks[weekIndex].days[
                                            dayIndex
                                          ].exercises[
                                            exerciseIndex
                                          ].targetReps = e.target.value;
                                        })
                                      }
                                      placeholder={exercise.targetReps}
                                      className="text-center block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium">
                                      Weight
                                    </label>
                                    <input
                                      type="number"
                                      onChange={(e) =>
                                        updateWorkout((workout) => {
                                          workout.weeks[weekIndex].days[
                                            dayIndex
                                          ].exercises[exerciseIndex].weight =
                                            e.target.value;
                                        })
                                      }
                                      placeholder={exercise.weight}
                                      className="text-center block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium">
                                      RPE
                                    </label>
                                    <input
                                      type="number"
                                      onChange={(e) =>
                                        updateWorkout((workout) => {
                                          workout.weeks[weekIndex].days[
                                            dayIndex
                                          ].exercises[exerciseIndex].rpe =
                                            e.target.value;
                                        })
                                      }
                                      placeholder={exercise.rpe}
                                      className="text-center block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                  </div>
                                </div>
                                <button
                                  onClick={() => deleteDay(weekIndex, dayIndex)}
                                  className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs"
                                >
                                  Delete Day
                                </button>
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => addExercise(weekIndex, dayIndex)}
                            className="mt-2 px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
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
                onClick={addWeek}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md mt-4"
              >
                + Add Week
              </button>

              <div className="flex justify-end mt-6 space-x-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmit()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                  Save Workout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
NewWorkoutForm.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.arrayOf(
    PropTypes.shape({
      clientId: PropTypes.string.isRequired,
    })
  ).isRequired,
  onCancel: PropTypes.func,
};

export default NewWorkoutForm;
