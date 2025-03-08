'use client';
import Image from 'next/image';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Analytics } from "@vercel/analytics/react";
import { FloatingDockUi } from '../components/FloatingDockUI';
import withAuth from '../components/withAuth';
import axios from 'axios';

const ManagerPage = () => {
  const [series, setSeries] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchSeries() {
      const seriesList = await getAllSeries();
      setSeries(seriesList);
    }

    fetchSeries();
  }, []);

  console.log(series);

  const handleCardClick = (selectedSeries) => {
    if (typeof window !== "undefined") {
      const queryString = new URLSearchParams({
        id: selectedSeries.manga,
        nick: selectedSeries.nick
      }).toString();
  
      router.push(`/series/seriesHome?${queryString}`);
    }
  };

  const redirectSeriesCreation = () => {
    router.push(`/series/createSeries`)
  }
  
  return (
  <div className="min-h-screen bg-base-100 relative overflow-hidden" data-theme="dark">
    {/* Background Layers */}
    <div className="absolute inset-0">
      {/* Base black background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Grid with radial fade */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(147, 51, 234, 1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(147, 51, 234, 1) 1px, transparent 1px),
              linear-gradient(rgba(147, 51, 234, 1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(147, 51, 234, 0.5) 1px, transparent 5px)
            `,
            backgroundSize: '50px 50px, 50px 50px, 10px 10px, 10px 10px',
            mask: 'radial-gradient(circle at center, transparent 0%, black 70%)',
            WebkitMask: 'radial-gradient(circle, rgba(106,45,194,0.3939776594231442) 100%, rgba(0,0,0,0.7637255585828081) 90%)',
            opacity: '0.4'
          }}
        />
      </div>

    {/* Subtle purple accent glow */}
    <div 
      className="absolute inset-0"
      style={{
        background: 'radial-gradient(circle at center, rgba(147, 51, 234, 0.0003) 10%, transparent 30%)',
        filter: 'blur(5px)'
      }}
    />
  </div>
  
    <div>
      <div className="top-5 right-10 flex flex-col justify-center items-center py-2">
        
        {/* Page Title */}
        <div className="relative z-10 p-4 pt-6">
          <div className="">
            <div className="flex gap-6">
              <div className="size-auto">
                <div className="card bg-base-100 backdrop-blur-sm
                  shadow-[0_0_30px_rgba(147,51,234,1)] 
                  hover:shadow-[0_0_50px_rgba(147,51,234,0.3)] 
                  transition-all duration-500 ease-out transform hover:-translate-y-2
                  border-2 border-[rgba(147,51,234,1)] backdrop-blur-sm rounded-md size-auto"
                >
                  <div className="card-body">
                    <h2 className="text-xl font-bold text-primary-content m-2">Series Manager</h2>
                  </div>
                </div>  
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Series Creation Button */}
      <div className="flex justify-end pr-10">
        <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block justify-end" onClick={redirectSeriesCreation}>
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-2 px-10 ring-1 ring-white/10 ">
            <span>
              Add New Series
            </span>
            <svg
              fill="none"
              height="16"
              viewBox="0 0 24 24"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.75 8.75L14.25 12L10.75 15.25"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
        </button>
      </div>


      {/* Main Content */}
      {series.map((series) => (
        <div key={series._id} className="gap-10 mb-10 mt-10">
          <div>
            <div className="flex flex-col gap-4 gap-5">
              <div 
                className="card bg-base-100 backdrop-blur-sm
                shadow-[0_0_30px_rgba(147,51,234,1)] 
                hover:shadow-[0_0_50px_rgba(147,51,234,0.3)] 
                transition-all duration-500 ease-out transform hover:-translate-y-2
                border-2 border-[rgba(147,51,234,1)] backdrop-blur-sm rounded-md size-auto cursor-pointer"
                onClick={() => handleCardClick(series)}
              >
                <div className="card-body flex flex-row">
                  {/* Series Thumbnail */}
                  <div className="seriesThumbnail flex-shrink-0">
                    <img src={series.thumbnail} alt={series.title} className="w-32 h-32 object-cover rounded-md" />
                  </div>

                  {/* Series Info */}
                  <div className="seriesInfo ml-4 flex flex-col justify-center">
                    {/* Series Title */}
                    <div className="seriesTitle">
                      <h3 className="text-lg font-bold text-primary-content">{formatTitle(series.title)}</h3>
                    </div>

                    {/* Series Author */}
                    <div className="seriesAuthor">
                      <p className="text-sm text-primary-content">Author: {series.author}</p>
                    </div>

                    {/* Series Genre */}
                    <div className="seriesGenre">
                      <p className="text-sm text-primary-content">Genre: {series.genre}</p>
                    </div>

                    {/* Series Status */}
                    <div className="seriesStatus">
                      <p className="text-sm text-primary-content">Status: {series.manga_status}</p>
                    </div>

                    {/* Series Release Date */}
                    <div className="seriesReleaseDate">
                      <p className="text-sm text-primary-content">Release Date: {new Date(series.releaseDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <FloatingDockUi />
    </div>
  </div>
  );
}

async function getAllSeries() {
  const seriesList = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/getAllSeries`);
  // console.log(seriesList.data.series[0].mangas[0]);
  return seriesList.data.series[0].mangas;
}

function formatTitle(title) {
  return title
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default withAuth(ManagerPage);