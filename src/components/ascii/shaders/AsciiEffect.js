import {
  Uniform,
  Texture,
  Color,
  CanvasTexture,
  NearestFilter,
  RepeatWrapping
} from "three";

import { Effect } from "postprocessing";
import { asciiFragmentShader } from "@/components/ascii/shaders/asciiFragment";

import {
  incrementTextureCount,
  decrementTextureCount
} from "@/components/ascii/debugs/asciiDebug";

export class AsciiEffect extends Effect {
  charactersTexture = null;
  depthMapTexture = null;
  framesToSkip = 0;
  visibilityHandler = null;

  constructor(options = {}) {
    const {
      characters = " .:,'-^=*+?!|0#X%WM@",
      fontSize = 54,
      cellSize = 30,
      color = "#ffffff",
      invert = false,
      alphaThreshold = 0.1,
      respectAlpha = true,
      progress = 1,
      colorProgress = 1,
      randomness = 0.3,
      revealDirection = 1,
      revealEnd = 0.85,
      enableGooeyReveal = false,
      gooeyRadius = 0.15,
      gooeySoftness = 0.08,
      gooeyNoiseIntensity = 0.03,
      enableDepthParallax = false,
      parallaxIntensity = 0.02,
      colorDark,
      depthDetailMin = 1,
      revealOrigin = { x: 0.5, y: 0.5 }
    } = options;

    super("ASCIIEffect", asciiFragmentShader, {
      uniforms: new Map([
        ["uCharacters", new Uniform(new Texture())],
        ["uCellSize", new Uniform(cellSize)],
        ["uCharactersCount", new Uniform(characters.length)],
        ["uColor", new Uniform(new Color(color))],
        ["uInvert", new Uniform(invert)],
        ["uAlphaThreshold", new Uniform(alphaThreshold)],
        ["uRespectAlpha", new Uniform(respectAlpha)],
        ["uProgress", new Uniform(progress)],
        ["uColorProgress", new Uniform(colorProgress)],
        ["uRandomness", new Uniform(randomness)],
        ["uRevealDirection", new Uniform(revealDirection)],
        ["uRevealEnd", new Uniform(revealEnd)],
        ["uEnableGooeyReveal", new Uniform(enableGooeyReveal)],
        ["uMouse", new Uniform({ x: -1, y: -1 })],
        ["uGooeyRadius", new Uniform(gooeyRadius)],
        ["uGooeySoftness", new Uniform(gooeySoftness)],
        ["uGooeyNoiseIntensity", new Uniform(gooeyNoiseIntensity)],
        ["uGooeyIntensity", new Uniform(0)],
        ["uScrambleSeed", new Uniform(0)],
        ["uTime", new Uniform(0)],
        ["uHeadTurnAmount", new Uniform(0)],
        ["uDepthMap", new Uniform(new Texture())],
        ["uEnableDepthParallax", new Uniform(enableDepthParallax)],
        ["uParallaxIntensity", new Uniform(parallaxIntensity)],
        ["uParallaxOffset", new Uniform({ x: 0, y: 0 })],
        ["uColorDark", new Uniform(new Color(colorDark ?? color))],
        ["uDepthDetailMin", new Uniform(depthDetailMin)],
        ["uClickPoint", new Uniform({ x: -1, y: -1 })],
        ["uRadialInvert", new Uniform(0)],
        ["uImpactProgress", new Uniform(0)],
        [
          "uRevealOrigin",
          new Uniform({
            x: revealOrigin.x,
            y: revealOrigin.y
          })
        ]
      ])
    });

    const charactersUniform = this.uniforms.get("uCharacters");

    if (charactersUniform) {
      this.charactersTexture = this.createCharactersTexture(
        characters,
        fontSize
      );

      charactersUniform.value = this.charactersTexture;
    }

    if (typeof document !== "undefined") {
      this.visibilityHandler = () => {
        if (document.visibilityState === "visible") {
          this.framesToSkip = 5;
        }
      };

      document.addEventListener(
        "visibilitychange",
        this.visibilityHandler
      );
    }
  }

  dispose() {
    if (
      this.visibilityHandler &&
      typeof document !== "undefined"
    ) {
      document.removeEventListener(
        "visibilitychange",
        this.visibilityHandler
      );

      this.visibilityHandler = null;
    }

    if (this.charactersTexture) {
      this.charactersTexture.dispose();
      this.charactersTexture = null;

      decrementTextureCount();
    }

    if (this.depthMapTexture) {
      this.depthMapTexture.dispose();
      this.depthMapTexture = null;

      decrementTextureCount();
    }

    super.dispose();
  }

  update(renderer, inputBuffer, deltaTime) {
    if (deltaTime === undefined) {
      return;
    }

    if (deltaTime * 1000 > 500) {
      this.framesToSkip = 5;
    }

    if (this.framesToSkip > 0) {
      this.framesToSkip--;
      return;
    }

    const timeUniform = this.uniforms.get("uTime");

    if (timeUniform) {
      const safeDeltaTime = Math.min(deltaTime, 0.033);

      timeUniform.value += safeDeltaTime;

      if (timeUniform.value > 1000) {
        timeUniform.value %= 1000;
      }
    }
  }

  createCharactersTexture(characters, fontSize) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1024;

    const texture = new CanvasTexture(
      canvas,
      undefined,
      RepeatWrapping,
      RepeatWrapping,
      NearestFilter,
      NearestFilter
    );

    const context = canvas.getContext("2d");

    if (!context) {
      throw Error("Context not available");
    }

    const font = `${fontSize}px "Cascadia Mono", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`;

    const draw = () => {
      context.clearRect(0, 0, 1024, 1024);
      context.font = font;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = "#fff";

      for (let index = 0; index < characters.length; index++) {
        const character = characters[index];
        const column = index % 16;
        const row = Math.floor(index / 16);

        if (character) {
          context.fillText(character, 64 * column + 32, 64 * row + 32);
        }
      }

      texture.needsUpdate = true;
    };

    draw();

    if (typeof document !== "undefined" && document.fonts?.load) {
      document.fonts
        .load(font)
        .then(() => {
          draw();
        })
        .catch(() => {});

      setTimeout(() => {
        draw();
      }, 100);
    }

    incrementTextureCount();

    return texture;
  }

  setUniform(name, value) {
    const uniform = this.uniforms.get(name);

    if (uniform) {
      uniform.value = value;
    }
  }

  setColor(color) {
    this.setUniform("uColor", new Color(color));
  }

  setCellSize(size) {
    this.setUniform("uCellSize", size);
  }

  setProgress(progress) {
    this.setUniform("uProgress", progress);
  }

  setColorProgress(progress) {
    this.setUniform("uColorProgress", progress);
  }

  setRandomness(randomness) {
    this.setUniform("uRandomness", randomness);
  }

  setMousePosition(x, y) {
    this.setUniform("uMouse", { x, y });
  }

  setEnableGooeyReveal(enabled) {
    this.setUniform("uEnableGooeyReveal", enabled);
  }

  setGooeyRadius(radius) {
    this.setUniform("uGooeyRadius", radius);
  }

  setGooeySoftness(softness) {
    this.setUniform("uGooeySoftness", softness);
  }

  setGooeyNoiseIntensity(intensity) {
    this.setUniform("uGooeyNoiseIntensity", intensity);
  }

  setScrambleSeed(seed) {
    this.setUniform("uScrambleSeed", seed);
  }

  setGooeyIntensity(intensity) {
    this.setUniform("uGooeyIntensity", intensity);
  }

  setHeadTurnAmount(amount) {
    this.setUniform("uHeadTurnAmount", amount);
  }

  setDepthMap(texture) {
    if (this.depthMapTexture) {
      this.depthMapTexture.dispose();
      decrementTextureCount();
    }

    this.depthMapTexture = texture;
    incrementTextureCount();

    this.setUniform("uDepthMap", texture);
  }

  setEnableDepthParallax(enabled) {
    this.setUniform("uEnableDepthParallax", enabled);
  }

  setParallaxOffset(x, y) {
    this.setUniform("uParallaxOffset", { x, y });
  }

  setParallaxIntensity(intensity) {
    this.setUniform("uParallaxIntensity", intensity);
  }

  setDepthDetailMin(minimum) {
    this.setUniform("uDepthDetailMin", minimum);
  }

  setImpactProgress(progress) {
    this.setUniform("uImpactProgress", progress);
  }

  setRadialInvert(value) {
    this.setUniform("uRadialInvert", value);
  }

  setClickPoint(x, y) {
    this.setUniform("uClickPoint", { x, y });
  }

  setRevealOrigin(x, y) {
    this.setUniform("uRevealOrigin", { x, y });
  }

  setColorDark(color) {
    this.setUniform("uColorDark", new Color(color));
  }
}
