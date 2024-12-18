import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUserContext } from "../UserContext";
import NewClientForm from "../components/NewClientForm";
export default function Clients() {
  const { user } = useUserContext();
  const userApiUrl = import.meta.env.VITE_USERS_API_URL;
  const [clients, setClients] = useState([]);
  const [currentUser, setCurrentUser] = useState([user]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${userApiUrl}/`);
        console.log(response.data);
        console.log(currentUser);
        setClients(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  return (
    <div className="container mx-auto pt-24">
      <h1 className="text-white text-center">List of clients</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <ul>
        {clients.map((client) => (
          <li className="text-gray-400 text-center" key={client.id}>
            {client.first_name} {client.last_name} - {client.role}
          </li>
        ))}
      </ul>

      <button onClick={openModal}>Create New user</button>

      <NewClientForm isVisible={isModalVisible} onClose={closeModal}>
        
      </NewClientForm>
    </div>
  );
}
