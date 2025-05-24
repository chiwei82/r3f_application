uniform float uTime;
varying vec2 vUv;

float circles(vec2 uv, float r){
    vec2 pos = vec2(0.5) - fract(uv);
    float dist = length(pos);
    return 1. - step(r, dist);
}

void main() {
    vec2 uv = vUv * 500.0; // frequency 500
    vec2 colRow = floor(uv);
    uv = fract(uv);

    float offset = length(colRow) * 0.3;
    float wave = sin(uTime * 2.0 - offset);
    float shift = 0.2 * wave;

    if (mod(colRow.x + colRow.y, 2.0) < 1.0) {
        uv += vec2(shift, 0.0);
    } else {
        uv += vec2(0.0, shift);
    }

    float val = circles(uv, 0.04); // radius 0.04

    if (val < 0.01) discard;

    vec3 color = vec3(0.0);
    gl_FragColor = vec4(color, val);
}
