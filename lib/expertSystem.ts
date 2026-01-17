import { connectToDatabase } from './mongodb';
import Rule from '@/models/Rule';
import Fault from '@/models/Fault';
import Solution from '@/models/Solution';
import Symptom from '@/models/Symptom';

export interface DiagnosisResult {
  fault: any;
  solutions: any[];
  confidence: number;
  matchedSymptoms: string[];
}

export class ExpertSystemEngine {
  static async diagnose(selectedSymptoms: string[]): Promise<DiagnosisResult[]> {
    await connectToDatabase();

    try {
      console.log('Starting diagnosis with symptoms:', selectedSymptoms);
      
      // Get all rules with their associated faults
      const rules = await Rule.find();
      console.log('Found rules:', rules.length);
      
      const diagnoses: DiagnosisResult[] = [];

      for (const rule of rules) {
        console.log('Checking rule:', rule.rule_id, 'with symptoms:', rule.symptoms);
        
        // Calculate symptom match percentage
        const matchedSymptoms = rule.symptoms.filter((symptom: string) => {
          const isMatch = selectedSymptoms.includes(symptom);
          console.log(`Symptom ${symptom} match:`, isMatch);
          return isMatch;
        });
        
        console.log('Matched symptoms:', matchedSymptoms);
        const matchPercentage = (matchedSymptoms.length / rule.symptoms.length) * 100;
        console.log('Match percentage:', matchPercentage);
        
        // If match percentage is above threshold (e.g., 30% - lowered for testing)
        if (matchPercentage >= 30) {
          console.log('Rule passed threshold, getting fault details');
          
          // Get fault details
          const fault = await Fault.findOne({ fault_id: rule.fault_id });
          console.log('Found fault:', fault?.fault_name);
          
          if (fault) {
            // Get solutions for this fault
            const solutions = await Solution.find({ fault_id: fault.fault_id });
            console.log('Found solutions:', solutions.length);
            
            // Calculate confidence based on match percentage and rule confidence
            const confidence = Math.min(
              (matchPercentage * rule.confidence_level) / 100,
              100
            );

            diagnoses.push({
              fault,
              solutions,
              confidence: Math.round(confidence),
              matchedSymptoms
            });
          }
        }
      }

      console.log('Final diagnoses:', diagnoses.length);
      // Sort by confidence (highest first)
      return diagnoses.sort((a, b) => b.confidence - a.confidence);
    } catch (error) {
      console.error('Diagnosis error:', error);
      throw new Error('Failed to perform diagnosis');
    }
  }

  static async getSymptomsByCategory(): Promise<any> {
    await connectToDatabase();
    
    try {
      const symptoms = await Symptom.find().sort({ category: 1, description: 1 });
      
      // Group symptoms by category
      const groupedSymptoms = symptoms.reduce((acc, symptom) => {
        const category = symptom.category || 'Other';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(symptom);
        return acc;
      }, {} as Record<string, any[]>);

      return groupedSymptoms;
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      throw new Error('Failed to fetch symptoms');
    }
  }

  static async getAllSymptoms(): Promise<any[]> {
    await connectToDatabase();
    
    try {
      return await Symptom.find().sort({ description: 1 });
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      throw new Error('Failed to fetch symptoms');
    }
  }
}