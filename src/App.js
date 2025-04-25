import React, { useEffect, useState } from "react";
import "./App.css";

const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/fqEoVf3k_bk";
const GOOGLE_SHEET_API =
  "https://opensheet.elk.sh/1MP-9NStIwl3CWiK9MKrf9uHs9I1zTVjgCNFd1hVIkho/Sheet1";

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

        const current = mapped
