<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Photobooth Result 🎉</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>The Lilac Strip</h1>
    <p class="subtitle">Your photos are ready! Choose a frame and download</p>

    <div id="frame-selector-result">
      <label for="frame-select" class="panel-label">Choose Frame:</label>
      <select id="frame-select" class="frame-select">
        <option value="1" selected>Frame 1</option>
        <option value="2">Frame 2</option>
        <option value="3">Frame 3</option>
        <option value="4">Frame 4</option>
      </select>
    </div>

    <div id="result-wrapper">
      <canvas id="result-canvas" width="600" height="1800"></canvas>
    </div>

    <div class="button-group">
      <button class="btn btn-primary" id="download-btn">Download Photo</button>
      <button class="btn btn-secondary" id="retake-btn">Retake Photos</button>
    </div>
  </div>

  <script>
    const canvas = document.getElementById('result-canvas');
    const ctx = canvas.getContext('2d');
    const downloadBtn = document.getElementById('download-btn');
    const retakeBtn = document.getElementById('retake-btn');
    const frameSelect = document.getElementById('frame-select');
    
    let photoboothData = null;
    let currentFrameImg = new Image();
    currentFrameImg.crossOrigin = 'anonymous';

    // Load photobooth data from localStorage
    const savedData = localStorage.getItem('photoboothData');
    if (savedData) {
      try {
        photoboothData = JSON.parse(savedData);
        // Set canvas dimensions
        canvas.width = photoboothData.canvasWidth;
        canvas.height = photoboothData.canvasHeight;
        // Load initial frame
        loadFrame(1);
      } catch (err) {
        console.error('Error parsing photobooth data:', err);
        showError('Failed to load photos. Please retake.');
        downloadBtn.disabled = true;
      }
    } else {
      // Fallback: try old format (photoboothResult)
      const imageData = localStorage.getItem('photoboothResult');
      if (imageData) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setTimeout(() => {
            scaleCanvas();
          }, 100);
        };
        img.onerror = () => {
          showError('Failed to load image.');
        };
        img.src = imageData;
        // Disable frame selector for old format (but keep it visible)
        frameSelect.disabled = true;
        // Show a message that frame selection is not available for old format
        const label = frameSelect.parentElement.querySelector('label');
        if (label) {
          label.textContent = 'Choose Frame: (Not available for old format - please retake photos)';
        }
      } else {
        showError('No photo found. Please take a photo first.');
        downloadBtn.disabled = true;
        frameSelect.disabled = true;
      }
    }

    function scaleCanvas() {
      // Scale canvas for display while maintaining aspect ratio
      // Fit within the container without causing scroll
      const resultWrapper = document.getElementById('result-wrapper');
      const container = document.querySelector('.container');
      if (!resultWrapper || !container) return;
      
      const containerWidth = container.clientWidth - 40; // Account for padding
      const maxWidth = Math.min(resultWrapper.clientWidth - 20, containerWidth);
      const maxHeight = window.innerHeight - 220; // Account for header, padding, buttons, and controls (reduced)
      const widthScale = maxWidth / canvas.width;
      const heightScale = maxHeight / canvas.height;
      const scale = Math.min(widthScale, heightScale, 1); // Don't scale up, only down
      canvas.style.width = (canvas.width * scale) + 'px';
      canvas.style.height = (canvas.height * scale) + 'px';
    }

    // Recalculate canvas size on window resize
    window.addEventListener('resize', () => {
      if (photoboothData || localStorage.getItem('photoboothResult')) {
        scaleCanvas();
      }
    });

    function showError(message) {
      ctx.fillStyle = '#333';
      ctx.font = "24px Arial";
      ctx.textAlign = 'center';
      ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    }

    function loadFrame(frameNumber) {
      if (!photoboothData) return;
      
      // Reset image to ensure onload fires even if same frame is selected
      currentFrameImg = new Image();
      currentFrameImg.crossOrigin = 'anonymous';
      
      currentFrameImg.onload = () => {
        renderComposite();
      };
      currentFrameImg.onerror = () => {
        console.error('Failed to load frame image');
        showError('Failed to load frame. Please try another frame.');
      };
      currentFrameImg.src = `assets/frames/Frame ${frameNumber}.png`;
      
      // If image is already cached, onload might not fire
      if (currentFrameImg.complete) {
        renderComposite();
      }
    }

    function renderComposite() {
      if (!photoboothData) return;
      
      // Wait for frame to be ready
      if (!currentFrameImg.complete || currentFrameImg.naturalWidth === 0) {
        // Frame not ready yet, wait for it
        currentFrameImg.onload = () => {
          renderComposite();
        };
        return;
      }
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw frame first as background
      ctx.drawImage(currentFrameImg, 0, 0, canvas.width, canvas.height);
      
      // Draw photos on top of frame at their positions
      let loadedCount = 0;
      const totalPhotos = photoboothData.photos.length;
      
      photoboothData.photos.forEach((photo, index) => {
        const photoImg = new Image();
        photoImg.onload = () => {
          ctx.drawImage(photoImg, photo.x, photo.y, photo.width, photo.height);
          loadedCount++;
          // Scale canvas after all photos are loaded
          if (loadedCount === totalPhotos) {
            // Small delay to ensure layout is rendered
            setTimeout(() => {
              scaleCanvas();
            }, 100);
          }
        };
        photoImg.onerror = () => {
          console.error(`Failed to load photo ${index + 1}`);
          loadedCount++;
          // Still scale even if some photos fail
          if (loadedCount === totalPhotos) {
            scaleCanvas();
          }
        };
        photoImg.src = photo.data;
      });
    }

    // Frame selection handler
    frameSelect.addEventListener('change', (e) => {
      const selectedFrame = parseInt(e.target.value);
      loadFrame(selectedFrame);
    });

    // Download button
    downloadBtn.addEventListener('click', () => {
      try {
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        link.download = `photobooth-strip-${timestamp}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Visual feedback
        downloadBtn.textContent = 'Downloaded!';
        setTimeout(() => {
          downloadBtn.textContent = 'Download Photo';
        }, 2000);
      } catch (err) {
        alert('Failed to download image. Please try again.');
        console.error('Download error:', err);
      }
    });

    // Retake button
    retakeBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to retake all photos?')) {
        localStorage.removeItem('photoboothData');
        localStorage.removeItem('photoboothResult');
        window.location.href = 'index.php';
      }
    });
  </script>
</body>
</html>
