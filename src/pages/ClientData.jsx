import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NewWorkoutForm from "../components/NewWorkoutForm";

export default function ClientData() {
  const { id } = useParams();

  const [userData, setUserData] = useState([]);
  const [userWorkouts, setUserWorkouts] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [currentUsersProgram, setCurrentUsersProgram] = useState([]);
  const [pastUsersPrograms, setPastUsersPrograms] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleWeek = (weekIndex) => {
    setSelectedWeek(selectedWeek === weekIndex ? null : weekIndex);
  };

  const getDateString = (date) => {
    const options = { year: "numeric", month: "short" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3000/workouts`, {
        params: { clientId: id },
      });

      const completedPrograms = response.data.filter(
        (program) => program.completed === true
      );

      const currentPrograms = response.data.filter(
        (program) => program.completed === false
      );

      const completedProgramData = completedPrograms.map((program) => ({
        name: program.programName,
        dateCompleted: getDateString(program.updatedAt),
      }));

      setCurrentUsersProgram(currentPrograms);
      setPastUsersPrograms(completedProgramData);
      setUserData(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [id]);

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedUser(null); // Clear the selected user
  };

  const handleUserUpdate = () => {
    fetchUserData();
    handleModalClose(); // Close the modal after updating
  };

  const handleChange = (users) => {
    setSelectedUser(users); // Set the selected user
    setModalVisible(true);
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (loading) {
    return <div>Loading data...</div>; // Show loading state
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Page Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Client's Workouts</h1>
        <p className="text-gray-500">John Doe</p>
      </header>

      {/* Current Program */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Current Program</h2>
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-bold">
            {currentUsersProgram[0].programName}
          </h3>
          <p className="text-sm text-gray-500">
            Week {currentUsersProgram[0].currentWeek} of{" "}
            {currentUsersProgram[0].totalWeeks}
          </p>
          <button
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            onClick={() => alert("Show full program details")}
          >
            View Program Details
          </button>
        </div>
      </section>

      {/* Program Details */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2 text-white">
          Program Details
        </h2>
        {currentUsersProgram.length > 0
          ? currentUsersProgram[0].weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="mb-4">
                <button
                  className="w-full text-left px-4 py-2 bg-gray-200 rounded-md font-medium hover:bg-gray-300"
                  onClick={() => toggleWeek(weekIndex)}
                >
                  Week {week.weekNumber}
                </button>
                {selectedWeek === weekIndex && (
                  <div className="pl-6 pt-2">
                    {week.days.map((day, dayIndex) => (
                      <div key={dayIndex} className="mb-2 text-white">
                        <h4 className="font-semibold">Day {day.dayNumber}</h4>
                        <ul className="list-disc pl-5">
                          {day.exercises.map((exercise, exerciseIndex) => (
                            <li key={exerciseIndex}>
                              {exercise.name} ({exercise.sets}x
                              {exercise.targetReps} @ {exercise.weight} lbs)
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          : null}
      </section>

      {/* Past Programs */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Past Programs</h2>
        {pastUsersPrograms.map((program, index) => (
          <div
            key={index}
            className="p-4 mb-4 bg-white shadow-md rounded-lg flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-bold">{program.name}</h3>
              <p className="text-sm text-gray-500">
                Completed: {program.dateCompleted}
              </p>
            </div>
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              onClick={() => alert(`Viewing details for ${program.name}`)}
            >
              View Details
            </button>
          </div>
        ))}
      </section>

      <section>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          onClick={() => handleChange(userData)}
        >
          Create New Program
        </button>
      </section>

      {isModalVisible && (
        <NewWorkoutForm
          isVisible={isModalVisible}
          onClose={handleModalClose}
          user={selectedUser}
          onSave={handleUserUpdate}
        />
      )}
    </div>
  );
}
