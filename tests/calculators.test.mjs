import test from 'node:test';
import assert from 'node:assert/strict';
// Test actual TS module through Node's type-stripping support (Node >=22).
const { calculate } = await import('../src/lib/calculate.ts');
const cases = [
  ['inverter-battery-backup', { voltage: 12, ah: 150, load: 300, dod: 50, eff: 85 }, '2.55 hours'],
  ['battery-ah-required', { voltage: 12, load: 300, hours: 4, dod: 50, eff: 85 }, '235.29 Ah'],
  ['inverter-size', { load: 600, pf: 0.8, margin: 25, surge: 2 }, '937.5 VA'],
  ['appliance-load', { load: 10 }, '160 W', [{ qty: 2, watts: 75 }]],
  ['ups-runtime', { voltage: 12, ah: 9, load: 120, dod: 70, eff: 80 }, '0.5 hours'],
  ['battery-charging-time', { ah: 150, soc: 30, target: 100, amps: 15, eff: 85 }, '8.24 hours'],
  ['solar-battery-size', { energy: 5, hours: 1, voltage: 48, dod: 90, eff: 90 }, '128.6 Ah'],
  ['solar-panel-size', { energy: 5, sun: 4.5, loss: 20, panel: 450 }, '1,389 W'],
  ['electricity-consumption', { load: 1000, hours: 3, days: 30, rate: 0.15 }, '90 kWh'],
  ['generator-runtime', { tank: 20, burn: 2, loadpct: 50 }, '10 hours'],
];
for (const [slug, inputs, expected, rows] of cases)
  test(slug, () => assert.equal(calculate(slug, inputs, rows).value, expected));
test('reject zero load', () =>
  assert.throws(() => calculate('ups-runtime', { voltage: 12, ah: 9, load: 0, dod: 70, eff: 80 })));
test('reject invalid loss', () =>
  assert.throws(() => calculate('solar-panel-size', { energy: 5, sun: 4, loss: 100, panel: 400 })));
test('reject NaN', () =>
  assert.throws(() => calculate('generator-runtime', { tank: NaN, burn: 2, loadpct: 50 })));
test('decimal conversions', () =>
  assert.equal(
    calculate('electricity-consumption', { load: 125.5, hours: 2, days: 1, rate: 0.2 }).value,
    '0.25 kWh',
  ));

test('reject missing voltage', () =>
  assert.throws(() => calculate('ups-runtime', { ah: 9, load: 120, dod: 70, eff: 80 })));
test('reject fractional appliance count', () =>
  assert.throws(() => calculate('appliance-load', { load: 0 }, [{ qty: 0.5, watts: 75 }])));
test('reject invalid power factor', () =>
  assert.throws(() => calculate('inverter-size', { load: 600, pf: 1.2, margin: 25, surge: 2 })));

for (const [slug, inputs, , rows] of cases) {
  for (const key of Object.keys(inputs)) {
    test(slug + ': reject missing ' + key, () => {
      const incomplete = { ...inputs };
      delete incomplete[key];
      assert.throws(() => calculate(slug, incomplete, rows));
    });
  }
}
