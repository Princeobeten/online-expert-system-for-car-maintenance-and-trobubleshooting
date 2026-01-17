import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { connectToDatabase } from '../lib/mongodb';
import Symptom from '../models/Symptom';
import Fault from '../models/Fault';
import Solution from '../models/Solution';
import Rule from '../models/Rule';

const symptoms = [
  // Engine symptoms
  { description: 'Engine makes knocking sounds', category: 'Engine' },
  { description: 'Engine overheating', category: 'Engine' },
  { description: 'Engine won\'t start', category: 'Engine' },
  { description: 'Engine stalls frequently', category: 'Engine' },
  { description: 'Rough idle', category: 'Engine' },
  { description: 'Loss of power', category: 'Engine' },
  { description: 'Excessive exhaust smoke', category: 'Engine' },
  { description: 'Engine misfiring', category: 'Engine' },

  // Transmission symptoms
  { description: 'Transmission slipping', category: 'Transmission' },
  { description: 'Hard shifting', category: 'Transmission' },
  { description: 'Delayed engagement', category: 'Transmission' },
  { description: 'Transmission fluid leak', category: 'Transmission' },

  // Brakes symptoms
  { description: 'Squealing brakes', category: 'Brakes' },
  { description: 'Grinding noise when braking', category: 'Brakes' },
  { description: 'Brake pedal feels spongy', category: 'Brakes' },
  { description: 'Car pulls to one side when braking', category: 'Brakes' },
  { description: 'Brake warning light on', category: 'Brakes' },

  // Electrical symptoms
  { description: 'Battery dies frequently', category: 'Electrical' },
  { description: 'Lights dimming', category: 'Electrical' },
  { description: 'Electrical components not working', category: 'Electrical' },
  { description: 'Check engine light on', category: 'Electrical' },

  // Cooling symptoms
  { description: 'Coolant leak', category: 'Cooling' },
  { description: 'Temperature gauge reading high', category: 'Cooling' },
  { description: 'Steam from engine', category: 'Cooling' },

  // Fuel symptoms
  { description: 'Poor fuel economy', category: 'Fuel' },
  { description: 'Fuel smell', category: 'Fuel' },
  { description: 'Engine hesitation during acceleration', category: 'Fuel' },

  // Suspension symptoms
  { description: 'Bumpy ride', category: 'Suspension' },
  { description: 'Car bounces excessively', category: 'Suspension' },
  { description: 'Uneven tire wear', category: 'Suspension' },
];

const faults = [
  { fault_name: 'Worn Brake Pads', severity: 'Medium', description: 'Brake pads have worn down and need replacement', category: 'Brakes' },
  { fault_name: 'Engine Overheating', severity: 'High', description: 'Engine temperature is too high, could cause serious damage', category: 'Engine' },
  { fault_name: 'Dead Battery', severity: 'Medium', description: 'Battery cannot hold charge and needs replacement', category: 'Electrical' },
  { fault_name: 'Transmission Fluid Low', severity: 'Medium', description: 'Transmission fluid level is below minimum', category: 'Transmission' },
  { fault_name: 'Spark Plug Failure', severity: 'Low', description: 'One or more spark plugs are not functioning properly', category: 'Engine' },
  { fault_name: 'Coolant Leak', severity: 'High', description: 'Coolant is leaking from the cooling system', category: 'Cooling' },
  { fault_name: 'Fuel Pump Failure', severity: 'High', description: 'Fuel pump is not delivering fuel properly', category: 'Fuel' },
  { fault_name: 'Worn Shock Absorbers', severity: 'Medium', description: 'Shock absorbers are worn and affecting ride quality', category: 'Suspension' },
];

const solutions = [
  {
    fault_name: 'Worn Brake Pads',
    repair_action: 'Replace brake pads and inspect rotors for damage. Resurface or replace rotors if necessary.',
    estimated_cost: 250,
    difficulty_level: 'Medium',
    estimated_time: '2-3 hours',
    tools_required: ['Jack', 'Lug wrench', 'C-clamp', 'Socket set']
  },
  {
    fault_name: 'Engine Overheating',
    repair_action: 'Check coolant level, inspect for leaks, test thermostat, and check radiator condition.',
    estimated_cost: 150,
    difficulty_level: 'Medium',
    estimated_time: '1-2 hours',
    tools_required: ['Coolant tester', 'Basic tools', 'New coolant']
  },
  {
    fault_name: 'Dead Battery',
    repair_action: 'Test battery voltage and replace if necessary. Clean terminals and check charging system.',
    estimated_cost: 120,
    difficulty_level: 'Easy',
    estimated_time: '30 minutes',
    tools_required: ['Multimeter', 'Wire brush', 'Wrench set']
  },
  {
    fault_name: 'Transmission Fluid Low',
    repair_action: 'Check for leaks, add appropriate transmission fluid, and monitor levels regularly.',
    estimated_cost: 50,
    difficulty_level: 'Easy',
    estimated_time: '15 minutes',
    tools_required: ['Funnel', 'Transmission fluid']
  },
  {
    fault_name: 'Spark Plug Failure',
    repair_action: 'Remove and inspect spark plugs, replace worn plugs, and check ignition system.',
    estimated_cost: 80,
    difficulty_level: 'Easy',
    estimated_time: '1 hour',
    tools_required: ['Spark plug socket', 'Gap gauge', 'Torque wrench']
  },
  {
    fault_name: 'Coolant Leak',
    repair_action: 'Locate leak source, replace damaged hoses or gaskets, and refill cooling system.',
    estimated_cost: 200,
    difficulty_level: 'Medium',
    estimated_time: '2-4 hours',
    tools_required: ['Basic tools', 'New hoses/gaskets', 'Coolant']
  },
  {
    fault_name: 'Fuel Pump Failure',
    repair_action: 'Test fuel pressure, replace fuel pump if faulty, and check fuel filter.',
    estimated_cost: 400,
    difficulty_level: 'Hard',
    estimated_time: '4-6 hours',
    tools_required: ['Fuel pressure gauge', 'Jack stands', 'Socket set']
  },
  {
    fault_name: 'Worn Shock Absorbers',
    repair_action: 'Replace shock absorbers and inspect suspension components for additional wear.',
    estimated_cost: 300,
    difficulty_level: 'Medium',
    estimated_time: '3-4 hours',
    tools_required: ['Jack', 'Spring compressor', 'Socket set']
  },
];

export async function seedDatabase() {
  try {
    await connectToDatabase();
    console.log('Connected to database');

    // Clear existing data
    await Promise.all([
      Symptom.deleteMany({}),
      Fault.deleteMany({}),
      Solution.deleteMany({}),
      Rule.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Insert symptoms
    const insertedSymptoms = await Symptom.insertMany(symptoms);
    console.log(`Inserted ${insertedSymptoms.length} symptoms`);

    // Insert faults
    const insertedFaults = await Fault.insertMany(faults);
    console.log(`Inserted ${insertedFaults.length} faults`);

    // Insert solutions
    const solutionsWithFaultIds = [];
    for (const solution of solutions) {
      const fault = insertedFaults.find(f => f.fault_name === solution.fault_name);
      if (fault) {
        solutionsWithFaultIds.push({
          ...solution,
          fault_id: fault.fault_id
        });
      }
    }
    const insertedSolutions = await Solution.insertMany(solutionsWithFaultIds);
    console.log(`Inserted ${insertedSolutions.length} solutions`);

    // Create diagnostic rules
    const rules = [
      {
        fault_name: 'Worn Brake Pads',
        symptoms: ['Squealing brakes', 'Grinding noise when braking'],
        condition: 'IF squealing_brakes OR grinding_noise THEN worn_brake_pads',
        confidence_level: 90
      },
      {
        fault_name: 'Engine Overheating',
        symptoms: ['Engine overheating', 'Temperature gauge reading high', 'Steam from engine'],
        condition: 'IF engine_overheating AND (high_temp_gauge OR steam) THEN overheating',
        confidence_level: 95
      },
      {
        fault_name: 'Dead Battery',
        symptoms: ['Battery dies frequently', 'Engine won\'t start', 'Lights dimming'],
        condition: 'IF battery_dies_frequently OR (wont_start AND lights_dimming) THEN dead_battery',
        confidence_level: 85
      },
      {
        fault_name: 'Transmission Fluid Low',
        symptoms: ['Transmission slipping', 'Hard shifting', 'Delayed engagement'],
        condition: 'IF transmission_slipping OR hard_shifting THEN low_fluid',
        confidence_level: 80
      },
      {
        fault_name: 'Spark Plug Failure',
        symptoms: ['Engine misfiring', 'Rough idle', 'Loss of power'],
        condition: 'IF engine_misfiring AND rough_idle THEN spark_plug_failure',
        confidence_level: 85
      },
      {
        fault_name: 'Coolant Leak',
        symptoms: ['Coolant leak', 'Engine overheating', 'Temperature gauge reading high'],
        condition: 'IF coolant_leak OR (overheating AND high_temp) THEN coolant_leak',
        confidence_level: 90
      },
      {
        fault_name: 'Fuel Pump Failure',
        symptoms: ['Engine won\'t start', 'Engine stalls frequently', 'Loss of power'],
        condition: 'IF wont_start AND stalls_frequently THEN fuel_pump_failure',
        confidence_level: 75
      },
      {
        fault_name: 'Worn Shock Absorbers',
        symptoms: ['Bumpy ride', 'Car bounces excessively', 'Uneven tire wear'],
        condition: 'IF bumpy_ride AND excessive_bouncing THEN worn_shocks',
        confidence_level: 80
      }
    ];

    const rulesWithIds = [];
    for (const rule of rules) {
      const fault = insertedFaults.find(f => f.fault_name === rule.fault_name);
      const symptomIds = rule.symptoms.map(symptomDesc => {
        const symptom = insertedSymptoms.find(s => s.description === symptomDesc);
        return symptom ? symptom.symptom_id : null;
      }).filter(Boolean);

      if (fault && symptomIds.length > 0) {
        rulesWithIds.push({
          fault_id: fault.fault_id,
          symptoms: symptomIds,
          condition: rule.condition,
          confidence_level: rule.confidence_level
        });
      }
    }

    const insertedRules = await Rule.insertMany(rulesWithIds);
    console.log(`Inserted ${insertedRules.length} rules`);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}