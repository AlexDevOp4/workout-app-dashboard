import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NewWorkoutForm from "../components/NewWorkoutForm";

export default function ClientData() {
  const { id } = useParams();
  const workoutApi = import.meta.env.VITE_WORKOUTS_API_URL;
  const userApiUrl = import.meta.env.VITE_USERS_API_URL;
  const navigate = useNavigate();

  const [userData, setUserData] = useState([]);
  const [client, setClient] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [currentUsersProgram, setCurrentUsersProgram] = useState([]);
  const [pastUsersPrograms, setPastUsersPrograms] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHidden, setIsHidden] = useState(true);
  const [percentComplete, setPercentComplete] = useState(0);

  const toggleWeek = (weekIndex) => {
    setSelectedWeek(selectedWeek === weekIndex ? null : weekIndex);
  };

const calculatePercentCompleted = (currentWeek, totalWeeks) => {
  const percentCompleted = (currentWeek / totalWeeks) * 100;
  return percentCompleted;
};


  const getDateString = (date) => {
    const options = { year: "numeric", month: "short" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const fetchUserData = useCallback(async () => {
    console.log("first");
    try {
      const response = await axios.get(workoutApi, {
        params: { clientId: id },
      });

      const responseUserData = await axios.get(`${userApiUrl}/${id}`);
      setClient(responseUserData.data);

      const completedPrograms = response.data.filter(
        (program) => program.completed === true
      );

      const currentPrograms = response.data.filter(
        (program) => program.completed === false
      );

      const percentCompleted = calculatePercentCompleted(
        currentPrograms[0].currentWeek,
        currentPrograms[0].weeks.length,
      );
      setPercentComplete(percentCompleted);

      const currentWeekUserIsOn = currentPrograms.map((program) => {
        const currentWeek = program.weeks.find(
          (week) => week.weekNumber === program.currentWeek
        );
        return {
          ...program,
          currentWeek: program.currentWeek,
          programName: program.programName,
          weeks: [currentWeek],
        };
      });

      const completedProgramData = completedPrograms.map((program) => ({
        id: program._id,
        name: program.programName,
        dateCompleted: getDateString(program.updatedAt),
      }));

      setCurrentUsersProgram(currentPrograms);
      setPastUsersPrograms(completedProgramData);
      setUserData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return console.error(error);
    }
  }, [id, userApiUrl, workoutApi]);

  const handleModalClose = () => {
    fetchUserData();
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
    <div className="max-w-5xl mx-auto p-6 text-white">
      {/* Page Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold">
          {`${client.first_name} ${client.last_name}'s Workouts`}
        </h1>
      </header>

      {/* Current Program */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2 text-white">
          Current Program
        </h2>
        {currentUsersProgram[0] ? (
          <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 mb-4 bg-gray-50 dark:bg-gray-700">
            <h3 className="text-lg font-bold">
              {currentUsersProgram[0] ? currentUsersProgram[0].programName : ""}
            </h3>

            <div>
              <h4 className="sr-only">Status</h4>
              <div aria-hidden="true" className="mt-6">
                <div className="overflow-hidden rounded-full bg-gray-200">
                  <div
                    style={{ width: `${percentComplete}%` }}
                    className="h-2 rounded-full bg-indigo-600"
                  />
                </div>
                <div
                  className={`mt-6 hidden grid-cols-${currentUsersProgram[0].weeks.length} text-sm font-medium text-gray-600 sm:grid`}
                >
                  {currentUsersProgram[0].weeks.map((week, index) => (
                    <div key={index} className="text-indigo-600">
                      Week {week.weekNumber}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Week{" "}
              {currentUsersProgram ? currentUsersProgram[0].currentWeek : ""}{" "}
              Day {currentUsersProgram[0].currentDay}
            </p>
            <button
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              onClick={() =>
                navigate(`/clients/workouts/${currentUsersProgram[0]._id}`)
              }
            >
              View Program Details
            </button>
          </div>
        ) : (
          <div className="p-4 bg-white shadow-md rounded-lg">
            No current program assigned
          </div>
        )}
      </section>

      {/* Program Details */}
      {currentUsersProgram.length > 0 ? (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2 text-white">
            Program Details
          </h2>
          {currentUsersProgram[0].weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="mb-4">
              <button
                className="w-full text-left px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg p-4 mb-4 bg-gray-50 dark:bg-gray-700"
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
          ))}
        </section>
      ) : null}

      {/* Past Programs */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Past Programs</h2>
        {pastUsersPrograms ? (
          pastUsersPrograms.map((program, index) => (
            <div
              key={index}
              className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 mb-4 bg-gray-50 dark:bg-gray-700 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-bold">{program.name}</h3>
                <p className="text-sm text-gray-500">
                  Completed: {program.dateCompleted}
                </p>
              </div>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                onClick={() => navigate(`/clients/workouts/${program.id}`)}
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <div>No completed workouts</div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">
          {" "}
          <button onClick={() => setIsHidden(!isHidden)}>
            View All Programs
          </button>
        </h2>
        {pastUsersPrograms ? (
          userData.map((program, index) => (
            <div
              key={index}
              className={
                isHidden
                  ? "hidden"
                  : "border border-gray-300 dark:border-gray-700 rounded-lg p-4 mb-4 bg-gray-50 dark:bg-gray-700 flex justify-between items-center"
              }
            >
              <div>
                <h3 className="text-lg font-bold">{program.programName}</h3>
                <p className="text-sm text-gray-500">
                  Completed: {program.dateCompleted}
                </p>
              </div>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                onClick={() => navigate(`/clients/workouts/${program._id}`)}
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <div>No completed workouts</div>
        )}
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
