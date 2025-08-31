import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Gif from '../components/Gif'
import { GifState } from '../context/GifContext'
import { HiMiniChevronDown, HiMiniChevronUp, HiMiniHeart } from 'react-icons/hi2'
import FollowOn from '../components/FollowOn'
import { MdOutlineFileDownload } from "react-icons/md";
import { FaPaperPlane } from 'react-icons/fa6'
import { IoCodeSharp } from 'react-icons/io5'
import FilterGif from '../components/FilterGif'

const contentType = ["gifs", "stickers", "text"]

const GifPage = () => {
  const { type, slug } = useParams()

  const [gif, setGif] = useState({})
  const [relatedGifs, setRelatedGifs] = useState([])
  const [readMore, setReadMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { gf, addToFavorites, filter, setGifs, favorites } = GifState()

    // --- Download functionality ---
    const downloadGif = async () => {
      try {
        const imageUrl = gif?.images?.original?.url;
        if (!imageUrl) {
          alert("No image URL found.");
          return;
        }
        const response = await fetch(imageUrl, { mode: 'cors' });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = gif.title ? `${gif.title}.gif` : 'download.gif';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        alert("Failed to download GIF. CORS or network error.");
        console.error("Download error:", error);
      }
    }

  const fetchGif = async () => {
    try {
      setLoading(true)
      // Ensure type and slug are available before making API calls
      if (!type || !slug) {
        return;
      }

      const gifId = slug.split("-")
      const { data } = await gf.gif(gifId[gifId.length - 1])
      // Only pass type if supported by Giphy API
      let related;
      if (filter === "gifs" || filter === "stickers") {
        const res = await gf.related(gifId[gifId.length - 1], {
          type: filter,
          // limit: 10,
        });
        related = res.data;
      } else {
        // For unsupported types, show message or fallback
        related = [];
      }
      setGif(data)
      setRelatedGifs(related || [])
      setLoading(false)
    } catch (err) {
      console.error("Error fetching gif:", err)
      setError("Failed to load GIF. Please try again.")
      setLoading(false)
    }
  }

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
      fetchGif()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

  useEffect(() => {
    // Ensure we have valid params before attempting to fetch
    if (!type || !slug) {
      return;
    }
    
    if (!contentType.includes(type)) {
      setError("Invalid content type")
      setLoading(false)
      return;
    }
    
    fetchGif()
    window.scroll(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, slug])

  // --- Share functionality ---
  //const shareGif = async () => {
    // try {
    //   if (navigator.share) {
    //     await navigator.share({
    //       title: gif.title || "GIF",
    //       url: gif.url,
    //     })
    //   } else {
    //     await navigator.clipboard.writeText(gif.url)
    //     alert("GIF link copied to clipboard!")
    //   }
    // } catch (error) {
    //   console.error("Error sharing:", error)
    // }
  //}

  // --- Embed functionality ---
  //const EmbedGif = async () => {
    // try {
    //   const embedCode = `<iframe src="${gif.embed_url}" width="480" height="270" frameBorder="0" allowFullScreen></iframe>`
    //   await navigator.clipboard.writeText(embedCode)
    //   alert("Embed code copied to clipboard!")
    // } catch (error) {
    //   console.error("Error copying embed code:", error)
    // }
  //}

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        {/* <div className="text-xl">Loading...</div> */}
        <img 
        src='https://media4.giphy.com/media/grNkIEN4dkiMXFLIE9/200w.webp?cid=9c3cd526xzbuco5o2gl3ugzuf5e6q380bq647tq5bp75ahbl&ep=v1_gifs_gifId&rid=200w.webp&ct=s' alt='logo'></img>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  // Don't render if gif is not yet available
  if (!gif || Object.keys(gif).length === 0) {
    return null;
  }

  return (
  <div className="grid grid-cols-4 my-10 gap-4">
      {/* Left side (User details & Source) */}
      <div className="hidden sm:block">
        {gif?.user && (
          <>
            <div className="flex gap-1">
              <img
                src={gif?.user?.avatar_url}
                alt={gif?.user?.display_name}
                className="h-14"
              />
              <div className="px-2">
                <div className="font-bold">{gif?.user?.display_name}</div>
                <div className="faded-text">@{gif?.user?.username}</div>
              </div>
            </div>
            {gif?.user?.description && (
              <p className="py-4 whitespace-pre-line text-sm text-gray-400">
                {!readMore
                  ? gif?.user?.description.slice(0, 100) + "..."
                  : gif?.user?.description}
                <div
                  className="flex items-center faded-text cursor-pointer"
                  onClick={() => setReadMore(!readMore)}
                >
                  {readMore ? (
                    <>
                      Read less <HiMiniChevronUp size={20} />
                    </>
                  ) : (
                    <>
                      Read more <HiMiniChevronDown size={20} />
                    </>
                  )}
                </div>
              </p>
            )}
          </>
        )}

        <FollowOn />
        <div className="divider"></div>
        {/* <FilterGif showTrending/> */}

        {/* {gif?.source && (
          <div>
            <span className="faded-text">Source</span>
            <div className="flex items-center text-sm font-bold gap-1">
              <HiOutlineExternalLink size={25} />
              <a href={gif.source} target="_blank" rel="noreferrer" className="truncate">
                {gif.source}
              </a>
            </div>
          </div>
        )} */}
      </div>

      {/* Main content */}
      <div className="col-span-4 sm:col-span-3">
        <div className="flex gap-6">
          {/* Gif & Mobile UI */}
          <div className="w-full sm:w-3/4">
           <div className="faded-text truncate mb-2">{gif.title}</div>
           
           <Gif gif={gif} hover={false} />

               {/* Mobile user details + favorite    */}
               
                <div className="flex sm:hidden items-center justify-between mt-3">
                  {gif?.user && (<div className="flex gap-1">
                    <img
                      src={gif?.user?.avatar_url}
                      alt={gif?.user?.display_name}
                      className="h-14"
                    />
                    <div className="px-2">
                      <div className="font-bold">{gif?.user?.display_name}</div>
                      <div className="faded-text">@{gif?.user?.username}</div>
                    </div>
                  </div>)}
                  <button
                    onClick={() => addToFavorites(gif.id)}
                    className="flex items-center"
                  >
                    <HiMiniHeart
                      size={30}
                      className={`${favorites.includes(gif.id) ? "text-red-500" : ""}`}
                    />
                    
                  </button>
                  <button
              onClick={downloadGif}
              className="flex gap-5 items-center font-bold text-lg"
            >
              <MdOutlineFileDownload size={25} />
              
            </button>
                </div>
                
               
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden sm:flex flex-col gap-5 mt-6">
            <button
              onClick={() => addToFavorites(gif.id)}
              className="flex gap-5 items-center font-bold text-lg"
            >
              <HiMiniHeart
                size={30}
                className={`${favorites.includes(gif.id) ? "text-red-500" : ""}`}
              />
              Favorite
            </button>
            <button
              onClick={downloadGif}
              className="flex gap-5 items-center font-bold text-lg"
            >
              <MdOutlineFileDownload size={25} />
              Download
            </button>
            {/* <button
              onClick={shareGif}
              className="flex gap-6 items-center font-bold text-lg"
            >
              <FaPaperPlane size={25} />
              Share
            </button>
            <button
              onClick={EmbedGif}
              className="flex gap-5 items-center font-bold text-lg"
            >
              <IoCodeSharp size={30} />
              Embed
            </button> */}
          </div>
        </div>

        {/* Centered FilterGif above recommended section */}
        <div className="mt-6 mb-4 flex justify-center items-center w-full">
          <FilterGif />
        </div>
        {/* Related GIFs */}
        <div className="mt-2">
          <span className="font-extrabold">Recommended GIFs</span>
          <div className="columns-2 md:columns-3 gap-2">
            {(filter === "text") ? (
              <div className='text-2xl font-bold'>Coming soon ☺️.</div>
            ) : relatedGifs.length > 0 ? 
              relatedGifs.slice(1).map((relatedGif) => (
                <Gif gif={relatedGif} key={relatedGif.id} />
              )) : 
              <div>No recommended GIFs found</div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default GifPage


