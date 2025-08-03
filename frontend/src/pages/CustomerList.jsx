import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CustomerList = () => {
  const { token } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line
  }, [token]);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/customers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch customers');
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      setCustomers([]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      const res = await fetch(`http://localhost:8000/api/customers/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete customer');
      fetchCustomers();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const startEdit = (customer) => {
    setEditingId(customer._id);
    setEditForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8000/api/customers/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('Failed to update customer');
      setEditingId(null);
      fetchCustomers();
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Customer List</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) =>
            editingId === customer._id ? (
              <tr key={customer._id}>
                <td className="border px-4 py-2">
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="border p-1 w-full"
                  />
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className="border p-1 w-full"
                  />
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="text"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleEditChange}
                    className="border p-1 w-full"
                  />
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={handleEditSubmit}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-400 text-white px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={customer._id}>
                <td className="border px-4 py-2">{customer.name}</td>
                <td className="border px-4 py-2">{customer.email}</td>
                <td className="border px-4 py-2">{customer.phone}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => startEdit(customer)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(customer._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
      {customers.length === 0 && (
        <div className="mt-4 text-gray-500">No customers found.</div>
      )}
    </div>
  );
};

export default CustomerList;
