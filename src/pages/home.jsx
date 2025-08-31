import React, { useEffect } from 'react'
import { GifState } from '../context/GifContext';
import Gif from '../components/Gif';
import FilterGif from '../components/FilterGif';

const Home = () => {

  const { gf, filter, setGifs, gifs } = GifState();

  const fetchTrendingGifs = async () => {
    const {data} = await gf.trending({
      limit: 20,
      type: filter,
      rating: "g",
    })

    setGifs(data)
  }

  useEffect(() => {
    fetchTrendingGifs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div>
      <img 
      src="banner.gif" 
      alt="earth_banner" 
      className='mt-2 rounded w-full'/>

      <FilterGif showTrending/>

      {filter === "text" ? (
        <div className="flex justify-center items-center h-40">
          <span className="text-2xl font-bold">Coming soon ☺️.</span>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2">
          {gifs.map((gif) => {
             return <Gif gif={gif} key={gif.tittle}/>
          })}
        </div>
      )}
    </div>
  )
}

export default Home
