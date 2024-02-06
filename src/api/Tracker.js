import axios from "axios";
import ApiService from "./ApiService.js";

// Create instances of ApiService for ejabberd API and backend API
const ejabberd_api = new ApiService("http://localhost:5443/api");
const backend_api = new ApiService("http://localhost:3000");

const TimeIntervals = {
  YESTERDAY: "Yesterday",
  NOW: "Now",
  FIVE_MIN_AGO: "Recently",
};

/**
 * Get updatedAt time and retuns ENUM value.
 * @param {time} updatedAt
 * @returns {TimeIntervals}
 */
// Function to determine enum value based on updatedAt timestamp
function getTimeIntervalEnum(updatedAt) {
  const updatedAtDate = new Date(updatedAt);
  const currentDate = new Date();
  const timeDifference = currentDate - updatedAtDate;
  const minutesDifference = timeDifference / (1000 * 60);

  if (minutesDifference < 1) {
    return TimeIntervals.NOW;
  } else if (minutesDifference < 24 * 60) {
    return TimeIntervals.YESTERDAY;
  } else {
    return TimeIntervals.FIVE_MIN_AGO;
  }
}

/**
 * Get tracker information by ID.
 * @param {string} id - The ID of the tracker to retrieve.
 * @returns {Promise} A promise that resolves with the tracker information or rejects with an error.
 */
const getTrackerById = async (id) => {
  return backend_api.post("/tracker/retrieve", { id });
};

/**
 * Get online trackers using the ejabberd API.
 * @returns {Promise} A promise that resolves with the list of online trackers or rejects with an error.
 */
const getOnlineTracker = async () => {
  return ejabberd_api.post(
    "/connected_users",
    {},
    {
      auth: {
        username: "admin@localhost",
        password: "admin",
      },
    }
  );
};

/**
 * Get a list of all trackers from the backend API.
 * @returns {Promise} A promise that resolves with the list of all trackers or rejects with an error.
 */
const getAllTracker = async () => {
  return backend_api.get("/tracker/list");
};

/**
 * Get detailed information about all trackers, including their online/offline status.
 * @returns {Promise} A promise that resolves with the list of tracker information or rejects with an error.
 */
const getTrackerInfo = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Fetch online and all trackers concurrently
      const [onlineTracker, allTracker] = await Promise.all([
        getOnlineTracker(),
        getAllTracker(),
      ]);

      // Process the data to determine online/offline status
      const onlineTrackerSet = new Set();

      onlineTracker.forEach((ele) => {
        const jabberId = ele.split("@")[0];
        onlineTrackerSet.add(jabberId);
      });

      const onlineTrackerList = [];

      allTracker.forEach((ele) => {
        let platform =
          ele.system.platform.length > 5
            ? ele.system.platform.slice(0, 3)
            : ele.system.platform;
        if (onlineTrackerSet.has(ele._id)) {
          onlineTrackerList.push({
            id: ele._id,
            status: "Online",
            name: ele.name,
            platform: platform,
            ip: "127.0.0.1",
            updated: getTimeIntervalEnum(ele.updatedAt),
          });
        } else {
          onlineTrackerList.push({
            id: ele._id,
            status: "Offline",
            name: ele.name,
            platform: platform,
            ip: "127.0.0.1",
            updated: getTimeIntervalEnum(ele.updatedAt),
          });
        }
      });

      // Resolve with the final list of tracker information
      resolve(onlineTrackerList);
    } catch (error) {
      // Reject with an error if there's any issue
      reject(error);
    }
  });
};

// Export the functions for external use
export { getAllTracker, getOnlineTracker, getTrackerById, getTrackerInfo };
