require("dotenv").config();
import imageCompression from 'browser-image-compression';

export class UploadHandler {
  constructor(updateConsole, seriesNick, chapterNo) {
      this.updateConsole = updateConsole;
      this.STORAGE_KEY = `upload_logs_${seriesNick}_ch${chapterNo}`;
      this.MAX_BATCH_SIZE = 4 * 1024 * 1024; // 4MB
      this.MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB  
  }
  
  createBatches(files) {
      const sortedFiles = Array.from(files).sort((a, b) => {
        const numA = parseInt(a.name.match(/\d+/)[0]);
        const numB = parseInt(b.name.match(/\d+/)[0]);
        return numA - numB;
      });
  
      const batches = [];
      let currentBatch = [];
      let currentBatchSize = 0;
  
      sortedFiles.forEach(file => {
        if (file.size > this.MAX_FILE_SIZE) {
          console.warn(`File ${file.name} exceeds maximum file size of ${this.MAX_FILE_SIZE / 1024 / 1024}MB`);
          return;
        }
  
        if (currentBatchSize + file.size <= this.MAX_BATCH_SIZE) {
          currentBatch.push(file);
          currentBatchSize += file.size;
        } else {
          if (currentBatch.length > 0) {
            batches.push(currentBatch);
          }
          currentBatch = [file];
          currentBatchSize = file.size;
        }
      });
  
      if (currentBatch.length > 0) {
        batches.push(currentBatch);
      }
  
      return batches;
    }
    
    loadLogs() {
      try {
        const savedLogs = localStorage.getItem(this.STORAGE_KEY);
        return savedLogs ? JSON.parse(savedLogs) : [];
      } catch (error) {
        console.error('Error loading logs:', error);
        return [];
      }
    }
  
    saveLogs(logs) {
      try {
        const truncatedLogs = logs.slice(-100);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(truncatedLogs));
      } catch (error) {
        console.error('Error saving logs:', error);
      }
    }
  
    logToConsole(message, type = 'info') {
      const timestamp = new Date().toLocaleTimeString();
      this.updateConsole((prev) => {
        const newLogs = [...prev, { timestamp, message, type }];
        this.saveLogs(newLogs);
        return newLogs;
      });
    }
    
    async handleUpload(batches, formData) {
      this.retryCount = 0; // Reset retry count for each new upload
      
      try {
        let totalUploaded = 0;
        const totalFiles = batches.reduce((sum, batch) => sum + batch.length, 0);
    
        for (let i = 0; i < batches.length; i++) {
          const batch = batches[i];
          this.logToConsole(`Starting batch ${i + 1} of ${batches.length}...`);
    
          try {
            const result = await this.uploadBatch(batch, formData, i);
            if (result.success) {
              totalUploaded += batch.length;
              this.logToConsole(`Batch ${i + 1} uploaded successfully`, 'success');
              this.logToConsole(`Progress: ${totalUploaded}/${totalFiles} files`);
              
              // Add delay between batches
              if (i < batches.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 2000));
              }
            }
          } catch (error) {
            this.logToConsole(`Error in batch ${i + 1}: ${error.message}`, 'error');
            throw error;
          }
        }
    
        this.logToConsole('All uploads completed successfully!', 'success');
        return true;
      } catch (error) {
        this.logToConsole(`Upload failed: ${error.message}`, 'error');
        throw error;
      }
    }

    async uploadBatch(batch, formData, batchIndex) {
      const batchFormData = new FormData();
    
      // Append other form data fields except 'images'
      for (let [key, value] of formData.entries()) {
        if (key !== 'images') {
          batchFormData.append(key, value);
        }
      }
    
      await Promise.all(batch.map(async file => {
        const options = {
          maxSizeMB: 5,
        };
        const compressedBlob = await imageCompression(file, options);
    
        // Create a new File object with the original file name
        const compressedFile = new File([compressedBlob], file.name, {
          type: compressedBlob.type,
          lastModified: Date.now(),
        });
        
        console.log(`originalFile size ${file.size / 1024 / 1024} MB`);
        console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`);
        batchFormData.append('images', compressedFile);
      }));
    
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/uploadChapter`, {
          method: 'POST',
          headers: {
            authorization: `${process.env.AUTH_TOKEN}`
          },
          body: batchFormData
        });
    
        if (!response.ok) {
          // Handle non-200 responses
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
        }
    
        // Add delay between batch uploads
        await new Promise(resolve => setTimeout(resolve, 5000));
    
        return await response.json();
      } catch (error) {
        this.logToConsole(`Batch upload failed: ${error.message}`, 'error');
    
        // Retry logic
        if (this.retryCount < 3) {
          this.retryCount++;
          this.logToConsole(`Retrying upload... Attempt ${this.retryCount}/3`, 'info');
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
          return this.uploadBatch(batch, formData, batchIndex);
        }
    
        throw error;
      }
    }
}
