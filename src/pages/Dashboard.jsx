import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const userApiUrl = import.meta.env.VITE_USERS_API_URL;
  const workoutApi = import.meta.env.VITE_WORKOUTS_API_URL;

  const [users, setUsers] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users and workouts
  const fetchDashboardData = async () => {
    try {
      const [userResponse, workoutResponse] = await Promise.all([
        fetch(userApiUrl),
        fetch(`${workoutApi}/all-workouts`),
      ]);
      const usersData = await userResponse.json();
      const workoutsData = await workoutResponse.json();

      setUsers(usersData);
      setWorkouts(workoutsData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          <p className="text-white mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Trainer Dashboard</h1>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg">
          Add New Workout
        </button>
      </header>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold">Total Users</h2>
          <p className="text-3xl font-bold mt-4">{users.length}</p>
        </div>
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold">Total Workouts</h2>
          <p className="text-3xl font-bold mt-4">{workouts.length}</p>
        </div>
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold">Active Trainers</h2>
          <p className="text-3xl font-bold mt-4">
            {users.filter((u) => u.role === "trainer").length}
          </p>
        </div>
      </section>

      {/* Users Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Users</h2>
        <div className="overflow-x-auto bg-gray-800 p-4 rounded-lg shadow-lg">
          <table className="table-auto w-full">
            <thead>
              <tr className="text-left text-sm uppercase border-b border-gray-700">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-700">
                  <td className="p-2">{user.first_name} {user.last_name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2 capitalize">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Workouts Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Workouts</h2>
        <div className="overflow-x-auto bg-gray-800 p-4 rounded-lg shadow-lg">
          <table className="table-auto w-full">
            <thead>
              <tr className="text-left text-sm uppercase border-b border-gray-700">
                <th className="p-2">Workout Name</th>
                <th className="p-2">Clients</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout) => (
                <tr key={workout._id} className="border-b border-gray-700">
                  <td className="p-2">{workout.programName}</td>
                  <td className="p-2">{workout.clients?.length || 0}</td>
                  <td className="p-2 capitalize">
                    {workout.completed ? "Completed" : "In Progress"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
