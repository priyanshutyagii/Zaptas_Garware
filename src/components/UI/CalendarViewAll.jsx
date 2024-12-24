import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Form } from "react-bootstrap";
import "./CalendarViewAll.css";

export default function CalendarViewAll() {
  const location = useLocation();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const events = location.state?.events || []; // Get events from state

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value, 10));
  };

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === selectedMonth;
  });

  return (
    <div className="calendar-view-all">
      <div className="header">
        <h3>Employee Engagement and Events</h3>
        <Form.Select
          onChange={handleMonthChange}
          value={selectedMonth}
          className="month-dropdown"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </Form.Select>
      </div>

      <div className="event-list">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <div key={index} className="event-card">
              <h5>{event.title}</h5>
              <p className="description">{event.description}</p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Location:</strong> {event.location}
              </p>
            </div>
          ))
        ) : (
          <p className="no-events">No events for this month.</p>
        )}
      </div>
    </div>
  );
}
