import React from "react";
import "./Tracker.css";
import { Bell } from "@phosphor-icons/react";
import toast from "react-hot-toast";

function Tracker(props) {
  const statusStyle = {
    online: "#62f462",
    offline: "#f46262",
  };
  return (
    <div
      ref={props.ref}
      onClick={() => {
        if (props.status === "Online") {
          props.tracker(props.id);
        } else {
          toast.error("Tracker is offline.");
          return;
        }
      }}
      className="row py-3 tracker"
      style={{
        background: `linear-gradient(${
          statusStyle[props.status.toLowerCase()]
        }, ${statusStyle[props.status.toLowerCase()]}) left/5px 100% no-repeat`,
      }}>
      <input className="control--checkbox col status " type="checkbox" />
      <span
        className="col status"
        style={{
          fontWeight: "500",
          color: statusStyle[props.status.toLowerCase()],
        }}>
        {props.status}
      </span>
      <span className="col status">Alpha</span>
      <span className="col status">{props.platform}</span>
      <span className="col status">{props.updated}</span>
      <span className="col status">{props.ip}</span>
      <span className="col status">
        <Bell size={13} weight="bold" />
      </span>
    </div>
  );
}

export default Tracker;
