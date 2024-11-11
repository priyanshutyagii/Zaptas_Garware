import { useState, useEffect } from "react";
import { HiArrowCircleRight } from "react-icons/hi";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarCard.css";
import { SlCalender } from "react-icons/sl";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import ConnectMe from "../../config/connect";

export default function CalendarCard() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const token = getTokenFromLocalStorage();
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        const url = `${ConnectMe.BASE_URL}/calendar/holidays?active=true`;
        const data = await apiCall("GET", url, headers);
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error.message);
      }
    }
    fetchEvents();
  }, []);

  const isEventDate = (date) => {
    return events.some(
      (event) =>
        new Date(event.startDate).toDateString() === date.toDateString()
    );
  };

  const getEventForDate = (date) => {
    return events.find(
      (event) =>
        new Date(event.startDate).toDateString() === date.toDateString()
    );
  };

  const tileContent = ({ date, view }) => {
    if (view === "month" && isEventDate(date)) {
      const event = getEventForDate(date);
      return (
        <div
          className="position-relative bg-warning text-white rounded-circle d-flex justify-content-center align-items-center"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={`${event.name}: ${event.description}`}
          style={{ width: "100%", height: "100%" }}
        >
          <small className="text-center">{event.name}</small>
        </div>
      );
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

  return (
    <div className="card mb-3">
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
        />
      </div>
    </div>
  );
}
