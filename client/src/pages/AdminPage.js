import React, { useEffect, useState } from "react";

const AdminPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/registrations");
        const data = await response.json();
        setRegistrations(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching registrations:", error);
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading registrations...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-yellow-600">SiriNova Registrations</h1>
      <table className="min-w-full border border-gray-300 shadow-md rounded-lg">
        <thead>
          <tr className="bg-yellow-100">
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b">danceStyle</th>
            <th className="py-2 px-4 border-b">experience</th>
            <th className="py-2 px-4 border-b">Date</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((reg) => (
            <tr key={reg._id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{reg.name}</td>
              <td className="py-2 px-4 border-b">{reg.email}</td>
              <td className="py-2 px-4 border-b">{reg.phone}</td>
              <td className="py-2 px-4 border-b">{reg.danceStyle}</td>
              <td className="py-2 px-4 border-b">{reg.experience}</td>
              <td className="py-2 px-4 border-b">{new Date(reg.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
