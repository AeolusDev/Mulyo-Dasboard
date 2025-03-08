
import axios from 'axios';

export class UpdateSeries {
  async updateSeriesDetails(id, originalDetails, updatedDetails) {
    
    // Identify changed fields
    const changedFields = this.getChangedFields(originalDetails, updatedDetails);

    // Map the changed fields
    const mappedFields = this.mapChangedFields(changedFields);

    // Log original details
    console.log("Original series details:", JSON.stringify(originalDetails, null, 2));
    
    // Log the mapped fields
    console.log("Mapped changed fields:", JSON.stringify(mappedFields, null, 2));

    // Log the updated details
    console.log("Updated series details:", updatedDetails);
    
    // Try to update the series details
    try {
      // Define the body object
      const body = {
        id: id,
        nick: originalDetails.nick,
        fields: mappedFields,
      };
      
      // Convert body to JSON and send request
      console.log(`Body: `, JSON.stringify(body, null, 2));
      
      const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/editSeries/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body, null, 2)
      });

      if (!response.ok) {
        throw new Error(`Failed to update series: ${response.statusText}`);
      }

      console.log(`Series ${id} updated successfully`);
    } catch (error) {
      console.error(error);
    }
  }

  mapChangedFields(changedFields) {
    const mappedFields = {};
    for (const key in changedFields) {
      mappedFields[key] = {
        original: changedFields[key].original,
        updated: changedFields[key].updated,
      };
    }
    return mappedFields;
  }

  getChangedFields(originalDetails, updatedDetails) {
    const changedFields = {};
    for (const key in updatedDetails) {
      if (updatedDetails[key] !== originalDetails[key]) {
        changedFields[key] = {
          original: originalDetails[key],
          updated: updatedDetails[key],
        };
      }
    }
    return changedFields;
  }
}
