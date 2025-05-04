# Color Scheme API Documentation

This document provides detailed API information for the `color-scheme.js` module, which generates harmonious color schemes with extended functionality.

## Table of Contents

- [Helper Functions](#helper-functions)
- [MutableColor Class](#mutablecolor-class)
- [ColorScheme Class](#colorscheme-class)

## Helper Functions

### isArray(value)

Checks if a value is an array.

**Parameters:**
- `value` (*): The value to check

**Returns:**
- `boolean`: True if the value is an array

### clone(obj)

Creates a deep clone of an object.

**Parameters:**
- `obj` (*): The object to clone

**Returns:**
- `*`: A deep clone of the input object

## MutableColor Class

The `MutableColor` class handles color transformations and is used internally by the `ColorScheme` class.

### constructor(hue)

Creates a new MutableColor instance.

**Parameters:**
- `hue` (number): Initial hue value (0-359)

**Throws:**
- Error if no hue is specified

### get_hue()

Gets the current hue value.

**Returns:**
- `number`: Hue value (0-359)

### set_hue(h)

Sets the hue value and updates base colors.

**Parameters:**
- `h` (number): Hue value (0-359)

### rotate(angle)

Rotates the hue by a specific angle.

**Parameters:**
- `angle` (number): Angle to rotate by

### get_saturation(variation)

Gets saturation for a specific variation.

**Parameters:**
- `variation` (number): Variation index

**Returns:**
- `number`: Saturation value (0-1)

### get_value(variation)

Gets value (brightness) for a specific variation.

**Parameters:**
- `variation` (number): Variation index

**Returns:**
- `number`: Value (0-1)

### set_variant(variation, s, v)

Sets variant parameters for saturation and value.

**Parameters:**
- `variation` (number): Variation index
- `s` (number): Saturation parameter
- `v` (number): Value parameter

### set_variant_preset(p)

Sets variant preset for all variations.

**Parameters:**
- `p` (number[]): Preset array of parameters

### get_hex(web_safe, variation)

Gets hexadecimal color value for a variation.

**Parameters:**
- `web_safe` (boolean): Whether to use web-safe colors
- `variation` (number): Variation index

**Returns:**
- `string`: Hexadecimal color code (without #)

## ColorScheme Class

The main class for creating color schemes based on configurable parameters.

### constructor(options)

Creates a new ColorScheme instance.

**Parameters:**
- `options` (Object): Configuration options
  - `colorCount` (number, optional): Number of colors to generate (2-16), defaults to 4

### getColors()

Generates color scheme and returns hexadecimal color codes.

**Returns:**
- `string[]`: Array of hexadecimal color codes (without #)

### getColorSet()

Groups colors into sets of 4 variations per color.

**Returns:**
- `string[][]`: Array of color groups, each with 4 variations

### fromHue(h)

Sets the base hue for the color scheme.

**Parameters:**
- `h` (number): Hue value (0-359)

**Returns:**
- `ColorScheme`: This instance for chaining

**Throws:**
- Error if no argument is provided

### rgb2hsv(...rgb)

Converts RGB to HSV color space.

**Parameters:**
- `rgb` (number[]): RGB values (0-1)

**Returns:**
- `number[]`: HSV values [hue (0-359), saturation (0-1), value (0-1)]

### fromHex(hex)

Sets base color from a hexadecimal color code.

**Parameters:**
- `hex` (string): Hexadecimal color (without #)

**Returns:**
- `ColorScheme`: This instance for chaining

**Throws:**
- Error if no argument is provided or if the hex code is invalid

### addComplement(b)

Sets whether to include complementary colors in analogic scheme.

**Parameters:**
- `b` (boolean): Whether to add complement

**Returns:**
- `ColorScheme`: This instance for chaining

**Throws:**
- Error if no argument is provided

### useWebSafe(b)

Sets whether colors should be web-safe.

**Parameters:**
- `b` (boolean): Whether to use web-safe colors

**Returns:**
- `ColorScheme`: This instance for chaining

**Throws:**
- Error if no argument is provided

### setDistance(d)

Sets distance between colors in schemes.

**Parameters:**
- `d` (number): Distance (0-1)

**Returns:**
- `ColorScheme`: This instance for chaining

**Throws:**
- Error if no argument is provided or if distance is out of range

### setScheme(name)

Sets the color scheme to use.

**Parameters:**
- `name` (string): Scheme name. Valid schemes are:
  - `mono` or `monochromatic`: All colors have the same hue
  - `contrast`: High contrast colors
  - `triade`: Three colors evenly distributed
  - `tetrade`: Four colors forming a rectangle on the color wheel
  - `analogic`: Analogous colors plus optional complement
  - `splitComplement`: Base color plus two colors adjacent to its complement
  - `square`: Four colors evenly spaced around the color wheel (90° apart)
  - `phi`: Golden ratio (phi) scheme (colors spaced by the golden angle 137.5°)
  - `shades`: Progressively darker versions of the base color
  - `tints`: Progressively lighter versions of the base color

**Returns:**
- `ColorScheme`: This instance for chaining

**Throws:**
- Error if no argument is provided or if scheme name is invalid

### setVariation(v)

Sets the color variation preset.

**Parameters:**
- `v` (string): Preset name. Valid presets are:
  - `default`: Standard color variations
  - `pastel`: Soft pastel colors
  - `soft`: Soft muted colors
  - `light`: Light color variations
  - `hard`: Strong, vibrant variations
  - `pale`: Very light, low-saturation colors
  - `vibrant`: High saturation, vivid colors
  - `muted`: Low saturation, subdued colors

**Returns:**
- `ColorScheme`: This instance for chaining

**Throws:**
- Error if no argument is provided or if variation name is invalid

### adjustSaturation(amount)

Adjusts the saturation of all colors.

**Parameters:**
- `amount` (number): Adjustment amount (-1 to 1)

**Returns:**
- `ColorScheme`: This instance for chaining

### desaturate(amount)

Desaturates colors by a given amount.

**Parameters:**
- `amount` (number): Amount to desaturate (0-1)

**Returns:**
- `ColorScheme`: This instance for chaining

### saturate(amount)

Increases saturation by a given amount.

**Parameters:**
- `amount` (number): Amount to saturate (0-1)

**Returns:**
- `ColorScheme`: This instance for chaining

### setColorCount(count)

Sets the number of colors to generate.

**Parameters:**
- `count` (number): Number of colors (2-16)

**Returns:**
- `ColorScheme`: This instance for chaining

## Example Usage

```javascript
import ColorScheme from './color-scheme.js';

// Create a color scheme with default settings (4 colors)
const scheme = new ColorScheme();

// Configure the color scheme
scheme
  .fromHex('66CCFF')     // Start with light blue
  .setScheme('triade')    // Use a triadic color scheme
  .setVariation('pastel') // Use pastel variations
  .setDistance(0.5)       // Set color distance
  .setColorCount(3);      // Generate 3 colors

// Get the colors
const colors = scheme.getColors();
// Returns an array of hex colors (without #)

// Get color sets (grouped by variations)
const colorSets = scheme.getColorSet();
// Returns an array of arrays, each inner array containing 4 variations of a color
```