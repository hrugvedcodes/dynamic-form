import React from "react";

const UserInfo = () => {
  return (
    <form className="space-y-4">
      <div className="flex flex-col">
        <label htmlFor="firstName" className="font-semibold">
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="lastName" className="font-semibold">
          Last Name
        </label>
        <input
          type="text"
          id="lastName"
          className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="age" className="font-semibold">
          Age
        </label>
        <input
          type="number"
          id="age"
          className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <button
        type="submit"
        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
      >
        Submit
      </button>
    </form>
  );
};

export default UserInfo;
