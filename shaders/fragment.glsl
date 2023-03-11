uniform float opacity;
uniform vec3 color;
uniform sampler2D map;
uniform sampler2D gradientMap;
uniform vec2 uMouse;
uniform float time;
uniform vec2 viewport;
varying vec2 vUv;

// Computation of the median value using minima and maxima
float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

float createCircle() {
  float viewportAspect = viewport.y / viewport.x;
  vec2 mousePoint = uMouse / viewport;
  mousePoint.y = 1.0 - mousePoint.y;
  vec2 currentPoint = gl_FragCoord.xy / viewport;
  float circleRadius = 0.12;
  float dist = distance(
    vec2(currentPoint.x / viewportAspect, currentPoint.y), 
    vec2(mousePoint.x / viewportAspect, mousePoint.y)
  );
  dist = smoothstep(circleRadius, circleRadius + 0.001, dist);
  return dist;
}

void main() {
  float width = 0.1;
  float lineProgress = 0.3;
  // Bilinear sampling of the distance field
  vec3 mysample = texture2D(map, vUv).rgb;
  // only need r because r,g,b are all the same since it's BW
  float gr = texture2D(gradientMap, vUv).r;

  // Acquiring the signed distance
  float sigDist = median(mysample.r, mysample.g, mysample.b) - 0.5;
  float fill = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);

  // stroke
  float border = fwidth(sigDist);
  // 1.0 -> white, 0.0 -> black
  // border -> outside, sigDist -> inside
  // smooth Hermite interpolation between 0 and 1 when edge0 < x < edge1
  float outline = smoothstep(0., border, sigDist);
  outline *= 1. - smoothstep(width - border, width, sigDist);


  // gradient
  float fractGr = fract(3.*gr + time);
  float start = smoothstep(0.0, 0.1, fractGr);
  float end = smoothstep(lineProgress, lineProgress - 0.01, fractGr);
  float mask = start*end;
  mask = max(0.1, mask);

  // circle
  float circle = createCircle();
  float finalAlpha = outline*mask + fill*circle;


  gl_FragColor = vec4(color.xyz, finalAlpha);
  if (gl_FragColor.a < 0.001) discard;
}