import React, { useEffect, useState } from "react";
import LineChart from "../Charts/LineChart";
import { client, xml } from "@xmpp/client";

// import {
//   createClientAndConnect,
//   onStartedSession,
// } from "../xmpp/utils/xmpp.helper";

// const config = {
//   jid: `admin@${environment.host}`,
//   password: "admin",
//   transports: transports,
//   allowResumption: false,
// };

function TracketAnalytics(props) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const xmpp = client({
      service: "ws://localhost:5443/ws",
      domain: "localhost",
      username: "admin",
      password: "admin",
    });
    if (props.trackerId !== null) {
      xmpp.start().catch((err) => console.log(err));
      const msg = xml(
        "message",
        {
          type: "chat",
          to: `${props.trackerId}@localhost`,
        },
        xml("body", {}, "SEND LIVE DATA")
      );

      xmpp.on("online", async (address) => {
        await xmpp.send(xml("presence"));
        await xmpp.send(msg);
      });
      xmpp.on("error", (error) => {
        console.error(error);
      });
      xmpp.on("stanza", async (stanza) => {
        if (stanza.is("message")) {
          if (stanza.children[2] !== undefined) {
            console.log(stanza.children[2].children[0]);
            setData(JSON.parse(stanza.children[2].children[0]));
          }
        }
      });
    }

    return () => {
      xmpp.stop();
    };
  }, [props.trackerId]);

  if (props.trackerId === null) {
    return (
      <div className="container d-flex align-items-center justify-content-center h-100">
        <h3 style={{ color: "#4f4f4f" }}>
          Choose a tracker to unlock analytics insights!
        </h3>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="p-4">
        <h3>Alpha</h3>
        <p className="pt-2" style={{ fontSize: "13px" }}>
          id: {props.trackerId}
        </p>
      </div>
      <div className="container w-100 p-2">
        <div className="d-flex gap-3 justify-content-around w-100">
          <div
            className="card w-50 h-50"
            style={{ backgroundColor: "var(--blackSecondary)" }}>
            <div
              className="card-header p-2"
              style={{ color: "#fff", borderBottomColor: "rgb(46,43,43)" }}>
              CPU usage
            </div>
            <div className="px-2">
              {data && <LineChart data={data.cpu.percent} />}
            </div>
          </div>
          <div
            className="card w-50 h-50"
            style={{ backgroundColor: "var(--blackSecondary)" }}>
            <div
              className="card-header p-2"
              style={{ color: "#fff", borderBottomColor: "rgb(46,43,43)" }}>
              Memory usage
            </div>
            <div className="px-2">
              {data && <LineChart data={data.ram.percent} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TracketAnalytics;
