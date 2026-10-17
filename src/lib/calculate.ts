type Result = { value: string; detail: string };
type Inputs = Record<string, number>;
const fmt = (v: number, d = 2) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: d }).format(v);
function check(f: Inputs) {
  for (const [k, v] of Object.entries(f)) {
    if (!Number.isFinite(v) || v < 0 || v > 1e10)
      throw Error(`Enter a valid non-negative value for ${k}.`);
  }
  for (const k of ['dod', 'eff', 'margin', 'loss', 'soc', 'target', 'loadpct'])
    if (k in f && f[k] > 100) throw Error(`${k} must be at most 100%.`);
  if ('pf' in f && (f.pf <= 0 || f.pf > 1))
    throw Error('Power factor must be greater than 0 and at most 1.');
  if ('target' in f && f.target <= f.soc) throw Error('Target charge must exceed starting charge.');
}
const positive = (v: number, k: string) => {
  if (!Number.isFinite(v) || v <= 0) throw Error(`${k} must be greater than zero.`);
  return v;
};
export function calculate(
  slug: string,
  f: Inputs,
  rows: { qty: number; watts: number }[] = [],
): Result {
  check(f);
  const pct = (k: string) => f[k] / 100;
  let v = 0,
    detail = '';
  switch (slug) {
    case 'inverter-battery-backup':
    case 'ups-runtime':
      v =
        (positive(f.voltage, 'Voltage') *
          positive(f.ah, 'Ah') *
          positive(pct('dod'), 'Depth of discharge') *
          positive(pct('eff'), 'Efficiency')) /
        positive(f.load, 'Load');
      detail = `${fmt(v * 60, 1)} minutes · ${fmt(f.voltage * f.ah)} Wh nominal battery energy`;
      return { value: `${fmt(v)} hours`, detail };
    case 'battery-ah-required':
      v =
        (positive(f.load, 'Load') * positive(f.hours, 'Runtime')) /
        (positive(f.voltage, 'Voltage') *
          positive(pct('dod'), 'Depth of discharge') *
          positive(pct('eff'), 'Efficiency'));
      return {
        value: `${fmt(v)} Ah`,
        detail: `${fmt(f.load * f.hours)} Wh required at the AC output`,
      };
    case 'inverter-size':
      v = (positive(f.load, 'Load') / positive(f.pf, 'Power factor')) * (1 + pct('margin'));
      return {
        value: `${fmt(v)} VA`,
        detail: `At least ${fmt(f.load * (1 + pct('margin')))} W continuous; verify ${fmt(f.load * positive(f.surge, 'Surge multiplier'))} W starting surge and duration`,
      };
    case 'appliance-load':
      v = f.load;
      for (const r of rows) {
        if (
          !Number.isFinite(r.qty) ||
          !Number.isInteger(r.qty) ||
          r.qty < 0 ||
          r.qty > 100000 ||
          !Number.isFinite(r.watts) ||
          r.watts < 0 ||
          r.watts > 1e10
        )
          throw Error('Check appliance quantities and watts.');
        v += r.qty * r.watts;
      }
      if (!Number.isFinite(v) || v <= 0) throw Error('Add at least one appliance or custom load.');
      return {
        value: `${fmt(v)} W`,
        detail: `${fmt(v / 1000, 3)} kW running load; check motor starting surge separately`,
      };
    case 'battery-charging-time':
      v =
        (positive(f.ah, 'Ah') * ((f.target - f.soc) / 100)) /
        (positive(f.amps, 'Charging current') * positive(pct('eff'), 'Efficiency'));
      return {
        value: `${fmt(v)} hours`,
        detail: `${fmt(v * 60)} minutes idealized average-current estimate; taper charging may take longer`,
      };
    case 'solar-battery-size':
      v =
        (positive(f.energy, 'Daily energy') * 1000 * positive(f.hours, 'Autonomy days')) /
        (positive(f.voltage, 'Voltage') *
          positive(pct('dod'), 'Depth of discharge') *
          positive(pct('eff'), 'Efficiency'));
      return {
        value: `${fmt(v)} Ah`,
        detail: `${fmt((v * f.voltage) / 1000)} kWh nominal battery storage`,
      };
    case 'solar-panel-size':
      if (f.loss >= 100) throw Error('System losses must be below 100%.');
      v =
        (positive(f.energy, 'Energy') * 1000) /
        (positive(f.sun, 'Peak sun hours') * (1 - pct('loss')));
      return {
        value: `${fmt(v, 0)} W`,
        detail: `Approximately ${Math.ceil(v / positive(f.panel, 'Panel rating'))} panels rated ${fmt(f.panel)} W each`,
      };
    case 'electricity-consumption':
      v =
        (positive(f.load, 'Power') * positive(f.hours, 'Daily hours') * positive(f.days, 'Days')) /
        1000;
      return {
        value: `${fmt(v)} kWh`,
        detail: `Estimated cost ${fmt(v * f.rate)} in your tariff currency; ${fmt(v / f.days, 3)} kWh per active day`,
      };
    case 'generator-runtime':
      v = positive(f.tank, 'Tank litres') / positive(f.burn, 'Fuel burn');
      return {
        value: `${fmt(v)} hours`,
        detail: `At ${fmt(f.loadpct)}% load, using your entered ${fmt(f.burn)} L/hour consumption rate`,
      };
    default:
      throw Error('Unknown calculator');
  }
}
