/**
 * Modern Color Scheme Module
 * 
 * An ES Module for generating harmonious color schemes with extended functionality.
 * Based on the original color-scheme-js by c0bra.
 */

// Predefined schemes available to generate color combinations
const SCHEMES = {
  mono: true,
  monochromatic: true,
  contrast: true,
  triade: true,
  tetrade: true,
  analogic: true,
  splitComplement: true,
  square: true,
  phi: true,  // Golden ratio based scheme
  shades: true,
  tints: true,
  chaos: true,  // Adds random variations
  seasons: true, // Seasonal color transitions
  gradient: true, // Linear gradient between two colors
  perlin: true   // Perlin noise based color scheme
};

// Predefined presets for color variations
const PRESETS = {
  default: [-1, -1, 1, -0.7, 0.25, 1, 0.5, 1],
  pastel: [0.5, -0.9, 0.5, 0.5, 0.1, 0.9, 0.75, 0.75],
  soft: [0.3, -0.8, 0.3, 0.5, 0.1, 0.9, 0.5, 0.75],
  light: [0.25, 1, 0.5, 0.75, 0.1, 1, 0.5, 1],
  hard: [1, -1, 1, -0.6, 0.1, 1, 0.6, 1],
  pale: [0.1, -0.85, 0.1, 0.5, 0.1, 1, 0.1, 0.75],
  // Extended presets
  vibrant: [1, 1, 1, 0.8, 0.3, 1, 0.7, 1],
  muted: [0.2, -0.8, 0.2, 0.4, 0.1, 0.8, 0.3, 0.7]
};

// Color wheel with RGB values and saturation for different hue angles
const COLOR_WHEEL = {
  0: [255, 0, 0, 100],
  15: [255, 51, 0, 100],
  30: [255, 102, 0, 100],
  45: [255, 128, 0, 100],
  60: [255, 153, 0, 100],
  75: [255, 178, 0, 100],
  90: [255, 204, 0, 100],
  105: [255, 229, 0, 100],
  120: [255, 255, 0, 100],
  135: [204, 255, 0, 100],
  150: [153, 255, 0, 100],
  165: [51, 255, 0, 100],
  180: [0, 204, 0, 80],
  195: [0, 178, 102, 70],
  210: [0, 153, 153, 60],
  225: [0, 102, 178, 70],
  240: [0, 51, 204, 80],
  255: [25, 25, 178, 70],
  270: [51, 0, 153, 60],
  285: [64, 0, 153, 60],
  300: [102, 0, 153, 60],
  315: [153, 0, 153, 60],
  330: [204, 0, 153, 80],
  345: [229, 0, 102, 90]
};

/**
 * Helper function to check if value is an array
 * @param {*} value - Value to check
 * @returns {boolean} - True if value is an array
 */
const isArray = (value) => Array.isArray(value) || Object.prototype.toString.call(value) === '[object Array]';

/**
 * Helper function to create a deep clone of an object
 * @param {*} obj - Object to clone
 * @returns {*} - Cloned object
 */
const clone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof RegExp) {
    let flags = '';
    if (obj.global) flags += 'g';
    if (obj.ignoreCase) flags += 'i';
    if (obj.multiline) flags += 'm';
    if (obj.sticky) flags += 'y';
    return new RegExp(obj.source, flags);
  }
  
  const newInstance = new obj.constructor();
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newInstance[key] = clone(obj[key]);
    }
  }
  return newInstance;
};

/**
 * Simple hash function for deterministic randomness
 * @param {string} str - String to hash
 * @returns {number} - Hash value
 */
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

/**
 * Simple Perlin noise-like function
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} seed - Random seed
 * @returns {number} - Noise value between 0 and 1
 */
const simpleNoise = (x, y, seed = 0) => {
  // Simple octave noise approximation
  const rand = (x, y, s) => {
    return (Math.sin(x * 12.9898 + y * 78.233 + s) * 43758.5453) % 1;
  };
  
  // Grid coordinates
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = x0 + 1;
  const y1 = y0 + 1;
  
  // Interpolation weights
  const sx = x - x0;
  const sy = y - y0;
  
  // Sample grid points
  const n00 = rand(x0, y0, seed);
  const n01 = rand(x0, y1, seed);
  const n10 = rand(x1, y0, seed);
  const n11 = rand(x1, y1, seed);
  
  // Interpolate
  const ix0 = n00 * (1 - sx) + n10 * sx;
  const ix1 = n01 * (1 - sx) + n11 * sx;
  
  return ix0 * (1 - sy) + ix1 * sy;
};

/**
 * MutableColor class for handling color transformations
 */
class MutableColor {
  /**
   * Create a new MutableColor
   * @param {number} hue - Initial hue value (0-359)
   */
  constructor(hue) {
    if (hue == null) {
      // Default to a random hue if none is provided
      hue = Math.floor(Math.random() * 360);
    }
    
    this.hue = 0;
    this.saturation = [];
    this.value = [];
    this.base_red = 0;
    this.base_green = 0;
    this.base_blue = 0;
    this.base_saturation = 0;
    this.base_value = 0;
    
    this.set_hue(hue);
    this.set_variant_preset(PRESETS.default);
  }

  /**
   * Get the current hue value
   * @returns {number} - Hue value (0-359)
   */
  get_hue() {
    return this.hue;
  }

  /**
   * Set the hue value and update base colors
   * @param {number} h - Hue value (0-359)
   */
  set_hue(h) {
    const avrg = (a, b, k) => a + Math.round((b - a) * k);
    
    this.hue = Math.round(h % 360);
    const d = this.hue % 15 + (this.hue - Math.floor(this.hue));
    const k = d / 15;
    
    const derivative1 = this.hue - Math.floor(d);
    const derivative2 = (derivative1 + 15) % 360;
    
    // Ensure derivatives are valid keys in the COLOR_WHEEL
    // Map to nearest valid key if not found
    const findNearestKey = (key) => {
      if (COLOR_WHEEL[key]) return key;
      
      const keys = Object.keys(COLOR_WHEEL).map(Number).sort((a, b) => a - b);
      let nearestKey = keys[0];
      let minDiff = Math.abs(key - nearestKey);
      
      for (const validKey of keys) {
        const diff = Math.abs(key - validKey);
        if (diff < minDiff) {
          minDiff = diff;
          nearestKey = validKey;
        }
      }
      
      return nearestKey;
    };
    
    const safeKey1 = findNearestKey(derivative1);
    const safeKey2 = findNearestKey(derivative2);
    
    const colorset1 = COLOR_WHEEL[safeKey1];
    const colorset2 = COLOR_WHEEL[safeKey2];
    
    const en = { red: 0, green: 1, blue: 2, value: 3 };
    
    for (const color in en) {
      const i = en[color];
      this[`base_${color}`] = avrg(colorset1[i], colorset2[i], k);
    }
    
    this.base_saturation = avrg(100, 100, k) / 100;
    this.base_value /= 100;
  }

  /**
   * Rotate the hue by a specific angle
   * @param {number} angle - Angle to rotate by
   */
  rotate(angle) {
    const newhue = (this.hue + angle) % 360;
    return this.set_hue(newhue);
  }

  /**
   * Get saturation for a specific variation
   * @param {number} variation - Variation index
   * @returns {number} - Saturation value (0-1)
   */
  get_saturation(variation) {
    const x = this.saturation[variation];
    let s = x < 0 ? -x * this.base_saturation : x;
    
    if (s > 1) s = 1;
    if (s < 0) s = 0;
    
    return s;
  }

  /**
   * Get value (brightness) for a specific variation
   * @param {number} variation - Variation index
   * @returns {number} - Value (0-1)
   */
  get_value(variation) {
    const x = this.value[variation];
    let v = x < 0 ? -x * this.base_value : x;
    
    if (v > 1) v = 1;
    if (v < 0) v = 0;
    
    return v;
  }

  /**
   * Set variant parameters for saturation and value
   * @param {number} variation - Variation index
   * @param {number} s - Saturation parameter
   * @param {number} v - Value parameter
   */
  set_variant(variation, s, v) {
    this.saturation[variation] = s;
    this.value[variation] = v;
  }

  /**
   * Set variant preset for all variations
   * @param {number[]} p - Preset array of parameters
   */
  set_variant_preset(p) {
    for (let i = 0; i <= 3; i++) {
      this.set_variant(i, p[2 * i], p[2 * i + 1]);
    }
  }

  /**
   * Get hexadecimal color value for a variation
   * @param {boolean} web_safe - Whether to use web-safe colors
   * @param {number} variation - Variation index
   * @returns {string} - Hexadecimal color code (without #)
   */
  get_hex(web_safe, variation) {
    const colors = ['red', 'green', 'blue'];
    const baseColors = colors.map(color => this[`base_${color}`]);
    const max = Math.max(...baseColors);
    const min = Math.min(...baseColors);
    
    const v = (variation < 0 ? this.base_value : this.get_value(variation)) * 255;
    const s = variation < 0 ? this.base_saturation : this.get_saturation(variation);
    const k = max > 0 ? v / max : 0;
    
    const rgb = [];
    for (const color of colors) {
      const rgbVal = Math.min(255, Math.round(v - (v - this[`base_${color}`] * k) * s));
      rgb.push(rgbVal);
    }
    
    // Apply web-safe conversion if requested
    const finalRgb = web_safe ? rgb.map(c => Math.round(c / 51) * 51) : rgb;
    
    // Convert to hex
    return finalRgb.map(i => {
      const str = i.toString(16);
      return str.length < 2 ? '0' + str : str;
    }).join('');
  }
}

/**
 * Main ColorScheme class - creates color schemes based on configurable parameters
 */
export class ColorScheme {
  /**
   * Create a new ColorScheme instance
   * @param {Object} options - Configuration options
   * @param {number} [options.colorCount=4] - Number of colors to generate (2-16)
   */
  constructor(options = {}) {
    const { colorCount = 4 } = options;
    
    // Validate color count
    this.colorCount = Math.min(16, Math.max(2, colorCount));
    
    // Initialize colors array with MutableColor instances
    this.colors = Array.from({ length: this.colorCount }, () => new MutableColor(60));
    
    this._scheme = 'mono';
    this._distance = 0.5;
    this._web_safe = false;
    this._add_complement = false;
    this._saturation_adjustment = 0; // -1 to 1, where -1 is completely desaturated
    this._seedValue = Date.now(); // Random seed for noise-based schemes
  }

  /**
   * Generate color scheme and return hexadecimal color codes
   * @returns {string[]} - Array of hexadecimal color codes (without #)
   */
  getColors() {
    const h = this.colors[0].get_hue();
    const step = 360 / this.colorCount;
    let usedColors = 1;
    
    // Apply the color scheme
    const dispatch = {
      mono: () => {
        // Monochromatic - all colors have the same hue
        usedColors = 1;
      },
      
      contrast: () => {
        // High contrast colors
        usedColors = Math.min(2, this.colorCount);
        
        if (usedColors >= 2) {
          this.colors[1].set_hue(h);
          this.colors[1].rotate(180);
        }
      },
      
      triade: () => {
        // Three colors evenly distributed
        usedColors = Math.min(3, this.colorCount);
        const dif = 60 * this._distance;
        
        if (usedColors >= 2) {
          this.colors[1].set_hue(h);
          this.colors[1].rotate(180 - dif);
        }
        
        if (usedColors >= 3) {
          this.colors[2].set_hue(h);
          this.colors[2].rotate(180 + dif);
        }
      },
      
      tetrade: () => {
        // Four colors forming a rectangle on the color wheel
        usedColors = Math.min(4, this.colorCount);
        const dif = 90 * this._distance;
        
        if (usedColors >= 2) {
          this.colors[1].set_hue(h);
          this.colors[1].rotate(180);
        }
        
        if (usedColors >= 3) {
          this.colors[2].set_hue(h);
          this.colors[2].rotate(180 + dif);
        }
        
        if (usedColors >= 4) {
          this.colors[3].set_hue(h);
          this.colors[3].rotate(dif);
        }
      },
      
      analogic: () => {
        // Analogous colors plus optional complement
        usedColors = this._add_complement ? Math.min(4, this.colorCount) : Math.min(3, this.colorCount);
        const dif = 60 * this._distance;
        
        if (usedColors >= 2) {
          this.colors[1].set_hue(h);
          this.colors[1].rotate(dif);
        }
        
        if (usedColors >= 3) {
          this.colors[2].set_hue(h);
          this.colors[2].rotate(360 - dif);
        }
        
        if (usedColors >= 4 && this._add_complement) {
          this.colors[3].set_hue(h);
          this.colors[3].rotate(180);
        }
      },
      
      splitComplement: () => {
        // Split complementary: base color plus two colors adjacent to its complement
        usedColors = Math.min(3, this.colorCount);
        const dif = 30 * this._distance;
        
        if (usedColors >= 2) {
          this.colors[1].set_hue(h);
          this.colors[1].rotate(180 - dif);
        }
        
        if (usedColors >= 3) {
          this.colors[2].set_hue(h);
          this.colors[2].rotate(180 + dif);
        }
      },
      
      square: () => {
        // Square: four colors evenly spaced around the color wheel (90° apart)
        usedColors = Math.min(4, this.colorCount);
        
        if (usedColors >= 2) {
          this.colors[1].set_hue(h);
          this.colors[1].rotate(90);
        }
        
        if (usedColors >= 3) {
          this.colors[2].set_hue(h);
          this.colors[2].rotate(180);
        }
        
        if (usedColors >= 4) {
          this.colors[3].set_hue(h);
          this.colors[3].rotate(270);
        }
      },
      
      phi: () => {
        // Golden ratio (phi) scheme: colors spaced by the golden angle (137.5°)
        // This creates a naturally harmonious distribution
        const goldenAngle = 137.5;
        usedColors = Math.min(this.colorCount, 5);  // Up to 5 golden ratio colors
        
        for (let i = 1; i < usedColors; i++) {
          this.colors[i].set_hue(h);
          this.colors[i].rotate(goldenAngle * i);
        }
      },
      
      shades: () => {
        // Shades: Progressively darker versions of the base color
        // We'll use a single hue with decreasing brightness
        usedColors = Math.min(this.colorCount, 5);
        
        // Create a custom preset for darker shades
        const shadePreset = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2];
        
        for (let i = 0; i < usedColors; i++) {
          this.colors[i].set_hue(h);
          // Set custom saturation and value parameters
          for (let j = 0; j <= 3; j++) {
            const valueAdjustment = 1 - (i * 0.15);  // Decrease value for darker shades
            this.colors[i].set_variant(j, 0.9, shadePreset[j] * valueAdjustment);
          }
        }
      },
      
      tints: () => {
        // Tints: Progressively lighter versions of the base color
        // We'll use a single hue with increasing brightness and lower saturation
        usedColors = Math.min(this.colorCount, 5);
        
        // Create a custom preset for lighter tints
        const tintPreset = [0.3, 0.95, 0.5, 0.9, 0.7, 0.85, 0.9, 0.8];
        
        for (let i = 0; i < usedColors; i++) {
          this.colors[i].set_hue(h);
          // Set custom saturation and value parameters
          for (let j = 0; j <= 3; j++) {
            const satAdjustment = 0.9 - (i * 0.15);  // Decrease saturation for lighter tints
            this.colors[i].set_variant(j, tintPreset[j] * satAdjustment, tintPreset[j + 1]);
          }
        }
      },
      
      // NEW SCHEMES
      
      chaos: () => {
        // Chaos: Semi-random colors with some relationship
        // Uses deterministic randomness based on seed value
        usedColors = this.colorCount;
        const seed = this._seedValue;
        
        // Use the base hue to anchor the randomness
        const baseHue = h;
        
        for (let i = 0; i < usedColors; i++) {
          // Create controlled chaos with some relationship to the base color
          const hashValue = simpleHash(`${seed}-${i}-${baseHue}`);
          const randomOffset = (hashValue % 240) - 120; // -120 to +120 degrees
          
          // Keep some relationship to the original color
          this.colors[i].set_hue((baseHue + randomOffset) % 360);
          
          // Also vary saturation and value for each color
          const randomSatFactor = 0.5 + (hashValue % 100) / 200; // 0.5 to 1.0
          const randomValFactor = 0.5 + (hashValue % 150) / 300; // 0.5 to 1.0
          
          for (let j = 0; j <= 3; j++) {
            const baseSat = this.colors[i].get_saturation(j);
            const baseVal = this.colors[i].get_value(j);
            this.colors[i].set_variant(j, baseSat * randomSatFactor, baseVal * randomValFactor);
          }
        }
      },
      
      seasons: () => {
        // Seasons: Colors inspired by seasonal transitions
        // Spring (green/pink), Summer (yellow/blue), Fall (orange/brown), Winter (blue/white)
        usedColors = Math.min(this.colorCount, 4);
        
        const seasonHues = [
          90,  // Spring - green
          60,  // Summer - yellow/gold
          30,  // Fall - orange/brown
          210  // Winter - cool blue
        ];
        
        const seasonSaturation = [
          [0.7, 0.9, 0.6, 0.8],  // Spring - medium-high saturation
          [0.8, 0.9, 0.7, 0.8],  // Summer - high saturation
          [0.9, 0.7, 0.8, 0.6],  // Fall - varying saturation
          [0.4, 0.3, 0.5, 0.2]   // Winter - low saturation
        ];
        
        const seasonValue = [
          [0.9, 0.7, 0.8, 0.9],  // Spring - bright
          [0.9, 0.8, 1.0, 0.7],  // Summer - very bright
          [0.7, 0.6, 0.5, 0.8],  // Fall - medium brightness
          [0.9, 1.0, 0.8, 0.9]   // Winter - bright (for snow effect)
        ];
        
        // Base hue affects the seasonal colors
        const hueShift = Math.floor(h / 30) * 10; // Use base hue to shift the seasonal palette
        
        for (let i = 0; i < usedColors; i++) {
          // Set the base seasonal hue with some influence from the base color
          this.colors[i].set_hue((seasonHues[i] + hueShift) % 360);
          
          // Set seasonal saturation and value
          for (let j = 0; j <= 3; j++) {
            this.colors[i].set_variant(j, seasonSaturation[i][j], seasonValue[i][j]);
          }
        }
      },
      
      gradient: () => {
        // Gradient: Linear transition between two colors
        usedColors = this.colorCount;
        
        // Start with the base hue
        const startHue = h;
        // End with a color that's different but not opposite
        const endHue = (h + 90 + (h % 90)) % 360;
        
        for (let i = 0; i < usedColors; i++) {
          // Calculate interpolation factor
          const factor = usedColors > 1 ? i / (usedColors - 1) : 0;
          
          // Linear interpolation between start and end hues
          // Using the shorter path around the color wheel
          let hueDistance = endHue - startHue;
          if (Math.abs(hueDistance) > 180) {
            hueDistance = hueDistance > 0 ? hueDistance - 360 : hueDistance + 360;
          }
          
          const newHue = (startHue + hueDistance * factor + 360) % 360;
          this.colors[i].set_hue(newHue);
          
          // Also interpolate saturation and value
          const startSat = 0.7;
          const endSat = 0.9;
          const startVal = 0.8;
          const endVal = 0.6;
          
          for (let j = 0; j <= 3; j++) {
            const interpolatedSat = startSat + (endSat - startSat) * factor;
            const interpolatedVal = startVal + (endVal - startVal) * factor;
            this.colors[i].set_variant(j, interpolatedSat, interpolatedVal);
          }
        }
      },
      
      perlin: () => {
        // Perlin: Colors based on perlin-like noise
        // Creates an organic, flowing pattern of colors
        usedColors = this.colorCount;
        const seed = this._seedValue;
        
        // Base the noise pattern around the starting hue
        const baseHue = h;
        
        for (let i = 0; i < usedColors; i++) {
          // Use noise function to generate organic variations
          // Map i to x,y coordinates on a circle for more interesting patterns
          const angle = (i / usedColors) * Math.PI * 2;
          const x = Math.cos(angle);
          const y = Math.sin(angle);
          
          // Generate noise values for hue, saturation, and value
          const noiseHue = simpleNoise(x, y, seed);
          const noiseSat = simpleNoise(x + 100, y + 100, seed);
          const noiseVal = simpleNoise(x + 200, y + 200, seed);
          
          // Map noise to hue variations (limit range to avoid chaotic colors)
          const hueOffset = noiseHue * 120 - 60; // -60 to +60 degrees
          this.colors[i].set_hue((baseHue + hueOffset + 360) % 360);
          
          // Set saturation and value based on noise
          for (let j = 0; j <= 3; j++) {
            const saturation = 0.5 + noiseSat * 0.5; // 0.5 to 1.0
            const value = 0.6 + noiseVal * 0.4; // 0.6 to 1.0
            this.colors[i].set_variant(j, saturation, value);
          }
        }
      }
    };
    
    // Set monochromatic as an alias for mono
    dispatch.monochromatic = dispatch.mono;
    
    // Execute the selected scheme
    if (dispatch[this._scheme]) {
      dispatch[this._scheme]();
    } else {
      throw new Error(`Unknown color scheme name: ${this._scheme}`);
    }
    
    // For additional colors beyond the scheme's natural count,
    // distribute evenly around the color wheel
    for (let i = usedColors; i < this.colorCount; i++) {
      this.colors[i].set_hue(h);
      this.colors[i].rotate((360 / (this.colorCount - usedColors)) * (i - usedColors + 1));
    }
    
    // Generate all color variations
    const output = [];
    for (let i = 0; i < this.colorCount; i++) {
      // For each color, generate 4 variations (or fewer based on options)
      for (let j = 0; j <= 3; j++) {
        output.push(this.colors[i].get_hex(this._web_safe, j));
      }
    }
    
    // Apply saturation adjustment if set
    if (this._saturation_adjustment !== 0) {
      return this._adjustSaturation(output);
    }
    
    return output;
  }

  /**
   * Group colors into sets of 4 variations per color
   * @returns {string[][]} - Array of color groups, each with 4 variations
   */
  getColorSet() {
    const flatColors = clone(this.getColors());
    const groupedColors = [];
    
    while (flatColors.length > 0) {
      groupedColors.push(flatColors.splice(0, 4));
    }
    
    return groupedColors;
  }

  /**
   * Set the base hue for the color scheme
   * @param {number} h - Hue value (0-359)
   * @returns {ColorScheme} - This instance for chaining
   */
  fromHue(h) {
    if (h == null) {
      // Default to a random hue if none is provided
      h = Math.floor(Math.random() * 360);
    }
    
    this.colors[0].set_hue(h);
    return this;
  }

  /**
   * Convert RGB to HSV color space
   * @param {number[]} rgb - RGB values (0-1)
   * @returns {number[]} - HSV values [hue (0-359), saturation (0-1), value (0-1)]
   */
  rgb2hsv(...rgb) {
    if (rgb[0] != null && isArray(rgb[0])) {
      rgb = rgb[0];
    }
    
    const [r, g, b] = rgb;
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const d = max - min;
    const v = max;
    
    let s, h;
    
    if (d > 0) {
      s = d / max;
    } else {
      return [0, 0, v];
    }
    
    if (r === max) {
      h = (g - b) / d;
    } else if (g === max) {
      h = 2 + (b - r) / d;
    } else {
      h = 4 + (r - g) / d;
    }
    
    h *= 60;
    h %= 360;
    
    return [h, s, v];
  }

  /**
   * Set base color from a hexadecimal color code
   * @param {string} hex - Hexadecimal color (without #)
   * @returns {ColorScheme} - This instance for chaining
   */
  fromHex(hex) {
    if (hex == null) {
      throw new Error("fromHex needs an argument");
    }
    
    if (!/^([0-9A-F]{2}){3}$/i.test(hex)) {
      throw new Error(`fromHex(${hex}) - argument must be in the form of RRGGBB`);
    }
    
    const rgbcap = /(..)(..)(..)/.exec(hex).slice(1, 4);
    const [r, g, b] = rgbcap.map(num => parseInt(num, 16));
    
    const hsv = this.rgb2hsv([r, g, b].map(i => i / 255));
    
    const h0 = hsv[0];
    let h1 = 0;
    let h2 = 1000;
    let i1 = null;
    let i2 = null;
    
    // Find closest hues in color wheel
    const wheelKeys = Object.keys(COLOR_WHEEL).sort((a, b) => a - b);
    
    for (const i of wheelKeys) {
      const c = COLOR_WHEEL[i];
      const hsv1 = this.rgb2hsv(c.slice(0, 3).map(i => i / 255));
      const h = hsv1[0];
      
      if (h >= h1 && h <= h0) {
        h1 = h;
        i1 = i;
      }
      
      if (h <= h2 && h >= h0) {
        h2 = h;
        i2 = i;
      }
    }
    
    if (h2 === 0 || h2 > 360) {
      h2 = 360;
      i2 = 360;
    }
    
    const k = h2 !== h1 ? (h0 - h1) / (h2 - h1) : 0;
    const h = Math.round(parseInt(i1) + k * (parseInt(i2) - parseInt(i1))) % 360;
    
    const s = hsv[1];
    const v = hsv[2];
    
    this.fromHue(h);
    this._set_variant_preset([s, v, s, v * 0.7, s * 0.25, 1, s * 0.5, 1]);
    
    return this;
  }

  /**
   * Set whether to include complementary colors in analogic scheme
   * @param {boolean} b - Whether to add complement
   * @returns {ColorScheme} - This instance for chaining
   */
  addComplement(b) {
    if (b == null) {
      throw new Error("addComplement needs an argument");
    }
    
    this._add_complement = b;
    return this;
  }

  /**
   * Set whether colors should be web-safe
   * @param {boolean} b - Whether to use web-safe colors
   * @returns {ColorScheme} - This instance for chaining
   */
  useWebSafe(b) {
    if (b == null) {
      throw new Error("useWebSafe needs an argument");
    }
    
    this._web_safe = b;
    return this;
  }

  /**
   * Set distance between colors in schemes
   * @param {number} d - Distance (0-1)
   * @returns {ColorScheme} - This instance for chaining
   */
  setDistance(d) {
    if (d == null) {
      throw new Error("setDistance needs an argument");
    }
    
    if (d < 0) {
      throw new Error(`setDistance(${d}) - argument must be >= 0`);
    }
    
    if (d > 1) {
      throw new Error(`setDistance(${d}) - argument must be <= 1`);
    }
    
    this._distance = d;
    return this;
  }

  /**
   * Set the color scheme to use
   * @param {string} name - Scheme name
   * @returns {ColorScheme} - This instance for chaining
   */
  setScheme(name) {
    if (name == null) {
      throw new Error("setScheme needs an argument");
    }
    
    if (!SCHEMES[name]) {
      throw new Error(`'${name}' isn't a valid scheme name`);
    }
    
    this._scheme = name;
    return this;
  }

  /**
   * Set the color variation preset
   * @param {string} v - Preset name
   * @returns {ColorScheme} - This instance for chaining
   */
  setVariation(v) {
    if (v == null) {
      throw new Error("setVariation needs an argument");
    }
    
    if (!PRESETS[v]) {
      throw new Error(`'${v}' isn't a valid variation name`);
    }
    
    this._set_variant_preset(PRESETS[v]);
    return this;
  }
  
  /**
   * Set random seed value for noise-based schemes
   * @param {number} seed - Seed value
   * @returns {ColorScheme} - This instance for chaining
   */
  setSeed(seed) {
    this._seedValue = seed;
    return this;
  }

  /**
   * Apply variant preset to all colors
   * @param {number[]} p - Preset parameters
   * @private
   */
  _set_variant_preset(p) {
    for (const color of this.colors) {
      color.set_variant_preset(p);
    }
  }

  /**
   * Adjust the saturation of all colors
   * @param {number} amount - Adjustment amount (-1 to 1)
   * @returns {ColorScheme} - This instance for chaining
   */
  adjustSaturation(amount) {
    this._saturation_adjustment = Math.max(-1, Math.min(1, amount));
    return this;
  }

  /**
   * Desaturate colors by a given amount
   * @param {number} amount - Amount to desaturate (0-1)
   * @returns {ColorScheme} - This instance for chaining
   */
  desaturate(amount) {
    return this.adjustSaturation(-Math.abs(amount));
  }

  /**
   * Increase saturation by a given amount
   * @param {number} amount - Amount to saturate (0-1)
   * @returns {ColorScheme} - This instance for chaining
   */
  saturate(amount) {
    return this.adjustSaturation(Math.abs(amount));
  }

  /**
   * Adjust saturation of hex colors
   * @param {string[]} hexColors - Array of hex color codes
   * @returns {string[]} - Adjusted hex color codes
   * @private
   */
  _adjustSaturation(hexColors) {
    return hexColors.map(hex => {
      // Convert hex to RGB
      const r = parseInt(hex.substr(0, 2), 16) / 255;
      const g = parseInt(hex.substr(2, 2), 16) / 255;
      const b = parseInt(hex.substr(4, 2), 16) / 255;
      
      // Convert RGB to HSV
      const [h, s, v] = this.rgb2hsv(r, g, b);
      
      // Adjust saturation
      let newS = s + this._saturation_adjustment;
      newS = Math.max(0, Math.min(1, newS));
      
      // Convert back to RGB
      const c = v * newS;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = v - c;
      
      let r1, g1, b1;
      
      if (h < 60) {
        [r1, g1, b1] = [c, x, 0];
      } else if (h < 120) {
        [r1, g1, b1] = [x, c, 0];
      } else if (h < 180) {
        [r1, g1, b1] = [0, c, x];
      } else if (h < 240) {
        [r1, g1, b1] = [0, x, c];
      } else if (h < 300) {
        [r1, g1, b1] = [x, 0, c];
      } else {
        [r1, g1, b1] = [c, 0, x];
      }
      
      // Convert back to hex
      const toHex = (value) => {
        const hex = Math.round((value + m) * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };
      
      return toHex(r1) + toHex(g1) + toHex(b1);
    });
  }
  
  /**
   * Set the number of colors to generate
   * @param {number} count - Number of colors (2-16)
   * @returns {ColorScheme} - This instance for chaining
   */
  setColorCount(count) {
    const newCount = Math.min(16, Math.max(2, count));
    
    if (newCount > this.colorCount) {
      // Add more colors
      for (let i = this.colorCount; i < newCount; i++) {
        this.colors.push(new MutableColor(60));
      }
    } else if (newCount < this.colorCount) {
      // Remove excess colors
      this.colors = this.colors.slice(0, newCount);
    }
    
    this.colorCount = newCount;
    return this;
  }
}

// Default export
export default ColorScheme;