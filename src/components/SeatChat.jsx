// import { useEffect, useRef, useState } from "react";
// import "../components/style.css";

// const SEATS_CONFIG = {
//   Publicworkspacekey: "57069033-6fc3-4e57-8ebc-c4f54d3d742e",
//   Secretworkspacekey: "8cd678c5-d6d5-43f1-b377-255951f6405f",
//   eventkey: "e979330a-5c0c-429e-8689-cf54ec6aceff",
// };

// const SeatsIOChart = () => {
//   const chartContainerRef = useRef(null);
//   const [holdToken, setHoldToken] = useState(null);
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [chartInitialized, setChartInitialized] = useState(false);

//   useEffect(() => {
//     const fetchHoldToken = async () => {
//       try {
//         const token = btoa(`${SEATS_CONFIG.Secretworkspacekey}:`);
//         const response = await fetch("https://api-eu.seatsio.net/hold-tokens", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Basic ${token}`,
//           },
//         });

//         if (!response.ok) throw new Error("Failed to fetch hold token");

//         const data = await response.json();
//         setHoldToken(data.holdToken);
//       } catch (error) {
//         console.error("Error fetching hold token:", error);
//       }
//     };

//     if (!holdToken) {
//       fetchHoldToken();
//     }
//   }, [holdToken]);

//   useEffect(() => {
//     if (!holdToken || chartInitialized) return;

//     const loadSeatsIoScript = () => {
//       return new Promise((resolve, reject) => {
//         if (window.seatsio) {
//           resolve();
//           return;
//         }

//         const script = document.createElement("script");
//         script.src = "https://cdn-eu.seatsio.net/chart.js";
//         script.async = false;
//         script.onload = resolve;
//         script.onerror = () =>
//           reject(new Error("Failed to load Seats.io script"));
//         document.body.appendChild(script);
//       });
//     };

//     const initializeChart = async () => {
//       try {
//         await loadSeatsIoScript();
//         if (!window.seatsio) {
//           console.error("Seats.io library not loaded");
//           return;
//         }

//         const chart = new window.seatsio.SeatingChart({
//           publicKey: SEATS_CONFIG.Publicworkspacekey,
//           event: SEATS_CONFIG.eventkey,
//           holdToken: holdToken,
//           divId: "chart-container",
//           session: "manual",
//           onObjectSelected: (object) => {
//             if (
//               object.status === "reservedByToken" ||
//               object.status === "free"
//             ) {
//               setSelectedSeats((prev) => [
//                 ...prev,
//                 { id: object.id, label: object.label || "N/A" },
//               ]);
//             }
//           },
//           onObjectDeselected: (object) => {
//             setSelectedSeats((prev) =>
//               prev.filter((seat) => seat.id !== object.id)
//             );
//           },
//         });

//         chart.render();
//         setChartInitialized(true);
//       } catch (error) {
//         console.error("Error initializing Seats.io chart:", error);
//       }
//     };

//     initializeChart();
//   }, [holdToken, chartInitialized]);

//   const handleBookSeats = async () => {
//     if (selectedSeats.length === 0) {
//       alert("No seats selected for booking.");
//       return;
//     }

//     try {
//       const token = btoa(`${SEATS_CONFIG.Secretworkspacekey}:`);
//       const response = await fetch(
//         `https://api-eu.seatsio.net/events/${SEATS_CONFIG.eventkey}/actions/book`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Basic ${token}`,
//           },
//           body: JSON.stringify({
//             objects: selectedSeats.map((seat) => seat.id),
//           }),
//         }
//       );

//       if (!response.ok) throw new Error("Booking failed");

//       alert("Seats successfully booked!");
//       setSelectedSeats([]);
//     } catch (error) {
//       console.error("Error booking seats:", error);
//       alert("An error occurred while booking the seats.");
//     }
//   };

//   return (
//     <div className="seats-chart-wrapper">
//       <div id="chart-container" ref={chartContainerRef}></div>
//       <div className="selected-seats">
//         <h3>Selected Seats</h3>
//         <ul>
//           {selectedSeats.length > 0 ? (
//             selectedSeats.map((seat) => (
//               <li key={seat.id} className="seat-item">
//                 <div className="seat-info">
//                   <span className="seat-id">{seat.label}</span>
//                   <span className="seat-category">(ID: {seat.id})</span>
//                 </div>
//               </li>
//             ))
//           ) : (
//             <li className="no-seats">No seats selected.</li>
//           )}
//         </ul>
//         {selectedSeats.length > 0 && (
//           <button className="book-seats-btn" onClick={handleBookSeats}>
//             Book Selected Seats
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SeatsIOChart;



import { useEffect, useRef, useState } from "react";
import "../components/style.css";

const SEATS_CONFIG = {
  Publicworkspacekey: "57069033-6fc3-4e57-8ebc-c4f54d3d742e",
  Secretworkspacekey: "8cd678c5-d6d5-43f1-b377-255951f6405f",
  eventkey: "e979330a-5c0c-429e-8689-cf54ec6aceff",
};

const SeatsIOChart = () => {
  const chartContainerRef = useRef(null);
  const [holdToken, setHoldToken] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [chartInitialized, setChartInitialized] = useState(false);

  useEffect(() => {
    const fetchHoldToken = async () => {
      try {
        const token = btoa(`${SEATS_CONFIG.Secretworkspacekey}:`);
        const response = await fetch("https://api-eu.seatsio.net/hold-tokens", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch hold token");

        const data = await response.json();
        setHoldToken(data.holdToken);
      } catch (error) {
        console.error("Error fetching hold token:", error);
      }
    };

    if (!holdToken) {
      fetchHoldToken();
    }
  }, [holdToken]);

  useEffect(() => {
    if (!holdToken || chartInitialized) return;
    const loadSeatsIoScript = () => {
      return new Promise((resolve, reject) => {
        if (window.seatsio) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = "https://cdn-eu.seatsio.net/chart.js";
        script.async = false;
        script.onload = resolve;
        script.onerror = () =>
          reject(new Error("Failed to load Seats.io script"));
        document.body.appendChild(script);
      });
    };

    const initializeChart = async () => {
      try {
        await loadSeatsIoScript();
        if (!window.seatsio) {
          console.error("Seats.io library not loaded");
          return;
        }

        const chart = new window.seatsio.SeatingChart({
          publicKey: SEATS_CONFIG.Publicworkspacekey,
          event: SEATS_CONFIG.eventkey,
          holdToken: holdToken,
          divId: "chart-container",
          session: "manual",
          onObjectSelected: (object) => {
            if (
              object.status === "reservedByToken" ||
              object.status === "free"
            ) {
              setSelectedSeats((prev) => [
                ...prev,
                { id: object.id, label: object.label || "N/A" },
              ]);
            }
          },
          onObjectDeselected: (object) => {
            setSelectedSeats((prev) =>
              prev.filter((seat) => seat.id !== object.id)
            );
          },
        });

        chart.render();
        setChartInitialized(true);
      } catch (error) {
        console.error("Error initializing Seats.io chart:", error);
      }
    };

    initializeChart();
  }, [holdToken, chartInitialized]);
  const handleBookSeats = async () => {
    if (selectedSeats.length === 0) {
      alert("No seats selected for booking.");
      return;
    }

    try {
      const token = btoa(`${SEATS_CONFIG.Secretworkspacekey}:`);
      const response = await fetch(
        `https://api-eu.seatsio.net/events/${SEATS_CONFIG.eventkey}/actions/book`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${token}`,
          },
          body: JSON.stringify({
            objects: selectedSeats.map((seat) => seat.id),
          }),
        }
      );

      if (!response.ok) throw new Error("Booking failed");

      alert("Seats successfully booked!");
      setSelectedSeats([]); // Reset selected seats after booking
    } catch (error) {
      console.error("Error booking seats:", error);
      alert("An error occurred while booking the seats.");
    }
  };

  return (
    <div className="seats-chart-wrapper">
      <div id="chart-container" ref={chartContainerRef}></div>
      <div className="selected-seats">
        <h3>Selected Seats</h3>
        <ul>
          {selectedSeats.length > 0 ? (
            selectedSeats.map((seat) => (
              <li key={seat.id} className="seat-item">
                <div className="seat-info">
                  <span className="seat-id">{seat.label}</span>
                  <span className="seat-category">(ID: {seat.id})</span>
                </div>
              </li>
            ))
          ) : (
            <li className="no-seats">No seats selected.</li>
          )}
        </ul>
        {selectedSeats.length > 0 && (
          <button className="book-seats-btn" onClick={handleBookSeats}>
            Book Selected Seats
          </button>
        )}
      </div>
    </div>
  );
};

export default SeatsIOChart;
