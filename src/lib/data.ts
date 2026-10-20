export const tools = [
  [
    'inverter-battery-backup',
    'Inverter Battery Backup Time',
    'Battery & Inverter',
    'Estimate battery backup hours with discharge and inverter losses.',
  ],
  [
    'battery-ah-required',
    'Battery Ah Required',
    'Battery & Inverter',
    'Size battery amp-hours for a target runtime.',
  ],
  [
    'inverter-size',
    'Inverter VA / Watt Size',
    'Battery & Inverter',
    'Calculate inverter VA, watts and surge allowance.',
  ],
  ['appliance-load', 'Appliance Load', 'Electricity', 'Add appliance wattages and quantities.'],
  ['ups-runtime', 'UPS Runtime', 'UPS', 'Estimate computer and UPS backup runtime.'],
  [
    'battery-charging-time',
    'Battery Charging Time',
    'Battery & Inverter',
    'Estimate recharge time with charger current and efficiency.',
  ],
  ['solar-battery-size', 'Solar Battery Size', 'Solar', 'Size battery storage for solar backup.'],
  [
    'solar-panel-size',
    'Solar Panel Size',
    'Solar',
    'Estimate solar array watts from daily kWh and sun hours.',
  ],
  [
    'electricity-consumption',
    'Electricity Consumption / kWh',
    'Electricity',
    'Estimate daily and monthly energy use.',
  ],
  [
    'generator-runtime',
    'Generator Runtime',
    'Generator',
    'Estimate run time from tank capacity and model fuel burn.',
  ],
] as const;
export const extras = [
  ['lithium-battery-runtime', 'Lithium Battery Runtime', 'Battery & Inverter'],
  ['solar-backup', 'Solar Backup', 'Solar'],
  ['computer-ups', 'Computer UPS', 'UPS'],
  ['electricity-cost', 'Electricity Cost', 'Electricity'],
  ['generator-fuel-consumption', 'Generator Fuel Consumption', 'Generator'],
] as const;
export const presets = [
  ['LED bulb', 9],
  ['Tube light', 20],
  ['Ceiling fan', 75],
  ['TV', 90],
  ['Wi-Fi router', 12],
  ['Laptop', 65],
  ['Desktop PC', 200],
  ['Refrigerator', 180],
  ['Freezer', 180],
  ['Air cooler', 150],
  ['0.8 ton AC', 850],
  ['1 ton AC', 1100],
  ['1.5 ton AC', 1700],
  ['2 ton AC', 2300],
  ['Water pump', 750],
  ['Washing machine', 500],
  ['Microwave', 1200],
  ['Induction cooktop', 1800],
] as const;
export const definitions: Record<
  string,
  {
    fields: [string, string, number, string, string?][];
    formula: string;
    example: string;
    assumptions: string;
    mistakes: string[];
    faq: [string, string][];
  }
> = {
  'inverter-battery-backup': {
    fields: [
      ['voltage', 'System voltage', 12, 'V', 'voltage'],
      ['ah', 'Battery capacity', 150, 'Ah'],
      ['load', 'Running load', 300, 'W'],
      ['dod', 'Depth of discharge', 50, '%'],
      ['eff', 'Inverter efficiency', 85, '%'],
    ],
    formula: 'Runtime (h) = voltage × Ah × DoD × inverter efficiency ÷ load (W)',
    example: '12 V × 150 Ah × 0.50 × 0.85 ÷ 300 W = 2.55 hours.',
    assumptions:
      'Steady load, healthy battery, nominal voltage. Lead-acid capacity may fall at high discharge rates.',
    mistakes: [
      'Ignoring inverter losses and battery age',
      'Assuming every appliance draws its nameplate wattage continuously',
    ],
    faq: [
      [
        'Is 150Ah enough?',
        'It depends on voltage, watt load, discharge depth and battery condition.',
      ],
      [
        'Why is actual backup shorter?',
        'Temperature, battery aging, high discharge current and inverter idle consumption reduce runtime.',
      ],
    ],
  },
  'battery-ah-required': {
    fields: [
      ['load', 'Running load', 300, 'W'],
      ['hours', 'Target runtime', 4, 'hours'],
      ['voltage', 'System voltage', 12, 'V', 'voltage'],
      ['dod', 'Depth of discharge', 50, '%'],
      ['eff', 'Inverter efficiency', 85, '%'],
    ],
    formula: 'Required Ah = load × hours ÷ (voltage × DoD × efficiency)',
    example: '300 W × 4 h ÷ (12 V × 0.50 × 0.85) ≈ 235.3 Ah.',
    assumptions: 'Continuous steady load; size battery and inverter separately.',
    mistakes: ['Confusing Ah with Wh', 'Not allowing for aging or reserve'],
    faq: [
      [
        'Can I combine batteries?',
        'Yes, but series changes voltage and parallel changes Ah; use compatible batteries.',
      ],
    ],
  },
  'inverter-size': {
    fields: [
      ['load', 'Continuous load', 600, 'W'],
      ['pf', 'Power factor', 0.8, 'ratio'],
      ['margin', 'Capacity headroom', 25, '%'],
      ['surge', 'Starting surge multiplier', 2, '×'],
    ],
    formula:
      'Continuous VA = watts ÷ power factor × (1 + headroom); surge W = load W × surge multiplier',
    example: '600 ÷ 0.8 × 1.25 = 937.5 VA; 2× surge = 1200 W.',
    assumptions: 'Surge watts and duration must be supported by the selected inverter datasheet.',
    mistakes: ['Confusing continuous and peak ratings', 'Ignoring motor starting currents'],
    faq: [
      [
        'Can a 1000VA inverter run 1000W?',
        'Not necessarily. Check continuous watt rating and actual power factor.',
      ],
    ],
  },
  'appliance-load': {
    fields: [['load', 'Additional custom load', 0, 'W']],
    formula: 'Total running watts = sum of (appliance watts × quantity) + custom watts',
    example: '2 × 75 W fans + 4 × 9 W bulbs = 186 W.',
    assumptions: 'Preset wattages are editable examples, not product specifications.',
    mistakes: [
      'Using average refrigerator watts for starting surge',
      'Counting appliances that are not on simultaneously',
    ],
    faq: [
      [
        'Should I use rated or measured watts?',
        'Measured running watts are preferable for consumption; use startup ratings for inverter sizing.',
      ],
    ],
  },
  'ups-runtime': {
    fields: [
      ['voltage', 'Battery bank voltage', 12, 'V', 'voltage'],
      ['ah', 'Battery capacity', 9, 'Ah'],
      ['load', 'Computer and accessory load', 120, 'W'],
      ['dod', 'Usable discharge', 70, '%'],
      ['eff', 'UPS conversion efficiency', 80, '%'],
    ],
    formula: 'Runtime = V × Ah × usable fraction × UPS efficiency ÷ load W',
    example: '12 × 9 × 0.70 × 0.80 ÷ 120 = 0.504 h (30.2 min).',
    assumptions:
      'Small UPS batteries at high discharge can deliver substantially less than rated Ah; consult vendor runtime curves.',
    mistakes: [
      'Assuming advertised VA equals battery Wh',
      'Ignoring UPS idle load and discharge-rate effects',
    ],
    faq: [
      [
        'Why is my UPS runtime lower?',
        'High battery discharge current and manufacturer cutoff settings can sharply reduce runtime.',
      ],
    ],
  },
  'battery-charging-time': {
    fields: [
      ['ah', 'Battery capacity', 150, 'Ah'],
      ['soc', 'Starting state of charge', 30, '%'],
      ['target', 'Target state of charge', 100, '%'],
      ['amps', 'Average charging current', 15, 'A'],
      ['eff', 'Charge efficiency', 85, '%'],
    ],
    formula:
      'Hours ≈ Ah × (target SoC − starting SoC) ÷ (average charge current × charge efficiency)',
    example: '150 × (1 − 0.30) ÷ (15 × 0.85) ≈ 8.24 h.',
    assumptions:
      'Average current is not constant during absorption/taper charging; battery/BMS charging limits apply.',
    mistakes: ['Ignoring absorption stage', 'Using charger peak current as its average'],
    faq: [
      [
        'Is this an exact charging time?',
        'No. Charging profiles, temperature and taper current affect the actual duration.',
      ],
    ],
  },
  'solar-battery-size': {
    fields: [
      ['energy', 'Daily backup energy', 5, 'kWh'],
      ['hours', 'Days of autonomy', 1, 'days'],
      ['voltage', 'Battery system voltage', 48, 'V', 'voltage'],
      ['dod', 'Depth of discharge', 90, '%'],
      ['eff', 'Conversion efficiency', 90, '%'],
    ],
    formula: 'Battery Ah = daily kWh × 1000 × autonomy days ÷ (V × DoD × efficiency)',
    example: '5 × 1000 × 1 ÷ (48 × 0.90 × 0.90) ≈ 128.6 Ah.',
    assumptions:
      'Autonomy days cover specified energy use; battery compatibility and power limits require separate checks.',
    mistakes: ['Confusing daily kWh with peak kW', 'Ignoring battery power output limits'],
    faq: [
      [
        'Can solar charge this battery every day?',
        'Only if the array and weather provide enough surplus energy.',
      ],
    ],
  },
  'solar-panel-size': {
    fields: [
      ['energy', 'Daily energy requirement', 5, 'kWh'],
      ['sun', 'Peak sun hours', 4.5, 'hours'],
      ['loss', 'System losses', 20, '%'],
      ['panel', 'Panel nameplate rating', 450, 'W'],
    ],
    formula:
      'Array W = daily kWh × 1000 ÷ (peak sun hours × (1 − losses)); panels = ceiling(array W ÷ panel W)',
    example: '5 × 1000 ÷ (4.5 × 0.80) ≈ 1389 W, or 4 × 450 W panels.',
    assumptions:
      'Peak sun hours vary by season and location; roof orientation, shade, temperature and inverter clipping matter.',
    mistakes: [
      'Treating daylight hours as peak sun hours',
      'Ignoring shade and seasonal variability',
    ],
    faq: [
      [
        'Will panels produce their rating all day?',
        'No. Rated output is measured under standard test conditions, not throughout a typical day.',
      ],
    ],
  },
  'electricity-consumption': {
    fields: [
      ['load', 'Appliance power', 1000, 'W'],
      ['hours', 'Usage per day', 3, 'hours'],
      ['days', 'Days used per month', 30, 'days'],
      ['rate', 'Electricity price per kWh', 0.15, 'currency/kWh'],
    ],
    formula: 'kWh = watts × hours/day × days ÷ 1000; cost = kWh × tariff',
    example: '1000 W × 3 h/day × 30 days ÷ 1000 = 90 kWh.',
    assumptions:
      'Flat tariff estimate; real bills may include taxes, tiered rates and fixed charges.',
    mistakes: ['Confusing kW and kWh', 'Ignoring variable-duty appliances'],
    faq: [
      [
        'Does this include standby usage?',
        'Only if you include standby watts and operating hours.',
      ],
    ],
  },
  'generator-runtime': {
    fields: [
      ['tank', 'Usable tank capacity', 20, 'L'],
      ['burn', 'Fuel consumption at selected load', 2, 'L/hour'],
      ['loadpct', 'Operating load', 50, '%'],
    ],
    formula: 'Runtime hours = usable fuel tank litres ÷ model-specific consumption litres/hour',
    example: '20 L ÷ 2 L/hour = 10 hours.',
    assumptions:
      'Enter fuel consumption at the actual operating load from your generator documentation. Load percentage is descriptive, not a universal burn-rate multiplier.',
    mistakes: [
      'Assuming consumption is proportional to load',
      'Ignoring minimum fuel reserve and operating conditions',
    ],
    faq: [
      [
        'Can I use one fuel rate for all generators?',
        'No. Fuel burn varies with model, fuel type, efficiency and load.',
      ],
    ],
  },
};
