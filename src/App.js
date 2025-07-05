import React, { useEffect, useState } from "react";
import "./App.css";

const GOOGLE_SHEET_API =
  "https://script.google.com/macros/s/AKfycbyIQXUr5qMOYEHo_dcURbLEn-6ywZMaeyFSpT88G1xTTvqCvRGQbu1996iWAOEYVNnHzw/exec";

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
            side: item.Side,
            missed: item.Missed,
            number: item.Number,
            stillInGame: item.stale_ve_hre?.toLowerCase() === "ano",
            shooting: item.Status?.toLowerCase() === "shooting",
            next: item.Status?.toLowerCase() === "next",
          }));

        setTotalCount(mapped.length);

        const activePlayers = mapped.filter((p) => p.stillInGame);
        setActiveCount(activePlayers.length);

        const current = activePlayers.filter((p) => p.shooting).slice(0, 2);
        setCurrentShooters(current);

        const currentIds = new Set(current.map((p) => p.number));
        const next = activePlayers
          .filter((p) => p.next && !currentIds.has(p.number))
          .slice(0, 6);
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
        <h2>
          Celkový počet kopajících: {totalCount}, ve hře: {activeCount}
        </h2>
        <h2>Aktuální kolo: {currentRound}</h2>
      </div>

      <div className="info">
        <div className="current-shooters">
          <h2>Aktuálně kope</h2>
          {currentShooters.length === 0 && (
            <p>Žádní aktuální hráči, přestávka</p>
          )}
          {currentShooters.map((shooter, i) => (
            <div className="shooter" key={i}>
              <p>
                <strong>
                  Č.{shooter.number} - {shooter.name} ({shooter.side})
                </strong>
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
              {[...Array(2)].flatMap((_, repeatIndex) =>
                Array.from({ length: 23 }, (_, i) => {
                  const num = i + 1;
                  const ext = [3, 8].includes(num) ? "jpg" : "png";
                  return (
                    <img
                      key={`${repeatIndex}-${num}`}
                      src={`/${num}.${ext}`}
                      alt={`${num}.${ext}`}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
