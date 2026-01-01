import { lightTheme, darkTheme } from '../src/theme/themes';
import { validateThemeContrast } from '../src/utils/colorContrast';

console.log('🎨 Checking color contrast ratios for accessibility...\n');

console.log('📱 Light Theme Contrast Check:');
console.log('================================');
const lightChecks = validateThemeContrast(lightTheme);
lightChecks.forEach(check => {
  const status = check.meetsAA ? '✅' : '❌';
  const aaaStatus = check.meetsAAA ? '⭐' : '';
  console.log(`${status} ${check.pair}: ${check.ratio}:1 ${aaaStatus}`);
  if (check.recommendation) {
    console.log(`   ⚠️  ${check.recommendation}`);
  }
});

console.log('\n🌙 Dark Theme Contrast Check:');
console.log('================================');
const darkChecks = validateThemeContrast(darkTheme);
darkChecks.forEach(check => {
  const status = check.meetsAA ? '✅' : '❌';
  const aaaStatus = check.meetsAAA ? '⭐' : '';
  console.log(`${status} ${check.pair}: ${check.ratio}:1 ${aaaStatus}`);
  if (check.recommendation) {
    console.log(`   ⚠️  ${check.recommendation}`);
  }
});

console.log('\n📊 Summary:');
console.log('================================');
const lightIssues = lightChecks.filter(c => !c.meetsAA).length;
const darkIssues = darkChecks.filter(c => !c.meetsAA).length;

if (lightIssues === 0 && darkIssues === 0) {
  console.log('✅ All color combinations meet WCAG AA standards!');
} else {
  console.log(`❌ Found ${lightIssues + darkIssues} contrast issues:`);
  console.log(`   - Light theme: ${lightIssues} issues`);
  console.log(`   - Dark theme: ${darkIssues} issues`);
}

console.log('\nLegend:');
console.log('✅ = Meets WCAG AA (4.5:1 for normal text)');
console.log('⭐ = Also meets WCAG AAA (7:1 for normal text)');
console.log('❌ = Does not meet WCAG AA standards');