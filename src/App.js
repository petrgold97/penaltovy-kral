import React, { useEffect, useState } from "react";
import "./App.css";

const GOOGLE_SHEET_API = "https://script.google.com/macros/s/AKfycbyIQXUr5qMOYEHo_dcURbLEn-6ywZMaeyFSpT88G1xTTvqCvRGQbu1996iWAOEYVNnHzw/exec";

function App() {
  const [aktualniHraci, nastavAktualniHraci] = useState([]);
  const [dalsiHraci, nastavDalsiHraci] = useState([]);
  const [celkovyPocet, nastavCelkovyPocet] = useState(0);
  const [aktivniPocet, nastavAktivniPocet] = useState(0);
  const [aktualniKolo, nastavAktualniKolo] = useState("");

  useEffect(() => {
    async function nactiData() {
      try {
        const odpoved = await fetch(GOOGLE_SHEET_API);
        const zaznamy = await odpoved.json();

        const radekSKolem = zaznamy.find((zaznam) => zaznam.current_round);
        if (radekSKolem?.current_round) {
          nastavAktualniKolo(radekSKolem.current_round);
        }

        const hraci = zaznamy
          .filter((zaznam) => zaznam.Name)
          .map((zaznam) => ({
            jmeno: zaznam.Name,
            kolo: zaznam.Round,
            vykoupen: zaznam.Buyback,
            stav: zaznam.Status?.toLowerCase(),
            strana: zaznam.Side,
            minut: zaznam.Missed,
            cislo: zaznam.Number,
          }));

        nastavCelkovyPocet(hraci.length);

        const aktivniHraci = hraci.filter((hrac) => hrac.stav !== "done");
        nastavAktivniPocet(aktivniHraci.length);

        const relevantni = hraci.filter(
          (hrac) => hrac.stav === "shooting" || hrac.stav === "next"
        );

        const kopajici = relevantni.filter((hrac) => hrac.stav === "shooting").slice(0, 2);
        nastavAktualniHraci(kopajici);

        const kopajiciId = new Set(kopajici.map((h) => h.cislo));
        const nasledujici = relevantni
          .filter((hrac) => !kopajiciId.has(hrac.cislo))
          .slice(0, 6);
        nastavDalsiHraci(nasledujici);
      } catch (chyba) {
        console.error("Chyba při načítání dat:", chyba);
      }
    }

    nactiData();
    const intervalId = setInterval(nactiData, 3000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="app centered">
      <div className="title-info">
        <h2>Celkový počet kopajících: {celkovyPocet}, ve hře: {aktivniPocet}</h2>
        <h2>Aktuální kolo: {aktualniKolo}</h2>
      </div>

      <div className="info">
        <div className="current-shooters">
          <h2>Aktuálně kope</h2>
          {aktualniHraci.length === 0 && <p>Žádní aktuální hráči, přestávka</p>}
          {aktualniHraci.map((hrac, i) => (
            <div className="shooter" key={i}>
              <p>
                <strong>Č.{hrac.cislo} - {hrac.jmeno} ({hrac.strana})</strong>
              </p>
              <p>Vykoupen: {hrac.vykoupen === "yes" ? "Ano" : "Ne"}</p>
            </div>
          ))}
        </div>

        <div className="next-shooters">
          <h2>Připraví se</h2>
          {dalsiHraci.length === 0 && <p>Žádní další hráči</p>}
          <ul>
            {dalsiHraci.map((hrac, i) => (
              <li key={i} className="next-shooter-item">
                Č.{hrac.cislo} - {hrac.jmeno} ({hrac.strana})
              </li>
            ))}
          </ul>
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
    </div>
  );
}

export default App;
