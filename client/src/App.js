// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './component/Navbar';
import Dashboard from './Pages/dashboard';
import Purchase from './Pages/purchase';
import Inventory from './Pages/inventory';
// import Sales from './pages/Sales';
import View from './Pages/View';
// import Accounts from './pages/Accounts';
// import Reports from './pages/Reports';
// import Msg from './pages/Msg';
// import Import from './pages/Import';
// import More from './pages/More';
// import Company from './pages/Company';
import Users from './Pages/Users.js';
// import Settings from './pages/Settings';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/users" element={<Users />} />
        <Route path="/view" element={<View />} />


        {/* <Route path="/sales" element={<Sales />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/msg" element={<Msg />} />
        <Route path="/import" element={<Import />} />
        <Route path="/more" element={<More />} />
        <Route path="/company" element={<Company />} />
        <Route path="/settings" element={<Settings />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
