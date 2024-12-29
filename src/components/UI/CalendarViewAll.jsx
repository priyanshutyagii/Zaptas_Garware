import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Form } from "react-bootstrap";
import "./CalendarViewAll.css";
import { MdOutlineDateRange } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";

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

      {filteredEvents.length > 0 ? (
        filteredEvents.map((event, index) => {
          const eventDate = new Date(event.date);
          const day = eventDate
            .toLocaleString("default", { weekday: "short" })
            .toUpperCase();
          const month = eventDate.toLocaleString("default", { month: "long" });
          const dayNumber = eventDate.getDate();

          return (
            <div key={index} className="event-details">
              {/* Top Date Section */}
              <div className="date-line">
                <span className="month-title">{`${month} ${eventDate.getFullYear()}`}</span>
                <hr />
              </div>
              <div className="event-details-card">
                {/* Event Date Section */}
                <div className="event-date">
                  <div className="event-date-box">
                    <span className="event-day">{day}</span>
                    <span className="event-day-number">{dayNumber}</span>
                  </div>
                </div>
                {/* Event Details Section */}
                <div className="event-info">
                  <p className="event-date-time">
                    <MdOutlineDateRange />{" "}
                    {`${month} ${dayNumber} @ ${event.startTime} - ${event.endTime}`}
                  </p>
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-location">
                    <CiLocationOn /> Cologne Cologne, Germany
                  </p>
                  {/* {event.description && (
                    <p className="event-description">{event.description}</p>
                  )} */}
                  <p className="event-description">
                    Far far away, behind the word mountains, far from the
                    countries Vokalia and Consonantia, there live the blind
                    texts. Separated they live in Bookmarksgrove right at the
                    coast of the Semantics, a large language ocean.
                  </p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="no-events">No events for this month.</p>
      )}
    </div>
  );
}
