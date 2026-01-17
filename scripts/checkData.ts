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

const Symptom = mongoose.model('Symptom', SymptomSchema);
const Rule = mongoose.model('Rule', RuleSchema);
const Fault = mongoose.model('Fault', FaultSchema);

async function checkData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to database');

    // Check symptoms
    const symptoms = await Symptom.find().limit(5);
    console.log('\n=== SYMPTOMS (first 5) ===');
    symptoms.forEach(symptom => {
      console.log(`ID: ${symptom.symptom_id}, Description: ${symptom.description}, Category: ${symptom.category}`);
    });

    // Check rules
    const rules = await Rule.find().limit(3);
    console.log('\n=== RULES (first 3) ===');
    rules.forEach(rule => {
      console.log(`Rule ID: ${rule.rule_id}`);
      console.log(`Fault ID: ${rule.fault_id}`);
      console.log(`Symptoms: ${rule.symptoms.join(', ')}`);
      console.log(`Confidence: ${rule.confidence_level}%`);
      console.log('---');
    });

    // Check faults
    const faults = await Fault.find().limit(3);
    console.log('\n=== FAULTS (first 3) ===');
    faults.forEach(fault => {
      console.log(`ID: ${fault.fault_id}, Name: ${fault.fault_name}, Severity: ${fault.severity}`);
    });

    // Test a specific rule
    console.log('\n=== TESTING BRAKE PAD RULE ===');
    const brakeSymptoms = await Symptom.find({
      description: { $in: ['Squealing brakes', 'Grinding noise when braking'] }
    });
    console.log('Brake symptoms found:');
    brakeSymptoms.forEach(symptom => {
      console.log(`- ${symptom.symptom_id}: ${symptom.description}`);
    });

    const brakeRule = await Rule.findOne({ fault_id: { $exists: true } });
    if (brakeRule) {
      console.log('Sample rule symptoms:', brakeRule.symptoms);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

checkData().then(() => process.exit(0));