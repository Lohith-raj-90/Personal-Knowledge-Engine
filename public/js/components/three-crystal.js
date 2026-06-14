let scene, camera, renderer, crystal, wireframe, particles, animId;
let _onResize = null;

export function initCrystal(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const geo = new THREE.IcosahedronGeometry(1.5, 0);
    const mat = new THREE.MeshPhysicalMaterial({ color: 0x4F9EFF, transmission: 0.9, clearcoat: 1, opacity: 0.8, transparent: true });
    crystal = new THREE.Mesh(geo, mat);
    scene.add(crystal);

    const wireGeo = new THREE.IcosahedronGeometry(1.52, 0);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x4F9EFF, wireframe: true, transparent: true, opacity: 0.2 });
    wireframe = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireframe);

    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(800 * 3);
    for (let i = 0; i < 800 * 3; i++) pPositions[i] = (Math.random() - 0.5) * 10;
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x4F9EFF, size: 0.02, transparent: true, opacity: 0.6 });
    particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    scene.add(new THREE.PointLight(0x4F9EFF, 5, 100).translateX(5).translateY(5).translateZ(5));
    scene.add(new THREE.PointLight(0xA78BFA, 5, 100).translateX(-5).translateY(-5).translateZ(5));
    scene.add(new THREE.AmbientLight(0x020408, 0.5));

    camera.position.z = 5;

    function animate() {
        animId = requestAnimationFrame(animate);
        crystal.rotation.y += 0.003;
        crystal.rotation.x += 0.001;
        crystal.position.y = Math.sin(Date.now() * 0.001) * 0.2;
        wireframe.rotation.y += 0.003;
        wireframe.rotation.x += 0.001;
        wireframe.position.y = crystal.position.y;
        particles.rotation.y -= 0.001;
        renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    };
    _onResize = onResize;
    window.addEventListener('resize', onResize);
    crystal._onResize = onResize;
}

export function disposeCrystal() {
    if (animId) cancelAnimationFrame(animId);
    if (_onResize) window.removeEventListener('resize', _onResize);
    if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
    }
    scene = camera = renderer = crystal = wireframe = particles = _onResize = null;
}
