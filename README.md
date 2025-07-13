# NovoSphere - Interactive 3D Solar System Simulation

A visually stunning, interactive 3D solar system simulation built with Three.js and vanilla JavaScript. Experience our solar system with realistic orbital mechanics, beautiful UI, and immersive interactions.

## 🌟 Features

### Core Solar System
- **Complete Solar System**: Sun and all 8 planets (Mercury to Neptune)
- **Realistic Mechanics**: Accurate relative sizes, distances, and orbital speeds based on real astronomical data
- **3D Lighting**: Point light from the Sun with ambient lighting for realistic illumination
- **Smooth Animation**: 60fps performance using requestAnimationFrame and THREE.Clock
- **Background Stars**: 2000+ procedurally generated stars for depth and immersion

### Interactive Controls
- **Individual Speed Control**: Real-time adjustment of each planet's orbital speed with sliders
- **Camera Controls**: Mouse/touch orbit, zoom, and pan controls with smooth interactions
- **Planet Focus**: Click any planet or the Sun to smoothly zoom in and view detailed information
- **Pause/Resume**: Freeze or resume all animations with a single button
- **Reset View**: Return to default camera position instantly

### Detailed Planet Information
- **Comprehensive Data**: Each planet shows detailed facts including:
  - Physical dimensions (radius)
  - Distance from the Sun
  - Orbital and rotation periods
  - Number of moons
  - Surface temperatures
  - Unique characteristics
- **Interactive Info Panel**: Click any celestial body to see detailed information
- **Hover Tooltips**: Quick planet identification on hover

### User Interface
- **NASA-Inspired Design**: Modern glassmorphism UI with semi-transparent panels
- **Fully Responsive**: Optimized layouts for desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between UI themes while maintaining 3D lighting
- **Touch-Friendly**: Mobile-optimized controls with gesture support
- **Collapsible Panels**: Minimize UI elements to focus on the simulation

### Performance Optimizations
- **Mobile Adaptive**: Reduced geometry complexity and star count on mobile devices
- **Efficient Rendering**: Optimized for 60fps on mid-range devices
- **Smart Resizing**: Automatic quality adjustment based on screen size
- **Memory Management**: Efficient resource usage and cleanup

## 🚀 Quick Start

1. **Open directly in browser**: Simply open `index.html` in any modern web browser
2. **No build tools required**: Everything runs client-side with CDN resources
3. **No installation needed**: Pure HTML, CSS, and JavaScript implementation

## 🎮 Controls

### Desktop
- **Mouse Drag**: Rotate camera around the solar system
- **Mouse Wheel**: Zoom in/out smoothly
- **Click Planet/Sun**: Focus camera and show detailed information
- **Hover**: Show quick tooltips with object names

### Mobile & Touch Devices
- **Touch Drag**: Rotate camera view with finger gestures
- **Pinch to Zoom**: Use browser's native pinch gesture for zooming
- **Tap**: Focus on planets and show information panels
- **Touch-Friendly UI**: Large buttons and sliders optimized for touch

### UI Controls
- **Speed Sliders**: Adjust individual planet orbital speeds (0x to 3x)
- **Pause Button**: Freeze all orbital and rotational animations
- **Reset View**: Return camera to default overview position
- **Theme Toggle**: Switch between dark and light UI modes
- **Panel Controls**: Collapse/expand control panels for better viewing

## 🛠️ Technical Details

### Built With
- **Three.js r128**: 3D graphics and WebGL rendering
- **GSAP 3.12**: Smooth camera animations and transitions
- **Vanilla JavaScript**: Core application logic with ES6+ features
- **CSS3**: Modern UI with glassmorphism effects and responsive design
- **Google Fonts**: Orbitron font for futuristic space aesthetics

### Architecture
- **Class-Based Design**: Clean, modular SolarSystem class structure
- **Event-Driven**: Responsive to user interactions and window events
- **Performance Focused**: Optimized rendering loop and memory management
- **Mobile-First**: Responsive design principles throughout

### Realistic Orbital Data
The simulation uses scientifically accurate relative orbital speeds:

| Planet  | Real Orbital Period | Simulation Speed |
|---------|-------------------|------------------|
| Mercury | 88 Earth days     | 0.04            |
| Venus   | 225 Earth days    | 0.015           |
| Earth   | 365 Earth days    | 0.01            |
| Mars    | 687 Earth days    | 0.005           |
| Jupiter | 11.86 Earth years | 0.001           |
| Saturn  | 29.45 Earth years | 0.0004          |
| Uranus  | 84 Earth years    | 0.00015         |
| Neptune | 165 Earth years   | 0.00008         |

### Browser Support
- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **WebGL Required**: Hardware-accelerated graphics support
- **Mobile Support**: iOS Safari 13+, Android Chrome 80+
- **Responsive**: Adapts to all screen sizes from 320px to 4K displays

## 🎨 Customization

### Adding New Celestial Objects
```javascript
const newObject = {
    name: 'Pluto',
    radius: 0.6,
    color: 0x8c7853,
    orbitRadius: 55,
    speed: 0.004,
    rotationSpeed: 0.01,
    description: 'Former 9th planet, now classified as a dwarf planet.',
    facts: {
        'Radius': '1,188 km',
        'Distance from Sun': '5.9 billion km',
        'Orbital Period': '248 Earth years',
        'Moons': '5 (including Charon)'
    }
};
```

### Modifying Visual Appearance
Edit `style.css` to customize:
- Panel transparency and blur effects
- Color schemes and accent colors
- Animation durations and easing
- Responsive breakpoints
- Typography and spacing

### Performance Tuning
Adjust in `script.js`:
- Star field density (`starCount` variable)
- Planet geometry complexity (`segments` parameter)
- Animation frame rate and quality
- Shadow and lighting settings

## 📱 Mobile Optimizations

The simulation includes specific mobile optimizations:

- **Adaptive Geometry**: Lower polygon counts on mobile devices
- **Touch Controls**: Gesture-based camera controls
- **UI Scaling**: Responsive panels and controls
- **Performance**: Reduced star count and effects on mobile
- **Battery Efficient**: Optimized rendering for mobile GPUs

## 🔧 Troubleshooting

### Performance Issues
- **Reduce Star Count**: Lower the `starCount` in `createStarField()`
- **Simplify Geometry**: Reduce planet geometry segments
- **Disable Effects**: Comment out glow and shadow effects

### Browser Compatibility
- **Enable WebGL**: Ensure browser supports hardware acceleration
- **Update Browser**: Use latest versions for best performance
- **Check GPU**: Verify graphics drivers are up to date

### Mobile Issues
- **Touch Sensitivity**: Adjust `rotationSpeed` for better touch response
- **UI Scaling**: Modify CSS media queries for specific devices
- **Performance**: Reduce visual effects on older mobile devices

## 🌌 Educational Value

This simulation serves as an excellent educational tool for:
- **Astronomy Education**: Visual representation of planetary motion
- **Physics Concepts**: Orbital mechanics and relative scales
- **Web Development**: Modern JavaScript and 3D graphics techniques
- **Interactive Design**: User experience and responsive interfaces

## 📄 License

This project is open source and available under the MIT License.

## 🌟 Credits

- **Astronomical Data**: Based on NASA planetary fact sheets
- **Design Inspiration**: NASA's "Eyes on the Solar System"
- **Three.js Community**: For excellent documentation and examples
- **Educational Purpose**: Built to inspire interest in space and programming

---

**Explore the cosmos from your browser! 🚀✨**

*Experience the beauty and scale of our solar system with scientifically accurate orbital mechanics and stunning visual design.*
