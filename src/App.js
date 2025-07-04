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
