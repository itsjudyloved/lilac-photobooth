# The Lilac Photobooth

A web-based photobooth application that allows users to take 3 photos with a countdown timer and create a photobooth strip with customizable frames.

## Features

- 📸 Take 3 photos with a 3-second countdown timer
- 🖼️ Choose from 4 different frame templates
- 💾 Photos are saved locally using localStorage
- 📥 Download your final photobooth strip
- 🎨 Beautiful purple gradient UI design
- 📱 Responsive design

## Technologies Used

- HTML5
- CSS3 (with gradients and animations)
- JavaScript (ES6+)
- Canvas API (for photo manipulation)

## Setup

1. Clone this repository
2. Place the files in your web server directory or deploy to a static hosting service
3. Open `index.html` in your browser

## Usage

1. Click "Take 3 Photos" button
2. Wait for the 3-second countdown for each photo
3. Review your photos in the preview slots
4. You'll be redirected to the result page
5. Choose a frame from the dropdown menu
6. Download your photobooth strip

## Browser Requirements

- Modern browser with camera access support
- HTTPS or localhost (required for camera access)
- JavaScript enabled

## File Structure

```
photobooth/
├── index.html         # Main camera page
├── result.html        # Result page with frame selection
├── script.js          # Main JavaScript functionality
├── style.css          # Styling
├── assets/
│   └── frames/        # Frame template images
│       ├── Frame 1.png
│       ├── Frame 2.png
│       ├── Frame 3.png
│       └── Frame 4.png
└── README.md
```

## License

This project is open source and available for personal use.

