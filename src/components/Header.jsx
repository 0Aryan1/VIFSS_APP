import { useEffect, useState } from "react";
import { GifState } from "../context/GifContext";
import { Link } from "react-router-dom";
import { HiMiniEllipsisVertical, HiMiniBars3BottomRight } from "react-icons/hi2";
import GifSearch from "./GifSearch";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);

  const { gf,filter, setFilter,favorites } = GifState();

  const fetchGifCategories = async () => {
      const { data } = await gf.categories();
      setCategories(data);
    } 

  useEffect(() => {
    fetchGifCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav>
      <div className="relative flex gap-4 justify-between items-center mb-2">
        <Link to={"/"} className="flex gap-2">
            <video src="/main_logo.mp4" autoPlay loop muted className="w-20 " />
            <h1 className="text-6xl sm:text-5xl font-bold tracking-tight cursor-pointer">
              VIFS
            </h1>
        </Link>
  
        <div className="font-bold text-md flex gap-2 items-center">
            {categories?.slice(0, 5).map((category) => {
                return (
                  <Link
                    className="px-4 py-1 transition ease-in-out hover:gradient border-b-4 hidden lg:block"
                    key={category.name}
                    to={`/${category.name_encoded}`}
                  >
                    {category.name}
                  </Link>
                );
              })}

             <button onClick={() => setShowCategories(!showCategories)}>
               <HiMiniEllipsisVertical 
             size={35}
             className={`py-0.5 transition ease-in-out hover:gradient ${
                       showCategories ? "gradient" : ""
                     } border-b-4 cursor-pointer hidden lg:block`}/>
            </button>
       
            {favorites.length > 0 && (
            <div className="h-9 bg-gray-700 hover:bg-gradient-to-tr from-pink-600 to-pink-400 pt-1.5 px-6 cursor-pointer rounded hidden lg:block">
              <Link to="/favorites">Favorite GIFs</Link>
            </div>
            )}

            <button onClick={() => setShowCategories(!showCategories)}>
               <HiMiniBars3BottomRight
               className="text-sky-400 block lg:hidden"
               size={50}
               />
            </button>
       </div>
  
  
       {showCategories && (
          <div className="absolute right-0 top-14 px-10 pt-6 pb-9 w-full gradient z-20">
            <span className="text-3xl font-extrabold">Categories</span>
            <hr className="bg-gray-100 opacity-50 my-5" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {categories?.map((category) => {
                return (
                  <Link
                    onClick={() => setShowCategories(false)}
                    className="transition ease-in-out font-bold"
                    key={category.name}
                    to={`/${category.name_encoded}`}
                  >
                    {category.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        
      </div>
      <div className="flex flex-col gap-4">
        {/* Mobile Favorites */}
        {favorites.length > 0 && (
          <div className="block lg:hidden">
            <div className="w-full h-12 bg-gray-700 hover:bg-gradient-to-tr from-pink-600 to-pink-400 flex items-center justify-center cursor-pointer rounded">
              <Link to="/favorites">Favorite GIFs</Link>
            </div>
          </div>
        )}
        <GifSearch filter={filter} setFilter={setFilter}/>
      </div>
    </nav>
  );
};

export default Header;
