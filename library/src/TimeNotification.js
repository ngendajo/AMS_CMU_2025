import React, { useEffect } from 'react';
import useAuth from "./hooks/useAuth";
import axios from "axios";
import baseUrl from "./api/baseUrl";
import beepSoundFile from './beeps/beeps.mp3';

const TimeNotification = () => {
  const { auth } = useAuth();
  let i = 0;

  const getData = async (period) => {
    try {
      const response = await axios.get(baseUrl + '/attendances/', {
        headers: {
          "Authorization": 'Bearer ' + String(auth.accessToken)
        },
        withCredentials: true 
      });
      const data = response.data;
      const organized_data = [];
      const processed = {};
      const today = new Date().toISOString().split('T')[0];
      data.forEach(record => {
        if (record['date'] === today && record['period'] === period) {
          const key = `${record['studentid']}_${record['date']}`;
          if (!(key in processed)) {
            const row = {
              "date": record['date'],
              "studentid": record['studentid'],
              "name": (record['student_last_name'] + " " + record['student_first_name'])
                .split(' ')
                .map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
                .join(' '),
              "gender": record['gender'],
              "family_name": record['family_name'],
              "grade_name": record['grade_name'],
              "end_academic_year": record['end_academic_year'],
              "combination_name": record['combination_name'],
              "comment": record['comment'],
              "hasAbsent": false
            };
            organized_data.push(row);
            processed[key] = row;
          }
          if (record['status']==="absent") {
              processed[key]["hasAbsent"] = true;
          }
        }
      });
      return organized_data.filter(record => record.hasAbsent);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    const notificationTimes = ['08:10', '09:00', '09:10','09:47', '09:30', '10:10','10:30', '11:10', '13:10', '14:10', '15:10'];
    const beepSound = new Audio(beepSoundFile);

    const getPeriodFromTime = (currentTime) => {
      const timeToPeriod = {
        '08:10': 1, '09:00': 2, '09:10': 2, '09:47': 2, '09:30': 2,
        '10:10': 3,'10:30': 3, '11:10': 4, '13:10': 5, '14:10': 6, '15:10': 7
      };
      return timeToPeriod[currentTime] || null;
    };

    const showNotification = async (currentTime) => {
      const period = getPeriodFromTime(currentTime);
      if (!period) return;

      try {
        const data = await getData(period);
        console.log(period,data)
        if (data && data.length > 0) {
          const today = new Date().toISOString().split('T')[0];
          const studentList = data.map(student => `${student.name} (${student.studentid})`).join(', ');

          if (Notification.permission === 'granted') {
            new Notification(`Report of Period ${period} on ${today}`, { body: studentList });
          }
        }
      } catch (err) {
        console.error("Failed to show notification:", err);
      }
    };

    const playBeep = () => {
      beepSound.play().catch(err => console.warn("Audio play prevented:", err));
      i++;
    };

    const requestNotificationPermission = () => {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            console.log('Notification permission granted.');
          }
        });
      }
    };

    const checkNotificationTime = () => {
      const now = new Date();
      const currentDay = now.getDay();
      const currentTime = now.toTimeString().slice(0, 5);

      if (currentDay >= 1 && currentDay <= 5 && notificationTimes.includes(currentTime)) {
        showNotification(currentTime);
        playBeep();
      }
    };

    requestNotificationPermission();
    const interval = setInterval(checkNotificationTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return <div>{i === 0 ? null : i}</div>;
};

export default TimeNotification;
