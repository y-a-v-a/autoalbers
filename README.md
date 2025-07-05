# AutoAlbers

## Concept

Create a new 'Homage to the Square' (originally a series by German/American Josef Albers) every 12 seconds (this is the average time people stand in front of a painting).

Originally based on color-scheme-js ([https://github.com/c0bra/color-scheme-js](https://github.com/c0bra/color-scheme-js)), now using a modernized ES Module version with enhanced features.

![](https://raw.githubusercontent.com/y-a-v-a/autoalbers/master/albers.jpg)

## For the curious

I use a canvas tag and JavaScript to create a new homage every 12 seconds. ~~I added two polyfills, one for Date.now() and one for requestAnimationFrame, both of which I will remove when I think they're not needed anymore.~~ I have put everything into one file since this makes loading faster, except for the color-scheme.js module which is kept separate. The color-scheme module has been rewritten as an ES Module with improved functionality including extended color set generation (2-16 colors) and saturation controls. ~~I still have plans to make a responsive version but did not yet make time for that.~~ It took some time but I made it responsive (8 years!)
Some [sources](http://www.huffingtonpost.com/james-elkins/how-long-does-it-take-to-_b_779946.html) on the internet report about different lengths people stand in front of a painting in a museum. The Getty talks about a mean of 32.5, the Louvre about 15 seconds. I choose 12 seconds. Because in the end, it's on the internets dude!

## Further reading

- [Josef Albers](http://en.wikipedia.org/wiki/Josef_Albers) was a German-born American artist and educator whose work, both in Europe and in the United States, formed the basis of some of the most influential and far-reaching art education programs of the twentieth century.
- [Interaction of Color: Revised and Expanded Edition](http://amzn.com/0300115954) a book, you know, a stack of paper glued together serving information.

## Color Scheme Module

The project now includes a modernized ES Module version of the color scheme generator with enhanced features:

```javascript
// Import the module
import ColorScheme from './color-scheme.js';

// Create a color scheme instance (default is 4 colors)
const scheme = new ColorScheme();

// Create a scheme with more colors
const largeScheme = new ColorScheme({ colorCount: 8 });

// Configure and generate colors
const colors = scheme
  .fromHue(180) // Set base hue (cyan)
  .setScheme('tetrade') // Use tetrade color scheme
  .setVariation('pastel') // Use pastel variation
  .setDistance(0.5) // Set color distance
  .saturate(0.2) // Increase saturation
  .getColors(); // Generate and return hex colors
```

### Color Schemes

Traditional schemes:

- `mono` / `monochromatic` - Single hue with variations
- `contrast` - Two complementary colors (180° apart)
- `triade` - Three colors evenly spaced (120° apart)
- `tetrade` - Four colors in rectangle pattern
- `analogic` - Three adjacent colors on the wheel

New schemes:

- `splitComplement` - Base color plus two colors adjacent to its complement
- `square` - Four colors evenly spaced (90° apart) around the color wheel
- `phi` - Colors spaced using the golden angle (137.5°) for natural harmony
- `shades` - Progressively darker versions of the base color
- `tints` - Progressively lighter versions of the base color

### Additional Features

- Generate between 2-16 base colors
- Adjust saturation with `saturate()` and `desaturate()` methods
- Group colors with `getColorSet()` for organized access

A test file (`color-scheme.test.js`) is included to verify functionality.

## AWS

Served from AWS since 2021 via Amplify

## Yet Another Visual Artist

Vincent Bruijn <vebruijn@gmail.com> • [y-a-v-a.org](https://www.y-a-v-a.org) • (c) 2014-2025

License: MIT
