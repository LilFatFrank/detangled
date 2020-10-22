import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import EventCards from "./EventCards/EventCards";
import { set } from "date-fns";

const App = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [newDestination, setNewDestination] = useState('');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (events.length === 0) fetchData();
    if (filteredEvents.length === 0) filterAccordingToMonth();
  }, [events, filteredEvents]);

  async function fetchData() {
    const response = await axios.get(
      "https://detangled.in/develop/e25e2cbf-e644-4325-b2f9-073571845a9d/events"
    );
    setEvents(
      response.data.sort((a, b) => new Date(a.start) - new Date(b.start))
    );
  }

  const filterAccordingToMonth = () => {
    setFilteredEvents(
      events?.filter((event) => {
        return (
          moment(new Date(event.start)).format("MM-YYYY") ===
          moment(new Date(events[0]?.start)).format("MM-YYYY")
        );
      })
    );
  };

  const onMonthClick = (date) => {
    setFilteredEvents(
      events?.filter((event) => {
        return (
          moment(new Date(event.start)).format("MM-YYYY") ===
          moment(date).format("MM-YYYY")
        );
      })
    );
  };

  async function onRemoveEvent (id) {
    const response = await axios.delete(`https://detangled.in/develop/e25e2cbf-e644-4325-b2f9-073571845a9d/events/${id}`);
    if(response.status === 200) {
      fetchData();
      filterAccordingToMonth();
    }
  }

  async function onEditEvent(id) {
    const getResponse = await axios.get(`https://detangled.in/develop/e25e2cbf-e644-4325-b2f9-073571845a9d/events/${id}`);
    const requestObject = {
      id: getResponse.id,
      destination: newDestination,
      comment: newComment,
      color: getResponse.color,
      start: getResponse.start,
      duration: getResponse.duration
    }
    const response = await axios.put(`https://detangled.in/develop/e25e2cbf-e644-4325-b2f9-073571845a9d/events/${id}`, requestObject);
    console.log(response);
  }

  const destinationChange = (value) => {
    console.log(value);
    setNewDestination(value);
  }

  const commentChange = (value) => {
    console.log(value);
    setNewComment(value);
  }

  const Header = () => <div className="header">Detangled Engineering</div>;

  return (
    <div className="app">
      <Header />
      <div className="container">
        <div className="title-label">
          My Events{" "}
        </div>
        <div className="table-calendar-container">
          <EventCards events={filteredEvents} removeEvent={onRemoveEvent} editEvent={onEditEvent}
          destinationChange={destinationChange} commentChange={commentChange} />
          <Calendar
            className={"calendar"}
            value={events.length > 0 ? new Date(events[0].start) : new Date()}
            tileClassName={({ date, view }) => {
              if (
                events?.length > 0 &&
                view === "month" &&
                events.find(
                  (event) =>
                    moment(new Date(event.start)).format("DD-MM-YYYY") ===
                    moment(date).format("DD-MM-YYYY")
                )
              ) {
                return ["highlight-date"];
              }
            }}
            onClickMonth={(value) => onMonthClick(value)}
            prev2Label={null}
            next2Label={null}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
