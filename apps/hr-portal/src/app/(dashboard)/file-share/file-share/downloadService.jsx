'use client';

import axios from 'axios';

class DownloadService {
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  }

  /**
   * Download a single file
   * @param {string} fileKey - The key/path of the file to download
   * @param {string} fileName - Optional file name for the downloaded file
   */
  async downloadFile(fileKey, fileName) {
    try {
      // Use fetch API with proper headers
      const response = await fetch(`${this.baseUrl}/v1/api/fileShare/download?key=${encodeURIComponent(fileKey)}`, {
        method: 'GET',
        headers: {
          'token': this.token
        }
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Check if we received a valid blob (not an error response disguised as blob)
      if (blob.type.includes('application/json')) {
        // This might be an error response as JSON
        const textResponse = await blob.text();
        try {
          const jsonResponse = JSON.parse(textResponse);
          if (!jsonResponse.status) {
            throw new Error(jsonResponse.message || 'Download failed');
          }
        } catch (jsonError) {
          // Not a parseable JSON, continue with download
        }
      }

      // Create object URL from blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.href = url;

      // Use the provided file name or extract it from the file key
      const downloadName = fileName || this.extractFileName(fileKey);
      link.setAttribute('download', downloadName);

      // Append link to the body, click it, and then remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the temporary URL
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Error downloading file with fetch:', error);

      // Fallback to axios as a secondary approach with proper error handling
      try {
        // Create a custom axios instance with specific config for downloads
        const downloadClient = axios.create({
          baseURL: this.baseUrl,
          responseType: 'blob',
          timeout: 30000, // Longer timeout for downloads
          headers: {
            token: this.token
          }
        });

        const response = await downloadClient.get(`/v1/api/fileShare/download?key=${encodeURIComponent(fileKey)}`);

        // Process the response
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        const downloadName = fileName || this.extractFileName(fileKey);
        link.setAttribute('download', downloadName);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return true;
      } catch (axiosError) {
        console.error('Error downloading file with axios:', axiosError);
        throw new Error(`Failed to download file: ${error.message}`);
      }
    }
  }

  /**
   * Download multiple files as a ZIP archive
   * @param {Array} fileKeys - Array of file keys to download
   * @param {string} zipName - Name for the ZIP file
   */
  async downloadMultipleFiles(fileKeys, zipName = 'download.zip') {
    if (!fileKeys || !fileKeys.length) {
      throw new Error('No files selected for download');
    }

    try {
      // Use fetch API with proper headers
      const response = await fetch(`${this.baseUrl}/v1/api/fileShare/download-multiple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': this.token
        },
        body: JSON.stringify({ keys: fileKeys })
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Create object URL from blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', zipName);

      // Append link to the body, click it, and then remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the temporary URL
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Error downloading multiple files:', error);

      // Fallback to axios
      try {
        const response = await axios.post(
          `${this.baseUrl}/v1/api/fileShare/download-multiple`,
          { keys: fileKeys },
          {
            headers: {
              'Content-Type': 'application/json',
              token: this.token
            },
            responseType: 'blob',
            timeout: 60000 // Longer timeout for multiple files
          }
        );

        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', zipName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return true;
      } catch (axiosError) {
        console.error('Error downloading multiple files with axios fallback:', axiosError);
        throw new Error(`Failed to download files: ${error.message}`);
      }
    }
  }

  /**
   * Download a folder and its contents as a ZIP archive
   * @param {string} folderKey - The key/path of the folder to download
   * @param {string} folderName - Optional name for the folder
   */
  async downloadFolder(folderKey, folderName) {
    try {
      // Use fetch API with proper headers
      const response = await fetch(`${this.baseUrl}/v1/api/fileShare/download-folder?key=${encodeURIComponent(folderKey)}`, {
        method: 'GET',
        headers: {
          'token': this.token
        }
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Create object URL from blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.href = url;

      // Generate appropriate filename
      const downloadName = this.getFolderZipName(folderKey, folderName);
      link.setAttribute('download', downloadName);

      // Append link to the body, click it, and then remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the temporary URL
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Error downloading folder:', error);

      // Fallback to axios
      try {
        const response = await axios.get(
          `${this.baseUrl}/v1/api/fileShare/download-folder?key=${encodeURIComponent(folderKey)}`,
          {
            headers: {
              token: this.token
            },
            responseType: 'blob',
            timeout: 60000 // Longer timeout for folder downloads
          }
        );

        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        const downloadName = this.getFolderZipName(folderKey, folderName);
        link.setAttribute('download', downloadName);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return true;
      } catch (axiosError) {
        console.error('Error downloading folder with axios fallback:', axiosError);
        throw new Error(`Failed to download folder: ${error.message}`);
      }
    }
  }

  /**
   * Get a pre-signed download URL
   * @param {string} fileKey - The key/path of the file
   */
  async getDownloadUrl(fileKey) {
    try {
      const response = await axios.get(`${this.baseUrl}/v1/api/fileShare/download-url?key=${encodeURIComponent(fileKey)}`, {
        headers: {
          token: this.token
        }
      });

      if (!response.data.status) {
        throw new Error(response.data.message || 'Failed to generate download URL');
      }

      return response.data.items.url;
    } catch (error) {
      console.error('Error generating download URL:', error);
      throw new Error(`Failed to generate download URL: ${error.message}`);
    }
  }

  /**
   * Extract filename from a file key/path
   * @param {string} fileKey - The file key/path
   * @returns {string} - The extracted filename
   */
  extractFileName(fileKey) {
    if (!fileKey) return 'download';

    // Split by slashes and get the last part
    const parts = fileKey.split('/');
    return parts[parts.length - 1] || 'download';
  }

  /**
   * Generate a name for the folder zip file
   * @param {string} folderKey - The folder key/path
   * @param {string} folderName - Optional folder name override
   * @returns {string} - The folder zip filename
   */
  getFolderZipName(folderKey, folderName) {
    if (folderName) return `${folderName}.zip`;

    const parts = folderKey.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1];

    return `${lastPart || 'folder'}.zip`;
  }

  /**
   * Create an iframe to preview a document if supported
   * @param {string} fileKey - The key/path of the file
   * @param {HTMLElement} container - The container element to append the iframe to
   */
  async previewFile(fileKey, container) {
    try {
      // Get a pre-signed URL for preview
      const url = await this.getDownloadUrl(fileKey);

      // Create an iframe
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';

      // Clear the container and append the iframe
      if (container) {
        container.innerHTML = '';
        container.appendChild(iframe);
      }

      return iframe;
    } catch (error) {
      console.error('Error previewing file:', error);
      throw new Error(`Failed to preview file: ${error.message}`);
    }
  }
}

// Create and export a singleton instance
const downloadService = new DownloadService();
export default downloadService;
