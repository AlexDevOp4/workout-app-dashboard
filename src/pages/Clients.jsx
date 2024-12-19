import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import NewClientForm from "../components/EditClientForm";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";


export default function Clients() {
  const userApiUrl = import.meta.env.VITE_USERS_API_URL;
  const authApiUrl = import.meta.env.VITE_API_URL;

  const [clients, setClients] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchClients = useCallback(async () => {
    try {
      const response = await axios.get(`${userApiUrl}/`);
      setClients(response.data);
    } catch (error) {
      console.log(error);
      return error;
    }
  }, [userApiUrl]);

  const handleDelete = async (id, firebaseUID) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }
    try {
      await axios.delete(`${userApiUrl}/${id}`);
      await axios.delete(`${authApiUrl}/delete-user/${firebaseUID}`);
      fetchClients();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (users) => {
    setSelectedUser(users); // Set the selected user
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedUser(null); // Clear the selected user
  };

  const handleUserUpdate = () => {
    fetchClients();
    handleModalClose(); // Close the modal after updating
  };

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return (
    <div className="container mx-auto pt-24">
      <div className="bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="bg-gray-900 py-10">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h1 className="text-base font-semibold text-white">Users</h1>
                  <p className="mt-2 text-sm text-gray-300">
                    A list of all the users in your account including their
                    name, title, email and role.
                  </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                  <button
                    type="button"
                    className="block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    Add user
                  </button>
                </div>
              </div>
              <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0"
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                          >
                            Email
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                          >
                            Role
                          </th>
                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                          >
                            <span className="sr-only">Edit</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {clients.map((person) => (
                          <tr key={person.email}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                              {person.first_name} {person.last_name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                              {person.email}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                              {person.role}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                              <button
                                onClick={() => handleChange(person)}
                                className="text-indigo-400"
                              >
                                <PencilSquareIcon className="h-5 w-5" />
                                <span className="sr-only">, {person.name}</span>
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(person._id, person.firebaseUID)
                                }
                                className="text-red-500  pl-4"
                              >
                                <TrashIcon className="h-5 w-5" />
                                <span className="sr-only">, {person.name}</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalVisible && (
        <NewClientForm
          isVisible={isModalVisible}
          onClose={handleModalClose}
          user={selectedUser}
          onSave={handleUserUpdate}
        />
      )}
    </div>
  );
}
