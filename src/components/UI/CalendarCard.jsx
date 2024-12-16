import { useState, useEffect } from "react";
import { HiArrowCircleRight } from "react-icons/hi";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarCard.css";
import { SlCalender } from "react-icons/sl";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import ConnectMe from "../../config/connect";
import showToast from "../../utils/toastHelper";

export default function CalendarCard() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  const fetchEvents = async (month, year) => {
    try {
      const token = getTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const url = `${ConnectMe.BASE_URL}/calendar/holidays?active=true&month=${month}&year=${year}`;
      const response = await apiCall("GET", url, headers);

      if (response.success) {
        setEvents(response?.data);
      } else {
        showToast("Failed to load holidays", "error");
      }
    } catch (error) {
      console.error("Error fetching events:", error.message);
    }
  };

  useEffect(() => {
    const currentMonth = date.getMonth() + 1; // JavaScript months are 0-based
    const currentYear = date.getFullYear();
    fetchEvents(currentMonth, currentYear);
  }, [date]);

  const getEventsForDate = (date) => {
    return events.filter(
      (event) => new Date(event.date).toDateString() === date.toDateString()
    );
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const eventsForDate = getEventsForDate(date);
      if (eventsForDate.length > 0) {
        return (
          <div className="event-dots">
            {eventsForDate.slice(0, 2).map((event, index) => (
              <span
                key={index}
                className={`event-dot ${event.type.toLowerCase()}`}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title={`${event.title} (${event.type})`}
              />
            ))}
            {eventsForDate.length > 2 && (
              <span className="more-events">+{eventsForDate.length - 2}</span>
            )}
          </div>
        );
      }
    }
  };

  useEffect(() => {
    const tooltipTriggerList = Array.from(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new window.bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, [events]);

  const handleActiveStartDateChange = ({ activeStartDate, view }) => {
    if (view === "month") {
      const newMonth = activeStartDate.getMonth() + 1;
      const newYear = activeStartDate.getFullYear();
      fetchEvents(newMonth, newYear);
    }
  };

  return (
    <div className="card mb-3 calendar-card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <SlCalender className="me-2" />
          <h5 className="mb-0">Calendar</h5>
        </div>
        <a href="#" className="text-decoration-none">
          View All <HiArrowCircleRight />
        </a>
      </div>
      <div className="card-body">
        <Calendar
          onChange={setDate}
          value={date}
          tileContent={tileContent}
          onActiveStartDateChange={handleActiveStartDateChange}
        />
      </div>
    </div>
  );
}
