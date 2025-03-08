import axios from 'axios';

export async function createSeries(seriesData) {
  console.log(seriesData);

  // Filter out empty fields
  const filteredData = Object.fromEntries(
    Object.entries(seriesData).filter(([_, value]) => value)
  );

  // Try creating new series
  try {
    const series = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/createNewSeries`,
      filteredData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`Series created: `, series.data);
  } catch (error) {
    console.error(error);
  }
}
