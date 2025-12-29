"use client";

import { useState } from "react";

export default function RainTimeSlider() {
  const [hour, setHour] = useState(0);

  return (
    <div className="panel">
      <h4>🕒 Rainfall Timeline</h4>
      <input
        type="range"
        min={0}
        max={24}
        value={hour}
        onChange={(e) => setHour(Number(e.target.value))}
      />
      <p>{hour} hours ago</p>
      <small>Simulated historical rainfall view</small>
    </div>
  );
}
