import React, { useEffect, useState } from 'react';
import { format, differenceInDays, parseISO } from 'date-fns';
import { jwtDecode } from 'jwt-decode';

const Expire = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expiryDate, setExpiryDate] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [remainingDays, setRemainingDays] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setExpiryDate(decodedToken.expiryDate);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (expiryDate) {
      try {
        const expiry = parseISO(expiryDate);
        const daysLeft = differenceInDays(expiry, new Date());
        setRemainingDays(daysLeft);

        if (daysLeft <= 10 && daysLeft >= 0) {
          setShowWarning(true);
        } else {
          setShowWarning(false);
        }
      } catch (error) {
        console.error("Invalid expiry date format:", error);
      }
    }
  }, [expiryDate]);

  return (
    <div>
      {showWarning && remainingDays !== null && (
        <div className="bg-white rounded-md text-red-400 p-4">
          <h1>⚠️ Your subscription is expiring soon!</h1>
          <h2>Expiry Date: {format(parseISO(expiryDate), "yyyy-MM-dd")}</h2>
          <p>Remaining Days: {remainingDays} days</p>
        </div>
      )}
    </div>
  );
};

export default Expire;
