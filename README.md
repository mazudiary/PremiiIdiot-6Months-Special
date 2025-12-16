# 💕 Hand Love - Interactive Particle Experience

A romantic interactive web application that uses hand gesture recognition to create beautiful particle animations. Designed for long-distance relationships, this project transforms hand movements into stunning visual effects that symbolize love across any distance.

## ✨ Features

### 🎨 10 Beautiful Romantic Shapes

Control different particle formations with your fingers:

1. **❤️ 1 Finger** - Beating Heart
2. **💕 2 Fingers** - Two Hearts Together
3. **♾️ 3 Fingers** - Forever (Infinity)
4. **📅 4 Fingers** - Our 6 Months
5. **🌉 5 Fingers** - Bridge Between Us
6. **💞 6 Fingers** - Intertwined Hearts
7. **💌 7 Fingers** - Love Letter
8. **🌹 8 Fingers** - Rose for You
9. **💍 9 Fingers** - Promise Ring
10. **⏰ 10 Fingers** - Counting Days

### 🎮 Interactive Controls

- **Hand Position (X-axis)**: Changes particle colors across the rainbow spectrum
- **Pinch/Open Gesture**: Scales the particle formation (grow or shrink)
- **No Hand Detected**: Displays "LILI" with sparkle effects

### 📱 Mobile Optimized

- Fully responsive design for all devices
- Adaptive performance based on device capabilities
- Touch-friendly UI with collapsible controls
- Optimized particle counts (5K/8K/15K based on device)
- Battery-aware rendering
- Wake Lock API to prevent screen dimming
- Safe area support for notched displays

## 🚀 Quick Start

### Option 1: Local Development

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. Allow camera access when prompted
4. Show your hand to the camera and start interacting!

### Option 2: GitHub Pages Deployment

1. Create a new GitHub repository
2. Upload all project files (`index.html`, `script.js`, `styles.css`)
3. Go to **Settings** → **Pages**
4. Select your branch (usually `main`) and root folder
5. Save and wait a few minutes
6. Your site will be live at: `https://yourusername.github.io/repositoryname/`

## 🛠️ Technologies Used

- **Three.js** (r128) - 3D graphics and particle system
- **MediaPipe Hands** - Real-time hand tracking and gesture recognition
- **WebGL** - Hardware-accelerated rendering
- **Vanilla JavaScript** - No framework dependencies
- **CSS3** - Responsive design and animations

## 📋 Requirements

- Modern web browser with WebGL support
- Webcam access
- HTTPS connection (required for camera access)
  - Local development: Most browsers allow camera on `localhost`
  - Production: Use HTTPS (GitHub Pages provides this automatically)

## 🎯 Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari (iOS/macOS)
- ✅ Mobile browsers (Chrome Mobile, Safari iOS)

## 🎨 Customization

### Change Particle Colors

Edit the `baseColor` in `script.js`:

```javascript
let baseColor = new THREE.Color(0xff1493); // Deep pink
```

### Adjust Particle Count

Modify in `script.js`:

```javascript
PARTICLE_COUNT = 15000; // Desktop
PARTICLE_COUNT = 8000; // Mobile
PARTICLE_COUNT = 5000; // Small screens
```

### Add Custom Shapes

Create new shape generator functions following the pattern:

```javascript
function generateYourShape() {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Define x, y, z positions
    targetPositions[i * 3] = x;
    targetPositions[i * 3 + 1] = y;
    targetPositions[i * 3 + 2] = z;
  }
}
```

## 💝 Perfect For

- Long-distance relationships
- Virtual date nights
- Special occasions and anniversaries
- Romantic gestures
- Interactive art installations
- Creative technology demonstrations

## ⚡ Performance Tips

- Use Chrome/Edge for best performance
- Close other tabs to free up GPU resources
- On mobile, close background apps
- Ensure good lighting for better hand detection
- Position your hand 1-2 feet from the camera

## 🔒 Privacy

- All processing happens locally in your browser
- No data is sent to external servers
- Camera feed is used only for hand detection
- No recording or storage of video/images

## 📱 Mobile Features

- Automatic fullscreen mode
- Performance monitoring and adaptive quality
- Low battery mode (reduces quality when battery < 20%)
- Network-aware rendering
- Orientation change support
- Touch gesture prevention
- Wake lock to prevent screen dimming

## 🐛 Troubleshooting

**Camera not working:**

- Ensure HTTPS connection
- Check browser permissions
- Try refreshing the page
- Verify camera is not in use by another app

**Poor performance:**

- Reduce particle count in `script.js`
- Close other applications
- Try a different browser
- Ensure hardware acceleration is enabled

**Hand not detected:**

- Improve lighting conditions
- Move hand closer/further from camera
- Ensure hand is clearly visible
- Try adjusting camera angle

## 📄 License

This project is open source and available for personal use. Feel free to customize and share!

## 💖 Credits

Created with love for couples separated by distance. May this bring you closer together, no matter how far apart you are.

---

**Made with ❤️ for LILI**

_"Distance means nothing when someone means everything"_
