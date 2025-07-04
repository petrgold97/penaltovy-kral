my code import React, { useEffect, useState } from "react";
import "./App.css";

const GOOGLE_SHEET_API = "https://script.google.com/macros/s/AKfycbyIQXUr5qMOYEHo_dcURbLEn-6ywZMaeyFSpT88G1xTTvqCvRGQbu1996iWAOEYVNnHzw/exec";

function App() {
  const [currentShooters, setCurrentShooters] = useState([]);
  const [nextShooters, setNextShooters] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [currentRound, setCurrentRound] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(GOOGLE_SHEET_API);
        const entries = await res.json();

        const roundRow = entries.find((e) => e.current_round);
        if (roundRow?.current_round) {
          setCurrentRound(roundRow.current_round);
        }

        const mapped = entries
          .filter((item) => item.Name)
          .map((item) => ({
            name: item.Name,
            round: item.Round,
            buyback: item.Buyback,
            status: item.Status?.toLowerCase(),
            side: item.Side,
            missed: item.Missed,
            number: item.Number,
          }));

        setTotalCount(mapped.length);

        const active = mapped.filter((e) => e.status !== "done");
        setActiveCount(active.length);

        const combined = mapped.filter(
          (e) => e.status === "shooting" || e.status === "next"
        );

        const shooting = combined.filter((e) => e.status === "shooting").slice(0, 2);
        setCurrentShooters(shooting);

        const shootingIds = new Set(shooting.map((s) => s.number));
        const next = combined.filter((e) => !shootingIds.has(e.number)).slice(0, 6);
        setNextShooters(next);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }

    fetchData();
    const intervalId = setInterval(fetchData, 3000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="app centered">
      <div className="title-info">
        <h2>Celkový počet kopajích: {totalCount}, ve hře: {activeCount}</h2>
        <h2>Aktuální kolo: {currentRound}</h2>
      </div>

      <div className="info">
        <div className="current-shooters">
          <h2>Aktuálně kope</h2>
          {currentShooters.length === 0 && <p>Žádní aktuální hráči, přestávka</p>}
          {currentShooters.map((shooter, i) => (
            <div className="shooter" key={i}>
              <p>
                <strong>Č.{shooter.number} - {shooter.name} ({shooter.side})</strong>
              </p>
              <p>Vykoupen: {shooter.buyback === "yes" ? "Ano" : "Ne"}</p>
            </div>
          ))}
        </div>

        <div className="next-shooters">
          <h2>Připraví se</h2>
          {nextShooters.length === 0 && <p>Žádní další hráči</p>}
          <ul>
            {nextShooters.map((player, i) => (
              <li key={i} className="next-shooter-item">
                Č.{player.number} - {player.name} ({player.side})
              </li>
            ))}
          </ul>
        </div>

        <div className="sponsors">
          <h2>Sponzoři</h2>
          <div className="carousel">
            <div className="carousel-track">
              <img src="/1.png" alt="1.png" />
              <img src="/2.png" alt="2.png" />
              <img src="/3.jpg" alt="3.png" />
              <img src="/4.png" alt="4.png" />
              <img src="/5.png" alt="5.png" />
              <img src="/6.png" alt="6.png" />
              <img src="/7.png" alt="7.png" />
              <img src="/8.jpg" alt="8.png" />
              <img src="/9.png" alt="9.png" />
              <img src="/10.png" alt="10.png" />
              <img src="/11.png" alt="11.png" />
              <img src="/12.png" alt="12.png" />
              <img src="/13.png" alt="13.png" />
              <img src="/14.png" alt="14.png" />
              <img src="/15.png" alt="15.png" />
              <img src="/16.png" alt="16.png" />
              <img src="/17.png" alt="17.png" />
              <img src="/18.png" alt="18.png" />
              <img src="/19.png" alt="19.png" />
              <img src="/20.png" alt="20.png" />
              <img src="/21.png" alt="21.png" />
              <img src="/22.png" alt="22.png" />
              <img src="/23.png" alt="23.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
