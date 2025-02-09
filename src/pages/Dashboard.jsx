
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import useSWR from "swr";

ChartJS.register(...registerables);

const Dashboard = () => {
  const userApiUrl = import.meta.env.VITE_USERS_API_URL;
  const workoutApi = import.meta.env.VITE_WORKOUTS_API_URL;

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data: users, error: userError } = useSWR(userApiUrl, fetcher);
  const { data: workouts, error: workoutError } = useSWR(
    `${workoutApi}/all-workouts`,
    fetcher
  );

  // Show loading state while fetching data
  if (!users || !workouts) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          <p className="text-white mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (userError || workoutError) {
    return <p className="text-red-500">Error loading data</p>;
  }

  // Data for charts
  const userRolesData = {
    labels: ["Trainers", "Clients"],
    datasets: [
      {
        label: "Roles",
        data: [
          users.filter((user) => user.role === "trainer").length,
          users.filter((user) => user.role === "client").length,
        ],
        backgroundColor: ["#6366F1", "#22D3EE"],
      },
    ],
  };

  const workoutStatusData = {
    labels: ["Completed", "In Progress"],
    datasets: [
      {
        label: "Workout Status",
        data: [
          workouts.filter((workout) => workout.completed).length,
          workouts.filter((workout) => !workout.completed).length,
        ],
        backgroundColor: ["#10B981", "#F59E0B"],
      },
    ],
  };

  const workoutDistributionData = {
    labels: workouts.map((workout) => workout.programName),
    datasets: [
      {
        label: "Clients Per Workout Program",
        data: workouts.map((workout) =>
          workout.weeks.reduce(
            (clientCount, week) =>
              clientCount +
              week.days.reduce(
                (exerciseCount, day) => exerciseCount + day.exercises.length,
                0
              ),
            0
          )
        ),
        backgroundColor: workouts.map(
          (_, i) => `hsl(${i * (360 / workouts.length)}, 70%, 50%)`
        ),
      },
    ],
  };

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

      {/* Charts Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">User Roles Distribution</h2>
          <Pie data={userRolesData} />
        </div>
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">Workout Status</h2>
          <Pie data={workoutStatusData} />
        </div>
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg col-span-2">
          <h2 className="text-lg font-bold mb-4">Workouts by Program</h2>
          <Bar data={workoutDistributionData} options={{ responsive: true }} />
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
                  <td className="p-2">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2 capitalize">{user.role}</td>
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
