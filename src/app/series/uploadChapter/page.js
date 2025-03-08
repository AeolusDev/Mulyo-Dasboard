"use client";
import Image from 'next/image';
import { FaEdit, FaTrash } from 'react-icons/fa';
import {useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { UploadHandler } from '../../utils/uploadHandler';
import { Analytics } from "@vercel/analytics/react";
import { FloatingDockUi } from '../../components/FloatingDockUI';
import withAuth from '../../components/withAuth';

const uploadChapter = () => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [imageCount, setImageCount] = useState('Images Uploaded: 0');
  const [dropZoneText, setDropZoneText] = useState('Drop images here');
  const fileInputRef = useRef(null);
  const [consoleMessages, setConsoleMessages] = useState([]);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [error, setError] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeInput, setActiveInput] = useState(null);
  const [chapterName, setChapterName] = useState("");
  const [seriesNick, setSeriesNick] = useState("");
  const [chapterNumber, setChapterNumber] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [replace, setReplace] = useState(false);

  useEffect(() => {
    if (selectedUpload) {
      const uploadHandler = new UploadHandler(
        setConsoleMessages,
        selectedUpload.seriesNick,
        selectedUpload.chapterNo
      );
      const savedLogs = uploadHandler.loadLogs();
      setConsoleMessages(savedLogs);
    }
  }, [selectedUpload]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  //Get All Series and Chapters
  const getUploadHistory = () => {
    const uploads = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('upload_logs_')) {
        const [_, seriesNick, chapter] = key.split('_');
        const chapterNo = chapter.replace('ch', '');
        uploads.push({ seriesNick, chapterNo });
      }
    }
    return uploads;
  };

  const clearLogs = () => {
    if (selectedUpload) {
      const { seriesNick, chapterNo } = selectedUpload;
      localStorage.removeItem(`upload_logs_${seriesNick}_ch${chapterNo}`);
      setConsoleMessages([]);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

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

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const uploadHandler = new UploadHandler(setConsoleMessages);
    const batches = uploadHandler.createBatches(files);

    let batchInfo = 'Files will be uploaded in the following batches:\n';
    batches.forEach((batch, index) => {
      const batchSize = batch.reduce((acc, file) => acc + file.size, 0);
      batchInfo += `Batch ${index + 1}: ${batch.length} files (${(batchSize / 1024 / 1024).toFixed(2)}MB)\n`;
    });

    setImageCount(`Total Files: ${files.length}\n${batchInfo}`);
    setDropZoneText(`${files.length} files selected`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    const files = Array.from(fileInputRef.current.files);

    formData.append('chapterName', chapterName);
    formData.append('nick', seriesNick);
    formData.append('chapterNo', chapterNumber);
    formData.append('totalPageNo', totalPages);
    formData.append('replace', replace);

    files.forEach(file => {
      formData.append('images', file);
    });

    setSelectedUpload({ seriesNick: seriesNick, chapterNo: chapterNumber });

    const uploadHandler = new UploadHandler(
      setConsoleMessages,
      seriesNick,
      chapterNumber
    );

    const batches = uploadHandler.createBatches(files);

    try {
      await uploadHandler.handleUpload(batches, formData);
      setChapterName("");
      setSeriesNick("");
      setChapterNumber("");
      setTotalPages("");
      setDropZoneText('Drop images here');
      setImageCount('Images Uploaded: 0');
      event.target.reset();
    } catch (error) {
      console.error('Upload error:', error);
      setError('Error uploading chapters. Please try again.');
    }
  };

  const handleMouseMove = (e, elementId) => {
    if (activeInput === elementId) {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

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
                linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px),
                linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(147, 51, 234, 0.4) 1px, transparent 5px)
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

      {/* Navbar */}
      <div className="relative z-10 p-4 pb-24 pt-6">
        <FloatingDockUi />

        {/* Main Content */}
        <div className="relative z-10 p-4 pt-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-6">
              {/* Left Side - Upload Form */}
              <div className="w-1/3">
                <div className="card bg-base-100 min-h-[calc(100vh-4.8rem)]
                  shadow-[0_0_30px_rgba(147,51,234,1)] 
                  hover:shadow-[0_0_50px_rgba(147,51,234,0.3)] 
                  transition-all duration-500 ease-out transform hover:-translate-y-2
                  border-2 border-[rgba(147,51,234,1)] backdrop-blur-sm"
                >
                  <div className="card-body p-6">
                    <h2 className="text-xl font-bold text-primary-content mb-4">Upload Chapter</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Chapter Title Field */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-primary-content">Chapter Title</span>
                        </label>
                        <div
                          className="relative"
                          onMouseMove={(e) => handleMouseMove(e, 'chapterName')}
                          onMouseEnter={() => setActiveInput('chapterName')}
                          onMouseLeave={() => setActiveInput(null)}
                        >
                          <input
                            type="text"
                            placeholder="Chapter Name"
                            className="input w-full bg-base-300 
                              border-2 border-primary/30
                              shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]
                              transition-all duration-300
                              focus:outline-none focus:border-primary
                              hover:border-primary/80
                              text-primary-content"
                            value={chapterName}
                            onChange={(e) => setChapterName(e.target.value)}
                          />
                          {activeInput === 'chapterName' && (
                            <div
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                background: `radial-gradient(
                                  200px circle at ${mousePosition.x}px ${mousePosition.y}px,
                                  var(--color-primary-content/0.2),
                                  transparent 70%
                                )`
                              }}
                            />
                          )}
                        </div>
                      </div>

                      {/* Series Nick */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-primary-content">Series Nick*</span>
                        </label>
                        <div
                          className="relative"
                          onMouseMove={(e) => handleMouseMove(e, 'seriesNick')}
                          onMouseEnter={() => setActiveInput('seriesNick')}
                          onMouseLeave={() => setActiveInput(null)}
                        >
                          <input
                            type="text"
                            placeholder="Series Nickname*"
                            className="input w-full bg-base-300 
                              border-2 border-primary/30
                              shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]
                              transition-all duration-300
                              focus:outline-none focus:border-primary
                              hover:border-primary/80
                              text-primary-content"
                            value={seriesNick}
                            onChange={(e) => setSeriesNick(e.target.value)}
                            required
                          />
                          {activeInput === 'seriesNick' && (
                            <div
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                background: `radial-gradient(
                                  200px circle at ${mousePosition.x}px ${mousePosition.y}px,
                                  var(--color-primary-content/0.2),
                                  transparent 70%
                                )`
                              }}
                            />
                          )}
                        </div>
                      </div>

                      {/* Chapter Number */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-primary-content">Chapter Number</span>
                        </label>
                        <div
                          className="relative"
                          onMouseMove={(e) => handleMouseMove(e, 'chapterNumber')}
                          onMouseEnter={() => setActiveInput('chapterNumber')}
                          onMouseLeave={() => setActiveInput(null)}
                        >
                          <input
                            type="text"
                            placeholder="Chapter Number"
                            className="input w-full bg-base-300 
                              border-2 border-primary/30
                              shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]
                              transition-all duration-300
                              focus:outline-none focus:border-primary
                              hover:border-primary/80
                              text-primary-content"
                            value={chapterNumber}
                            onChange={(e) => setChapterNumber(e.target.value)}
                            required
                          />
                          {activeInput === 'chapterNumber' && (
                            <div
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                background: `radial-gradient(
                                  200px circle at ${mousePosition.x}px ${mousePosition.y}px,
                                  var(--color-primary-content/0.2),
                                  transparent 70%
                                )`
                              }}
                            />
                          )}
                        </div>
                      </div>

                      {/* Total No of Pages */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-primary-content">Total No of Pages</span>
                        </label>
                        <div
                          className="relative"
                          onMouseMove={(e) => handleMouseMove(e, 'totalPages')}
                          onMouseEnter={() => setActiveInput('totalPages')}
                          onMouseLeave={() => setActiveInput(null)}
                        >
                          <input
                            type="text"
                            placeholder="Total No of Pages"
                            className="input w-full bg-base-300 
                              border-2 border-primary/30
                              shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]
                              transition-all duration-300
                              focus:outline-none focus:border-primary
                              hover:border-primary/80
                              text-primary-content"
                            value={totalPages}
                            onChange={(e) => setTotalPages(e.target.value)}
                            required
                          />
                          {activeInput === 'totalPages' && (
                            <div
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                background: `radial-gradient(
                                  200px circle at ${mousePosition.x}px ${mousePosition.y}px,
                                  var(--color-primary-content/0.2),
                                  transparent 70%
                                )`
                              }}
                            />
                          )}
                        </div>
                      </div>

                      {/* Replace Toggle */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-primary-content">Replace a Chapter/Pages?</span>
                        </label>
                        <br/>
                        <input 
                        type="checkbox"
                        className="mt-1 checkbox border-indigo-600 bg-[#414558] checked:bg-[#51fa7b] checked:text-black checked:border-[#1f202a]" 
                        onChange={(e) => setReplace(e.target.checked)}
                        />
                      </div>
                      
                      {/* Image Upload */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-primary-content">Chapter Images *</span>
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
                              multiple
                              accept="image/*"
                              required
                            />
                          </label>
                        </div>
                      </div>

                      {error && (
                        <div className="alert alert-error bg-error/0 border-2 border-error/0 text-error-content">
                          {error}
                        </div>
                      )}

                      {/* Submit Button */}
                      <div
                        className="relative"
                        onMouseMove={(e) => handleMouseMove(e, 'submit')}
                        onMouseEnter={() => setActiveInput('submit')}
                        onMouseLeave={() => setActiveInput(null)}
                      >
                        <button
                          type="submit"
                          className="btn w-full bg-base-300 text-primary-content
                            border-2 border-primary/30
                            shadow-[0_2px_4px_rgba(0,0,0,0.4)]
                            hover:border-primary/80
                            transition-all duration-300
                            active:transform active:translate-y-0.5"
                        >
                          Upload Chapter
                          <span className="ml-2">→</span>
                        </button>
                        {activeInput === 'submit' && (
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: `radial-gradient(
                                200px circle at ${mousePosition.x}px ${mousePosition.y}px,
                                var(--color-primary-content/0.2),
                                transparent 70%
                              )`
                            }}
                          />
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Right Side - Console */}
              <div className="w-2/3">
                <div className="card bg-base-100 min-h-[calc(100vh-7rem)]
              shadow-[0_0_30px_rgba(147,51,234,1)] 
              hover:shadow-[0_0_50px_rgba(147,51,234,0.3)] 
              transition-all duration-500 ease-out
              border-2 border-[rgba(147,51,234,1)] backdrop-blur-sm"
                >
                  <div className="card-body p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-primary-content">Upload Console</h2>
                      <div className="flex gap-4 items-center">
                        <select
                          className="select select-sm bg-base-300 
                        border-2 border-primary/30
                        text-primary-content"
                          onChange={(e) => {
                            if (e.target.value) {
                              const [seriesNick, chapterNo] = e.target.value.split('_');
                              setSelectedUpload({ seriesNick, chapterNo });
                            }
                          }}
                          value={selectedUpload ? `${selectedUpload.seriesNick}_${selectedUpload.chapterNo}` : ''}
                        >
                          <option value="">Select Upload History</option>
                          {getUploadHistory().map(({ seriesNick, chapterNo }) => (
                            <option key={`${seriesNick}_${chapterNo}`} value={`${seriesNick}_${chapterNo}`}>
                              {seriesNick} - Chapter {chapterNo}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={clearLogs}
                          className="btn btn-sm bg-base-300 text-primary-content
                        border-2 border-primary/30
                        hover:border-primary/80
                        transition-all duration-300"
                          disabled={!selectedUpload}
                        >
                          Clear Logs
                        </button>
                      </div>
                    </div>

                    {/* Console Messages */}
                    <div className="bg-base-200 rounded-lg p-4 h-[calc(100vh-12rem)] overflow-y-auto border border-primary/20">
                      <div className="space-y-2">
                        {consoleMessages.map((msg, index) => (
                          <div
                            key={index}
                            className={`text-sm ${msg.type === 'error' ? 'text-error' :
                                msg.type === 'success' ? 'text-success' :
                                  'text-primary-content/70'
                              }`}
                          >
                            <span className="opacity-50 font-mono">{msg.timestamp}</span> {msg.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(uploadChapter);