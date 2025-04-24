import React, { useEffect, useState } from "react";
import "./App.css";

const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/dPC67RJ-bD4"; // Make sure it's the EMBED version
const GOOGLE_SHEET_API = "https://opensheet.elk.sh/1MP-9NStIwl3CWiK9MKrf9uHs9I1zTVjgCNFd1hVIkho/Sheet1";

function App() {
  const [currentShooters, setCurrentShooters] = useState([]);
  const [nextShooters, setNextShooters] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    fetch(GOOGLE_SHEET_API)
      .then((res) => res.json())
      .then((entries) => {
        console.log("Fetched entries:", entries);

        if (!Array.isArray(entries)) {
          console.error("Expected array but got:", entries);
          return;
        }

        const mapped = entries.map((item) => ({
          name: item.Name,
          round: item.Round,
          buyback: item.Buyback,
          status: item.Status,
        }));

        setTotalCount(mapped.length);

        const active = mapped.filter((e) => e.buyback?.toLowerCase() === "yes");
        setActiveCount(active.length);

        const current = mapped.filter((e) =>
          ["1", "2"].includes(e.status?.toString().trim())
        );
        setCurrentShooters(current);

        const lastIndex = mapped.findIndex((e) => e.status?.toString().trim() === "2");
        const next = mapped.slice(lastIndex + 1, lastIndex + 11);
        setNextShooters(next);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, []);

  return (
    <div className="app">
      <div className="title">
        <h1>O penaltového krále MS kraje, 16. ročník, Hukvaldy</h1>
        <p>Celkový počet: {totalCount}, pokračuje: {activeCount}</p>
      </div>

      <div className="layout">
        <div className="livestream">
          <iframe
            src={YOUTUBE_EMBED_URL}
            title="Penalty Livestream"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>

        <div className="info">
          <div className="current-shooters">
            <h2>Aktuální hráči</h2>
            {currentShooters.length === 0 && <p>Žádní aktuální hráči</p>}
            {currentShooters.map((shooter, i) => (
              <div className="shooter" key={i}>
                <p><strong>{shooter.name}</strong></p>
                <p>Kolo: {shooter.round}</p>
                <p>
                  Stav: {shooter.buyback === "yes" ? "Má šanci" : "Vyřazen"}
                </p>
              </div>
            ))}
          </div>

          <div className="next-shooters">
            <h2>Další hráči na řadě</h2>
            {nextShooters.length === 0 && <p>Žádní další hráči</p>}
            <ul>
              {nextShooters.map((player, i) => (
                <li key={i}>{player.name}</li>
              ))}
            </ul>
          </div>

          <div className="sponsors">
            <h2>Sponzoři</h2>
            <div className="carousel">
              <p>Sponsor 1</p>
              <p>Sponsor 2</p>
              <p>Sponsor 3</p>
              <p>Sponsor 4</p>
              <p>Sponsor 5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
