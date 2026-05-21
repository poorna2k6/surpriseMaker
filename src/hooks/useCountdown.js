import { useState, useEffect } from 'react';

/**
 * Returns a live countdown to targetDate, updating every second.
 *
 * @param {Date|null} targetDate
 * @returns {{ days: number, hours: number, minutes: number, seconds: number, isToday: boolean, isPast: boolean }}
 */
function useCountdown(targetDate) {
  const computeDiff = () => {
    if (!targetDate || !(targetDate instanceof Date) || isNaN(targetDate)) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isToday: false, isPast: false };
    }

    const now = Date.now();
    const target = targetDate.getTime();
    const diff = target - now;

    // Check if target date is today (same calendar day in local time)
    const nowDate = new Date(now);
    const targetDateLocal = new Date(target);
    const isToday =
      nowDate.getFullYear() === targetDateLocal.getFullYear() &&
      nowDate.getMonth() === targetDateLocal.getMonth() &&
      nowDate.getDate() === targetDateLocal.getDate();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isToday, isPast: !isToday };
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days    = Math.floor(totalSeconds / 86400);
    const hours   = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds, isToday, isPast: false };
  };

  const [countdown, setCountdown] = useState(computeDiff);

  useEffect(() => {
    if (!targetDate || !(targetDate instanceof Date) || isNaN(targetDate)) {
      setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isToday: false, isPast: false });
      return;
    }

    // Update immediately so first render is accurate
    setCountdown(computeDiff());

    const interval = setInterval(() => {
      setCountdown(computeDiff());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]); // eslint-disable-line react-hooks/exhaustive-deps

  return countdown;
}

export default useCountdown;
