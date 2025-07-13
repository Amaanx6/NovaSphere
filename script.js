/**
 * Interactive 3D Solar System Simulation
 * Built with Three.js and vanilla JavaScript
 */

class SolarSystem {
    constructor() {
        // Scene setup
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();
        
        // Controls
        this.controls = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Animation
        this.animationId = null;
        this.isPaused = false;
        this.globalSpeedMultiplier = 1;
        
        // Planets data
        this.planets = [];
        this.sun = null;
        this.stars = null;
        
        // UI elements
        this.tooltip = document.getElementById('tooltip');
        this.planetInfo = document.getElementById('planet-info');
        this.loadingScreen = document.getElementById('loading-screen');
        
        // Camera states
        this.defaultCameraPosition = new THREE.Vector3(0, 30, 50);
        this.currentFocusedPlanet = null;
        
        // Theme
        this.isDarkMode = true;
        
        this.init();
    }
    
    async init() {
        try {
            this.setupScene();
            this.setupLights();
            this.setupCamera();
            this.setupRenderer();
            this.setupControls();
            this.createStarField();
            this.createSolarSystem();
            this.setupEventListeners();
            this.setupUI();
            
            // Hide loading screen
            setTimeout(() => {
                this.loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    this.loadingScreen.style.display = 'none';
                }, 500);
            }, 1000);
            
            this.animate();
        } catch (error) {
            console.error('Error initializing solar system:', error);
        }
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
    }
    
    setupLights() {
        // Sun light (point light)
        const sunLight = new THREE.PointLight(0xffffff, 2, 1000);
        sunLight.position.set(0, 0, 0);
        this.scene.add(sunLight);
        
        // Ambient light for visibility
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
    }
    
    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 2000);
        this.camera.position.copy(this.defaultCameraPosition);
        this.camera.lookAt(0, 0, 0);
    }
    
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('canvas'),
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    
    setupControls() {
        // Simple orbit controls implementation
        this.controls = {
            enabled: true,
            autoRotate: false,
            autoRotateSpeed: 0.5,
            enableZoom: true,
            enablePan: false,
            minDistance: 10,
            maxDistance: 200,
            
            // Mouse interaction
            isMouseDown: false,
            mouseX: 0,
            mouseY: 0,
            rotationSpeed: 0.005,
            
            // Current rotation
            spherical: new THREE.Spherical(50, Math.PI / 3, 0),
            target: new THREE.Vector3(0, 0, 0)
        };
        
        this.updateCameraFromControls();
    }
    
    updateCameraFromControls() {
        const position = new THREE.Vector3();
        position.setFromSpherical(this.controls.spherical);
        position.add(this.controls.target);
        this.camera.position.copy(position);
        this.camera.lookAt(this.controls.target);
    }
    
    createStarField() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = window.innerWidth < 768 ? 1000 : 2000; // Reduce stars on mobile
        const positions = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount * 3; i += 3) {
            // Random position in a large sphere
            const radius = 500 + Math.random() * 500;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i + 2] = radius * Math.cos(phi);
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5,
            transparent: true,
            opacity: 0.8
        });
        
        this.stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.stars);
    }
    
    createSolarSystem() {
        // Planet data with realistic relative properties and detailed information
        const planetData = [
            {
                name: 'Mercury',
                radius: 1.2,
                color: 0x8C7853,
                emissive: 0x2a1f15,
                orbitRadius: 8,
                speed: 0.04,
                rotationSpeed: 0.001,
                description: 'The smallest planet and closest to the Sun. Mercury has extreme temperature variations and a heavily cratered surface similar to our Moon.',
                facts: {
                    'Radius': '2,439 km',
                    'Distance from Sun': '58 million km',
                    'Orbital Period': '88 Earth days',
                    'Day Length': '59 Earth days',
                    'Moons': '0',
                    'Surface Temperature': '-173°C to 427°C',
                    'Atmosphere': 'Extremely thin (oxygen, sodium, hydrogen)',
                    'Surface Features': 'Heavily cratered, cliffs up to 3km high',
                    'Composition': 'Large iron core (75% of radius)'
                }
            },
            {
                name: 'Venus',
                radius: 1.8,
                color: 0xFFC649,
                emissive: 0x332211,
                orbitRadius: 12,
                speed: 0.015,
                rotationSpeed: 0.0008,
                description: 'The hottest planet with a thick, toxic atmosphere of carbon dioxide and sulfuric acid clouds. Often called Earth\'s "evil twin".',
                facts: {
                    'Radius': '6,051 km',
                    'Distance from Sun': '108 million km',
                    'Orbital Period': '225 Earth days',
                    'Day Length': '243 Earth days',
                    'Moons': '0',
                    'Surface Temperature': '462°C (constant)',
                    'Atmosphere': '96% CO₂, 3.5% N₂, sulfuric acid clouds',
                    'Surface Pressure': '92x Earth\'s pressure',
                    'Rotation': 'Retrograde (backwards)',
                    'Surface Features': 'Volcanoes, impact craters, mountain ranges'
                }
            },
            {
                name: 'Earth',
                radius: 2.0,
                color: 0x6B93D6,
                emissive: 0x001122,
                orbitRadius: 16,
                speed: 0.01,
                rotationSpeed: 0.01,
                description: 'Our home planet, the only known planet with life. Earth has liquid water, a protective atmosphere, and a dynamic climate system.',
                facts: {
                    'Radius': '6,371 km',
                    'Distance from Sun': '150 million km',
                    'Orbital Period': '365.25 days',
                    'Day Length': '24 hours',
                    'Moons': '1',
                    'Surface Temperature': '-89°C to 58°C',
                    'Atmosphere': '78% N₂, 21% O₂, 1% other gases',
                    'Surface': '71% water, 29% land',
                    'Magnetic Field': 'Strong dipolar field',
                    'Life': 'Only known planet with life',
                    'Plate Tectonics': 'Active continental drift'
                }
            },
            {
                name: 'Mars',
                radius: 1.6,
                color: 0xC1440E,
                emissive: 0x2a0f05,
                orbitRadius: 20,
                speed: 0.005,
                rotationSpeed: 0.009,
                description: 'The Red Planet, with the largest volcano in the solar system (Olympus Mons) and evidence of ancient water. Target for future human exploration.',
                facts: {
                    'Radius': '3,389 km',
                    'Distance from Sun': '228 million km',
                    'Orbital Period': '687 Earth days',
                    'Day Length': '24.6 hours',
                    'Moons': '2 (Phobos, Deimos)',
                    'Surface Temperature': '-87°C to -5°C',
                    'Atmosphere': '95% CO₂, 3% N₂, 2% Ar',
                    'Surface Features': 'Olympus Mons (21km high), Valles Marineris canyon',
                    'Polar Ice Caps': 'Water and CO₂ ice',
                    'Dust Storms': 'Planet-wide storms lasting months',
                    'Past Water': 'Evidence of ancient rivers and lakes'
                }
            },
            {
                name: 'Jupiter',
                radius: 5.5,
                color: 0xD8CA9D,
                emissive: 0x2a2520,
                orbitRadius: 28,
                speed: 0.001,
                rotationSpeed: 0.02,
                description: 'The largest planet, a gas giant with a Great Red Spot storm larger than Earth and a strong magnetic field protecting the inner solar system.',
                facts: {
                    'Radius': '69,911 km',
                    'Distance from Sun': '779 million km',
                    'Orbital Period': '12 Earth years',
                    'Day Length': '9.9 hours',
                    'Moons': '95+ (including Io, Europa, Ganymede, Callisto)',
                    'Composition': '89% H₂, 10% He, 1% other',
                    'Great Red Spot': 'Storm larger than Earth (400+ years old)',
                    'Magnetic Field': '20,000x stronger than Earth\'s',
                    'Ring System': 'Faint rings discovered in 1979',
                    'Mass': '2.5x all other planets combined',
                    'Galilean Moons': 'Io, Europa, Ganymede, Callisto'
                }
            },
            {
                name: 'Saturn',
                radius: 4.8,
                color: 0xFAB27B,
                emissive: 0x332218,
                orbitRadius: 35,
                speed: 0.0004,
                rotationSpeed: 0.018,
                description: 'Famous for its spectacular ring system made of ice and rock particles. Saturn is less dense than water and has hexagonal storms at its poles.',
                facts: {
                    'Radius': '58,232 km',
                    'Distance from Sun': '1.43 billion km',
                    'Orbital Period': '29 Earth years',
                    'Day Length': '10.7 hours',
                    'Moons': '146+ (including Titan, Enceladus)',
                    'Rings': 'Thousands of ringlets (ice and rock)',
                    'Density': '0.687 g/cm³ (less than water)',
                    'Hexagonal Storm': 'Unique 6-sided storm at north pole',
                    'Titan': 'Moon with thick atmosphere and lakes',
                    'Enceladus': 'Moon with subsurface ocean',
                    'Ring Span': '282,000 km wide, only 1 km thick'
                }
            },
            {
                name: 'Uranus',
                radius: 3.2,
                color: 0x4FD0E7,
                emissive: 0x0f2a2f,
                orbitRadius: 42,
                speed: 0.00015,
                rotationSpeed: 0.015,
                description: 'An ice giant that rotates on its side due to an ancient collision. Uranus has a unique tilted magnetic field and faint rings discovered in 1977.',
                facts: {
                    'Radius': '25,362 km',
                    'Distance from Sun': '2.87 billion km',
                    'Orbital Period': '84 Earth years',
                    'Day Length': '17.2 hours',
                    'Moons': '27 (including Miranda, Ariel)',
                    'Axial Tilt': '98° (rotates on its side)',
                    'Composition': 'Water, methane, ammonia ices',
                    'Atmosphere': '83% H₂, 15% He, 2% CH₄',
                    'Magnetic Field': 'Tilted 59° from rotation axis',
                    'Rings': '13 known rings (vertical orientation)',
                    'Temperature': '-224°C (coldest planetary atmosphere)'
                }
            },
            {
                name: 'Neptune',
                radius: 3.1,
                color: 0x4B70DD,
                emissive: 0x0f1a33,
                orbitRadius: 48,
                speed: 0.00008,
                rotationSpeed: 0.016,
                description: 'The windiest planet with supersonic winds up to 2,100 km/h. Neptune radiates 2.6x more energy than it receives from the Sun.',
                facts: {
                    'Radius': '24,622 km',
                    'Distance from Sun': '4.5 billion km',
                    'Orbital Period': '165 Earth years',
                    'Day Length': '16.1 hours',
                    'Moons': '16+ (including Triton)',
                    'Wind Speed': 'Up to 2,100 km/h (supersonic)',
                    'Great Dark Spot': 'Storm system size of Earth',
                    'Internal Heat': 'Radiates 2.6x more energy than received',
                    'Triton': 'Largest moon, retrograde orbit, geysers',
                    'Atmosphere': '80% H₂, 19% He, 1% CH₄',
                    'Discovery': 'First planet found by mathematical prediction'
                }
            }
        ];
        
        // Create Sun
        this.createSun();
        
        // Create planets
        planetData.forEach((data, index) => {
            this.createPlanet(data, index);
        });
    }
    
    createSun() {
        const sunGeometry = new THREE.SphereGeometry(4, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            emissive: 0xffaa00,
            emissiveIntensity: 0.3
        });
        
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.sun.name = 'Sun';
        this.sun.userData = {
            name: 'Sun',
            description: 'The star at the center of our solar system, providing light and heat to all planets.',
            facts: {
                'Radius': '696,340 km',
                'Mass': '1.989 × 10³⁰ kg',
                'Surface Temperature': '5,778 K (5,505°C)',
                'Core Temperature': '15 million°C',
                'Age': '4.6 billion years',
                'Composition': '73% Hydrogen, 25% Helium'
            }
        };
        this.scene.add(this.sun);
        
        // Add sun glow effect
        const glowGeometry = new THREE.SphereGeometry(5, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.1
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.sun.add(glow);
    }
    
    createPlanet(data, index) {
        // Planet geometry and material
        const segments = window.innerWidth < 768 ? 12 : 16; // Reduce geometry complexity on mobile
        const geometry = new THREE.SphereGeometry(data.radius, segments * 2, segments);
        
        // Enhanced material with more realistic appearance
        const material = new THREE.MeshPhongMaterial({ 
            color: data.color,
            emissive: data.emissive || 0x000000,
            emissiveIntensity: 0.1,
            shininess: data.name === 'Venus' ? 100 : 30,
            specular: data.name === 'Earth' ? 0x111111 : 0x050505
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        
        // Add special effects for certain planets
        if (data.name === 'Saturn') {
            this.addSaturnRings(mesh, data.radius);
        }
        
        if (data.name === 'Earth') {
            this.addEarthFeatures(mesh);
        }
        
        if (data.name === 'Jupiter') {
            this.addJupiterFeatures(mesh);
        }
        
        // Position planet
        mesh.position.x = data.orbitRadius;
        mesh.name = data.name;
        mesh.userData = data;
        
        // Create planet object
        const planet = {
            name: data.name,
            mesh: mesh,
            orbitRadius: data.orbitRadius,
            angle: (index * Math.PI * 2) / 8, // Spread planets around
            speed: data.speed,
            baseSpeed: data.speed,
            rotationSpeed: data.rotationSpeed,
            description: data.description,
            facts: data.facts,
            color: data.color
        };
        
        this.planets.push(planet);
        this.scene.add(mesh);
        
        // Create orbit line
        this.createOrbitLine(data.orbitRadius);
    }
    
    createOrbitLine(radius) {
        const points = [];
        const segments = 64;
        
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            points.push(new THREE.Vector3(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            ));
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0x444444,
            transparent: true,
            opacity: 0.3
        });
        
        const orbitLine = new THREE.Line(geometry, material);
        this.scene.add(orbitLine);
    }
    
    addSaturnRings(planet, planetRadius) {
        const ringGeometry = new THREE.RingGeometry(planetRadius * 1.2, planetRadius * 2.2, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xaaaaaa,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6
        });
        
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = Math.PI / 2;
        planet.add(rings);
        
        // Add multiple ring bands
        for (let i = 0; i < 3; i++) {
            const bandGeometry = new THREE.RingGeometry(
                planetRadius * (1.3 + i * 0.2), 
                planetRadius * (1.4 + i * 0.2), 
                32
            );
            const bandMaterial = new THREE.MeshBasicMaterial({
                color: 0x888888,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.4 - i * 0.1
            });
            
            const band = new THREE.Mesh(bandGeometry, bandMaterial);
            band.rotation.x = Math.PI / 2;
            planet.add(band);
        }
    }
    
    addEarthFeatures(planet) {
        // Add atmosphere glow
        const atmosphereGeometry = new THREE.SphereGeometry(planet.geometry.parameters.radius * 1.05, 16, 16);
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x87CEEB,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });
        
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        planet.add(atmosphere);
    }
    
    addJupiterFeatures(planet) {
        // Add Great Red Spot (simplified)
        const spotGeometry = new THREE.SphereGeometry(planet.geometry.parameters.radius * 0.15, 8, 8);
        const spotMaterial = new THREE.MeshBasicMaterial({
            color: 0xff4444,
            transparent: true,
            opacity: 0.8
        });
        
        const spot = new THREE.Mesh(spotGeometry, spotMaterial);
        spot.position.set(planet.geometry.parameters.radius * 0.9, 0, 0);
        planet.add(spot);
    }
    
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Mouse events for controls
        const canvas = this.renderer.domElement;
        
        canvas.addEventListener('mousedown', (event) => this.onMouseDown(event));
        canvas.addEventListener('mousemove', (event) => this.onMouseMove(event));
        canvas.addEventListener('mouseup', () => this.onMouseUp());
        canvas.addEventListener('wheel', (event) => this.onMouseWheel(event));
        canvas.addEventListener('click', (event) => this.onMouseClick(event));
        
        // Touch events for mobile
        canvas.addEventListener('touchstart', (event) => this.onTouchStart(event));
        canvas.addEventListener('touchmove', (event) => this.onTouchMove(event));
        canvas.addEventListener('touchend', () => this.onTouchEnd());
        
        // Prevent context menu on right click
        canvas.addEventListener('contextmenu', (event) => event.preventDefault());
    }
    
    setupUI() {
        this.setupControlPanels();
        this.setupSpeedControls();
        this.setupButtons();
    }
    
    setupControlPanels() {
        // Toggle main panel
        const togglePanel = document.getElementById('toggle-panel');
        const controlsPanel = document.getElementById('controls-panel');
        
        // Hide controls completely on mobile by default
        if (window.innerWidth <= 768) {
            controlsPanel.classList.add('mobile-hidden');
            // Add a floating toggle button for mobile
            this.createMobileToggleButton();
        }
        
        togglePanel.addEventListener('click', () => {
            const isCollapsed = controlsPanel.classList.contains('collapsed');
            
            if (isCollapsed) {
                controlsPanel.classList.remove('collapsed');
                togglePanel.textContent = '−';
            } else {
                controlsPanel.classList.add('collapsed');
                togglePanel.textContent = '+';
            }
        });
        
        // Close planet info
        const closeInfo = document.getElementById('close-info');
        closeInfo.addEventListener('click', () => {
            this.planetInfo.classList.remove('active');
            this.currentFocusedPlanet = null;
            this.resetCameraView();
        });
    }
    
    createMobileToggleButton() {
        // Create a floating toggle button for mobile
        const mobileToggle = document.createElement('button');
        mobileToggle.id = 'mobile-toggle';
        mobileToggle.innerHTML = '⚙️';
        mobileToggle.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(15, 15, 25, 0.9);
            border: 2px solid rgba(100, 255, 218, 0.5);
            color: #64ffda;
            font-size: 20px;
            cursor: pointer;
            z-index: 1000;
            backdrop-filter: blur(15px);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        mobileToggle.addEventListener('click', () => {
            const controlsPanel = document.getElementById('controls-panel');
            const isHidden = controlsPanel.classList.contains('mobile-hidden');
            
            if (isHidden) {
                controlsPanel.classList.remove('mobile-hidden');
                controlsPanel.classList.add('visible');
                mobileToggle.innerHTML = '✕';
            } else {
                controlsPanel.classList.add('mobile-hidden');
                controlsPanel.classList.remove('visible');
                mobileToggle.innerHTML = '⚙️';
            }
        });
        
        document.body.appendChild(mobileToggle);
        
        // Hide mobile toggle on desktop
        if (window.innerWidth > 768) {
            mobileToggle.style.display = 'none';
        }
        
        // Handle resize events
        window.addEventListener('resize', () => {
            const controlsPanel = document.getElementById('controls-panel');
            if (window.innerWidth <= 768) {
                mobileToggle.style.display = 'flex';
                if (!controlsPanel.classList.contains('mobile-hidden')) {
                    controlsPanel.classList.add('mobile-hidden');
                    mobileToggle.innerHTML = '⚙️';
                }
            } else {
                mobileToggle.style.display = 'none';
                controlsPanel.classList.remove('mobile-hidden', 'visible');
            }
        });
    }
    
    setupSpeedControls() {
        const speedControlsContainer = document.getElementById('speed-controls');
        
        this.planets.forEach((planet, index) => {
            const controlDiv = document.createElement('div');
            controlDiv.className = 'speed-control';
            
            controlDiv.innerHTML = `
                <div class="planet-indicator" style="background-color: #${planet.color.toString(16).padStart(6, '0')}"></div>
                <label>${planet.name}</label>
                <input type="range" class="speed-slider" min="0" max="3" step="0.1" value="1" data-planet="${index}">
                <span class="speed-value">1.0x</span>
            `;
            
            speedControlsContainer.appendChild(controlDiv);
            
            // Add event listener for slider
            const slider = controlDiv.querySelector('.speed-slider');
            const valueDisplay = controlDiv.querySelector('.speed-value');
            
            slider.addEventListener('input', (e) => {
                const multiplier = parseFloat(e.target.value);
                planet.speed = planet.baseSpeed * multiplier;
                valueDisplay.textContent = `${multiplier.toFixed(1)}x`;
            });
        });
    }
    
    setupButtons() {
        // Pause/Resume button
        const pauseBtn = document.getElementById('pause-btn');
        pauseBtn.addEventListener('click', () => {
            this.isPaused = !this.isPaused;
            pauseBtn.textContent = this.isPaused ? '▶ Resume' : '⏸ Pause';
            pauseBtn.classList.toggle('active', this.isPaused);
        });
        
        // Reset view button
        const resetBtn = document.getElementById('reset-btn');
        resetBtn.addEventListener('click', () => {
            this.resetCameraView();
            this.planetInfo.classList.remove('active');
            this.currentFocusedPlanet = null;
        });
        
        // Theme toggle button
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('click', () => {
            this.isDarkMode = !this.isDarkMode;
            document.body.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
            themeToggle.textContent = this.isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode';
        });
    }
    
    onWindowResize() {
        // Update camera aspect ratio
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        
        // Update renderer size
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Update pixel ratio for high DPI displays
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Recreate star field with appropriate density for new screen size
        if (this.stars) {
            this.scene.remove(this.stars);
            this.createStarField();
        }
    }
    
    onMouseDown(event) {
        this.controls.isMouseDown = true;
        this.controls.mouseX = event.clientX;
        this.controls.mouseY = event.clientY;
    }
    
    onMouseMove(event) {
        if (this.controls.isMouseDown) {
            const deltaX = event.clientX - this.controls.mouseX;
            const deltaY = event.clientY - this.controls.mouseY;
            
            this.controls.spherical.theta -= deltaX * this.controls.rotationSpeed;
            this.controls.spherical.phi += deltaY * this.controls.rotationSpeed;
            
            // Constrain phi
            this.controls.spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.controls.spherical.phi));
            
            this.controls.mouseX = event.clientX;
            this.controls.mouseY = event.clientY;
            
            if (!this.currentFocusedPlanet) {
                this.updateCameraFromControls();
            }
        } else {
            // Handle hover for tooltips
            this.updateMousePosition(event);
            this.checkHover();
        }
    }
    
    onMouseUp() {
        this.controls.isMouseDown = false;
    }
    
    onMouseWheel(event) {
        event.preventDefault();
        
        const scale = event.deltaY > 0 ? 1.1 : 0.9;
        this.controls.spherical.radius *= scale;
        this.controls.spherical.radius = Math.max(
            this.controls.minDistance,
            Math.min(this.controls.maxDistance, this.controls.spherical.radius)
        );
        
        if (!this.currentFocusedPlanet) {
            this.updateCameraFromControls();
        }
    }
    
    onMouseClick(event) {
        this.updateMousePosition(event);
        this.checkPlanetClick();
    }
    
    onTouchStart(event) {
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            this.controls.isMouseDown = true;
            this.controls.mouseX = touch.clientX;
            this.controls.mouseY = touch.clientY;
        }
        event.preventDefault();
    }
    
    onTouchMove(event) {
        event.preventDefault();
        if (event.touches.length === 1 && this.controls.isMouseDown) {
            const touch = event.touches[0];
            const deltaX = touch.clientX - this.controls.mouseX;
            const deltaY = touch.clientY - this.controls.mouseY;
            
            this.controls.spherical.theta -= deltaX * this.controls.rotationSpeed;
            this.controls.spherical.phi += deltaY * this.controls.rotationSpeed;
            
            this.controls.spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.controls.spherical.phi));
            
            this.controls.mouseX = touch.clientX;
            this.controls.mouseY = touch.clientY;
            
            if (!this.currentFocusedPlanet) {
                this.updateCameraFromControls();
            }
        }
    }
    
    onTouchEnd() {
        this.controls.isMouseDown = false;
    }
    
    updateMousePosition(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }
    
    checkHover() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const allObjects = [...this.planets.map(p => p.mesh), this.sun];
        const intersects = this.raycaster.intersectObjects(allObjects);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            const name = object.name || object.userData.name;
            if (name) {
                this.showTooltip(name, event);
                document.body.style.cursor = 'pointer';
            }
        } else {
            this.hideTooltip();
            document.body.style.cursor = 'default';
        }
    }
    
    checkPlanetClick() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const allObjects = [...this.planets.map(p => p.mesh), this.sun];
        const intersects = this.raycaster.intersectObjects(allObjects);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            
            if (object === this.sun) {
                this.focusOnSun();
            } else {
                const planet = this.planets.find(p => p.mesh === object);
                if (planet) {
                    this.focusOnPlanet(planet);
                }
            }
        }
    }
    
    showTooltip(text, event) {
        this.tooltip.textContent = text;
        this.tooltip.style.left = event.clientX + 10 + 'px';
        this.tooltip.style.top = event.clientY - 10 + 'px';
        this.tooltip.classList.add('visible');
    }
    
    hideTooltip() {
        this.tooltip.classList.remove('visible');
    }
    
    focusOnSun() {
        this.currentFocusedPlanet = null;
        
        // Show sun info
        this.showObjectInfo(this.sun.userData);
        
        // Animate camera to sun
        const targetPosition = new THREE.Vector3(0, 15, 25);
        
        gsap.to(this.camera.position, {
            duration: 2,
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            ease: "power2.inOut",
            onUpdate: () => {
                this.camera.lookAt(0, 0, 0);
            }
        });
    }
    
    focusOnPlanet(planet) {
        this.currentFocusedPlanet = planet;
        
        // Show planet info panel
        this.showObjectInfo(planet);
        
        // Animate camera to planet
        const targetPosition = new THREE.Vector3();
        targetPosition.copy(planet.mesh.position);
        targetPosition.y += planet.mesh.geometry.parameters.radius * 3;
        targetPosition.z += planet.mesh.geometry.parameters.radius * 5;
        
        gsap.to(this.camera.position, {
            duration: 2,
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            ease: "power2.inOut",
            onUpdate: () => {
                this.camera.lookAt(planet.mesh.position);
            }
        });
    }
    
    showObjectInfo(objectData) {
        const nameElement = document.getElementById('planet-name');
        const detailsElement = document.getElementById('planet-details');
        
        nameElement.textContent = objectData.name;
        
        let detailsHTML = `<div class="planet-description">${objectData.description}</div>`;
        
        for (const [key, value] of Object.entries(objectData.facts)) {
            detailsHTML += `
                <div class="planet-fact">
                    <span class="fact-label">${key}:</span>
                    <span class="fact-value">${value}</span>
                </div>
            `;
        }
        
        detailsElement.innerHTML = detailsHTML;
        this.planetInfo.classList.add('active');
    }
    
    resetCameraView() {
        this.currentFocusedPlanet = null;
        
        // Reset controls
        this.controls.spherical.radius = 50;
        this.controls.spherical.phi = Math.PI / 3;
        this.controls.spherical.theta = 0;
        this.controls.target.set(0, 0, 0);
        
        // Animate camera back to default position
        gsap.to(this.camera.position, {
            duration: 2,
            x: this.defaultCameraPosition.x,
            y: this.defaultCameraPosition.y,
            z: this.defaultCameraPosition.z,
            ease: "power2.inOut",
            onUpdate: () => {
                this.camera.lookAt(0, 0, 0);
            }
        });
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        if (!this.isPaused) {
            const deltaTime = this.clock.getDelta();
            
            // Rotate sun
            if (this.sun) {
                this.sun.rotation.y += 0.005;
            }
            
            // Update planets
            this.planets.forEach(planet => {
                // Orbital motion
                planet.angle += planet.speed * this.globalSpeedMultiplier;
                planet.mesh.position.x = Math.cos(planet.angle) * planet.orbitRadius;
                planet.mesh.position.z = Math.sin(planet.angle) * planet.orbitRadius;
                
                // Planet rotation (slow self-spin)
                planet.mesh.rotation.y += planet.rotationSpeed;
            });
            
            // Rotate stars slowly
            if (this.stars) {
                this.stars.rotation.y += 0.0002;
            }
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the solar system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SolarSystem();
});