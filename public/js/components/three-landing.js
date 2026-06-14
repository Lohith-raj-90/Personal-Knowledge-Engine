let scene, camera, renderer, animId;
let particles, floatingShapes = [], connectionLines;
let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;
let scrollProgress = 0;
let _onMouseMove = null, _onScroll = null, _onResize = null;
let _isMobile = false;
let _fps = 60;
let _frameCount = 0;
let _lastFpsTime = 0;

export function initLandingScene(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    _isMobile = window.innerWidth < 768;

    const width = container.clientWidth;
    const height = container.clientHeight;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0d12, 0.03);

    camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 30);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !_isMobile });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, _isMobile ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    createParticleField();
    if (!_isMobile) createConnectionLines();
    createFloatingShapes();
    createLights();
    createNebulaPlanes();

    _onMouseMove = (e) => {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', _onMouseMove, { passive: true });

    _onScroll = () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress = docHeight > 0 ? window.scrollY / docHeight : 0;
    };
    window.addEventListener('scroll', _onScroll, { passive: true });

    _onResize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        _isMobile = window.innerWidth < 768;
    };
    window.addEventListener('resize', _onResize, { passive: true });

    _lastFpsTime = performance.now();
    animate();
}

function createParticleField() {
    const count = _isMobile ? 600 : 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const coolPalette = [
        new THREE.Color(0x4f9eff),
        new THREE.Color(0x599dff),
        new THREE.Color(0x8ebfff),
    ];
    const warmPalette = [
        new THREE.Color(0xa78bfa),
        new THREE.Color(0xcebdff),
        new THREE.Color(0xffb867),
    ];

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const radius = 15 + Math.random() * 55;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi) - 25;

        const palette = Math.random() > 0.5 ? coolPalette : warmPalette;
        const color = palette[Math.floor(Math.random() * palette.length)];
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: _isMobile ? 0.18 : 0.14,
        vertexColors: true,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function createConnectionLines() {
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(300 * 6);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setDrawRange(0, 0);

    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x4f9eff,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    connectionLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(connectionLines);
}

function createFloatingShapes() {
    if (_isMobile) return;

    const shapeConfigs = [
        { geo: new THREE.IcosahedronGeometry(0.9, 0), color: 0x4f9eff, count: 3, range: 22 },
        { geo: new THREE.OctahedronGeometry(0.7, 0), color: 0xa78bfa, count: 2, range: 28 },
        { geo: new THREE.TetrahedronGeometry(0.6, 0), color: 0x06b6d4, count: 2, range: 25 },
        { geo: new THREE.IcosahedronGeometry(0.45, 1), color: 0xffb867, count: 2, range: 18 },
    ];

    shapeConfigs.forEach(cfg => {
        for (let i = 0; i < cfg.count; i++) {
            const wireframeMat = new THREE.MeshBasicMaterial({
                color: cfg.color,
                wireframe: true,
                transparent: true,
                opacity: 0.1,
            });
            const mesh = new THREE.Mesh(cfg.geo.clone(), wireframeMat);

            const edgeGeo = new THREE.EdgesGeometry(cfg.geo);
            const edgeMat = new THREE.LineBasicMaterial({
                color: cfg.color,
                transparent: true,
                opacity: 0.25,
            });
            const edges = new THREE.LineSegments(edgeGeo, edgeMat);
            mesh.add(edges);

            mesh.position.set(
                (Math.random() - 0.5) * cfg.range,
                (Math.random() - 0.5) * cfg.range,
                (Math.random() - 0.5) * 20 - 15
            );

            mesh.userData = {
                rotSpeed: { x: (Math.random() - 0.5) * 0.004, y: (Math.random() - 0.5) * 0.006, z: (Math.random() - 0.5) * 0.002 },
                floatSpeed: Math.random() * 0.4 + 0.2,
                floatAmp: Math.random() * 1.5 + 0.5,
                baseY: mesh.position.y,
            };

            floatingShapes.push(mesh);
            scene.add(mesh);
        }
    });
}

function createLights() {
    scene.add(new THREE.AmbientLight(0x0f1219, 0.5));

    const point1 = new THREE.PointLight(0x4f9eff, 1.8, 70);
    point1.position.set(12, 12, 10);
    scene.add(point1);

    const point2 = new THREE.PointLight(0xa78bfa, 1.2, 55);
    point2.position.set(-12, -8, 5);
    scene.add(point2);

    if (!_isMobile) {
        const point3 = new THREE.PointLight(0xffb867, 0.6, 35);
        point3.position.set(0, 18, -10);
        scene.add(point3);
    }
}

function createNebulaPlanes() {
    const nebulaGeo = new THREE.PlaneGeometry(90, 90);

    const nebulaMat1 = new THREE.MeshBasicMaterial({
        color: 0x4f9eff,
        transparent: true,
        opacity: 0.018,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
    });
    const nebula1 = new THREE.Mesh(nebulaGeo, nebulaMat1);
    nebula1.position.set(-18, 8, -35);
    nebula1.rotation.set(0.3, 0.5, 0.1);
    scene.add(nebula1);

    const nebulaMat2 = new THREE.MeshBasicMaterial({
        color: 0xa78bfa,
        transparent: true,
        opacity: 0.012,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
    });
    const nebula2 = new THREE.Mesh(nebulaGeo, nebulaMat2);
    nebula2.position.set(22, -12, -45);
    nebula2.rotation.set(-0.2, 0.8, -0.3);
    scene.add(nebula2);
}

function updateConnectionLines() {
    if (!connectionLines || !particles) return;

    const positions = particles.geometry.attributes.position.array;
    const linePositions = connectionLines.geometry.attributes.position.array;
    const maxDistance = 8;
    let lineIndex = 0;
    const maxLines = 150;

    for (let i = 0; i < positions.length / 3 && lineIndex < maxLines; i += 3) {
        for (let j = i + 3; j < positions.length / 3 && lineIndex < maxLines; j += 3) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < maxDistance) {
                const idx = lineIndex * 6;
                linePositions[idx] = positions[i * 3];
                linePositions[idx + 1] = positions[i * 3 + 1];
                linePositions[idx + 2] = positions[i * 3 + 2];
                linePositions[idx + 3] = positions[j * 3];
                linePositions[idx + 4] = positions[j * 3 + 1];
                linePositions[idx + 5] = positions[j * 3 + 2];
                lineIndex++;
            }
        }
    }

    connectionLines.geometry.setDrawRange(0, lineIndex * 2);
    connectionLines.geometry.attributes.position.needsUpdate = true;
}

function animate() {
    animId = requestAnimationFrame(animate);
    const time = Date.now() * 0.001;

    _frameCount++;
    if (time - _lastFpsTime >= 1) {
        _fps = _frameCount;
        _frameCount = 0;
        _lastFpsTime = time;
    }

    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    if (particles) {
        particles.rotation.y += 0.00015;
        particles.rotation.x += 0.00008;

        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 2] += Math.sin(time * 0.5 + i * 0.1) * 0.002;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        const scrollFade = Math.max(0, 1 - scrollProgress * 2);
        particles.material.opacity = 0.65 * scrollFade;
    }

    if (connectionLines) {
        if (_frameCount % 3 === 0) updateConnectionLines();
        connectionLines.material.opacity = 0.08 * Math.max(0, 1 - scrollProgress * 2);
    }

    floatingShapes.forEach((shape, i) => {
        const ud = shape.userData;
        shape.rotation.x += ud.rotSpeed.x;
        shape.rotation.y += ud.rotSpeed.y;
        shape.rotation.z += ud.rotSpeed.z;
        shape.position.y = ud.baseY + Math.sin(time * ud.floatSpeed + i) * ud.floatAmp;
    });

    camera.position.x = mouseX * 1.5;
    camera.position.y = -mouseY * 1 - scrollProgress * 10;
    camera.lookAt(0, -scrollProgress * 5, -10);

    renderer.render(scene, camera);
}

export function disposeLandingScene() {
    if (animId) cancelAnimationFrame(animId);
    if (_onMouseMove) window.removeEventListener('mousemove', _onMouseMove);
    if (_onScroll) window.removeEventListener('scroll', _onScroll);
    if (_onResize) window.removeEventListener('resize', _onResize);

    if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
    }

    scene = camera = renderer = particles = floatingShapes = connectionLines = null;
    _onMouseMove = _onScroll = _onResize = null;
    _isMobile = false;
    _fps = 60;
    _frameCount = 0;
}
