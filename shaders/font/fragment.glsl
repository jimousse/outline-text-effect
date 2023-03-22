uniform float opacity;
uniform vec3 color;
uniform sampler2D map;
uniform vec2 uMouse;
uniform float time;
uniform vec2 viewport;
varying vec2 vUv;


#define PI 3.1415926535897932384626433832795

vec4 permute(vec4 x) {
    return mod(((x*34.0)+1.0)*x, 289.0);
}

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec2 fade(vec2 t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec2 P) {
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

// Computation of the median value using minima and maxima
float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

float createCircle() {
  float viewportAspect = viewport.y / viewport.x;
  vec2 mousePoint = uMouse / viewport;
  mousePoint.y = 1.0 - mousePoint.y;
  vec2 currentPoint = gl_FragCoord.xy / viewport;
  float circleRadius = 0.08;
  float dist = distance(
    vec2(currentPoint.x / viewportAspect, currentPoint.y), 
    vec2(mousePoint.x / viewportAspect, mousePoint.y)
  );
  dist = smoothstep(circleRadius, circleRadius + 0.001, dist);
  return dist;
}

void main() {
  float width = 0.2 ;
  float lineProgress = 0.3;
  vec3 mysample = texture2D(map, vUv).rgb;
  float sigDist = median(mysample.r, mysample.g, mysample.b) - 0.5;
  float fill = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);

  // stroke
  float border = fwidth(sigDist);
  float outline = smoothstep(0., border, sigDist);
  outline *= 1. - smoothstep(width - border, width, sigDist);

  vec2 rotatedUv = rotate(vUv, PI + time*0.01, vec2(0.5));

  // mask
  float mask = fract(sin(cnoise(rotatedUv * 10.0 + time * 0.4)));

  // circle
  float circle = createCircle();
  float finalAlpha = outline * mask + fill*circle;

  gl_FragColor = vec4(color.xyz, finalAlpha);
  if (gl_FragColor.a < 0.001) discard;
}