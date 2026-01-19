import { GiphyFetch } from "@giphy/js-fetch-api";
import { createContext, useContext, useEffect, useState,useMemo } from "react";

const GifContext = createContext({});

export const GifProvider = ({ children }) => {
  const [gifs, setGifs] = useState([]);
  const [filter, setFilter] = useState("gifs");
  const [favorites, setFavorites] = useState([]);

  const gf = useMemo(() => new GiphyFetch(import.meta.env.VITE_GIPHY_KEY), []);

  // Load favorites from localStorage on mount
   useEffect(() => {
    try {
        const favorites = JSON.parse(localStorage.getItem("favoriteGIFs")) || [];
        setFavorites(favorites);
        } catch {
       setFavorites([]);
        }
     }, []);

  // Add/remove GIF from favorites
  const addToFavorites = (id) => {
    
    if (favorites.includes(id)) {
      // remove if already in favorites
      const updatedFavorites = favorites.filter((itemId) => itemId !== id);
      localStorage.setItem("favoriteGIFs", JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } else {
      // add if not in favorites
      const updatedFavorites = [...favorites, id];
      localStorage.setItem("favoriteGIFs", JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    }
  };

  return (
    <GifContext.Provider
      value={{
        gf,
        gifs,
        setGifs,
        filter,
        setFilter,
        favorites,
        addToFavorites, // ✅ functionality included here
      }}
    >
      {children}
    </GifContext.Provider>
  );
};

export const GifState = () => useContext(GifContext);
