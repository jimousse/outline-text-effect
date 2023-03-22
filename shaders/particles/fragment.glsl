uniform vec2 uMouse;
uniform float time;
uniform vec2 viewport;

float createCircle() {
  float viewportAspect = viewport.y / viewport.x;
  vec2 mousePoint = uMouse / viewport;
  mousePoint.y = 1.0 - mousePoint.y;
  vec2 currentPoint = gl_FragCoord.xy / viewport;
  float circleRadius = 0.1;
  float dist = distance(
    vec2(currentPoint.x / viewportAspect, currentPoint.y), 
    vec2(mousePoint.x / viewportAspect, mousePoint.y)
  );
  dist = smoothstep(circleRadius, circleRadius + 0.001, dist);
  return dist;
}

void main() {
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
  float strength = 0.05 / distanceToCenter - 0.1;
  float circle = 1.0 - createCircle();
  gl_FragColor = vec4(1.0, 1.0, 1.0, strength*circle);
  if (gl_FragColor.a < 0.001) discard;
}