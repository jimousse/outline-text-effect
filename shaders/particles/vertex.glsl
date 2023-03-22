uniform float time;
attribute float aScale;
attribute vec3 aRandomness;
varying vec3 vRandomness;
varying vec2 vUv;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.x += aRandomness.x * cos(time * aRandomness.y + aRandomness.z);
    modelPosition.y += aRandomness.x * sin(time * aRandomness.z + aRandomness.y);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;


    gl_PointSize = 3.0 * aScale;
    gl_PointSize *= (1.0 / - viewPosition.z);
    vUv = vec2(uv);
    vRandomness = aRandomness;
}
