/**
 * Unit tests for the ColorScheme module
 */
import ColorScheme from './color-scheme.js';

// Helper function to run all tests
function runTests() {
  console.log('Running ColorScheme tests...');
  
  let passed = 0;
  let failed = 0;
  
  function assert(condition, message) {
    if (condition) {
      passed++;
      console.log(`✓ ${message}`);
    } else {
      failed++;
      console.error(`✗ ${message}`);
    }
  }
  
  // Test basic functionality
  function testBasics() {
    console.log('\nTesting basic functionality:');
    
    // Create a new ColorScheme instance
    const scheme = new ColorScheme();
    
    // Test default settings
    assert(scheme._scheme === 'mono', 'Default scheme should be mono');
    assert(scheme._distance === 0.5, 'Default distance should be 0.5');
    assert(scheme._web_safe === false, 'Default web_safe should be false');
    assert(scheme._add_complement === false, 'Default add_complement should be false');
    assert(scheme.colorCount === 4, 'Default color count should be 4');
    
    // Test color generation
    const colors = scheme.getColors();
    assert(colors.length === 16, 'Should generate 16 colors by default (4 colors x 4 variations)');
    
    // Test that all colors are valid hex colors
    assert(colors.every(color => /^[0-9A-F]{6}$/i.test(color)), 'All colors should be valid hex codes');
  }
  
  // Test color count functionality
  function testColorCount() {
    console.log('\nTesting color count functionality:');
    
    // Test with 2 colors
    const scheme2 = new ColorScheme({ colorCount: 2 });
    assert(scheme2.colorCount === 2, 'Should accept colorCount of 2');
    assert(scheme2.getColors().length === 8, 'Should generate 8 colors (2 colors x 4 variations)');
    
    // Test with maximum 16 colors
    const scheme16 = new ColorScheme({ colorCount: 16 });
    assert(scheme16.colorCount === 16, 'Should accept colorCount of 16');
    assert(scheme16.getColors().length === 64, 'Should generate 64 colors (16 colors x 4 variations)');
    
    // Test with out-of-range values
    const schemeTooLow = new ColorScheme({ colorCount: 1 });
    assert(schemeTooLow.colorCount === 2, 'Should enforce minimum of 2 colors');
    
    const schemeTooHigh = new ColorScheme({ colorCount: 20 });
    assert(schemeTooHigh.colorCount === 16, 'Should enforce maximum of 16 colors');
    
    // Test setColorCount method
    const scheme = new ColorScheme();
    scheme.setColorCount(8);
    assert(scheme.colorCount === 8, 'setColorCount should update the color count');
    assert(scheme.colors.length === 8, 'setColorCount should update the colors array');
    assert(scheme.getColors().length === 32, 'Should generate 32 colors (8 colors x 4 variations)');
  }
  
  // Test color schemes
  function testSchemes() {
    console.log('\nTesting color schemes:');
    
    const baseHue = 120; // Green
    
    // Test mono scheme
    const mono = new ColorScheme();
    mono.fromHue(baseHue).setScheme('mono');
    const monoColors = mono.getColorSet();
    assert(monoColors.length === 1, 'Mono scheme should have 1 color');
    
    // Test contrast scheme
    const contrast = new ColorScheme();
    contrast.fromHue(baseHue).setScheme('contrast');
    const contrastColors = contrast.getColorSet();
    assert(contrastColors.length === 2, 'Contrast scheme should have 2 colors');
    
    // Test triade scheme
    const triade = new ColorScheme();
    triade.fromHue(baseHue).setScheme('triade');
    const triadeColors = triade.getColorSet();
    assert(triadeColors.length === 3, 'Triade scheme should have 3 colors');
    
    // Test tetrade scheme
    const tetrade = new ColorScheme();
    tetrade.fromHue(baseHue).setScheme('tetrade');
    const tetradeColors = tetrade.getColorSet();
    assert(tetradeColors.length === 4, 'Tetrade scheme should have 4 colors');
    
    // Test analogic scheme
    const analogic = new ColorScheme();
    analogic.fromHue(baseHue).setScheme('analogic');
    const analogicColors = analogic.getColorSet();
    assert(analogicColors.length === 3, 'Analogic scheme should have 3 colors');
    
    // Test analogic with complement
    const analogicComplement = new ColorScheme();
    analogicComplement.fromHue(baseHue).setScheme('analogic').addComplement(true);
    const analogicComplementColors = analogicComplement.getColorSet();
    assert(analogicComplementColors.length === 4, 'Analogic with complement should have 4 colors');
    
    // Test split complementary scheme
    const splitComplement = new ColorScheme();
    splitComplement.fromHue(baseHue).setScheme('splitComplement');
    const splitComplementColors = splitComplement.getColorSet();
    assert(splitComplementColors.length === 3, 'Split complementary scheme should have 3 colors');
    
    // Test square scheme
    const square = new ColorScheme();
    square.fromHue(baseHue).setScheme('square');
    const squareColors = square.getColorSet();
    assert(squareColors.length === 4, 'Square scheme should have 4 colors');
    
    // Test phi (golden ratio) scheme
    const phi = new ColorScheme();
    phi.fromHue(baseHue).setScheme('phi');
    const phiColors = phi.getColorSet();
    assert(phiColors.length === 4, 'Phi scheme with default color count should have 4 colors');
    
    // Test phi with more colors
    const phiMore = new ColorScheme({ colorCount: 5 });
    phiMore.fromHue(baseHue).setScheme('phi');
    const phiMoreColors = phiMore.getColorSet();
    assert(phiMoreColors.length === 5, 'Phi scheme with 5 colors should have 5 colors');
    
    // Test shades scheme
    const shades = new ColorScheme();
    shades.fromHue(baseHue).setScheme('shades');
    const shadesColors = shades.getColorSet();
    assert(shadesColors.length === 4, 'Shades scheme should have 4 color sets by default');
    
    // Test that shades get progressively darker
    const shadesHex = shades.getColors();
    // Extract value components from first variation of each color
    const shadesValues = [];
    for (let i = 0; i < shadesHex.length; i += 4) {
      const r = parseInt(shadesHex[i].substr(0, 2), 16);
      const g = parseInt(shadesHex[i].substr(2, 2), 16);
      const b = parseInt(shadesHex[i].substr(4, 2), 16);
      shadesValues.push(Math.max(r, g, b));
    }
    // Check that each shade is darker than the previous
    let shadesGetDarker = true;
    for (let i = 1; i < shadesValues.length; i++) {
      if (shadesValues[i] > shadesValues[i-1]) {
        shadesGetDarker = false;
      }
    }
    assert(shadesGetDarker, 'Shades should get progressively darker');
    
    // Test tints scheme
    const tints = new ColorScheme();
    tints.fromHue(baseHue).setScheme('tints');
    const tintsColors = tints.getColorSet();
    assert(tintsColors.length === 4, 'Tints scheme should have 4 color sets by default');
  }
  
  // Test saturation adjustment
  function testSaturation() {
    console.log('\nTesting saturation adjustment:');
    
    // Generate a baseline color set
    const baseScheme = new ColorScheme();
    baseScheme.fromHue(210).setScheme('tetrade');
    const baseColors = baseScheme.getColors();
    
    // Generate a desaturated color set
    const desaturatedScheme = new ColorScheme();
    desaturatedScheme.fromHue(210).setScheme('tetrade').desaturate(0.5);
    const desaturatedColors = desaturatedScheme.getColors();
    
    // Generate a saturated color set
    const saturatedScheme = new ColorScheme();
    saturatedScheme.fromHue(210).setScheme('tetrade').saturate(0.2);
    const saturatedColors = saturatedScheme.getColors();
    
    // Test that they're different
    assert(JSON.stringify(baseColors) !== JSON.stringify(desaturatedColors), 
      'Desaturated colors should be different from base colors');
    
    assert(JSON.stringify(baseColors) !== JSON.stringify(saturatedColors), 
      'Saturated colors should be different from base colors');
    
    // Test extreme values
    const fullySaturatedScheme = new ColorScheme();
    fullySaturatedScheme.fromHue(210).setScheme('tetrade').adjustSaturation(2);
    assert(fullySaturatedScheme._saturation_adjustment === 1, 
      'Saturation adjustment should be clamped to max 1');
    
    const fullyDesaturatedScheme = new ColorScheme();
    fullyDesaturatedScheme.fromHue(210).setScheme('tetrade').adjustSaturation(-2);
    assert(fullyDesaturatedScheme._saturation_adjustment === -1, 
      'Saturation adjustment should be clamped to min -1');
  }
  
  // Test method chaining
  function testChaining() {
    console.log('\nTesting method chaining:');
    
    const scheme = new ColorScheme();
    const result = scheme
      .fromHue(30)
      .setScheme('tetrade')
      .setDistance(0.3)
      .useWebSafe(true)
      .setColorCount(6)
      .desaturate(0.2);
    
    assert(result === scheme, 'Method chaining should return the instance');
    assert(scheme.colors[0].get_hue() === 30, 'fromHue should be applied');
    assert(scheme._scheme === 'tetrade', 'setScheme should be applied');
    assert(scheme._distance === 0.3, 'setDistance should be applied');
    assert(scheme._web_safe === true, 'useWebSafe should be applied');
    assert(scheme.colorCount === 6, 'setColorCount should be applied');
    assert(scheme._saturation_adjustment < 0, 'desaturate should be applied');
  }
  
  // Test fromHex
  function testFromHex() {
    console.log('\nTesting fromHex:');
    
    const scheme = new ColorScheme();
    scheme.fromHex('FF0000'); // Bright red
    
    // Make sure the main color is reddish
    const colors = scheme.getColors();
    const firstColor = colors[0];
    
    // Red should be the dominant component
    const r = parseInt(firstColor.substr(0, 2), 16);
    const g = parseInt(firstColor.substr(2, 2), 16);
    const b = parseInt(firstColor.substr(4, 2), 16);
    
    assert(r > g && r > b, 'Red should be the dominant component when using fromHex with FF0000');
    
    // Test invalid input
    let errorThrown = false;
    try {
      scheme.fromHex('invalid');
    } catch (e) {
      errorThrown = true;
    }
    assert(errorThrown, 'fromHex should throw an error for invalid hex codes');
  }
  
  // Run all the tests
  testBasics();
  testColorCount();
  testSchemes();
  testSaturation();
  testChaining();
  testFromHex();
  
  // Print summary
  console.log(`\nTest summary: ${passed} passed, ${failed} failed`);
  
  return {
    passed,
    failed
  };
}

// Run the tests
runTests();

// For node.js compatibility
export { runTests };