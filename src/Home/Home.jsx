import React, { useEffect, useRef, useState } from "react";
import "./Home.css";
import Tracker from "../Tracker/Tracker";
import LineChart from "../Charts/LineChart";
import { getAllTracker, getTrackerInfo } from "../api/Tracker";
import { useQuery } from "react-query";
import Loader from "../Loader/Loader";
import toast from "react-hot-toast";
import TracketAnalytics from "../TrackerAnalytics/TracketAnalytics";

function Home() {
  const [selectedTracker, setSelectedTracker] = useState(null);
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["trackerData"],
    queryFn: () => getTrackerInfo(),
  });

  return (
    <div className="d-flex home">
      <div className="section section-two" style={{ width: "35%" }}>
        <h3 className="p-4 mb-3">Trackers</h3>
        <div className="row text-center mx-3">
          <span className="col mb-3 header"></span>
          <span className="col mb-3 header">Status</span>
          <span className="col mb-3 header">Name</span>
          <span className="col mb-3 header">Platform</span>
          <span className="col mb-3 header">Updated</span>
          <span className="col mb-3 header">IPv4</span>
          <span className="col mb-3 header">Notify</span>
          {/* <span className="col mb-3"></span> */}
          <div
            className="w-100 ps-3 pt-1"
            style={{
              overflowY: "auto",
              overflowX: "hidden",
              height: "calc(90vh * 0.9)",
            }}>
            {isLoading ? (
              <Loader />
            ) : isError ? (
              toast.error(error.message)
            ) : (
              data.map((ele) => (
                <Tracker
                  tracker={setSelectedTracker}
                  id={ele.id}
                  key={ele.id}
                  status={ele.status}
                  platform={ele.platform}
                  ip={ele.ip}
                  updated={ele.updated}
                />
              ))
            )}
          </div>
        </div>
      </div>
      <div className="section section-one" style={{ width: "65%" }}>
        <TracketAnalytics trackerId={selectedTracker} />
      </div>
    </div>
  );
}

export default Home;
