import React from 'react';
import forbidden from '../assets/Forbidden.png'
import { useNavigate } from 'react-router-dom';

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <header className="absolute top-4 left-4 flex items-center space-x-2">
      <div className="text-gray-600 text-3xl font-bold">Apala<span className="text-blue-400">Bajar</span></div>
      </header>
      <div className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8">
        <img
          src={forbidden}
          alt="Illustration of a police officer stopping"
          className="w-[600px] object-contain"
        />
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold text-primary">403 Forbidden</h1>
          <p className="mt-2 text-lg text-red-600">Sorry but the requested source is not available for you.</p>
          <div className="mt-4">
            <p className="text-xs font-semibold text-muted-foreground text-gray-500">
              We cannot authorize your information. If you are certain that you have access to this source, please contact us!
            </p>
          </div>
          <div className="mt-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <button
              className="px-4 py-2 border border-primary bg-purple-500 text-white font-semibold hover:bg-purple-600 hover:text-primary-foreground rounded-md"
              onClick={() => navigate('/dashboard')}
            >
              Go back home
            </button>
            <button
              className="px-4 py-2 bg-accent border border-gray-600 text-accent-foreground hover:font-semibold rounded-md"
              onClick={() => navigate('/contact')}
            >
              Contact us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
