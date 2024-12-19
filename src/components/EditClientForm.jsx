"use client";
import { useState } from "react";
import axios from "axios";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { PropTypes } from "prop-types";

EditClientForm.propTypes = {
  isVisible: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
  user: PropTypes.object,
  onSave: PropTypes.func,
};

export default function EditClientForm({ isVisible, onClose, user, onSave }) {
  const userApiUrl = import.meta.env.VITE_USERS_API_URL;

  const [first_name, setFirstName] = useState(user.first_name);
  const [last_name, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${userApiUrl}/${user.user_id}`, {
        first_name: first_name,
        last_name: last_name,
        email: email,
        role: role,
      });
      onClose();
      onSave({ ...user, first_name, last_name, email, role });
    } catch (error) {
      console.error("Error:", error.message);
      return error;
    }
  };

  if (!isVisible) return null;
  return (
    <Dialog open={isVisible} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <form onSubmit={submitForm}>
              <div className="space-y-12">
                <div className="border-b border-white/10 pb-12">
                  <h2 className="text-base/7 font-semibold text-black">
                    Personal Information
                  </h2>

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="first-name"
                          className="block text-sm/6 font-medium text-black"
                        >
                          First name
                        </label>
                        <div className="mt-2">
                          <input
                            id="first-name"
                            name="first-name"
                            type="text"
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder={first_name}
                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline outline-1 -outline-offset-1 outline-black placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="last-name"
                          className="block text-sm/6 font-medium text-black"
                        >
                          Last name
                        </label>
                        <div className="mt-2">
                          <input
                            id="last-name"
                            name="last-name"
                            type="text"
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder={last_name}
                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline outline-1 -outline-offset-1 outline-black placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-4">
                        <label
                          htmlFor="email"
                          className="block text-sm/6 font-medium text-black"
                        >
                          Email address
                        </label>
                        <div className="mt-2">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={email}
                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline outline-1 -outline-offset-1 outline-black placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-4">
                        <label
                          htmlFor="role"
                          className="block text-sm/6 font-medium text-black"
                        >
                          Users Role
                        </label>
                        <div className="mt-2">
                          <input
                            id="role"
                            name="role"
                            onChange={(e) => setRole(e.target.value)}
                            placeholder={role}
                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline outline-1 -outline-offset-1 outline-black placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-sm/6 font-semibold text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Save
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
