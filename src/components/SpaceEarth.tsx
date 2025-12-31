import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import profilePic from '../assets/profile-pic.webp';
import { useTheme } from '../contexts/ThemeContext';

const SpaceEarth: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const isDarkTheme = theme === 'dark' || theme === null; // Default to dark if not yet loaded
    const [isZoomedState, setIsZoomedState] = useState(false);
    const isZoomedRef = useRef(false);
    const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

    const handleInteraction = () => {
        isZoomedRef.current = true;
        setIsZoomedState(true);
    };

    const handleReset = (e: React.MouseEvent) => {
        e.stopPropagation();
        isZoomedRef.current = false;
        setIsZoomedState(false);
    }

    useEffect(() => {
        if (!containerRef.current) return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        // Scene Setup
        const scene = new THREE.Scene();

        // Camera Setup - Responsive FOV
        const isMobile = window.innerWidth < 768;
        const initialZ = isMobile ? 18 : 14;
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.z = initialZ;

        // Renderer Setup
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
        containerRef.current.appendChild(renderer.domElement);

        // Textures
        const textureLoader = new THREE.TextureLoader();
        const earthMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');
        const earthSpecular = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg');
        const earthNormal = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg');

        // Earth Mesh - Adaptive size
        const radius = isMobile ? 2.5 : 3;
        const geometry = new THREE.SphereGeometry(radius, 64, 64);
        const material = new THREE.MeshPhongMaterial({
            map: earthMap,
            specularMap: earthSpecular,
            normalMap: earthNormal,
            specular: new THREE.Color(isDarkTheme ? 0x888888 : 0xaaaaaa),
            shininess: 25,
        });
        const earth = new THREE.Mesh(geometry, material);
        scene.add(earth);

        // Atmosphere Glow
        const atmosphereGeo = new THREE.SphereGeometry(radius + 0.1, 64, 64);
        const atmosphereMat = new THREE.MeshPhongMaterial({
            color: 0x38BDF8,
            transparent: true,
            opacity: isDarkTheme ? 0.25 : 0.15,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
        });
        const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
        scene.add(atmosphere);

        // Stars - Reduced count for mobile and lowered visibility in light mode
        const starGeometry = new THREE.BufferGeometry();
        const starCount = isMobile ? 800 : 1800;
        const starPositions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount * 3; i++) {
            starPositions[i] = (Math.random() - 0.5) * 150;
        }
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starMaterial = new THREE.PointsMaterial({
            color: 0x0EA5E9,
            size: 0.12,
            transparent: true,
            opacity: 0.3
        });
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // Lights - Boosted for light theme to prevent dark silhouette
        const ambientLight = new THREE.AmbientLight(isDarkTheme ? 0x999999 : 0xcccccc);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, isDarkTheme ? 2.5 : 4.0);
        pointLight.position.set(20, 10, 20);
        scene.add(pointLight);

        // Secondary rim light for light theme to pop more
        if (!isDarkTheme) {
            const rimLight = new THREE.PointLight(0xffffff, 2.0);
            rimLight.position.set(-20, -10, -20);
            scene.add(rimLight);

            const topLight = new THREE.DirectionalLight(0xffffff, 1.0);
            topLight.position.set(0, 20, 0);
            scene.add(topLight);
        }

        // Profile Picture Marker (Circular)
        const profileTexture = textureLoader.load(profilePic);
        profileTexture.colorSpace = THREE.SRGBColorSpace;
        const markerGeo = new THREE.CircleGeometry(isMobile ? 0.25 : 0.35, 32);
        const markerMat = new THREE.MeshBasicMaterial({
            map: profileTexture,
            transparent: true,
            side: THREE.DoubleSide
        });
        const marker = new THREE.Mesh(markerGeo, markerMat);

        // Position slightly above surface to prevent z-fighting
        const offsetRadius = radius * 1.02;
        const lat = 34.1425;
        const lon = -118.2470;
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const posX = -(offsetRadius * Math.sin(phi) * Math.cos(theta));
        const posY = (offsetRadius * Math.cos(phi));
        const posZ = (offsetRadius * Math.sin(phi) * Math.sin(theta));

        marker.position.set(posX, posY, posZ);
        marker.lookAt(posX * 2, posY * 2, posZ * 2); // Face outwards
        earth.add(marker);

        let animationId: number;

        const animate = () => {
            animationId = requestAnimationFrame(animate);

            if (isZoomedRef.current) {
                const markerWorldPos = new THREE.Vector3();
                marker.getWorldPosition(markerWorldPos);

                // Closer zoom on mobile
                const zoomDist = isMobile ? 4.8 : 5.5;
                const offset = markerWorldPos.clone().normalize().multiplyScalar(zoomDist);

                camera.position.lerp(offset, 0.05);
                camera.lookAt(0, 0, 0);

                if (!prefersReducedMotion) {
                    earth.rotation.y += 0.0005;
                }
            } else {
                if (!prefersReducedMotion) {
                    earth.rotation.y += 0.0025;
                    stars.rotation.y -= 0.0003;
                }
                const targetZ = window.innerWidth < 768 ? 16 : 14;
                camera.position.lerp(new THREE.Vector3(0, 0, targetZ), 0.05);
                camera.lookAt(0, 0, 0);
            }

            renderer.render(scene, camera);
        };

        animate();

        const canvas = renderer.domElement;
        canvas.addEventListener('click', handleInteraction);

        const handleResize = () => {
            if (!containerRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('click', handleInteraction);
            if (containerRef.current) {
                containerRef.current.removeChild(canvas);
            }
            geometry.dispose();
            material.dispose();
            markerGeo.dispose();
            markerMat.dispose();
            atmosphereGeo.dispose();
            atmosphereMat.dispose();
            starGeometry.dispose();
            starMaterial.dispose();
        };
    }, [prefersReducedMotion, isDarkTheme]);

    return (
        <div className="position-relative w-100 h-100 d-flex flex-column align-items-center justify-content-center">
            <div
                ref={containerRef}
                style={{ width: '100%', height: '100%', cursor: isZoomedState ? 'default' : 'pointer', touchAction: 'none' }}
                title={isZoomedState ? "Welcome to California!" : "Tap Earth to Locate Me"}
            />
            {!isZoomedState && (
                <div className="position-absolute bottom-0 mb-4 text-sky-blue small font-monospace animate-pulse pointer-events-none opacity-75">
                    [ Tap Earth to Locate ]
                </div>
            )}
            {isZoomedState && (
                <div className="position-absolute bottom-0 mb-4 text-center animate-fade-in px-3">
                    <p className="font-monospace text-orange-cta mb-0 fw-bold small">LOCATED: Los Angeles, CA</p>
                    <button
                        onClick={handleReset}
                        className="btn btn-sm btn-outline-sky-blue mt-2 px-3 py-1"
                        style={{ zIndex: 10, fontSize: '0.75rem' }}
                    >
                        Reset
                    </button>
                </div>
            )}
        </div>
    );
};

export default SpaceEarth;
