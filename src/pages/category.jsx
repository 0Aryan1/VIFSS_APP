import React, { useEffect, useState } from 'react'
import { GifState } from '../context/GifContext';
import { useParams } from 'react-router-dom';
import Gif from '../components/Gif';
import FollowOn from '../components/FollowOn';


const Category = () => {

  const [results, setResults] = useState([]);

  const {gf} = GifState();

  const {category} = useParams();

  const fetchResults = async () => {
    const {data} = await gf.gifs(category, category);

    setResults(data);
  };

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);


  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-5 my-4">
      <div className="w-full sm:w-72">
        {results.length > 0 && <Gif gif={results[0]} hover={false}/>}
        <span className="text-gray-400 text-sm pt-2">
          Don&apos;t tell it to me, GIF it to me!
        </span>
        <FollowOn/>
        <div className="w-full h-0.5 mt-6 bg-gray-800 divider" />
      </div>
      
      <div>
        <h2 className="text-4xl pb-1 font-extrabold capitalize">
          {category.split("-").join(" & ")} GIFs
        </h2>
        <h2 className="text-lg text-gray-400 pb-3 font-bold hover:text-gray-50 cursor-pointer">
          @{category}
        </h2>

        {results.length > 0 && (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-2 ">
            {results.slice(1).map((gif) => (
              <Gif gif={gif} key={gif.id} />
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  )
}

export default Category