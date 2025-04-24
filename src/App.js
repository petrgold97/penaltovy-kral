import React, { useEffect, useState } from "react";
import "./App.css";

const YOUTUBE_EMBED_URL = "https://www.youtube.com/watch?v=dPC67RJ-bD4"; // Replace this with your actual YouTube URL
const GOOGLE_SHEET_API = "https://opensheet.elk.sh/1MP-9NStIwl3CWiK9MKrf9uHs9I1zTVjgCNFd1hVIkho/Sheet1"; // Replace this with your actual Google Sheets API

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

        // 🔁 Map with correct keys and track missed penalties
        const mapped = entries.map((item) => ({
          name: item.Name,
          round: item.Round,
          buyback: item.Buyback,
          status: item.Status,
          side: item.Side, // "A" or "B"
          missed: item.Missed || 0, // Track number of missed penalties
        }));

        setTotalCount(mapped.length);

        // ✅ Active players (Buyback = yes)
        const active = mapped.filter((e) => e.buyback?.toLowerCase() === "yes");
        setActiveCount(active.length);

        // ✅ Current players (Status = 1 or 2, but only show 2 players who are actively kicking)
        const current = mapped.filter((e) => e.status === "1");
        setCurrentShooters(current.slice(0, 2)); // Only show the first two players kicking

        // ✅ Next shooters (Status = 2) - show 2 preparing players
        const next = mapped.filter((e) => e.status === "2").slice(0, 2); // Show the next two players preparing
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
        <p>Celkový počet kopajích: {totalCount}, ve hře: {activeCount}</p>
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
            <h2>Aktuálně kope</h2>
            {currentShooters.length === 0 && <p>Žádní aktuální hráči</p>}
            {currentShooters.map((shooter, i) => (
              <div className="shooter" key={i}>
                <p><strong>{shooter.name}</strong> (Kopa na: {shooter.side})</p>
                <p>Kolo: {shooter.round}</p>
                <p>
                  Stav: {shooter.missed < 2 ? "Má šanci" : "Vyřazen"}
                </p>
              </div>
            ))}
          </div>

          <div className="next-shooters">
            <h2>Připraví se</h2>
            {nextShooters.length === 0 && <p>Žádní další hráči</p>}
            <ul>
              {nextShooters.map((player, i) => (
                <li key={i}>{player.name} (Kopa na: {player.side})</li>
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
