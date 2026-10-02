export const asciiFragmentShader = `
uniform sampler2D uCharacters;
uniform float uCharactersCount;
uniform float uCellSize;
uniform bool uInvert;
uniform vec3 uColor;
uniform float uAlphaThreshold;
uniform bool uRespectAlpha;
uniform float uProgress;
uniform float uColorProgress;
uniform float uRandomness;
uniform float uRevealDirection;
uniform float uRevealEnd;
uniform bool uEnableGooeyReveal;
uniform vec2 uMouse;
uniform float uGooeyRadius;
uniform float uGooeySoftness;
uniform float uGooeyNoiseIntensity;
uniform float uGooeyIntensity;
uniform float uScrambleSeed;
uniform float uTime;
uniform float uHeadTurnAmount;
uniform sampler2D uDepthMap;
uniform bool uEnableDepthParallax;
uniform float uParallaxIntensity;
uniform vec2 uParallaxOffset;
uniform vec3 uColorDark;
uniform float uDepthDetailMin;
uniform vec2 uClickPoint;
uniform float uRadialInvert;
uniform float uImpactProgress;
uniform vec2 uRevealOrigin;

const vec2 SIZE = vec2(16.0);

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

float fbm(vec2 p, float time) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 4; i++) {
        value += amplitude * snoise(p * frequency + time * 0.5);
        amplitude *= 0.5;
        frequency *= 2.0;
    }
    return value;
}

float getLuminance(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 distortedUV = uv;
    float depth = 0.5;
    if (uEnableDepthParallax) {
        depth = texture2D(uDepthMap, uv).r;
        vec2 displacement = uParallaxOffset * depth * uParallaxIntensity;
        distortedUV = uv + displacement;
    }

    vec2 cell = resolution / uCellSize;
    vec2 grid = 1.0 / cell;
    vec2 pixelizedUV = grid * (0.5 + floor(distortedUV / grid));
    vec4 pixelized = texture2D(inputBuffer, pixelizedUV);
    vec4 original = texture2D(inputBuffer, distortedUV);

    if (uRespectAlpha && pixelized.a < uAlphaThreshold) {
        outputColor = vec4(0.0, 0.0, 0.0, 0.0);
        return;
    }

    vec2 cellCoord = floor(uv / grid);
    float gooeyBlend = 0.0;
    if (uEnableGooeyReveal && uGooeyIntensity > 0.01 && uMouse.x > -0.5) {
        vec2 aspect = vec2(resolution.x / resolution.y, 1.0);
        vec2 cellCenterCorrected = pixelizedUV * aspect;
        vec2 mouseCorrected = uMouse * aspect;
        float dist = distance(cellCenterCorrected, mouseCorrected);
        float gooeyRandom = hash(cellCoord) * uGooeyNoiseIntensity * 2.0;
        float timeOffset = sin(uTime * 1.5 + hash(cellCoord * 1.7) * 6.28) * uGooeyNoiseIntensity * 0.3;
        float distortedDist = dist + gooeyRandom + timeOffset;
        float animatedRadius = uGooeyRadius * uGooeyIntensity;
        float softness = uGooeySoftness * uGooeyIntensity * 0.5;
        gooeyBlend = 1.0 - smoothstep(animatedRadius - softness, animatedRadius + softness, distortedDist);
    }

    float luminance = getLuminance(pixelized.rgb);
    luminance = smoothstep(0.0, 1.0, luminance);
    luminance = pow(luminance, 1.3);

    if (uInvert) {
        luminance = 1.0 - luminance;
    }

    float depthDetail = uEnableDepthParallax ? mix(uDepthDetailMin, 1.0, depth) : 1.0;
    float characterIndex = floor((uCharactersCount - 1.0) * depthDetail * clamp(luminance, 0.0, 1.0));

    if (gooeyBlend > 0.0) {
        float scramble = hash(cellCoord + uScrambleSeed);
        characterIndex = floor(mod(characterIndex + scramble * uCharactersCount * luminance, uCharactersCount));
    }

    vec2 characterPosition = vec2(mod(characterIndex, SIZE.x), floor(characterIndex / SIZE.y));
    vec2 offset = vec2(characterPosition.x, -characterPosition.y) / SIZE;
    vec2 charUV = mod(distortedUV * (cell / SIZE), 1.0 / SIZE) - vec2(0., 1.0 / SIZE) + offset;
    vec4 asciiCharacter = texture2D(uCharacters, charUV);

    float charVisibility = asciiCharacter.r;
    float finalAlpha = charVisibility;

    if (uRespectAlpha) {
        finalAlpha *= smoothstep(uAlphaThreshold, uAlphaThreshold + 0.2, pixelized.a);
    }

    float visibility = 1.0;
    float colorBlend = 1.0;
    float ripple = 0.0;
    float rawNormDist = 0.0;

    vec2 originCell = uRevealOrigin * cell;
    vec2 revealDiff = cellCoord - originCell;
    float revealDist = length(revealDiff);
    float rd1 = length(vec2(0.0, 0.0) - originCell);
    float rd2 = length(vec2(cell.x, 0.0) - originCell);
    float rd3 = length(vec2(0.0, cell.y) - originCell);
    float rd4 = length(cell - originCell);
    float revealMaxDist = max(max(rd1, rd2), max(rd3, rd4));
    float revealNormDist = revealDist / max(revealMaxDist, 1.0);
    float cellRandom = hash(cellCoord) * uRandomness * 0.15;
    float revealThreshold = revealNormDist + cellRandom + 0.06;

    float revealScale = 1.0 + uRandomness * 0.3 + 0.1;
    float scaledProgress = uProgress * revealScale;
    float visibilityRaw = smoothstep(scaledProgress - 0.05, scaledProgress + 0.05, revealThreshold);
    visibility = 1.0 - visibilityRaw;

    float visRippleDist = revealThreshold - scaledProgress;
    float visRipple = exp(-visRippleDist * visRippleDist * 180.0);

    if (uClickPoint.x >= 0.0) {
      vec2 clickCell = uClickPoint * cell;
      vec2 diff = cellCoord - clickCell;
      float dist = length(diff);
      float d1 = length(vec2(0.0, 0.0) - clickCell);
      float d2 = length(vec2(cell.x, 0.0) - clickCell);
      float d3 = length(vec2(0.0, cell.y) - clickCell);
      float d4 = length(cell - clickCell);
      float maxDist = max(max(d1, d2), max(d3, d4));
      float normDist = dist / max(maxDist, 1.0);
      rawNormDist = normDist;
      
      if (uRadialInvert > 0.5) {
        normDist = 1.0 - normDist;
      }
      
      float radialRandom = hash(cellCoord) * uRandomness * 0.15;
      float radialThreshold = normDist + radialRandom;
      float radialScale = 1.0 + uRandomness * 0.3;
      float scaledRadial = uColorProgress * radialScale;
      float radialRaw = smoothstep(scaledRadial - 0.05, scaledRadial + 0.05, radialThreshold);
      colorBlend = 1.0 - radialRaw;

      float rippleDist = radialThreshold - scaledRadial;
      ripple = exp(-rippleDist * rippleDist * 180.0) * max(0.0, 1.0 - rawNormDist * 0.7);
    } else {
      float scaledColorProgress = uColorProgress * revealScale;
      float colorRaw = smoothstep(scaledColorProgress - 0.05, scaledColorProgress + 0.05, revealThreshold);
      colorBlend = 1.0 - colorRaw;

      float colorRippleDist = revealThreshold - scaledColorProgress;
      ripple = exp(-colorRippleDist * colorRippleDist * 180.0);
    }

    ripple += visRipple;

    finalAlpha *= visibility;
    vec3 targetColor = mix(uColorDark, uColor, luminance);
    vec3 finalColor = mix(pixelized.rgb, targetColor, colorBlend);

    if (ripple > 0.01) {
      finalColor += ripple * 0.35;
    }

    if (uClickPoint.x >= 0.0 && uImpactProgress > 0.0 && uImpactProgress < 1.0) {
      float impactRadius = 0.03 + uImpactProgress * 0.18;
      float impactFade = 1.0 - uImpactProgress;
      float impact = impactFade * exp(-rawNormDist * rawNormDist / (2.0 * impactRadius * impactRadius));
      finalColor += impact * 0.35;
    }

    if (gooeyBlend > 0.0) {
      float sharpBlend = smoothstep(0.0, 0.15, gooeyBlend);
      vec3 gooeyTarget = mix(targetColor, original.rgb, colorBlend);
      vec3 blendedColor = mix(finalColor, gooeyTarget, sharpBlend);
      outputColor = vec4(blendedColor * finalAlpha, finalAlpha);
      return;
    }

    outputColor = vec4(finalColor * finalAlpha, finalAlpha);
}
\`;
