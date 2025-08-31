import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

const AppLayout = () => {
  return (
    <div className='bg-gray-800 text-white min-h-screen'>
       <div className='container px-6 py-4 mx-auto'>        {/*  // container make breakpoints diffrent for diffrent screen */}
      <Header/>
      <main>
        <Outlet/>
      </main>
      </div>
    </div>
  );
};

export default AppLayout;
