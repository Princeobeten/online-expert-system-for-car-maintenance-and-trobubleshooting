import mongoose from 'mongoose';

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://user_db_user:r279PhhU0dKXoOsI@fuzzy-based-expert-syst.2cx2z6f.mongodb.net/car-maintenance-and-trobubleshooting?retryWrites=true&w=majority';

// Define schemas
const SymptomSchema = new mongoose.Schema({
  symptom_id: String,
  description: String,
  category: String
}, { timestamps: true });

const RuleSchema = new mongoose.Schema({
  rule_id: String,
  fault_id: String,
  symptoms: [String],
  condition: String,
  confidence_level: Number
}, { timestamps: true });

const FaultSchema = new mongoose.Schema({
  fault_id: String,
  fault_name: String,
  severity: String,
  description: String,
  category: String
}, { timestamps: true });

const SolutionSchema = new mongoose.Schema({
  solution_id: String,
  fault_id: String,
  repair_action: String,
  estimated_cost: Number,
  difficulty_level: String,
  estimated_time: String,
  tools_required: [String]
}, { timestamps: true });

const Symptom = mongoose.model('Symptom', SymptomSchema);
const Rule = mongoose.model('Rule', RuleSchema);
const Fault = mongoose.model('Fault', FaultSchema);
const Solution = mongoose.model('Solution', SolutionSchema);

// Additional faults and solutions
const additionalFaults = [
  { fault_name: 'Brake Fluid Low', severity: 'High', description: 'Brake fluid level is critically low', category: 'Brakes' },
  { fault_name: 'Brake Master Cylinder Failure', severity: 'Critical', description: 'Master cylinder is not functioning properly', category: 'Brakes' },
  { fault_name: 'Alternator Failure', severity: 'High', description: 'Alternator is not charging the battery properly', category: 'Electrical' },
  { fault_name: 'Starter Motor Failure', severity: 'High', description: 'Starter motor is not engaging properly', category: 'Electrical' },
  { fault_name: 'Thermostat Failure', severity: 'Medium', description: 'Thermostat is stuck open or closed', category: 'Cooling' },
  { fault_name: 'Radiator Blockage', severity: 'High', description: 'Radiator is blocked and not cooling properly', category: 'Cooling' },
  { fault_name: 'Fuel Filter Clogged', severity: 'Medium', description: 'Fuel filter is restricting fuel flow', category: 'Fuel' },
  { fault_name: 'Fuel Injector Problems', severity: 'Medium', description: 'One or more fuel injectors are clogged or faulty', category: 'Fuel' },
  { fault_name: 'Strut Failure', severity: 'Medium', description: 'Struts are worn and need replacement', category: 'Suspension' },
  { fault_name: 'Ball Joint Wear', severity: 'High', description: 'Ball joints are worn and affecting steering', category: 'Suspension' },
  { fault_name: 'Clutch Wear', severity: 'Medium', description: 'Clutch is slipping and needs replacement', category: 'Transmission' },
  { fault_name: 'Transmission Solenoid Failure', severity: 'High', description: 'Transmission solenoid is not functioning', category: 'Transmission' }
];

const additionalSolutions = [
  {
    fault_name: 'Brake Fluid Low',
    repair_action: 'Check for leaks, repair any damaged brake lines, and refill brake fluid.',
    estimated_cost: 100,
    difficulty_level: 'Medium',
    estimated_time: '1-2 hours',
    tools_required: ['Brake fluid', 'Basic tools', 'Jack']
  },
  {
    fault_name: 'Brake Master Cylinder Failure',
    repair_action: 'Replace brake master cylinder and bleed brake system.',
    estimated_cost: 300,
    difficulty_level: 'Hard',
    estimated_time: '3-4 hours',
    tools_required: ['Master cylinder', 'Brake fluid', 'Bleeding kit']
  },
  {
    fault_name: 'Alternator Failure',
    repair_action: 'Test charging system, replace alternator if faulty.',
    estimated_cost: 400,
    difficulty_level: 'Medium',
    estimated_time: '2-3 hours',
    tools_required: ['Multimeter', 'Socket set', 'New alternator']
  },
  {
    fault_name: 'Starter Motor Failure',
    repair_action: 'Test starter motor, replace if not engaging properly.',
    estimated_cost: 250,
    difficulty_level: 'Medium',
    estimated_time: '1-2 hours',
    tools_required: ['Socket set', 'Multimeter', 'New starter']
  },
  {
    fault_name: 'Thermostat Failure',
    repair_action: 'Replace thermostat and refill cooling system.',
    estimated_cost: 80,
    difficulty_level: 'Easy',
    estimated_time: '1 hour',
    tools_required: ['New thermostat', 'Coolant', 'Basic tools']
  },
  {
    fault_name: 'Radiator Blockage',
    repair_action: 'Flush cooling system, clean or replace radiator if necessary.',
    estimated_cost: 150,
    difficulty_level: 'Medium',
    estimated_time: '2-3 hours',
    tools_required: ['Radiator flush', 'New coolant', 'Basic tools']
  },
  {
    fault_name: 'Fuel Filter Clogged',
    repair_action: 'Replace fuel filter and check fuel system for contamination.',
    estimated_cost: 60,
    difficulty_level: 'Easy',
    estimated_time: '30 minutes',
    tools_required: ['New fuel filter', 'Basic tools']
  },
  {
    fault_name: 'Fuel Injector Problems',
    repair_action: 'Clean or replace fuel injectors, check fuel system pressure.',
    estimated_cost: 200,
    difficulty_level: 'Medium',
    estimated_time: '2-3 hours',
    tools_required: ['Injector cleaner', 'Pressure gauge', 'Basic tools']
  },
  {
    fault_name: 'Strut Failure',
    repair_action: 'Replace worn struts and check wheel alignment.',
    estimated_cost: 400,
    difficulty_level: 'Hard',
    estimated_time: '4-5 hours',
    tools_required: ['New struts', 'Spring compressor', 'Alignment tools']
  },
  {
    fault_name: 'Ball Joint Wear',
    repair_action: 'Replace worn ball joints and check suspension components.',
    estimated_cost: 200,
    difficulty_level: 'Hard',
    estimated_time: '3-4 hours',
    tools_required: ['Ball joint press', 'New ball joints', 'Torque wrench']
  },
  {
    fault_name: 'Clutch Wear',
    repair_action: 'Replace clutch disc, pressure plate, and release bearing.',
    estimated_cost: 800,
    difficulty_level: 'Professional',
    estimated_time: '6-8 hours',
    tools_required: ['Transmission jack', 'Clutch alignment tool', 'Complete clutch kit']
  },
  {
    fault_name: 'Transmission Solenoid Failure',
    repair_action: 'Replace faulty solenoid and check transmission fluid.',
    estimated_cost: 300,
    difficulty_level: 'Hard',
    estimated_time: '3-4 hours',
    tools_required: ['New solenoid', 'Transmission fluid', 'Special tools']
  }
];

async function addMoreRules() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to database');

    // Get all symptoms
    const symptoms = await Symptom.find();
    console.log('Found symptoms:', symptoms.length);

    // Add additional faults
    const existingFaults = await Fault.find();
    const newFaults = [];
    
    for (const faultData of additionalFaults) {
      const exists = existingFaults.find(f => f.fault_name === faultData.fault_name);
      if (!exists) {
        newFaults.push({
          ...faultData,
          fault_id: new mongoose.Types.ObjectId().toString()
        });
      }
    }

    if (newFaults.length > 0) {
      const insertedFaults = await Fault.insertMany(newFaults);
      console.log('Added new faults:', insertedFaults.length);
    }

    // Get all faults (including new ones)
    const allFaults = await Fault.find();

    // Add solutions for new faults
    const existingSolutions = await Solution.find();
    const newSolutions = [];

    for (const solutionData of additionalSolutions) {
      const fault = allFaults.find(f => f.fault_name === solutionData.fault_name);
      if (fault) {
        const exists = existingSolutions.find(s => s.fault_id === fault.fault_id);
        if (!exists) {
          newSolutions.push({
            ...solutionData,
            fault_id: fault.fault_id,
            solution_id: new mongoose.Types.ObjectId().toString()
          });
        }
      }
    }

    if (newSolutions.length > 0) {
      await Solution.insertMany(newSolutions);
      console.log('Added new solutions:', newSolutions.length);
    }

    // Create comprehensive rules for all symptoms
    const newRules = [
      // Brake rules
      {
        fault_name: 'Brake Fluid Low',
        symptoms: ['Brake pedal feels spongy', 'Brake warning light on'],
        condition: 'IF spongy_pedal OR brake_warning THEN low_brake_fluid',
        confidence_level: 85
      },
      {
        fault_name: 'Brake Master Cylinder Failure',
        symptoms: ['Brake pedal feels spongy', 'Car pulls to one side when braking'],
        condition: 'IF spongy_pedal AND pulling THEN master_cylinder_failure',
        confidence_level: 80
      },
      
      // Electrical rules
      {
        fault_name: 'Alternator Failure',
        symptoms: ['Battery dies frequently', 'Lights dimming', 'Electrical components not working'],
        condition: 'IF battery_dies AND (lights_dimming OR electrical_issues) THEN alternator_failure',
        confidence_level: 90
      },
      {
        fault_name: 'Starter Motor Failure',
        symptoms: ['Engine won\'t start', 'Check engine light on'],
        condition: 'IF wont_start AND check_engine_light THEN starter_failure',
        confidence_level: 75
      },
      
      // Cooling rules
      {
        fault_name: 'Thermostat Failure',
        symptoms: ['Engine overheating', 'Temperature gauge reading high'],
        condition: 'IF overheating AND high_temp_gauge THEN thermostat_failure',
        confidence_level: 80
      },
      {
        fault_name: 'Radiator Blockage',
        symptoms: ['Engine overheating', 'Steam from engine', 'Temperature gauge reading high'],
        condition: 'IF overheating AND steam AND high_temp THEN radiator_blockage',
        confidence_level: 85
      },
      
      // Fuel rules
      {
        fault_name: 'Fuel Filter Clogged',
        symptoms: ['Engine hesitation during acceleration', 'Poor fuel economy', 'Loss of power'],
        condition: 'IF hesitation AND poor_economy THEN clogged_filter',
        confidence_level: 80
      },
      {
        fault_name: 'Fuel Injector Problems',
        symptoms: ['Engine misfiring', 'Poor fuel economy', 'Rough idle'],
        condition: 'IF misfiring AND poor_economy THEN injector_problems',
        confidence_level: 85
      },
      
      // Suspension rules
      {
        fault_name: 'Strut Failure',
        symptoms: ['Bumpy ride', 'Car bounces excessively'],
        condition: 'IF bumpy_ride AND excessive_bouncing THEN strut_failure',
        confidence_level: 90
      },
      {
        fault_name: 'Ball Joint Wear',
        symptoms: ['Uneven tire wear', 'Car pulls to one side when braking'],
        condition: 'IF uneven_wear AND pulling THEN ball_joint_wear',
        confidence_level: 80
      },
      
      // Transmission rules
      {
        fault_name: 'Clutch Wear',
        symptoms: ['Hard shifting', 'Transmission slipping'],
        condition: 'IF hard_shifting AND slipping THEN clutch_wear',
        confidence_level: 85
      },
      {
        fault_name: 'Transmission Solenoid Failure',
        symptoms: ['Delayed engagement', 'Hard shifting', 'Transmission slipping'],
        condition: 'IF delayed_engagement AND hard_shifting THEN solenoid_failure',
        confidence_level: 80
      },
      
      // Additional single-symptom rules for better coverage
      {
        fault_name: 'Fuel Pump Failure',
        symptoms: ['Fuel smell'],
        condition: 'IF fuel_smell THEN possible_fuel_pump_issue',
        confidence_level: 60
      },
      {
        fault_name: 'Engine Overheating',
        symptoms: ['Excessive exhaust smoke'],
        condition: 'IF excessive_smoke THEN possible_overheating',
        confidence_level: 70
      }
    ];

    // Convert symptom descriptions to IDs and create rules
    const existingRules = await Rule.find();
    const rulesToAdd = [];

    for (const ruleData of newRules) {
      const fault = allFaults.find(f => f.fault_name === ruleData.fault_name);
      if (fault) {
        const symptomIds = ruleData.symptoms.map(symptomDesc => {
          const symptom = symptoms.find(s => s.description === symptomDesc);
          return symptom ? symptom.symptom_id : null;
        }).filter(Boolean);

        if (symptomIds.length > 0) {
          // Check if rule already exists
          const exists = existingRules.find(r => 
            r.fault_id === fault.fault_id && 
            JSON.stringify(r.symptoms.sort()) === JSON.stringify(symptomIds.sort())
          );

          if (!exists) {
            rulesToAdd.push({
              rule_id: new mongoose.Types.ObjectId().toString(),
              fault_id: fault.fault_id,
              symptoms: symptomIds,
              condition: ruleData.condition,
              confidence_level: ruleData.confidence_level
            });
          }
        }
      }
    }

    if (rulesToAdd.length > 0) {
      await Rule.insertMany(rulesToAdd);
      console.log('Added new rules:', rulesToAdd.length);
    }

    // Summary
    const totalRules = await Rule.countDocuments();
    const totalFaults = await Fault.countDocuments();
    const totalSolutions = await Solution.countDocuments();

    console.log('\n=== SUMMARY ===');
    console.log(`Total Rules: ${totalRules}`);
    console.log(`Total Faults: ${totalFaults}`);
    console.log(`Total Solutions: ${totalSolutions}`);
    console.log('\nDatabase updated successfully!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

addMoreRules().then(() => process.exit(0));