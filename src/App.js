import React, { useEffect, useState } from "react";
import "./App.css";

const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/fqEoVf3k_bk";
const GOOGLE_SHEET_API = "https://opensheet.elk.sh/1MP-9NStIwl3CWiK9MKrf9uHs9I1zTVjgCNFd1hVIkho/Sheet1";

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

        if (!Array.isArray(entries)) {
          console.error("Expected array but got:", entries);
          return;
        }

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
          }));

        setTotalCount(mapped.length);

        const active = mapped.filter((e) => e.buyback?.toLowerCase() === "yes");
        setActiveCount(active.length);

        const current = mapped.filter((e) => e.status === "shooting");
        setCurrentShooters(current.slice(0, 2));

        const next = mapped.filter((e) => e.status === "next");
        setNextShooters(next.slice(0, 4));
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }

    fetchData();
    const intervalId = setInterval(fetchData, 3000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="app">
      <div className="title">
        <h1>O penaltového krále MS kraje, 16. ročník, Hukvaldy</h1>
        <p>Celkový počet kopajích: {totalCount}, ve hře: {activeCount}  <h2>Aktuální kolo: {currentRound}</h2></p>
        
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
                <p><strong>{shooter.name}</strong> (kope na: {shooter.side})</p>
                <p>Vykoupen: {shooter.buyback === "yes" ? "Ne" : "Ano"}</p>
              </div>
            ))}
          </div>

          <div className="next-shooters">
            <h2>Připraví se</h2>
            {nextShooters.length === 0 && <p>Žádní další hráči</p>}
            <ul>
              {nextShooters.map((player, i) => (
                <li key={i} className="next-shooter-item">
                  {player.name} (kope na: {player.side})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="sponsors">
        <h2>Sponzoři</h2>
        <div className="carousel">
          <div className="carousel-track">
            <img src="/sponsor1.png" alt="Sponsor 1" />
            <img src="/sponsor2.png" alt="Sponsor 2" />
            <img src="/sponsor3.png" alt="Sponsor 3" />
            <img src="/sponsor1.png" alt="Sponsor 1 duplicate" />
            <img src="/sponsor2.png" alt="Sponsor 2 duplicate" />
            <img src="/sponsor3.png" alt="Sponsor 3 duplicate" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
