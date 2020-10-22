import React, { useState } from "react";
import "../App.css";
import Modal from "react-modal";
import axios from "axios";

const EventCards = (props) => {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const [showModal, setShowModal] = useState(false);
  const [isEditClicked, setEditClicked] = useState(false);
  const [eventInformation, setInformation] = useState({
    id: NaN,
    comment: "",
    destination: "",
  });

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  async function onEditClick(id) {
    setShowModal(true);
    setEditClicked(true);
    const response = await axios.get(
      `https://detangled.in/develop/e25e2cbf-e644-4325-b2f9-073571845a9d/events/${id}`
    );
    setInformation(response.data);
  }

  async function onRemoveClick(id) {
    setShowModal(true);
    setEditClicked(false);
    const response = await axios.get(
      `https://detangled.in/develop/e25e2cbf-e644-4325-b2f9-073571845a9d/events/${id}`
    );
    setInformation(response.data);
  }

  const onCancelClick = () => {
    setShowModal(false);
  };

  const onConfirmClick = (id) => {
    !isEditClicked ? props.removeEvent(id) : props.editEvent(id);
    setShowModal(false);
  };

  const onDestinationChange = (e) => {
    props.destinationChange(e.target.value);
  };

  const onCommentChange = (e) => {
    props.commentChange(e.target.value);
  };

  return (
    <>
      <div className="events-table">
        {props.events?.length > 0 ? (
          <>
            {props.events.map((event) => {
              return (
                <div key={event.id} className={"card"}>
                  <div className={"date-label font-600"}>
                    {event.destination}
                    <span className={"float-right"}>
                      <i
                        className={"fa fa-pencil-square-o primary-label-color"}
                        style={{ marginRight: "8px", cursor: "pointer" }}
                        onClick={() => onEditClick(event.id)}
                      ></i>
                      <i
                        className={"fa fa-trash secondary-label-color"}
                        style={{ cursor: "pointer" }}
                        onClick={() => onRemoveClick(event.id)}
                      ></i>
                    </span>
                  </div>
                  <div>
                    <span className={"primary-label-color font-600"}>
                      Start Date:
                    </span>{" "}
                    {new Date(event.start).toLocaleDateString("en-US", options)}
                  </div>
                  <div>
                    <span className={"primary-label-color font-600"}>
                      Duration:
                    </span>{" "}
                    {event.duration} {event.duration ? "days" : null}
                  </div>
                  <div>
                    <span className={"primary-label-color font-600"}>
                      Comment:
                    </span>{" "}
                    {event.comment}
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="unavailable-card">
            <p>
              Hmm... Don't think you have any scheduled events for this month.
            </p>
            <p>
              Or maybe it's us. We maybe having a problem in retrieving your
              data.
            </p>
          </div>
        )}
      </div>
      <Modal isOpen={showModal} style={customStyles} ariaHideApp={false}>
        <div className={"modal-container"}>
          {isEditClicked ? (
            <>
              <h1>Edit your Event Information:</h1>
              <div className={"input-label-container"}>
                <label className={"label-font"}>Destination:</label>
                <input
                  type="text"
                  defaultValue={eventInformation.destination}
                  className={"input-class"}
                  onChange={onDestinationChange}
                />
              </div>
              <div className={"input-label-container"}>
                <label className={"label-font"}>Comment:</label>
                <input
                  type="text"
                  defaultValue={eventInformation.comment}
                  className={"input-class"}
                  onChange={onCommentChange}
                />
              </div>
              <div className={"button-container float-right"}>
                <button className={"primary-button"} onClick={onCancelClick}>
                  Cancel
                </button>
                <button
                  className={"secondary-button"}
                  onClick={() => onConfirmClick(eventInformation.id)}
                >
                  Confirm
                </button>
              </div>
            </>
          ) : (
            <>
              <h1>Are you sure?</h1>
              <div>
                Confirming this change will remove the schedule from your
                calendar.
              </div>
              <div className={"button-container float-right"}>
                <button className={"primary-button"} onClick={onCancelClick}>
                  Cancel
                </button>
                <button
                  className={"secondary-button"}
                  onClick={() => onConfirmClick(eventInformation.id)}
                >
                  Confirm
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default EventCards;
