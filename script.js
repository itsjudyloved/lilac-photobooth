document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('video');
  const captureBtn = document.getElementById('capture-btn');
  const retakeBtn = document.getElementById('retake-btn');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const countdownEl = document.querySelector('.countdown-number');
  const countdownOverlay = document.getElementById('countdown');
  const flashEl = document.getElementById('flash');

  let currentSlot = 0;
  let stream = null;
  const totalPhotos = 3;

  // Photo positions within the frame template - reduced spacing between photos
  // Canvas dimensions: 600x1800
  // Photo dimensions: 535px × 420px
  // Reduced gaps between photos for tighter layout
  
  const canvasWidth = 600;
  const photoWidth = 525;
  const photoHeight = 400;
  const gapBetween = 60; // Reduced gap between photos (was ~160px)
  const topPadding = 125; // Space for banner at top
  
  // Center photos horizontally - precise calculation
  const photoX = Math.round((canvasWidth - photoWidth) / 2); // = 37.5px rounded to 38px (centered)
  
  const photoSlots = [
    { 
      x: photoX,   // Centered horizontally
      y: topPadding,  // Start from top padding
      width: photoWidth, 
      height: photoHeight
    },
    { 
      x: photoX,   // Centered horizontally, aligned with slot 1
      y: topPadding + photoHeight + gapBetween,  // Consistent spacing from slot 1
      width: photoWidth, 
      height: photoHeight 
    },
    { 
      x: photoX,   // Centered horizontally, aligned with slots 1 and 2
      y: topPadding + (photoHeight + gapBetween) * 2,  // Consistent spacing from slot 2
      width: photoWidth, 
      height: photoHeight 
    }
  ];
  
  console.log('Photo slots configured with exact frame coordinates:', photoSlots);

  const frameImg = new Image();
  // Encode URL to handle spaces in filename
  frameImg.src = encodeURI('assets/frames/Frame 1.png');
  // Remove crossOrigin for same-origin requests

  // Initialize camera
  async function initCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      video.srcObject = stream;
      video.play();
    } catch (err) {
      alert('Camera access denied. Please allow camera access to use the photobooth.');
      console.error('Camera error:', err);
    }
  }

  function startCountdown() {
    return new Promise(resolve => {
      let count = 3;
      countdownOverlay.style.display = 'flex';
      countdownEl.textContent = count;
      countdownEl.style.transform = 'scale(0.5)';
      
      const interval = setInterval(() => {
        count--;
        if (count > 0) {
          countdownEl.textContent = count;
          countdownEl.style.transform = 'scale(0.5)';
          setTimeout(() => {
            countdownEl.style.transform = 'scale(1)';
          }, 50);
        } else {
          countdownEl.textContent = 'SMILE!';
          countdownEl.style.transform = 'scale(1.2)';
          setTimeout(() => {
            clearInterval(interval);
            countdownOverlay.style.display = 'none';
            resolve();
          }, 300);
        }
      }, 1000);
    });
  }

  function showFlash() {
    flashEl.style.opacity = '1';
    setTimeout(() => {
      flashEl.style.opacity = '0';
    }, 200);
  }

  function showTimer(seconds, message = '') {
    return new Promise(resolve => {
      let count = seconds;
      countdownOverlay.style.display = 'flex';
      countdownEl.style.fontSize = '100px';
      countdownEl.style.lineHeight = '1.2';
      
      if (message) {
        countdownEl.innerHTML = `<div style="font-size: 40px; margin-bottom: 20px;">${message}</div><div>${count}</div>`;
      } else {
        countdownEl.textContent = count;
      }
      countdownEl.style.transform = 'scale(0.8)';
      
      const interval = setInterval(() => {
        count--;
        if (count > 0) {
          if (message) {
            countdownEl.innerHTML = `<div style="font-size: 40px; margin-bottom: 20px;">${message}</div><div>${count}</div>`;
          } else {
            countdownEl.textContent = count;
          }
          countdownEl.style.transform = 'scale(0.8)';
          setTimeout(() => {
            countdownEl.style.transform = 'scale(1)';
          }, 50);
        } else {
          if (message) {
            countdownEl.innerHTML = `<div style="font-size: 40px; margin-bottom: 20px;">${message}</div><div style="font-size: 60px;">Get Ready!</div>`;
          } else {
            countdownEl.textContent = 'GO!';
          }
          countdownEl.style.transform = 'scale(1.1)';
          setTimeout(() => {
            clearInterval(interval);
            countdownOverlay.style.display = 'none';
            resolve();
          }, 500);
        }
      }, 1000);
    });
  }

  async function capturePhoto() {
    if (video.readyState < 2) {
      await new Promise(r => {
        if (video.readyState >= 2) r();
        else video.onloadeddata = r;
      });
    }

    // Wait for video dimensions to be available
    let attempts = 0;
    while ((!video.videoWidth || !video.videoHeight) && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    const slot = photoSlots[currentSlot];
    
    // Get actual video dimensions (use videoWidth/videoHeight, not clientWidth/clientHeight)
    const videoWidth = video.videoWidth || video.clientWidth || 640;
    const videoHeight = video.videoHeight || video.clientHeight || 480;
    
    // Calculate video aspect ratio
    const videoAspect = videoWidth / videoHeight;
    const slotAspect = slot.width / slot.height;
    
    let drawWidth, drawHeight, drawX, drawY;
    
    // Scale to cover the slot (crop if needed) - maintains aspect ratio, no stretching
    if (videoAspect > slotAspect) {
      // Video is wider - fit to height, crop width (centered)
      drawHeight = slot.height;
      drawWidth = drawHeight * videoAspect;
      drawX = slot.x - (drawWidth - slot.width) / 2;
      drawY = slot.y;
    } else {
      // Video is taller - fit to width, crop height (centered)
      drawWidth = slot.width;
      drawHeight = drawWidth / videoAspect;
      drawX = slot.x;
      drawY = slot.y - (drawHeight - slot.height) / 2;
    }
    
    // Draw photo to canvas with proper scaling and centering
    // Clip to slot boundaries to ensure clean edges
    ctx.save();
    ctx.beginPath();
    ctx.rect(slot.x, slot.y, slot.width, slot.height);
    ctx.clip();
    // Use the 9-parameter drawImage to maintain aspect ratio
    ctx.drawImage(video, 0, 0, videoWidth, videoHeight, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();
    
    console.log(`Capturing photo ${currentSlot + 1} at position:`, slot);
    console.log(`Video dimensions: ${videoWidth}x${videoHeight}, Aspect: ${videoAspect.toFixed(2)}`);
    
    // Verify photo was drawn
    const imageData = ctx.getImageData(slot.x, slot.y, 10, 10);
    const hasData = imageData.data.some(pixel => pixel !== 0);
    console.log(`Photo ${currentSlot + 1} captured:`, hasData);

    // Update preview thumbnail - draw from the captured photo on main canvas
    // This ensures preview matches exactly what was captured
    const previewCanvas = document.getElementById(`preview-${currentSlot}`);
    const previewCtx = previewCanvas.getContext('2d');
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    
    // Get the captured photo from the main canvas
    const capturedPhoto = ctx.getImageData(slot.x, slot.y, slot.width, slot.height);
    
    // Create a temporary canvas to hold the captured photo
    const tempPreviewCanvas = document.createElement('canvas');
    tempPreviewCanvas.width = slot.width;
    tempPreviewCanvas.height = slot.height;
    const tempPreviewCtx = tempPreviewCanvas.getContext('2d');
    tempPreviewCtx.putImageData(capturedPhoto, 0, 0);
    
    // Calculate aspect ratios for preview
    const photoAspect = slot.width / slot.height;
    const previewAspect = previewCanvas.width / previewCanvas.height;
    
    let previewDrawWidth, previewDrawHeight, previewDrawX, previewDrawY;
    
    // Use "cover" mode - fill the preview slot while maintaining aspect ratio
    if (photoAspect > previewAspect) {
      // Captured photo is wider than preview - fit to height, crop width
      previewDrawHeight = previewCanvas.height;
      previewDrawWidth = previewDrawHeight * photoAspect;
      previewDrawX = (previewCanvas.width - previewDrawWidth) / 2;
      previewDrawY = 0;
    } else {
      // Captured photo is taller than preview - fit to width, crop height
      previewDrawWidth = previewCanvas.width;
      previewDrawHeight = previewDrawWidth / photoAspect;
      previewDrawX = 0;
      previewDrawY = (previewCanvas.height - previewDrawHeight) / 2;
    }
    
    // Draw the captured photo to preview (no mirroring needed - already captured correctly)
    previewCtx.save();
    previewCtx.beginPath();
    previewCtx.rect(0, 0, previewCanvas.width, previewCanvas.height);
    previewCtx.clip();
    previewCtx.drawImage(
      tempPreviewCanvas,
      previewDrawX, previewDrawY, previewDrawWidth, previewDrawHeight
    );
    previewCtx.restore();
    
    previewCanvas.classList.add('has-photo');

    // Update progress indicator
    const prevProgress = document.getElementById(`progress-${currentSlot}`);
    prevProgress.classList.remove('active');
    prevProgress.classList.add('completed');
    
    currentSlot++;

    // Update progress indicator for next photo
    if (currentSlot < totalPhotos) {
      // Activate next progress dot
      const nextProgress = document.getElementById(`progress-${currentSlot}`);
      if (nextProgress) {
        nextProgress.classList.add('active');
      }
    }
    // Note: createFinalStrip() is called by captureAllPhotos() after all photos are taken
  }

  async function createFinalStrip() {
    try {
      console.log('Creating final strip...');
      console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
      
      // Verify canvas has content
      if (!canvas || !ctx) {
        throw new Error('Canvas not available');
      }
      
      // Don't wait for frame image - it will load on result page
      // Just proceed with extracting photos
      
      // Extract individual photos from the canvas with their positions
      const photos = [];
      for (let i = 0; i < totalPhotos; i++) {
        try {
          const slot = photoSlots[i];
          console.log(`Extracting photo ${i + 1} from slot:`, slot);
          
          // Verify slot is within canvas bounds
          if (slot.x + slot.width > canvas.width || slot.y + slot.height > canvas.height) {
            console.warn(`Photo ${i + 1} slot extends beyond canvas bounds`);
          }
          
          // Get the photo from main canvas
          let photoImageData;
          try {
            photoImageData = ctx.getImageData(slot.x, slot.y, slot.width, slot.height);
          } catch (e) {
            throw new Error(`Failed to get image data for photo ${i + 1}: ${e.message}`);
          }
          
          // Create a temporary canvas for this photo
          const photoCanvas = document.createElement('canvas');
          photoCanvas.width = slot.width;
          photoCanvas.height = slot.height;
          const photoCtx = photoCanvas.getContext('2d');
          
          if (!photoCtx) {
            throw new Error(`Failed to get 2d context for photo ${i + 1}`);
          }
          
          photoCtx.putImageData(photoImageData, 0, 0);
          
          // Convert to data URL
          let photoData;
          try {
            photoData = photoCanvas.toDataURL('image/png');
            if (!photoData || photoData === 'data:,') {
              throw new Error('Empty data URL generated');
            }
          } catch (e) {
            throw new Error(`Failed to convert photo ${i + 1} to data URL: ${e.message}`);
          }
          
          photos.push({
            x: slot.x,
            y: slot.y,
            width: slot.width,
            height: slot.height,
            data: photoData
          });
          
          console.log(`Photo ${i + 1} extracted successfully, data size: ${photoData.length} chars`);
        } catch (e) {
          console.error(`Error extracting photo ${i + 1}:`, e);
          throw new Error(`Failed to extract photo ${i + 1}: ${e.message}`);
        }
      }
      
      if (photos.length !== totalPhotos) {
        throw new Error(`Expected ${totalPhotos} photos but got ${photos.length}`);
      }

      // Save photobooth data in the format expected by result.html
      const photoboothData = {
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        photos: photos
      };
      
      try {
        const dataString = JSON.stringify(photoboothData);
        localStorage.setItem('photoboothData', dataString);
        console.log('Photobooth data saved to localStorage, size:', dataString.length, 'chars');
      } catch (e) {
        // localStorage might be full or disabled
        if (e.name === 'QuotaExceededError') {
          throw new Error('Storage quota exceeded. Please clear some browser data.');
        } else {
          throw new Error(`Failed to save to localStorage: ${e.message}`);
        }
      }
      
      // Also save a fallback composite image for backward compatibility
      try {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');

        // Try to draw frame if available, but don't wait for it
        if (frameImg.complete && frameImg.naturalWidth > 0) {
          try {
            tempCtx.drawImage(frameImg, 0, 0, tempCanvas.width, tempCanvas.height);
          } catch (e) {
            console.warn('Could not draw frame in composite:', e);
          }
        }

        // Draw photos on top of frame at their aligned positions
        for (let i = 0; i < totalPhotos; i++) {
          const slot = photoSlots[i];
          const photoImageData = ctx.getImageData(slot.x, slot.y, slot.width, slot.height);
          tempCtx.putImageData(photoImageData, slot.x, slot.y);
        }

        // Save fallback composite image
        const imageData = tempCanvas.toDataURL('image/png');
        localStorage.setItem('photoboothResult', imageData);
        console.log('Fallback composite saved, size:', imageData.length, 'chars');
      } catch (e) {
        console.warn('Could not save fallback composite:', e);
        // Don't fail if fallback fails - main data is saved
      }
      
      // Update button
      captureBtn.textContent = 'Processing...';
      captureBtn.disabled = true;
      
      console.log('All photos processed successfully. Redirecting to result page...');
      // Small delay to ensure localStorage is written
      setTimeout(() => {
        window.location.href = 'result.html';
      }, 100);
      
    } catch (error) {
      console.error('Error in createFinalStrip:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      alert(`Error processing photos: ${error.message}\n\nPlease check the browser console for details.`);
      captureBtn.disabled = false;
      captureBtn.textContent = 'Take 3 Photos';
    }
  }

  function resetPhotobooth() {
    currentSlot = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Clear previews
    for (let i = 0; i < totalPhotos; i++) {
      const previewCanvas = document.getElementById(`preview-${i}`);
      const previewCtx = previewCanvas.getContext('2d');
      previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
      previewCanvas.classList.remove('has-photo');
      
      // Reset progress indicators
      const progressDot = document.getElementById(`progress-${i}`);
      progressDot.classList.remove('completed');
      if (i === 0) {
        progressDot.classList.add('active');
      } else {
        progressDot.classList.remove('active');
      }
    }
    
    captureBtn.textContent = `Take Photo 1/${totalPhotos}`;
    captureBtn.disabled = false;
    retakeBtn.style.display = 'none';
  }

  // Continuous capture function - takes all 3 photos automatically
  async function captureAllPhotos() {
    if (currentSlot >= totalPhotos) return;
    
    // Disable button and hide retake button during capture
    captureBtn.disabled = true;
    retakeBtn.style.display = 'none';
    captureBtn.textContent = 'Capturing...';
    
    // Reset to start from first photo
    currentSlot = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Clear previews and progress indicators
    for (let i = 0; i < totalPhotos; i++) {
      const previewCanvas = document.getElementById(`preview-${i}`);
      const previewCtx = previewCanvas.getContext('2d');
      previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
      previewCanvas.classList.remove('has-photo');
      
      const progressDot = document.getElementById(`progress-${i}`);
      progressDot.classList.remove('completed', 'active');
      if (i === 0) {
        progressDot.classList.add('active');
      }
    }
    
    // Capture all 3 photos with 3-second delay between each
    for (let i = 0; i < totalPhotos; i++) {
      currentSlot = i;
      
      // Update button text
      captureBtn.textContent = `Photo ${i + 1}/${totalPhotos} - Get ready!`;
      
      // Countdown before capture
      await startCountdown();
      
      // Capture photo
      showFlash();
      await capturePhoto();
      
      // No wait between photos - capture immediately after countdown
    }
    
    // All photos captured - create final strip
    captureBtn.textContent = 'Processing...';
    await createFinalStrip();
  }

  // Event listeners
  captureBtn.addEventListener('click', async () => {
    await captureAllPhotos();
  });

  retakeBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to retake all photos?')) {
      resetPhotobooth();
    }
  });

  // Initialize
  initCamera();
});
