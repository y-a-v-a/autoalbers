# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Recent Updates

### May 4, 2025
- Added four new color schemes:
  - `chaos`: Semi-random colors with some relationship to the base color
  - `perlin`: Colors based on Perlin-like noise for organic, flowing patterns
  - `seasons`: Colors inspired by seasonal transitions (spring, summer, fall, winter)
  - `gradient`: Linear transition between two colors
- Added URL parameter support for configuring schemes via query string
- Added UI elements for viewing current scheme settings and sharing via URL
- Fixed bug with COLOR_WHEEL key validation to prevent errors with noise-based schemes
- Updated documentation to reflect all new features and API changes

## Build Commands
- No specific build tools required
- Project is pure HTML/CSS/JavaScript
- Open `index.html` directly in browser to test changes

## Code Style Guidelines
- Indent using 2 spaces
- Use semicolons at the end of statements
- Use camelCase for variable and function names
- ES5 syntax for JavaScript compatibility
- Keep functions small and focused
- Use meaningful variable names
- Log messages for debugging using console.log()
- Format HTML using proper indentation and attributes on new lines
- Organize CSS properties logically
- Avoid inline styles when possible
- Maintain responsive design for all screen sizes
- Consider accessibility in UI changes

## Project Structure
- Main application logic in index.html
- Color scheme utilities in color-scheme.js
  - Supports various color schemes: 
    - Standard: mono, contrast, triade, tetrade, analogic, splitComplement, square, phi, shades, tints
    - Advanced: chaos, perlin, seasons, gradient
  - Variation presets: default, pastel, soft, light, hard, pale, vibrant, muted
  - Can adjust saturation, use web-safe colors, and set color distances
  - Supports seeded randomness for reproducible results with noise-based schemes
- URL parameter support for configuring schemes via query string
  - scheme: Any valid scheme name
  - variation: Any valid variation name
  - hue: 0-359 value for base color
  - seed: Numeric seed for noise-based schemes
- UI elements for sharing configurations via copyable URLs
- API documentation in docs/color-scheme-api.md
- New images should match existing naming conventions

## Documentation
- API documentation for color-scheme.js is available in docs/color-scheme-api.md
- When updating functionality, ensure documentation is updated to match
- Documentation should follow Markdown format with proper headings and code examples