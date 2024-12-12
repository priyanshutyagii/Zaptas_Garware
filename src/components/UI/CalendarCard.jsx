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

  useEffect(() => {
    async function fetchEvents() {
      try {
        const token = getTokenFromLocalStorage();
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        const url = `${ConnectMe.BASE_URL}/calendar/holidays?active=true`;
        const response = await apiCall("GET", url, headers);

        if (response.success) {
          setEvents(response?.data);
        } else {
          showToast("Failed to load Holiday", "error");
        }
      } catch (error) {
        console.error("Error fetching events:", error.message);
      }
    }
    fetchEvents();
  }, []);

  const getEventsForDate = (date) => {
    // Filter out all events for the selected date
    return events.filter(
      (event) => new Date(event.date).toDateString() === date.toDateString()
    );
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const eventsForDate = getEventsForDate(date);
      if (eventsForDate.length > 0) {
        return (
          <div className="position-relative">
            {eventsForDate.map((event, index) => (
              <div
                key={index}
                className="bg-warning text-white rounded-circle d-flex justify-content-center align-items-center mb-1"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title={`${event.title} (${event.type})`}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <small className="text-center">
                  {event.title} ({event.type})
                </small>
              </div>
            ))}
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
        <Calendar onChange={setDate} value={date} tileContent={tileContent} />
      </div>
    </div>
  );
}
