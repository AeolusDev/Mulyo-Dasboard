"use client"
import { useState } from 'react';
import { FloatingDockUi } from '../../components/FloatingDockUI'
import withAuth from '../../components/withAuth';
import { createSeries } from '../../utils/createSeries'

const addSeries = () => {
  const [thumbnail, setThumbnail] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [alert, setAlert] = useState(null);

  const handleThumbnailChange = (e) => {
    const url = e.target.value;
    setThumbnail(url);
    setIsValidUrl(validateUrl(url));
  };

  const validateUrl = (url) => {
    const pattern = new RegExp('^(https?://)?([a-zA-Z0-9]([a-zA-Z0-9\\-].*[a-zA-Z0-9])?\\.)+[a-zA-Z].*$');
    return pattern.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const seriesData = Object.fromEntries(formData.entries());
    seriesData.manga_status = selectedStatus; // Add selectedStatus to seriesData

    // Convert date format from yyyy-mm-dd to yyyy/mm/dd
    if (seriesData.releaseDate) {
      const [year, month, day] = seriesData.releaseDate.split('-');
      seriesData.releaseDate = `${year}/${month}/${day}`;
    }

    try {
      await createSeries(seriesData);
      setAlert('success');
      setTimeout(() => setAlert(null), 5000); // Hide alert after 5 seconds
    } catch (error) {
      setAlert('error');
      setTimeout(() => setAlert(null), 5000); // Hide alert after 5 seconds
    }
  };

  const handleStatusChange = (manga_status) => {
    setSelectedStatus(manga_status);
  };

  return (
    <div className="min-h-screen bg-base-100 relative overflow-hidden">
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
                linear-gradient(rgba(147, 51, 234, 0.8) 1px, transparent 1px),
                linear-gradient(90deg, rgba(147, 51, 234, 0.6) 1px, transparent 5px)
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
                      <h2 className="text-xl font-bold text-primary-content m-2">Series Creation</h2>
                    </div>
                  </div>  
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Creation Form */}
          <form onSubmit={handleSubmit}>  
            <div className="relative z-10 p-4 pt-6 w-full h-full">
              <div className="flex justify-center h-full">
                <div className="w-full h-full">
                  <div className="card bg-base-100 backdrop-blur-sm
                    shadow-[0_0_30px_rgba(147,51,234,1)] 
                    hover:shadow-[0_0_50px_rgba(147,51,234,0.3)] 
                    transition-all duration-500 ease-out transform hover:-translate-y-2
                    border-2 border-[rgba(147,51,234,1)] backdrop-blur-sm rounded-md w-full h-full"
                  >
                    <div className="card-body h-full">
                      
                      {/* Thumbnail Container */}
                      <div className="bg-[#282a36] rounded-lg w-full h-full flex flex-row justify-start items-center">
                        {/* Thumbnail Upload Preview */}
                        <div className="uploadPreview rounded-lg">
                          {isValidUrl ? (
                            <img src={thumbnail} alt="Thumbnail Preview" className="m-2 h-60 w-50 rounded-lg object-cover" />
                          ) : (
                            <div className="m-2 skeleton h-60 w-50 rounded-lg"></div>
                          )}
                        </div>
                        
                        {/* Thumbnail Upload Input */}                      
                        <div className="flex flex-col w-[70%] items-center">
                          <h1 className="text-2xl font-bold mb-4">Thumbnail Upload*</h1>
                          <label className="input validator bg-[#282a36] rounded-lg shadow-lg">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></g></svg>
                            <input 
                              type="url"  
                              required 
                              placeholder="https://" 
                              pattern="^(https?://)?([a-zA-Z0-9]([a-zA-Z0-9\\-].*[a-zA-Z0-9])?\\.)+[a-zA-Z].*$" 
                              title="Must be valid URL" 
                              value={thumbnail}
                              onChange={handleThumbnailChange}
                              name="thumbnail"
                            />
                          </label>
                          <p className="validator-hint">Must be valid URL</p>
                        </div>
                      </div>
                      
                      <div className="divider divider-secondary"></div>
                      
                      {/* Detail Container */}
                      <div className="rounded-lg bg-[#282a36] w-full h-full flex flex-wrap justify-center items-center gap-5">
                        
                        {/* Basic Information */}
                        <div className="flex flex-wrap gap-5 w-full justify-center mt-10">
                          {/* Series Title */}
                          <div className="titleContainer flex flex-col mt-2 mb-2 items-center">
                            <h2 className="text-xl font-bold">Title*</h2>
                            <input
                              type="text"
                              name="title"
                              placeholder="Title*"
                              className="input input-bordered w-full rounded-lg bg-[#282a36] input-secondary"
                              required
                            />
                          </div>
                          
                          {/* Series Nick */}
                          <div className="titleContainer flex flex-col mt-2 mb-2 items-center">
                            <h2 className="text-xl font-bold">Nickname*</h2>
                            <input
                              type="text"
                              name="nick"
                              placeholder="Series Nickname*"
                              className="input input-bordered w-full rounded-lg bg-[#282a36] input-secondary"
                              required
                            />
                          </div>
                          
                          {/* Series Author */}
                          <div className="titleContainer flex flex-col mt-2 mb-2 items-center">
                            <h2 className="text-xl font-bold">Author*</h2>
                            <input
                              type="text"
                              name="author"
                              placeholder="Series Author*"
                              className="input input-bordered w-full rounded-lg bg-[#282a36] input-secondary"
                              required
                            />
                          </div>
                          
                          {/* Genre */}
                          <div className="titleContainer flex flex-col mt-2 mb-2 items-center">
                            <h2 className="text-xl font-bold">Genre*</h2>
                            <input
                              required
                              type="text"
                              name="genre"
                              placeholder="Series Genres*"
                              className="input input-bordered w-full rounded-lg bg-[#282a36] input-secondary"
                            />
                          </div>
                          
                        </div>
                        
                        {/* Description */}
                        <div className="flex flex-wrap gap-5 w-full justify-center">
                          <div className="titleContainer flex flex-col mt-2 mb-2 items-center w-[90%]">
                            <h2 className="text-xl font-bold">Description*</h2>
                            <textarea 
                              required
                              name="desc"
                              className="textarea w-full rounded-lg bg-[#282a36] textarea-secondary" 
                              placeholder="Description*"
                            >
                            </textarea>
                          </div>
                        </div>
                        
                        {/* Links */}
                        <div className="flex flex-wrap gap-5 w-full justify-center">
                          
                          {/* Anilist */}
                          <div className="titleContainer flex flex-col mt-2 mb-2 items-center">
                            <h2 className="text-xl font-bold">Anilist</h2>
                            <input
                              type="text"
                              name="anilist"
                              placeholder="Anilist"
                              className="input input-bordered w-full rounded-lg bg-[#282a36] input-secondary"
                            />
                          </div>
                          
                          {/* MAL */}
                          <div className="titleContainer flex flex-col mt-2 mb-2 items-center">
                            <h2 className="text-xl font-bold">MAL</h2>
                            <input
                              type="text"
                              name="mal"
                              placeholder="MAL"
                              className="input input-bordered w-full rounded-lg bg-[#282a36] input-secondary"
                            />
                          </div>
                          
                          {/* Naver */}
                          <div className="titleContainer flex flex-col mt-2 mb-2 items-center">
                            <h2 className="text-xl font-bold">Naver</h2>
                            <input
                              type="text"
                              name="naver"
                              placeholder="Naver"
                              className="input input-bordered w-full rounded-lg bg-[#282a36] input-secondary"
                            />
                          </div>
                          
                          {/* Webtoon */}
                          <div className="titleContainer flex flex-col mt-2 mb-2 items-center">
                            <h2 className="text-xl font-bold">Webtoon</h2>
                            <input
                              type="text"
                              name="webtoon"
                              placeholder="Webtoon"
                              className="input input-bordered w-full rounded-lg bg-[#282a36] input-secondary"
                            />
                          </div>
                          
                          {/* Newtoki */}
                          <div className="titleContainer flex flex-col mt-2 mb-2 items-center">
                            <h2 className="text-xl font-bold">Newtoki</h2>
                            <input
                              type="text"
                              name="newtoki"
                              placeholder="Newtoki"
                              className="input input-bordered w-full rounded-lg bg-[#282a36] input-secondary"
                            />
                          </div>
                        </div>
                        
                        {/* Other Information */}
                        <div className="flex flex-wrap gap-5 w-full justify-center mb-10">
                          
                          {/* Manga Status */}
                          <div className="mangaStatusContainer flex flex-col mt-2 mb-2 items-center">
                            <h2 className="text-xl font-bold">Status*</h2>
                            <div required className="dropdown dropdown-bottom dropdown-center rounded-md">
                              <div tabIndex="0" role="button" className="btn m-1 rounded-lg bg-[#282a36]">{ selectedStatus || "Choose Status" }</div>
                              <ul tabIndex="0" className="dropdown-content menu bg-[#282a36] rounded-box rounded-lg z-1 w-52 p-2 shadow-sm">
                                <li><a onClick={() => handleStatusChange("Completed")}>Completed</a></li>
                                <li><a onClick={() => handleStatusChange("Releasing")}>Releasing</a></li>
                                <li><a onClick={() => handleStatusChange("On Hold")}>On Hold</a></li>
                                <li><a onClick={() => handleStatusChange("Dropped")}>Dropped</a></li>
                              </ul>
                            </div>
                          </div>
                          
                          {/* Release Date */}
                          <div className="releaseDateContainer flex flex-col mt-2 mb-2 items-center">
                            <h2 className="text-xl font-bold">Release Date*</h2>
                            <input
                              required
                              type="date"
                              name="releaseDate"
                              placeholder="Release Date"
                              className="m-1 input input-bordered w-full rounded-lg bg-[#282a36] input-secondary"
                            />
                          </div>
                          
                        </div>
                        
                        {/* Submit Button */}
                        
                        <div className="flex flex-col jusify-centre mb-10 w-100">
                          <button
                            className="w-[90%] bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                            type="submit"
                          >
                            Create &rarr;
                            <BottomGradient />
                          </button>
                        </div>
                        
                      </div>
                    </div>
                  </div>  
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <FloatingDockUi />
      {alert === 'success' && <SuccessAlert />}
      {alert === 'error' && <ErrorAlert />}
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const SuccessAlert = () => {
  return (
    <div role="alert" className="z-50 alert alert-success fixed top-5 right-5 transition-opacity duration-500 ease-in-out rounded-lg">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Success! Chapter creation was successful.</span>
    </div>
  );
}

const ErrorAlert = () => {
  return (
    <div role="alert" className="z-50 alert alert-error fixed top-5 right-5 transition-opacity duration-500 ease-in-out rounded-lg">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Error! Chapter creation was not successful.</span>
    </div>
  );
}

export default withAuth(addSeries);
