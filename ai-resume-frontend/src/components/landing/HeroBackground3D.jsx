import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const MAX_CONNECTIONS = 600;

export default function HeroBackground3D({ count = 80 }) {
  const pointsRef = useRef();
  const linesRef = useRef();
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // Create random positions and velocities for particles
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = [];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
      vel.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        )
      );
    }
    return [pos, vel];
  }, [count]);

  const linePositions = useMemo(() => new Float32Array(MAX_CONNECTIONS * 6), []);
  const lineColors = useMemo(() => new Float32Array(MAX_CONNECTIONS * 6), []);

  const colorPrimary = new THREE.Color('#7C5CFC'); // Purple
  const colorSecondary = new THREE.Color('#00D4AA'); // Cyan

  useFrame(() => {
    if (prefersReducedMotion || document.hidden) return;
    if (!pointsRef.current || !linesRef.current) return;

    const posAttr = pointsRef.current.geometry.attributes.position;
    const pa = posAttr.array;
    
    // Update particle positions
    for (let i = 0; i < count; i++) {
      pa[i * 3] += velocities[i].x;
      pa[i * 3 + 1] += velocities[i].y;
      pa[i * 3 + 2] += velocities[i].z;

      // Bounce off boundaries
      if (pa[i * 3] < -7.5 || pa[i * 3] > 7.5) velocities[i].x *= -1;
      if (pa[i * 3 + 1] < -7.5 || pa[i * 3 + 1] > 7.5) velocities[i].y *= -1;
      if (pa[i * 3 + 2] < -7.5 || pa[i * 3 + 2] > 7.5) velocities[i].z *= -1;
    }
    posAttr.needsUpdate = true;

    // Update lines
    let vertexpos = 0;
    let colorpos = 0;
    let numConnected = 0;

    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pa[i * 3] - pa[j * 3];
        const dy = pa[i * 3 + 1] - pa[j * 3 + 1];
        const dz = pa[i * 3 + 2] - pa[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 2.5) {
          const alpha = 1.0 - dist / 2.5;

          linePositions[vertexpos++] = pa[i * 3];
          linePositions[vertexpos++] = pa[i * 3 + 1];
          linePositions[vertexpos++] = pa[i * 3 + 2];

          linePositions[vertexpos++] = pa[j * 3];
          linePositions[vertexpos++] = pa[j * 3 + 1];
          linePositions[vertexpos++] = pa[j * 3 + 2];

          // Interpolate color based on position
          const color1 = pa[i * 3] > 0 ? colorPrimary : colorSecondary;
          const color2 = pa[j * 3] > 0 ? colorPrimary : colorSecondary;

          lineColors[colorpos++] = color1.r;
          lineColors[colorpos++] = color1.g;
          lineColors[colorpos++] = color1.b;

          lineColors[colorpos++] = color2.r;
          lineColors[colorpos++] = color2.g;
          lineColors[colorpos++] = color2.b;

          numConnected++;
          if (numConnected >= MAX_CONNECTIONS) break;
        }
      }
      if (numConnected >= MAX_CONNECTIONS) break;
    }

    linesRef.current.geometry.setDrawRange(0, numConnected * 2);
    linesRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.attributes.color.needsUpdate = true;
    
    // Rotate slowly
    pointsRef.current.rotation.y += 0.001;
    linesRef.current.rotation.y += 0.001;
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#ffffff"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={lineColors.length / 3}
            array={lineColors}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  );
}
