import React, { useEffect, useState } from 'react';
import { format, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, parseISO } from 'date-fns';
import { jwtDecode } from 'jwt-decode';

export default function ExpireDate() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [expiryDate, setExpiryDate] = useState(null);
    const [showWarning, setShowWarning] = useState(false);
    const [remainingDays, setRemainingDays] = useState(null);
    const [remainingTime, setRemainingTime] = useState('');
  
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
          const hoursLeft = differenceInHours(expiry, new Date()) % 24;
          const minutesLeft = differenceInMinutes(expiry, new Date()) % 60;
          const secondsLeft = differenceInSeconds(expiry, new Date()) % 60;
  
          setRemainingDays(daysLeft);
          setRemainingTime(`${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`);
  
          if (daysLeft <= 10 && daysLeft >= 0) {
            setShowWarning(true);
          } else {
            setShowWarning(false);
          }
        } catch (error) {
          console.error("Invalid expiry date format:", error);
        }
      }
    }, [expiryDate, currentTime]);
  return (
    <div>
      {showWarning && remainingDays !== null && (
        <div className="bg-red-500 rounded-md text-white p-2 font-bold mb-2">
          <h1>⚠️ Your subscription is expiring soon! Expiry Date: {format(parseISO(expiryDate), "yyyy-MM-dd")} Remaining Days: {remainingDays} days, {remainingTime}</h1>
          <h2></h2>
          <p></p>
        </div>
      )}
    </div>
  )
}
