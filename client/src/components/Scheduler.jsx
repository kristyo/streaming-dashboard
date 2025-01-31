import React, { useState } from 'react';
import axios from 'axios';

const Scheduler = () => {
  const [schedule, setSchedule] = useState({
    startTime: '',
    endTime: '',
    days: []
  });

  const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/schedule', schedule);
      alert('Jadwal berhasil disimpan!');
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  return (
    <div className="scheduler">
      <h2>Atur Jadwal Streaming</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Waktu Mulai:</label>
          <input
            type="time"
            value={schedule.startTime}
            onChange={(e) => setSchedule({...schedule, startTime: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Hari:</label>
          <div className="days-grid">
            {daysOfWeek.map(day => (
              <label key={day}>
                <input
                  type="checkbox"
                  checked={schedule.days.includes(day)}
                  onChange={(e) => {
                    const days = e.target.checked
                      ? [...schedule.days, day]
                      : schedule.days.filter(d => d !== day);
                    setSchedule({...schedule, days});
                  }}
                />
                {day}
              </label>
            ))}
          </div>
        </div>

        <button type="submit">Simpan Jadwal</button>
      </form>
    </div>
  );
};

export default Scheduler;