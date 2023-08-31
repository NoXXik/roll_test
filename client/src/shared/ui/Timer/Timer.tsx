import React, { useEffect, useState } from 'react';

interface TimerProps {
  timestamp: number | null;
}

const Timer: React.FC<TimerProps> = ({ timestamp }) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    let intervalId: number = 0;

    if (timestamp !== null) {
      intervalId = setInterval(() => {
        const currentTime = Date.now();
        setTimeRemaining(Math.max(0, timestamp - currentTime)); // Ограничиваем время не меньше 0
      }, 1000); // Обновление каждую секунду
    }

    return () => clearInterval(intervalId);
  }, [timestamp]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 1000 / 60);
    const seconds = Math.floor((time / 1000) % 60);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (timeRemaining <= 0 || timestamp === null) {
    return <div>Time's up!</div>;
  }

  return <div>{formatTime(timeRemaining)}</div>;
};

export default Timer;
