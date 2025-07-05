import formidable from 'formidable';
import fetch from 'node-fetch';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const form = new formidable.IncomingForm({ maxFileSize: 12 * 1024 * 1024, keepExtensions: true });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    const file = files.image;
    if (!file) {
      res.status(400).json({ error: 'No image file provided' });
      return;
    }
    try {
      const removeBgApiKey = process.env.REMOVE_BG_API_KEY;
      if (!removeBgApiKey) {
        res.status(500).json({ error: 'Remove.bg API key not configured' });
        return;
      }
      // Use the file buffer directly
      const fileBuffer = file.buffer || (file._writeStream && file._writeStream._buffer);
      const fileName = file.name || file.originalFilename || 'upload.png';
      if (!fileBuffer) {
        res.status(500).json({ error: 'Could not get file buffer for upload.' });
        return;
      }
      const formData = new FormData();
      formData.append('image_file', fileBuffer, { filename: fileName, contentType: file.mimetype });
      formData.append('size', 'auto');
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': removeBgApiKey,
          ...formData.getHeaders(),
        },
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        res.status(response.status).json({ error: `Remove.bg API error: ${response.status} - ${errorText}` });
        return;
      }
      const imageBuffer = await response.buffer();
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', 'attachment; filename="background-removed.png"');
      res.send(imageBuffer);
    } catch (error) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });
} 