let scene, camera, renderer, core, nodes, edges, particles, animId;
let _onResize = null;

export function initNeural(containerId, graphData) {
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

    const coreGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const coreMat = new THREE.MeshPhongMaterial({ color: 0xA78BFA, emissive: 0xA78BFA, emissiveIntensity: 0.8 });
    core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    const nodeGroup = new THREE.Group();
    const edgeGroup = new THREE.Group();
    const clusterColors = { 'concept': 0x4F9EFF, 'document': 0x00E0B3, 'person': 0xFFB867, 'event': 0xA78BFA, 'question': 0xCEBDFF };

    const nodeData = graphData?.nodes || [];
    const edgeData = graphData?.edges || [];

    if (nodeData.length === 0) {
        const numNodes = 24;
        for (let i = 0; i < numNodes; i++) {
            const phi = Math.acos(-1 + (2 * i) / numNodes);
            const theta = Math.sqrt(numNodes * Math.PI) * phi;
            const radius = 3 + Math.random() * 0.5;
            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.12, 16, 16),
                new THREE.MeshPhongMaterial({ color: 0x4F9EFF, emissive: 0x4F9EFF, emissiveIntensity: 0.5 })
            );
            sphere.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
            nodeGroup.add(sphere);

            const lineGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0), sphere.position.clone()
            ]);
            const lineMat = new THREE.LineBasicMaterial({ color: 0x4F9EFF, transparent: true, opacity: 0.2 });
            edgeGroup.add(new THREE.Line(lineGeo, lineMat));
        }
    } else {
        const maxDist = Math.max(...nodeData.map(n => {
            const x = (Math.random() - 0.5) * 6;
            const y = (Math.random() - 0.5) * 6;
            return Math.sqrt(x*x + y*y + 3*3);
        }), 4);

        nodeData.forEach((n, i) => {
            const phi = Math.acos(-1 + (2 * i) / Math.max(nodeData.length, 1));
            const theta = Math.sqrt(Math.max(nodeData.length, 1) * Math.PI) * phi;
            const radius = 2.5 + Math.random() * 1;
            const color = clusterColors[n.node_type] || 0x4F9EFF;
            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.15, 16, 16),
                new THREE.MeshPhongMaterial({ color, emissive: color, emissiveIntensity: 0.5 })
            );
            sphere.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
            sphere.userData = n;
            nodeGroup.add(sphere);
        });

        const nodeMap = {};
        nodeGroup.children.forEach((s, i) => { nodeMap[nodeData[i]?.id] = s; });
        edgeData.forEach(e => {
            const src = nodeMap[e.source_node_id];
            const tgt = nodeMap[e.target_node_id];
            if (src && tgt) {
                const lineGeo = new THREE.BufferGeometry().setFromPoints([src.position.clone(), tgt.position.clone()]);
                const lineMat = new THREE.LineBasicMaterial({ color: 0x4F9EFF, transparent: true, opacity: 0.15 });
                edgeGroup.add(new THREE.Line(lineGeo, lineMat));
            }
        });
    }

    scene.add(nodeGroup);
    scene.add(edgeGroup);

    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000 * 3; i++) pPos[i] = (Math.random() - 0.5) * 15;
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x4F9EFF, size: 0.015, transparent: true, opacity: 0.4 }));
    scene.add(particles);

    scene.add(new THREE.PointLight(0x4F9EFF, 5, 100).translateX(5).translateY(5).translateZ(5));
    scene.add(new THREE.PointLight(0xA78BFA, 5, 100).translateX(-5).translateY(-5).translateZ(5));
    scene.add(new THREE.AmbientLight(0xffffff, 0.1));

    camera.position.z = 8;

    function animate() {
        animId = requestAnimationFrame(animate);
        nodeGroup.rotation.y += 0.0015;
        nodeGroup.rotation.x += 0.0005;
        edgeGroup.rotation.y += 0.0015;
        edgeGroup.rotation.x += 0.0005;
        core.scale.setScalar(1 + Math.sin(Date.now() * 0.002) * 0.05);
        particles.rotation.y -= 0.0005;
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
    core._onResize = onResize;
}

export function disposeNeural() {
    if (animId) cancelAnimationFrame(animId);
    if (_onResize) window.removeEventListener('resize', _onResize);
    if (renderer) {
        renderer.dispose();
        if (renderer.domElement?.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
    scene = camera = renderer = core = nodes = edges = particles = _onResize = null;
}
