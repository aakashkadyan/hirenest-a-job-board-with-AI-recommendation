const { google } = require('googleapis');
const path = require('path');
const { Readable } = require('stream');
require('dotenv').config();

// Configure Google Drive API with Service Account using environment variables
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

// Function to upload file to Google Drive
const uploadToGoogleDrive = async (file) => {
  try {
    const fileMetadata = {
      name: file.originalname,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // Use env variable for folder ID
    };

    const media = {
      mimeType: file.mimetype,
      body: Readable.from(file.buffer),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    // Make the file publicly accessible
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return {
      fileId: response.data.id,
      webViewLink: response.data.webViewLink,
    };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw error;
  }
};

// Function to delete file from Google Drive
const deleteFromGoogleDrive = async (fileId) => {
  try {
    await drive.files.delete({
      fileId: fileId,
    });
  } catch (error) {
    console.error('Error deleting from Google Drive:', error);
    throw error;
  }
};

module.exports = {
  uploadToGoogleDrive,
  deleteFromGoogleDrive,
}; 