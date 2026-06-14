let scene, camera, renderer, animId;
let particles, floatingShapes = [];
let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;
let scrollProgress = 0;
let _onMouseMove = null, _onScroll = null, _onResize = null;

export function initLandingScene(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x101419, 0.035);

    camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 30);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    createParticleField();
    createFloatingShapes();
    createLights();
    createNebulaPlanes();

    _onMouseMove = (e) => {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', _onMouseMove);

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
    };
    window.addEventListener('resize', _onResize);

    animate();
}

function createParticleField() {
    const count = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const palette = [
        new THREE.Color(0x4f9eff),
        new THREE.Color(0xcebdff),
        new THREE.Color(0xa78bfa),
        new THREE.Color(0xffb867),
    ];

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const radius = 20 + Math.random() * 60;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi) - 30;

        const color = palette[Math.floor(Math.random() * palette.length)];
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;

        sizes[i] = Math.random() * 2 + 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function createFloatingShapes() {
    const shapeConfigs = [
        { geo: new THREE.IcosahedronGeometry(1, 0), color: 0x4f9eff, count: 4, range: 25 },
        { geo: new THREE.OctahedronGeometry(0.8, 0), color: 0xcebdff, count: 3, range: 30 },
        { geo: new THREE.TetrahedronGeometry(0.7, 0), color: 0xa78bfa, count: 3, range: 28 },
        { geo: new THREE.IcosahedronGeometry(0.5, 1), color: 0xffb867, count: 2, range: 20 },
    ];

    shapeConfigs.forEach(cfg => {
        for (let i = 0; i < cfg.count; i++) {
            const wireframeMat = new THREE.MeshBasicMaterial({
                color: cfg.color,
                wireframe: true,
                transparent: true,
                opacity: 0.15,
            });
            const mesh = new THREE.Mesh(cfg.geo.clone(), wireframeMat);

            const edgeGeo = new THREE.EdgesGeometry(cfg.geo);
            const edgeMat = new THREE.LineBasicMaterial({
                color: cfg.color,
                transparent: true,
                opacity: 0.3,
            });
            const edges = new THREE.LineSegments(edgeGeo, edgeMat);
            mesh.add(edges);

            mesh.position.set(
                (Math.random() - 0.5) * cfg.range,
                (Math.random() - 0.5) * cfg.range,
                (Math.random() - 0.5) * 20 - 15
            );

            mesh.userData = {
                rotSpeed: { x: (Math.random() - 0.5) * 0.005, y: (Math.random() - 0.5) * 0.008, z: (Math.random() - 0.5) * 0.003 },
                floatSpeed: Math.random() * 0.5 + 0.3,
                floatAmp: Math.random() * 1.5 + 0.5,
                baseY: mesh.position.y,
                orbitSpeed: (Math.random() - 0.5) * 0.0003,
                orbitRadius: Math.random() * 3 + 1,
            };

            floatingShapes.push(mesh);
            scene.add(mesh);
        }
    });
}

function createLights() {
    const ambient = new THREE.AmbientLight(0x1a1a2e, 0.4);
    scene.add(ambient);

    const point1 = new THREE.PointLight(0x4f9eff, 2, 80);
    point1.position.set(15, 15, 10);
    scene.add(point1);

    const point2 = new THREE.PointLight(0xa78bfa, 1.5, 60);
    point2.position.set(-15, -10, 5);
    scene.add(point2);

    const point3 = new THREE.PointLight(0xffb867, 0.8, 40);
    point3.position.set(0, 20, -10);
    scene.add(point3);
}

function createNebulaPlanes() {
    const nebulaGeo = new THREE.PlaneGeometry(100, 100);

    const nebulaMat1 = new THREE.MeshBasicMaterial({
        color: 0x4f9eff,
        transparent: true,
        opacity: 0.02,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
    });
    const nebula1 = new THREE.Mesh(nebulaGeo, nebulaMat1);
    nebula1.position.set(-20, 10, -40);
    nebula1.rotation.set(0.3, 0.5, 0.1);
    scene.add(nebula1);

    const nebulaMat2 = new THREE.MeshBasicMaterial({
        color: 0xa78bfa,
        transparent: true,
        opacity: 0.015,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
    });
    const nebula2 = new THREE.Mesh(nebulaGeo, nebulaMat2);
    nebula2.position.set(25, -15, -50);
    nebula2.rotation.set(-0.2, 0.8, -0.3);
    scene.add(nebula2);
}

function animate() {
    animId = requestAnimationFrame(animate);
    const time = Date.now() * 0.001;

    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    if (particles) {
        particles.rotation.y += 0.0002;
        particles.rotation.x += 0.0001;
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 2] += Math.sin(time + i) * 0.003;
        }
        particles.geometry.attributes.position.needsUpdate = true;
    }

    floatingShapes.forEach((shape, i) => {
        const ud = shape.userData;
        shape.rotation.x += ud.rotSpeed.x;
        shape.rotation.y += ud.rotSpeed.y;
        shape.rotation.z += ud.rotSpeed.z;

        shape.position.y = ud.baseY + Math.sin(time * ud.floatSpeed + i) * ud.floatAmp;
        shape.position.x += Math.cos(time * ud.orbitSpeed + i) * 0.01;

        const scrollOffset = scrollProgress * 15;
        shape.position.y -= scrollOffset * 0.3;
        shape.rotation.x += scrollProgress * 0.01;
    });

    camera.position.x = mouseX * 2;
    camera.position.y = -mouseY * 1.5 - scrollProgress * 10;
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

    scene = camera = renderer = particles = floatingShapes = null;
    _onMouseMove = _onScroll = _onResize = null;
}
