import React from 'react';
import RegisterForm from '../components/RegisterForm';

const Register = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      <RegisterForm />
    </div>
  </div>
);

export default Register;