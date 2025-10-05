precision mediump float;

uniform float time;
uniform vec2 resolution;

varying vec2 vTextureCoord;


void main() {
    vec2 uv = vTextureCoord;

    float xDist = abs(uv.x - 0.5);

    float xFalloff = exp(-pow(xDist / 0.5, 2.0)); // 0.5 = half width
    float yFalloff = smoothstep(0.0, 1.0, uv.y);

    float intensity = xFalloff * yFalloff;

    gl_FragColor = vec4(vec3(1.0, 1.0, 0.8) * intensity, intensity);
}
