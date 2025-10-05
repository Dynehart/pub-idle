// lightshaft.glsl
precision mediump float;

uniform vec2 resolution;
uniform float time;
uniform vec3 glowColor;

varying vec2 vUv;

// ====================
// Vertex Shader
// ====================
#ifdef VERTEX_SHADER
// GL_VERTEX AND GL_FRAGMENT failed
// VERTEX_SHADER and FRAGMENT_SHADER failed

attribute vec2 aPosition;
varying vec2 vUv;

void main(void) {
    // Convert from clip-space (-1..1) to UV (0..1)
    vUv = (aPosition + 1.0) * 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
}

#endif

// ====================
// Fragment Shader
// ====================
#ifdef FRAGMENT_SHADER

void main(void) {
    // Beam centered horizontally
    float dist = abs(vUv.x - 0.5);

    // Smooth horizontal falloff
    float beam = smoothstep(0.5, 0.0, dist * 2.0);

    // Fade vertically (bright at top, fades out at bottom)
    float vertical = smoothstep(0.0, 1.0, vUv.y);

    // Add some flicker for liveliness
    float flicker = 0.9 + 0.1 * sin(time * 3.0 + vUv.y * 10.0);

    // Combine layers
    float intensity = beam * vertical * flicker;

    // Final glow color
    gl_FragColor = vec4(glowColor * intensity, intensity);
}

#endif
