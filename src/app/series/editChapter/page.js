"use client"
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { FloatingDockUi } from '../../components/FloatingDockUI';
import withAuth from '../../components/withAuth';
import { getChapters, getChapterDetails, updateChapter } from '../../utils/editChapter';
import imageCompression from 'browser-image-compression';
import { 
  IconArrowBigRightLinesFilled,
  IconTrash,
  IconEdit,
  IconX
} from "@tabler/icons-react";

// Edit Page Modal component
const EditPageModal = ({ isOpen, onClose, image, index, chapterDetails, handleUpdate }) => {
  const [chapterName, setChapterName] = useState(chapterDetails?.chapterName || "");
  const [seriesNick, setSeriesNick] = useState(chapterDetails?.nick || "");
  const [chapterNo, setChapterNo] = useState(chapterDetails?.chapterNo || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [dropZoneText, setDropZoneText] = useState('Drop image here');
  const [imageCount, setImageCount] = useState('Image Uploaded: 0');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (chapterDetails) {
      setChapterName(chapterDetails.chapterName);
      setSeriesNick(chapterDetails.nick);
      setChapterNo(chapterDetails.chapterNo);
    }
  }, [chapterDetails]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFile(files[0]);
    setImageCount(`Total Files: ${files.length}`);
    setDropZoneText(`${files.length} file selected`);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = '#f0f0f0';
  };

  const handleDragLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'white';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length) {
      handleFileChange({ target: { files } });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await handleUpdate({ seriesNick, chapterNo, selectedFile });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-[#1f202a] border border-base-100 p-6 rounded-lg shadow-lg w-[90%] max-w-3xl max-h-[95vh] overflow-y-auto">
        <button className="absolute top-3 right-3" onClick={onClose}>
          <IconX size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4">Edit Page {index + 1}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-primary-content">Series Nick</span>
            </label>
            <input
              type="text"
              placeholder="Series Nickname"
              className="input w-full bg-base-300 border-2 border-primary/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] transition-all duration-300 focus:outline-none focus:border-primary hover:border-primary/80 text-primary-content"
              value={seriesNick}
              onChange={(e) => setSeriesNick(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-primary-content">Chapter Number</span>
            </label>
            <input
              type="text"
              placeholder="Chapter Number"
              className="input w-full bg-base-300 border-2 border-primary/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] transition-all duration-300 focus:outline-none focus:border-primary hover:border-primary/80 text-primary-content"
              value={chapterNo}
              onChange={(e) => setChapterNo(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-primary-content">Page Image</span>
            </label>
            <div
              className="relative cursor-pointer"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <label
                className="flex flex-col items-center justify-center w-full min-h-[12rem] 
                  border-2 border-dashed border-primary/30 rounded-lg
                  hover:border-primary/80 transition-all duration-300 padding-bottom-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-content/70 mt-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mt-4 text-sm text-primary-content/70">{dropZoneText}</p>
                <p className="mt-2 text-xs text-primary-content/50 whitespace-pre-line">{imageCount}</p>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn w-full bg-base-300 text-primary-content border-2 border-primary/30 shadow-[0_2px_4px_rgba(0,0,0,0.4)] hover:border-primary/80 transition-all duration-300 active:transform active:translate-y-0.5"
          >
            Update Page
            <span className="ml-2">→</span>
          </button>
        </form>
      </div>
    </div>
  );
};

// Image Modal component
const Modal = ({ isOpen, onClose, image, index, handleEditClick }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-[#1f202a] border border-base-100 p-6 rounded-lg shadow-lg w-[90%] max-w-3xl max-h-[95vh] overflow-y-auto">
        <button className="absolute top-3 right-3" onClick={onClose}>
          <IconX size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4">Page {index + 1}</h2>
        <div className="flex flex-col items-center">
          <img src={image} alt={`Page ${index + 1}`} className="w-full h-auto object-cover rounded-md mb-4" />
          <div className="flex flex-row gap-2 justify-center items-center">
            <button className="btn btn-soft btn-warning w-20 rounded-full" onClick={() => handleEditClick(image, index)}> <IconEdit /> </button>
            <button className="btn btn-soft btn-error w-20 rounded-full">  <IconTrash /> </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const editChapter = () => {
  // For loading
  const [loading, setLoading] = useState(true);
  
  // For getting series
  const [series, setSeries] = useState(null);
  
  // For getting chapter
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapterNoList, setChapterNoList] = useState([]);
  const [chapterDetails, setChapterDetails] = useState(null);
  const [chapterResources, setChapterResources] = useState(null);
  
  // For image modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  
  // For reloading
  const [reloading, setReloading] = useState(false);
  
  // For edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEditImage, setSelectedEditImage] = useState(null);
  const [selectedEditImageIndex, setSelectedEditImageIndex] = useState(null);

  // For alerts
  const [alert, setAlert] = useState(null);
  
  // Get search params
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const nick = searchParams.get("nick");

  useEffect(() => {
    const fetchChapters = async () => {
      if (id && nick) {
        try {
          const { chapterList, chapterNoList } = await getChapters(id, nick);
          setSeries({ id, nick, chapterList });
          setChapterNoList(chapterNoList);
        } catch (error) {
          console.error('Error fetching chapters:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [id, nick]);

  useEffect(() => {
    const fetchChapterDetails = async () => {
      if (selectedChapter) {
        try {
          const details = await getChapterDetails(id, nick, selectedChapter);
          setChapterDetails(details.seriesDetails);
          setChapterResources(details.chapterResources);
        } catch (error) {
          console.error('Error fetching chapter details:', error);
        } finally {
          setReloading(false);
        }
      }
    };

    fetchChapterDetails();
  }, [selectedChapter, id, nick]);

  const handleChapterSelect = (chapterNo) => {
    setSelectedChapter(chapterNo);
    setChapterResources(null);
    setReloading(true);
  };

  const handleImageClick = (image, index) => {
    setSelectedImage(image);
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setSelectedImageIndex(null);
  };

  // For handling edit image click
  const handleEditClick = (image, index) => {
    setSelectedEditImage(image);
    setSelectedEditImageIndex(index);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEditImage(null);
    setSelectedEditImageIndex(null);
  };

  const handleUpdate = async ({ seriesNick, chapterNo, selectedFile }) => {
    try {
      const formData = new FormData();
      formData.append('nick', seriesNick);
      formData.append('chapterNo', chapterNo);

      // Compress the image
      const options = {
        maxSizeMB: 5,
      };
      const compressedBlob = await imageCompression(selectedFile, options);
      const compressedFile = new File([compressedBlob], selectedFile.name, {
        type: compressedBlob.type,
        lastModified: Date.now(),
      });

      formData.append('image', compressedFile);

      await updateChapter(formData);
      // Refresh chapter details after update
      const details = await getChapterDetails(id, nick, selectedChapter);
      setChapterDetails(details.seriesDetails);
      setChapterResources(details.chapterResources);
      setAlert('success');
      setTimeout(() => setAlert(null), 5000); // Hide alert after 5 seconds
    } catch (error) {
      console.error('Error updating chapter:', error);
      setAlert('error');
      setTimeout(() => setAlert(null), 5000); // Hide alert after 5 seconds
    }
  };

  if (!id || id === "undefined" || !nick || nick === "undefined") {
    return (
      <div className="flex h-screen items-center justify-center text-xl">
        No series details found.
        <FloatingDockUi />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl">
        Loading...
        <FloatingDockUi />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black" />
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
                      <h2 className="text-xl font-bold text-primary-content m-2">Edit Chapter</h2>
                    </div>
                  </div>  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chapter Selection List */}
      <div>
        <div className="flex flex-col justify-center items-center py-2">
          <div className="relative z-10 p-4 pt-6 w-[90%]">
            <div className="">
              <div className="flex gap-6">
                <div className="w-full">
                  <div className="card bg-base-100 backdrop-blur-sm
                    shadow-[0_0_30px_rgba(147,51,234,1)] 
                    hover:shadow-[0_0_50px_rgba(147,51,234,0.3)] 
                    transition-all duration-500 ease-out transform hover:-translate-y-2
                    border-2 border-[rgba(147,51,234,1)] backdrop-blur-sm rounded-md size-auto"
                  >
                    <div className="card-body justify-center items-center w-full">
                      <h1 className="p-4 pb-2 text-xl text-bold">Select Chapter</h1>
                      <ul className="list bg-[#282a36] rounded-lg shadow-md w-full">
                        
                        {
                          chapterNoList.map((chapterNo, index) => (
                            <li key={index} className="list-row w-full flex justify-between items-center p-2">
                              <div>
                                <div className="text-l text-bold">Chapter {chapterNo}</div>
                                <div className="text-xs uppercase font-semibold opacity-60">Select Chapter to Edit</div>
                              </div>
                              <button className="btn btn-round rounded-full btn-ghost hover:bg-[#1f202a]" onClick={() => handleChapterSelect(chapterNo)}>
                                <IconArrowBigRightLinesFilled />
                              </button>
                            </li>
                          ))
                        }
                        
                      </ul>
                    </div>
                  </div>  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chapter Edit Display */}
            <div>
              <div className="flex flex-col justify-center items-center py-2 mb-5">
                <div className="relative z-10 p-4 pt-6 w-[90%]">
                  <div className="">
                    <div className="flex gap-6">
                      <div className="w-full">
                        <div className="card bg-base-100 backdrop-blur-sm
                          shadow-[0_0_30px_rgba(147,51,234,1)] 
                          hover:shadow-[0_0_50px_rgba(147,51,234,0.3)] 
                          transition-all duration-500 ease-out transform hover:-translate-y-2
                          border-2 border-[rgba(147,51,234,1)] backdrop-blur-sm rounded-md size-auto"
                        >
                          <div className="card-body justify-center items-center w-full">
                            
                            {/* Display Selected Chapter */}
                            <h1 className="text-2xl font-bold">{selectedChapter ? `Chapter ${selectedChapter}` : "Select a chapter to view details"}</h1>
                            {reloading && (
                              <div className="text-center mt-4">
                                <p className="text-lg font-semibold">Loading...</p>
                                <progress className="progress w-56 rounded-lg"></progress>
                              </div>
                            )}
                            
                            {/* Display images */}
                            <div className="flex flex-row flex-wrap gap-5 justify-center items-center">
                              {
                                !reloading && chapterResources && chapterResources.map((image, index) => (
                                  <div key={index} className="flex flex-col justify-center items-center">
                                    <h1 className="text-s font-bold mb-2">Page {index + 1}</h1>
                                    <div className="w-[200px] h-[200px] bg-gray-300 rounded-md cursor-pointer" onClick={() => handleImageClick(image, index)}>
                                      <img src={image} alt={`Page ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                                    </div>
                                    
                                    {/* Edit/Delete Buttons */}
                                    <div className="flex flex-row gap-2 justify-center items-center">
                                      <button className="btn btn-soft btn-warning w-20 rounded-full" onClick={() => handleEditClick(image, index)}> <IconEdit /> </button>
                                      <button className="btn btn-soft btn-error w-20 rounded-full">  <IconTrash /> </button>
                                    </div>
                                  </div>
                                ))
                              }
                            </div>
                            
                          </div>
                        </div>  
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <FloatingDockUi />
            
            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} image={selectedImage} index={selectedImageIndex} handleEditClick={handleEditClick} />
            <EditPageModal
              isOpen={isEditModalOpen}
              onClose={handleCloseEditModal}
              image={selectedEditImage}
              index={selectedEditImageIndex}
              chapterDetails={chapterDetails}
              handleUpdate={handleUpdate}
            />
            
            {alert === 'success' && <SuccessAlert />}
            {alert === 'error' && <ErrorAlert />}
          </div>
        );
      }
      
      const SuccessAlert = () => {
        return (
          <div role="alert" className="z-50 alert alert-success fixed top-5 right-5 transition-opacity duration-500 ease-in-out rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Success! Chapter update was successful.</span>
          </div>
        );
      }
      
      const ErrorAlert = () => {
        return (
          <div role="alert" className="z-50 alert alert-error fixed top-5 right-5 transition-opacity duration-500 ease-in-out rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Error! Chapter update was not successful.</span>
          </div>
        );
      }
      
      export default withAuth(editChapter);
