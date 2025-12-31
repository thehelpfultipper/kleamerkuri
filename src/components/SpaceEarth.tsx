import React, { useRef, useEffect, useState, useCallback } from 'react';
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

    const handleInteraction = useCallback(() => {
        isZoomedRef.current = true;
        setIsZoomedState(true);
    }, []);

    const handleReset = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        isZoomedRef.current = false;
        setIsZoomedState(false);
    }, []);

    const sceneRef = useRef<{
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
        earthMaterial: THREE.MeshPhongMaterial;
        atmosphereMaterial: THREE.MeshPhongMaterial;
        ambientLight: THREE.AmbientLight;
        pointLight: THREE.PointLight;
        rimLight?: THREE.PointLight;
        topLight?: THREE.DirectionalLight;
    } | null>(null);

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
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

        // Stars
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

        // Lights
        const ambientLight = new THREE.AmbientLight(isDarkTheme ? 0x999999 : 0xcccccc);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, isDarkTheme ? 2.5 : 4.0);
        pointLight.position.set(20, 10, 20);
        scene.add(pointLight);

        let rimLight: THREE.PointLight | undefined;
        let topLight: THREE.DirectionalLight | undefined;

        if (!isDarkTheme) {
            rimLight = new THREE.PointLight(0xffffff, 2.0);
            rimLight.position.set(-20, -10, -20);
            scene.add(rimLight);

            topLight = new THREE.DirectionalLight(0xffffff, 1.0);
            topLight.position.set(0, 20, 0);
            scene.add(topLight);
        }

        // Profile Picture Marker
        const profileTexture = textureLoader.load(profilePic);
        profileTexture.colorSpace = THREE.SRGBColorSpace;
        const markerGeo = new THREE.CircleGeometry(isMobile ? 0.25 : 0.35, 32);
        const markerMat = new THREE.MeshBasicMaterial({
            map: profileTexture,
            transparent: true,
            side: THREE.DoubleSide
        });
        const marker = new THREE.Mesh(markerGeo, markerMat);

        const offsetRadius = radius * 1.02;
        const lat = 34.1425;
        const lon = -118.2470;
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const posX = -(offsetRadius * Math.sin(phi) * Math.cos(theta));
        const posY = (offsetRadius * Math.cos(phi));
        const posZ = (offsetRadius * Math.sin(phi) * Math.sin(theta));

        marker.position.set(posX, posY, posZ);
        marker.lookAt(posX * 2, posY * 2, posZ * 2);
        earth.add(marker);

        sceneRef.current = {
            scene, camera, renderer,
            earthMaterial: material,
            atmosphereMaterial: atmosphereMat,
            ambientLight, pointLight, rimLight, topLight
        };

        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);

            if (isZoomedRef.current) {
                const markerWorldPos = new THREE.Vector3();
                marker.getWorldPosition(markerWorldPos);
                const zoomDist = isMobile ? 4.8 : 5.5;
                const offset = markerWorldPos.clone().normalize().multiplyScalar(zoomDist);
                camera.position.lerp(offset, 0.05);
                camera.lookAt(0, 0, 0);
                if (!prefersReducedMotion) earth.rotation.y += 0.0005;
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
            sceneRef.current = null;
        };
    }, [prefersReducedMotion]); // Only recreate on motion preference change

    // Handle Theme Changes without recreating the scene
    useEffect(() => {
        const refs = sceneRef.current;
        if (!refs) return;

        const { earthMaterial, atmosphereMaterial, ambientLight, pointLight, scene } = refs;

        earthMaterial.specular.set(isDarkTheme ? 0x888888 : 0xaaaaaa);
        atmosphereMaterial.opacity = isDarkTheme ? 0.25 : 0.15;
        ambientLight.color.set(isDarkTheme ? 0x999999 : 0xcccccc);
        pointLight.intensity = isDarkTheme ? 2.5 : 4.0;

        if (!isDarkTheme) {
            if (!refs.rimLight) {
                refs.rimLight = new THREE.PointLight(0xffffff, 2.0);
                refs.rimLight.position.set(-20, -10, -20);
                scene.add(refs.rimLight);
            }
            if (!refs.topLight) {
                refs.topLight = new THREE.DirectionalLight(0xffffff, 1.0);
                refs.topLight.position.set(0, 20, 0);
                scene.add(refs.topLight);
            }
        } else {
            if (refs.rimLight) {
                scene.remove(refs.rimLight);
                refs.rimLight.dispose();
                refs.rimLight = undefined;
            }
            if (refs.topLight) {
                scene.remove(refs.topLight);
                refs.topLight.dispose();
                refs.topLight = undefined;
            }
        }
    }, [isDarkTheme]);

    return (
        <div className="position-relative w-100 h-100 d-flex flex-column align-items-center justify-content-center">
            <div
                ref={containerRef}
                style={{ width: '100%', height: '100%', cursor: isZoomedState ? 'default' : 'pointer', touchAction: 'none' }}
                title={isZoomedState ? "Welcome to California!" : "Tap Earth to Locate Me"}
            />
            {!isZoomedState && (
                <div
                    className="position-absolute bottom-0 mb-4 px-3 py-1 rounded-pill small font-monospace animate-pulse pointer-events-none"
                    style={{
                        background: isDarkTheme ? 'rgba(30, 30, 30, 0.5)' : 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(8px)',
                        color: isDarkTheme ? 'var(--bs-sky-blue)' : '#4c1d95',
                        border: `1px solid ${isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                        opacity: 0.9
                    }}
                >
                    [ Tap Earth to Locate ]
                </div>
            )}
            {isZoomedState && (
                <div
                    className="position-absolute bottom-0 mb-4 text-center animate-fade-in px-4 py-2 rounded-3"
                    style={{
                        background: isDarkTheme ? 'rgba(30, 30, 30, 0.5)' : 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <p className="font-monospace mb-0 fw-bold small" style={{ color: isDarkTheme ? 'var(--bs-orange-cta)' : '#be123c' }}>
                        LOCATED: Los Angeles, CA
                    </p>
                    <button
                        onClick={handleReset}
                        className={`btn btn-sm ${isDarkTheme ? 'btn-outline-sky-blue' : 'btn-outline-dark'} mt-2 px-3 py-1`}
                        style={{ zIndex: 10, fontSize: '0.75rem', fontWeight: 'bold' }}
                    >
                        Reset
                    </button>
                </div>
            )}
        </div>
    );
};

export default React.memo(SpaceEarth);
