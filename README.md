# Background Remover

A responsive web application that allows users to upload images and remove backgrounds using the Remove.bg API. Built with HTML, CSS (TailwindCSS), JavaScript, and Node.js.

## Features

- 🖼️ **Image Upload**: Drag & drop or click to upload images
- 🎨 **Background Removal**: AI-powered background removal using Remove.bg API
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- ⚡ **Real-time Processing**: Live progress indicators and smooth animations
- 💾 **Download**: Save processed images with transparent backgrounds
- 🔒 **Secure**: API key stored securely on the backend
- 🎯 **Error Handling**: Comprehensive error handling and user feedback

## Tech Stack

- **Frontend**: HTML5, CSS3 (TailwindCSS), Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Styling**: TailwindCSS v4
- **API**: Remove.bg API
- **File Handling**: Multer, Form-data

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- Remove.bg API key

## Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd background-remover
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit the `.env` file and add your Remove.bg API key:
   ```env
   REMOVE_BG_API_KEY=your_actual_api_key_here
   PORT=3000
   ```

4. **Get a Remove.bg API key**
   - Visit [Remove.bg API](https://www.remove.bg/api)
   - Sign up for a free account
   - Get your API key from the dashboard
   - Add it to your `.env` file

## Usage

### Development Mode

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Build CSS (in another terminal)**
   ```bash
   npm run watch:css
   ```

3. **Open your browser**
   Navigate to `http://localhost:3000`

### Production Mode

1. **Build the CSS**
   ```bash
   npm run build:css
   ```

2. **Start the server**
   ```bash
   npm start
   ```

3. **Access the application**
   Navigate to `http://localhost:3000`

## How to Use

1. **Upload an Image**
   - Drag and drop an image onto the upload area
   - Or click the upload area to browse and select a file
   - Supported formats: JPG, PNG, WEBP
   - Maximum file size: 12MB

2. **Process the Image**
   - Click the "Remove Background" button
   - Wait for the AI to process your image
   - View the result in the preview section

3. **Download the Result**
   - Click the "Download Image" button
   - Save the background-free image to your device

4. **Start Over**
   - Click "Upload New Image" to process another image

## Project Structure

```
background-remover/
├── public/                 # Static files served to browser
│   ├── index.html         # Main HTML file
│   ├── script.js          # Frontend JavaScript
│   └── styles.css         # Compiled TailwindCSS
├── src/
│   └── css/
│       └── input.css      # TailwindCSS source
├── server.js              # Express.js backend server
├── tailwind.config.js     # TailwindCSS configuration
├── postcss.config.js      # PostCSS configuration
├── package.json           # Node.js dependencies
├── env.example            # Environment variables template
└── README.md              # This file
```

## API Endpoints

- `GET /` - Serves the main application
- `POST /api/remove-background` - Processes image and removes background

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REMOVE_BG_API_KEY` | Your Remove.bg API key | Yes |
| `PORT` | Server port (default: 3000) | No |

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the production server |
| `npm run dev` | Start the development server with auto-restart |
| `npm run build:css` | Build the CSS file once |
| `npm run watch:css` | Build CSS and watch for changes |

## Troubleshooting

### Common Issues

1. **"Remove.bg API key not configured"**
   - Make sure you've created a `.env` file
   - Verify your API key is correct
   - Check that the `.env` file is in the project root

2. **"File size too large"**
   - Ensure your image is under 12MB
   - Compress the image if necessary

3. **"Only image files are allowed"**
   - Make sure you're uploading a valid image file (JPG, PNG, WEBP)

4. **CSS not updating**
   - Run `npm run build:css` to rebuild the CSS
   - Or use `npm run watch:css` for automatic rebuilding

### API Limits

- Remove.bg free tier: 50 images per month
- Maximum file size: 12MB
- Supported formats: JPG, PNG, WEBP

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [Remove.bg](https://www.remove.bg/) for providing the background removal API
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Font Awesome](https://fontawesome.com/) for the icons 