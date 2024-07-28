// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './Redux/store'; 
import Navbar from './component/Navbar';
import Dashboard from './Pages/dashboard';
import Purchase from './Pages/purchase';
import Inventory from './Pages/inventory';
// import Sales from './pages/Sales';
import EditOrder from './Pages/editOrder.js';
import View from './Pages/view.js';
import Login from './Pages/login';
import Sales from './Pages/sale';
import Forbidden from './component/Forbidden';
import Admin from './Pages/admin';
// import Accounts from './pages/Accounts';
// import Reports from './pages/Reports';
// import Msg from './pages/Msg';
// import Import from './pages/Import';
// import More from './pages/More';
// import Company from './pages/Company';
import Users from './Pages/users.js';
// import Settings from './pages/Settings';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './component/ProtectedRoute';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<PageWithNavbar><Dashboard /></PageWithNavbar>} />
          <Route path="/purchase" element={<PageWithNavbar><Purchase /></PageWithNavbar>} />
          <Route path="/inventory" element={<PageWithNavbar><Inventory /></PageWithNavbar>} />
          <Route path="/sales" element={<PageWithNavbar><Sales /></PageWithNavbar>} />
          <Route path="/editOrder" element={<PageWithNavbar><EditOrder /></PageWithNavbar>} />
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="/users" element={<PageWithNavbar><Users /></PageWithNavbar>} />
          <Route path="/view" element={<PageWithNavbar><View /></PageWithNavbar>} />

          {/* Admin protected routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <PageWithNavbar><Admin /></PageWithNavbar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <PageWithNavbar><Users /></PageWithNavbar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/purchase"
            element={
              <ProtectedRoute requiredRole="admin">
                <PageWithNavbar><Purchase /></PageWithNavbar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/inventory"
            element={
              <ProtectedRoute requiredRole="admin">
                <PageWithNavbar><Inventory /></PageWithNavbar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/sales"
            element={
              <ProtectedRoute requiredRole="admin">
                <PageWithNavbar><Sales /></PageWithNavbar>
              </ProtectedRoute>
            }
          />
           <Route path="/view" element={<PageWithNavbar><View /></PageWithNavbar>} />
          {/*<Route path="/accounts" element={<PageWithNavbar><Accounts /></PageWithNavbar>} />
          <Route path="/reports" element={<PageWithNavbar><Reports /></PageWithNavbar>} />
          <Route path="/msg" element={<PageWithNavbar><Msg /></PageWithNavbar>} />
          <Route path="/import" element={<PageWithNavbar><Import /></PageWithNavbar>} />
          <Route path="/more" element={<PageWithNavbar><More /></PageWithNavbar>} />
          <Route path="/company" element={<PageWithNavbar><Company /></PageWithNavbar>} />
          <Route path="/users" element={<PageWithNavbar><Users /></PageWithNavbar>} />
          <Route path="/settings" element={<PageWithNavbar><Settings /></PageWithNavbar>} /> */}
        </Routes>
        <ToastContainer />
      </Router>
    </Provider>
  );
};

// Component to conditionally include Navbar
const PageWithNavbar = ({ children }) => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/' && <Navbar />}
      {children}
    </>
  );
};

export default App;
