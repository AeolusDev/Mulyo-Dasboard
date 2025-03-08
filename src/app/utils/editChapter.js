import axios from 'axios';
import { Form } from 'storybook/internal/components';

const getChapters = async (id, nick) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/getSeriesDetails/${id}/${nick}`);
    
    // Get raw data
    const data = response.data;
    const chapterList = data.releases;
    
    // Sort chapter list by chapter number
    chapterList.sort((a, b) => a.chapterNo - b.chapterNo);

    // Get required data
    const chapterNoList = chapterList.map((chapter) => chapter.chapterNo);
    
    // Console log for debugging
    console.log('Chapter list:', chapterList);
    console.log('Chapter number list:', chapterNoList);
    
    // Return required data
    return { chapterList, chapterNoList };
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return { chapterList: [], chapterNoList: [] };
  }
};

const getChapterDetails = async (id, nick, chapterNo) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/getSeries/${id}/${nick}/${chapterNo}`);
    
    // Get raw data
    const data = response.data;
    const chapterResources = data.resources;
    const seriesDetails = data.seriesDetails;
    
    // Console log for debugging
    console.log('Series details:', seriesDetails);
    console.log('Chapter resources:', chapterResources);
    
    // Return required data
    return {seriesDetails, chapterResources};
  } catch (error) {
    console.error('Error fetching chapter details:', error);
    return null;
  }
};

const updateChapter = async (formData) => {
  try {
    console.log(formData)
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/updateChapter`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating chapter:', error);
    throw error;
  }
};

export { getChapters, getChapterDetails, updateChapter };

