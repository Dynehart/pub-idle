// ---
// name: lightshaft
// type: fragment
// uniform.size: { "type": "1f", "value": 16.0 }
// ---

// attribute vec2 aPosition;
// varying vec2 vUv;

// void main(void) {
//     // Convert from clip-space (-1..1) to UV (0..1)
//     vUv = (aPosition + 1.0) * 0.5;
//     gl_Position = vec4(aPosition, 0.0, 1.0);
// }
---
name: marble
type: fragment
author: https://phaser.io/examples/v3.85.0/game-objects/shaders/view/shader-arcade-physics
---

precision mediump float;

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord.xy / resolution.xx-0.5)*8.0;
    vec2 uv0=uv;
    float i0=1.0;
    float i1=1.0;
    float i2=1.0;
    float i4=0.0;
    for(int s=0;s<7;s++)
    {
        vec2 r;
        r=vec2(cos(uv.y*i0-i4+time/i1),sin(uv.x*i0-i4+time/i1))/i2;
        r+=vec2(-r.y,r.x)*0.3;
        uv.xy+=r;

        i0*=1.93;
        i1*=1.15;
        i2*=1.7;
        i4+=0.05+0.1*time*i1;
    }
    float r=sin(uv.x-time)*0.5+0.5;
    float b=sin(uv.y+time)*0.5+0.5;
    float g=sin((uv.x+uv.y+sin(time*0.5))*0.5)*0.5+0.5;
    fragColor = vec4(r,g,b,1.0);
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
    gl_FragColor.a = 1.0;
}

---
name: lightshaft-rainbow
type: fragment
---

precision mediump float;

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // Normalize coordinates (centered horizontally, full height)
    vec2 uv = fragCoord / resolution.xy;
    
    // Center X around 0 and scale UV for effect
    vec2 centeredUV = (uv - vec2(0.5, 0.0)) * vec2(8.0, 4.0);

    vec2 uv0 = centeredUV;
    float i0 = 1.0;
    float i1 = 1.0;
    float i2 = 1.0;
    float i4 = 0.0;

    for(int s = 0; s < 7; s++)
    {
        vec2 r = vec2(
            cos(centeredUV.y * i0 - i4 + time / i1),
            sin(centeredUV.x * i0 - i4 + time / i1)
        ) / i2;

        r += vec2(-r.y, r.x) * 0.3;
        centeredUV += r;

        i0 *= 1.93;
        i1 *= 1.15;
        i2 *= 1.7;
        i4 += 0.05 + 0.1 * time * i1;
    }

    // Base color pattern
    float r = sin(centeredUV.x - time) * 0.5 + 0.5;
    float g = sin((centeredUV.x + centeredUV.y + sin(time * 0.5)) * 0.5) * 0.5 + 0.5;
    float b = sin(centeredUV.y + time) * 0.5 + 0.5;
    vec3 color = vec3(r, g, b);

    // === Fade effects ===
    // Fade vertically toward the top
    float verticalFade = smoothstep(1.0, 0.4, uv.y);

    // Fade horizontally toward the sides
    float horizontalFade = smoothstep(0.5, 0.0, abs(uv.x - 0.5));

    // Combine both fades
    float beamFade = verticalFade * horizontalFade;

    // Final color with fade applied
    fragColor = vec4(color * beamFade, beamFade);
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
}

---
name: lightshaft
type: fragment
---

precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform vec3 glowColor;

varying vec2 outTexCoord
// varying vec2 fragCoord;


void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord / resolution.xy;

    // Center X, stretch for beam shape
    vec2 centeredUV = (uv - vec2(0.5, 0.0)) * vec2(8.0, 4.0);

    vec2 uv0 = centeredUV;
    float i0 = 1.0;
    float i1 = 1.0;
    float i2 = 1.0;
    float i4 = 0.0;

    // 7 steps is too many? 
    for (int s = 0; s < 3; s++)
    {
        vec2 r = vec2(
            cos(centeredUV.y * i0 - i4 + time / i1),
            sin(centeredUV.x * i0 - i4 + time / i1)
        ) / i2;

        r += vec2(-r.y, r.x) * 0.3;
        centeredUV += r;

        i0 *= 1.93;
        i1 *= 1.15;
        i2 *= 1.7;
        i4 += 0.05 + 0.1 * time * i1;
    }

    // Base color pattern
    float r = 1.0;
    float g = 0.8;
    float b = 0.3;
    vec3 glowColor = vec3(r, g, b) * sin(centeredUV.y + time) * 0.5 + 0.5;

    // Fade vertically toward the top
    float verticalFade = smoothstep(1.0, 0.4, uv.y);

    // Fade horizontally toward the sides
    float horizontalFade = smoothstep(0.5, 0.0, abs(uv.x - 0.5));

    // Combined falloff
    float beamFade = verticalFade * horizontalFade;

    // Apply the uniform glowColor with fade
    vec3 color = glowColor * beamFade;

    fragColor = vec4(color, beamFade);
}

void main(void)
{
    vec2 fragCoord = outTexCoord * resolution;

    // gl_FragColor = vec4(glowColor, 1);
    // gl_FragColor = vec4(vec3(1.0, 0.8, 0.3), 1);
    mainImage(gl_FragColor, fragCoord.xy);
}
