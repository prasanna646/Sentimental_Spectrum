import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  const verifyBackupCodes = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5005/api/validateBackupCode', { email, code });
      if (response.data.message === "User not found") {
        alert("User not found");
      } else if (response.data.message === "Backup code validated successfully") {
        alert("Code verified!");
        setIsVerified(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5005/api/forgotPassword', { email, password });
      alert(response.data.message);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Forgot Password</h2>
        </div>

        {!isVerified ? (
          <form className="mt-8 space-y-6" onSubmit={verifyBackupCodes}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="appearance-none rounded-t-md w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Backup Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="appearance-none rounded-b-md w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Verify Code
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Set New Password
            </button>
          </form>
        )}

        <p className="mt-2 text-center text-sm text-gray-600">
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            {'<-'} Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
