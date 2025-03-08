"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { default as formatString } from "../../utils/formatString";
import { FloatingDockUi } from '../../components/FloatingDockUI';
import { useRouter } from 'next/navigation';
import { UpdateSeries } from '../../utils/updateSeries';
import withAuth from '../../components/withAuth';

function SeriesHome() {
  const searchParams = useSearchParams();
  const [series, setSeries] = useState(null);
  const [seriesDetails, setSeriesDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});
  const [selectedStatus, setSelectedStatus] = useState('');
  const router = useRouter();
  
  useEffect(() => {
    const id = searchParams.get("id");
    const nick = searchParams.get("nick");
    
    if (id && nick) {
      setSeries({ id, nick });
    }
  }, [searchParams]);
  
  useEffect(() => {
    async function fetchSeries() {
      if (series) {
        try {
          const seriesDetails = await getSeriesDetails(series.id, series.nick);
          console.log(seriesDetails);
          setSeriesDetails(seriesDetails.seriesDetails);
          setEditedDetails(seriesDetails.seriesDetails);
        } catch (error) {
          console.error("Failed to fetch series details:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    
    fetchSeries();
  }, [series]);
  
  const handleEditClick = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      handleSaveEdit();
    }
  };
  
  const handleSaveEdit = async () => {
    console.log("Saved details:", editedDetails);
    // Here you can add the logic to save the changes to the server
    try {
      const updateSeries = new UpdateSeries();
      await updateSeries.updateSeriesDetails(series.id, seriesDetails, editedDetails);
      console.log("Series details updated successfully");
    } catch (error) {
      console.error("Failed to update series details:", error);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setEditedDetails((prevDetails) => ({
      ...prevDetails,
      manga_status: status,
    }));
  };
  
  const handleUploadClick = () => {
    router.push(`/series/uploadChapter`);
  };
  
  const handleEditChapterClick = () => {
    const queryString = new URLSearchParams({
      id: series.id,
      nick: series.nick,
    }).toString();
    router.push(`/series/editChapter?${queryString}`);
  };
  
  const handleDeleteClick = () => {
    router.push(`/series/delete/${seriesDetails.id}`);
  };
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center text-xl">Loading...</div>;
  }
  
  if (!seriesDetails) {
    return <div className="flex h-screen items-center justify-center text-xl">No series details found.</div>;
  }
  
  return (
    <div className="flex flex-col justify-center items-center w-full h-full min-h-screen">
      {/* Base Card */}
      <div className="relative z-10 p-4 pt-6 w-full h-full">
        <div className="w-full h-full">
          <div className="flex gap-6 w-full h-full">
            <div className="w-full h-full">
              <div className="card bg-base-100 backdrop-blur-sm
                shadow-[0_0_30px_rgba(147,51,234,1)] 
                border-2 border-[rgba(147,51,234,1)] backdrop-blur-sm rounded-md w-full h-full"
              >
                {/* Series Title */}
                <div className="card-body w-full h-full flex flex-col justify-center items-center">
                  {isEditing ? (
                    <div className="w-full max-w-xs">
                      <label className="block text-sm font-bold mb-2 text-primary-content" htmlFor="title">Title</label>
                      <input
                      type="text"
                      name="title"
                      value={editedDetails.title}
                      onChange={handleChange}
                      className="input input-secondary input-bordered w-full rounded-lg bg-[#282a36]"
                      />
                    </div>
                  ) : (
                    <h2 className="text-xl font-bold text-primary-content m-2">{formatString(seriesDetails.title)}</h2>
                  )}
                </div>
                
                <div className="flex w-full h-full">
                  {/* Series Thumbnail */}
                  <div className="card-body w-80 h-200 flex flex-col justify-center items-center rounded-md">
                    <img src={seriesDetails.thumbnail} alt={seriesDetails.title} className="w-full h-full object-cover rounded-md" />
                  </div>
                  
                  {/* Series Details */}
                  <div className="card-body w-1/2 h-full flex flex-col justify-center items-start">
                    {/* Series Description */}
                    <div className="w-full mb-4">
                      <label className="block text-sm font-bold mb-2 text-primary-content" htmlFor="desc">Description</label>
                      {isEditing ? (
                        <textarea
                        name="desc"
                        value={editedDetails.desc}
                        onChange={handleChange}
                        className="textarea textarea-bordered w-full rounded-lg bg-[#282a36] input-secondary"
                        />
                      ) : (
                        <p className="text-sm text-primary-content m-2">
                          {formatString(seriesDetails.desc)}
                        </p>
                      )}
                    </div>
                    
                    {/* Genre Tags */}
                    <div className="w-full mb-4">
                      <label className="block text-sm font-bold mb-2 text-primary-content" htmlFor="genre">Genre</label>
                      {isEditing ? (
                        <input
                        type="text"
                        name="genre"
                        value={editedDetails.genre}
                        onChange={handleChange}
                        className="input input-bordered w-full rounded-lg bg-[#282a36] input-secondary"
                        />
                      ) : (
                        <p className="text-sm text-primary-content m-2">
                          {formatString(seriesDetails.genre)}
                        </p>
                      )}
                    </div>
                    
                    {/* Author Tags */}
                    <div className="w-full mb-4">
                      <label className="block text-sm font-bold mb-2 text-primary-content" htmlFor="author">Author</label>
                      {isEditing ? (
                        <input
                        type="text"
                        name="author"
                        value={editedDetails.author}
                        onChange={handleChange}
                        className="input input-bordered w-full rounded-lg bg-[#282a36] input-secondary"
                        />
                      ) : (
                        <p className="text-sm text-primary-content m-2">
                          {seriesDetails.author}
                        </p>
                      )}
                    </div>
                    
                    {/* Status Tag */}
                    <div className="w-full mb-4">
                      <label className="block text-sm font-bold mb-2 text-primary-content" htmlFor="manga_status">Status</label>
                      {isEditing ? (
                        <div className="dropdown dropdown-bottom dropdown-center rounded-md">
                          <div tabIndex="0" role="button" className="btn m-1 rounded-lg bg-[#282a36]">{selectedStatus || "Choose New Status"}</div>
                          <ul tabIndex="0" className="dropdown-content menu bg-[#282a36] rounded-box rounded-lg z-1 w-52 p-2 shadow-sm">
                            <li><a onClick={() => handleStatusChange("Completed")}>Completed</a></li>
                            <li><a onClick={() => handleStatusChange("Releasing")}>Releasing</a></li>
                            <li><a onClick={() => handleStatusChange("On Hold")}>On Hold</a></li>
                            <li><a onClick={() => handleStatusChange("Dropped")}>Dropped</a></li>
                          </ul>
                        </div>
                      ) : (
                        <p className="text-sm text-primary-content m-2">
                          {formatString(seriesDetails.manga_status)}
                        </p>
                      )}
                    </div>
                    
                    {/* Nick Tag */}
                    <div className="w-full mb-4">
                      <label className="block text-sm font-bold mb-2 text-primary-content" htmlFor="nick">Nick</label>
                      {isEditing ? (
                        <input
                        type="text"
                        name="nick"
                        value={editedDetails.nick}
                        onChange={handleChange}
                        className="input input-bordered w-full rounded-lg bg-[#282a36] input-secondary"
                        />
                      ) : (
                        <p className="text-sm text-primary-content m-2">
                          {seriesDetails.nick}
                        </p>
                      )}
                    </div>
                    
                    {/* Anilist */}
                    <div className="w-full mb-4">
                      <label className="block text-sm font-bold mb-2 text-primary-content" htmlFor="anilist">Anilist</label>
                      {isEditing ? (
                        <input
                        type="text"
                        name="anilist"
                        value={editedDetails.anilist}
                        onChange={handleChange}
                        className="input input-bordered w-full rounded-lg bg-[#282a36] input-secondary"
                        />
                      ) : (
                        <p className="text-sm text-primary-content m-2">
                          <a href={seriesDetails.anilist} target="_blank" rel="noopener noreferrer">{seriesDetails.anilist || 'N/A'}</a>
                        </p>
                      )}
                    </div>
                    
                    {/* MyAnimeList */}
                    <div className="w-full mb-4">
                      <label className="block text-sm font-bold mb-2 text-primary-content" htmlFor="mal">MyAnimeList</label>
                      {isEditing ? (
                        <input
                        type="text"
                        name="mal"
                        value={editedDetails.mal}
                        onChange={handleChange}
                        className="input input-bordered w-full rounded-lg bg-[#282a36] input-secondary"
                        />
                      ) : (
                        <p className="text-sm text-primary-content m-2">
                          <a href={seriesDetails.mal} target="_blank" rel="noopener noreferrer">{seriesDetails.mal || 'N/A'}</a>
                        </p>
                      )}
                    </div>
                    
                    {/* Newtoki */}
                    <div className="w-full mb-4">
                      <label className="block text-sm font-bold mb-2 text-primary-content" htmlFor="newtoki">Newtoki</label>
                      {isEditing ? (
                        <input
                        type="text"
                        name="newtoki"
                        value={editedDetails.newtoki}
                        onChange={handleChange}
                        className="input input-bordered w-full rounded-lg bg-[#282a36] input-secondary"
                        />
                      ) : (
                        <p className="text-sm text-primary-content m-2">
                          <a href={seriesDetails.newtoki} target="_blank" rel="noopener noreferrer">{seriesDetails.newtoki || 'N/A'}</a>
                        </p>
                      )}
                    </div>
                    
                    {/* Naver */}
                    <div className="w-full mb-4">
                      <label className="block text-sm font-bold mb-2 text-primary-content" htmlFor="naver">Naver</label>
                      {isEditing ? (
                        <input
                        type="text"
                        name="naver"
                        value={editedDetails.naver}
                        onChange={handleChange}
                        className="input input-bordered w-full rounded-lg bg-[#282a36] input-secondary"
                        />
                      ) : (
                        <p className="text-sm text-primary-content m-2">
                          <a href={seriesDetails.naver} target="_blank" rel="noopener noreferrer">{seriesDetails.naver || 'N/A'}</a>
                        </p>
                      )}
                    </div>
                    
                    {/* Webtoon */}
                    <div className="w-full mb-4">
                      <label className="block text-sm font-bold mb-2 text-primary-content" htmlFor="webtoon">Webtoon</label>
                      {isEditing ? (
                        <input
                        type="text"
                        name="webtoon"
                        value={editedDetails.webtoon}
                        onChange={handleChange}
                        className="input input-bordered w-full rounded-lg bg-[#282a36] input-secondary"
                        />
                      ) : (
                        <p className="text-sm text-primary-content m-2">
                          <a href={seriesDetails.webtoon} target="_blank" rel="noopener noreferrer">{seriesDetails.webtoon || 'N/A'}</a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Series Actions */}
                <div className="card-body w-fit h-full flex flex-row justify-center items-center">
                  {/* Edit Button */}
                  <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50" onClick={handleEditClick}>
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                      {isEditing ? "Save Edit" : "Edit Series"}
                    </span>
                  </button>
                  
                  {/* Upload Chapters Button */}
                  <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50" onClick={handleUploadClick}>
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                      Upload Chapters
                    </span>
                  </button>
                  
                  {/* Edit Chapters Button */}
                  <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50" onClick={handleEditChapterClick}>
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                      Edit Chapters
                    </span>
                  </button>
                  
                  {/* Delete Button */}
                  <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                      Delete Series
                    </span>
                  </button>
                </div>
              </div>  
            </div>
          </div>
        </div>
      </div>
      <FloatingDockUi />
    </div>
  );
}

async function getSeriesDetails(id, nick) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/getSeriesDetails/${id}/${nick}`);
  if (!response.ok) {
    throw new Error("Failed to fetch series details");
  }
  const data = await response.json();
  return data;
}

const SeriesHomeWrapper = () => {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-xl">Loading...</div>}>
      <SeriesHome />
    </Suspense>
  );
}

export default withAuth(SeriesHomeWrapper);