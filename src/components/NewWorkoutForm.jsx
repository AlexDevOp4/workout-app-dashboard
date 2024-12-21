import React, { useState, useEffect, useCallback } from "react";
import { Dialog } from "@headlessui/react";
import PropTypes from "prop-types";
import axios from "axios";

const NewWorkoutForm = ({ isVisible, onClose, user, onSave }) => {
  const userApiUrl = import.meta.env.VITE_USERS_API_URL;

  const [client, setClient] = useState({});
  const fetchClients = useCallback(async () => {
    try {
      const response = await axios.get(`${userApiUrl}/${user[0].clientId}`);
      setClient(response.data);
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  }, [user, userApiUrl]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const [formData, setFormData] = useState({
    clientId: user[0].clientId,
    programName: "",
    startDate: "",
    weeks: [
      {
        weekNumber: 1,
        days: [
          {
            dayNumber: 1,
            exercises: [
              {
                name: "",
                weight: 0,
                sets: 0,
                targetReps: 0,
                actualReps: [],
                rpe: 0,
                rest: 0,
              },
            ],
          },
        ],
      },
    ],
  });

  // Handle input changes
  const handleInputChange = (e, path) => {
    const keys = path.split(".");
    const value = e.target.value;

    setFormData((prev) => {
      const data = { ...prev };
      let ref = data;
      for (let i = 0; i < keys.length - 1; i++) {
        ref = ref[keys[i]];
      }
      ref[keys[keys.length - 1]] = value;
      return data;
    });
  };

  // Add a new week
  const addWeek = () => {
    setFormData((prev) => ({
      ...prev,
      weeks: [
        ...prev.weeks,
        {
          weekNumber: prev.weeks.length + 1,
          days: [
            {
              dayNumber: 1,
              exercises: [
                {
                  name: "",
                  weight: 0,
                  sets: 0,
                  targetReps: 0,
                  actualReps: [],
                  rpe: 0,
                  rest: 0,
                },
              ],
            },
          ],
        },
      ],
    }));
  };

  // Add a new day to a specific week
  const addDay = (weekIndex) => {
    setFormData((prev) => {
      const updatedWeeks = JSON.parse(JSON.stringify(prev.weeks));

      const newDay = {
        dayNumber: updatedWeeks[weekIndex].days.length + 1,
        exercises: [
          {
            name: "",
            weight: 0,
            sets: 0,
            targetReps: 0,
            actualReps: [],
            rpe: 0,
            rest: 0,
          },
        ],
      };

      updatedWeeks[weekIndex].days.push(newDay);
      return { ...prev, weeks: updatedWeeks };
    });
  };

  // Add a new exercise
  const addExercise = (weekIndex, dayIndex) => {
    setFormData((prev) => {
      const updatedWeeks = JSON.parse(JSON.stringify(prev.weeks));
      updatedWeeks[weekIndex].days[dayIndex].exercises.push({
        name: "",
        weight: 0,
        sets: 0,
        targetReps: 0,
        actualReps: [],
        rpe: 0,
        rest: 0,
      });
      return { ...prev, weeks: updatedWeeks };
    });
  };

  // Delete a week
  const deleteWeek = (weekIndex) => {
    setFormData((prev) => {
      const updatedWeeks =
        prev.weeks.length > 1
          ? prev.weeks.filter((_, i) => i !== weekIndex)
          : prev.weeks;
      return {
        ...prev,
        weeks: updatedWeeks.map((week, i) => ({ ...week, weekNumber: i + 1 })),
      };
    });
  };

  // Delete a day
  const deleteDay = (weekIndex, dayIndex) => {
    setFormData((prev) => {
      const updatedWeeks = JSON.parse(JSON.stringify(prev.weeks));
      const week = updatedWeeks[weekIndex];

      if (week.days.length > 1) {
        week.days.splice(dayIndex, 1);
        week.days = week.days.map((day, i) => ({ ...day, dayNumber: i + 1 }));
      }
      return { ...prev, weeks: updatedWeeks };
    });
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    try {
      const response = await axios.post(
        "http://localhost:3000/workouts",
        formData
      );
      console.log("Workout created:", response.data);
    } catch (error) {
      console.error("Error creating workout:", error);
    }

    onSave(formData); // Pass formData to onSave callback
    onClose(); // Close the modal
  };

  if (!isVisible) return null;

  return (
    <Dialog open={isVisible} onClose={onClose} className="relative z-10">
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-gray-800 text-white rounded-lg shadow-lg w-3/4 max-w-5xl max-h-screen overflow-y-auto">
          <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Create New Workout</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            {/* Client Info */}
            <div>
              <label className="block text-sm font-medium">Client</label>
              <p>
                {client.first_name} {client.last_name}
              </p>
            </div>

            {/* Program Name */}
            <div>
              <label className="block text-sm font-medium">Program Name</label>
              <input
                type="text"
                value={formData.programName}
                onChange={(e) => handleInputChange(e, "programName")}
                className="mt-1 block w-full bg-gray-900 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange(e, "startDate")}
                className="mt-1 block w-full bg-gray-900 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* Weeks */}
            <div className="space-y-6">
              {formData.weeks.map((week, weekIndex) => (
                <div
                  key={weekIndex}
                  className="border border-gray-700 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      Week {week.weekNumber}
                    </h3>
                    <button
                      type="button"
                      onClick={() => deleteWeek(weekIndex)}
                      className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md"
                      disabled={formData.weeks.length === 1}
                    >
                      Delete Week
                    </button>
                  </div>
                  <div className="flex space-x-4 overflow-x-auto mt-4">
                    {week.days.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className="min-w-[200px] border border-gray-700 rounded-lg p-4"
                      >
                        <h4 className="font-medium mb-2">
                          Day {day.dayNumber}
                        </h4>
                        <div className="space-y-2">
                          {day.exercises.map((exercise, exerciseIndex) => (
                            <div key={exerciseIndex} className="space-y-2">
                              <label className="block text-sm font-medium">
                                Exercise Name
                              </label>
                              <input
                                type="text"
                                placeholder="Exercise Name"
                                value={exercise.name}
                                onChange={(e) =>
                                  handleInputChange(
                                    e,
                                    `weeks.${weekIndex}.days.${dayIndex}.exercises.${exerciseIndex}.name`
                                  )
                                }
                                className="block w-full bg-gray-900 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                              <label className="block text-sm font-medium">
                                Weight
                              </label>
                              <input
                                type="number"
                                placeholder="Weight"
                                value={exercise.weight}
                                onChange={(e) =>
                                  handleInputChange(
                                    e,
                                    `weeks.${weekIndex}.days.${dayIndex}.exercises.${exerciseIndex}.weight`
                                  )
                                }
                                className="block w-full bg-gray-900 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addExercise(weekIndex, dayIndex)}
                            className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md"
                          >
                            + Add Exercise
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteDay(weekIndex, dayIndex)}
                          className="text-red-500 hover:text-red-700 mt-2"
                          disabled={week.days.length === 1}
                        >
                          Delete Day
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addDay(weekIndex)}
                      className="h-32 w-32 flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded-lg"
                    >
                      + Add Day
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addWeek}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                + Add Week
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md w-full"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

NewWorkoutForm.propTypes = {
  isVisible: PropTypes.bool,
  onClose: PropTypes.func,
  user: PropTypes.array.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default NewWorkoutForm;
