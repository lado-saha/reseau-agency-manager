{/* "use client";

import { useState, useEffect } from "react";
import { FaSearch, FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useRouter } from "next/navigation";
import styles from "../../front-styles/SearchPage.module.css";

const SearchComponent = () => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"agency" | "destination">("agency");
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false); // Pour afficher ou masquer l'historique
  const [showMore, setShowMore] = useState(false); // Pour afficher les recherches supplémentaires
  const router = useRouter();

  // Charger les recherches récentes depuis le localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Sauvegarder les recherches dans le localStorage
  const saveSearch = (searchQuery: string) => {
    const timestamp = new Date().toLocaleString();
    const searchRecord = { query: searchQuery, type: searchType, timestamp };

    const updatedSearches = [searchRecord, ...recentSearches].slice(0, 50);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  // Gérer la recherche à la fois par clic et par entrée au clavier
  const handleSearchClick = () => {
    if (query.trim() === "") {
      alert("Veuillez entrer une requête de recherche.");
      return;
    }

    saveSearch(query); // Sauvegarde la recherche
    router.push(`/search-results?query=${query}&type=${searchType}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  // Toggle pour afficher plus de recherches
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  // Toggle pour afficher l'historique de recherche
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  // Gérer la recherche depuis l'historique
  const handleHistorySearch = (searchQuery: string, searchType: string) => {
    setQuery(searchQuery);
    setSearchType(searchType);
    saveSearch(searchQuery); // Sauvegarde la recherche de l'historique
    router.push(`/search-results?query=${searchQuery}&type=${searchType}`);
  };

  return (
    <div className={styles.searchPage}>
      <h1>Recherche de Voyages et Agences</h1>

      {/* Toggle pour le type de recherche */}
    { /* <div className={styles.toggleButtons}>
        <label>
          <input
            type="radio"
            name="searchType"
            checked={searchType === "agency"}
            onChange={() => setSearchType("agency")}
          />
          Recherche par Agence
        </label>
        <label>
          <input
            type="radio"
            name="searchType"
            checked={searchType === "destination"}
            onChange={() => setSearchType("destination")}
          />
          Recherche par Destination
        </label>
      </div>

      {/* Barre de recherche */}
     {/* <div className={styles.searchBar}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            searchType === "agency"
              ? "Entrez le nom d'une agence..."
              : "Entrez une destination..."
          }
        />
        <button onClick={handleSearchClick} className={styles.searchButton}>
          <FaSearch size={20} />
        </button>
      </div>

      {/* Bouton pour afficher l'historique des recherches */}
      {/* <div>
        <button onClick={toggleHistory} className={styles.toggleHistoryButton}>
          {showHistory ? <FaArrowUp /> : <FaArrowDown />} Voir l'historique des recherches
        </button>
      </div>

      {/* Menu déroulant pour l'historique des recherches */}
      {/*showHistory && (
        <div className={styles.recentSearches}>
          <div className={styles.searchList}>
            {/* Liste défilante */}
           {/* <div className={styles.scrollableList}>
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th>Requête</th>
                    <th>Type</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSearches.slice(0, showMore ? recentSearches.length : 10).map((search, index) => (
                    <tr key={index} onClick={() => handleHistorySearch(search.query, search.type)} className={styles.historyRow}>
                      <td>{search.query}</td>
                      <td>{search.type === "agency" ? "Agence" : "Destination"}</td>
                      <td>{search.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {recentSearches.length > 5 && (
            <button onClick={toggleShowMore} className={styles.showMoreButton}>
              {showMore ? "Voir Moins" : "Voir Plus"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;*/}
