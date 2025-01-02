import { describe, it, expect, beforeEach, jest } from 'jest';
import GPUOptimizer from '../chatbot/core/optimizer';
import PlatformAnalyzer from '../chatbot/core/platformAnalyzer';
import ResponseGenerator from '../chatbot/core/responseGenerator';

describe('Integration Tests', () => {
  let optimizer;
  let analyzer;
  let responseGenerator;

  beforeEach(() => {
    optimizer = new GPUOptimizer();
    analyzer = new PlatformAnalyzer();
    responseGenerator = new ResponseGenerator();
  });

  describe('End-to-End Optimization Flow', () => {
    it('should handle complete optimization process', async () => {
      // Sample user input
      const userInput = {
        workloadType: 'machine learning training',
        budget: 'moderate',
        technicalExpertise: 'intermediate',
        performance: {
          highAvailability: true,
          scalability: true
        }
      };

      // Test complete flow
      const requirements = await optimizer.analyzeRequirements(userInput);
      const platformAnalysis = analyzer.analyzeUserRequirements(requirements);
      const optimizationPlan = await optimizer.generateOptimizationPlan(platformAnalysis);
      const response = responseGenerator.generatePlatformRecommendation(platformAnalysis);

      // Verify response structure
      expect(response).toHaveProperty('type', 'recommendation');
      expect(response.content).toHaveProperty('recommendations');
      expect(response.content.recommendations.length).toBeGreaterThan(0);
    });

    it('should handle cost optimization scenarios', async () => {
      const costMetrics = {
        current: 1500,
        projected: 1000,
        timeline: '3 months'
      };

      const response = responseGenerator.generateCostAnalysis(costMetrics);
      const formatted = responseGenerator.formatResponse(response);

      expect(formatted).toContain('$1500');
      expect(formatted).toContain('$1000');
      expect(formatted).toContain('3 months');
    });
  });

  describe('Platform-Specific Optimizations', () => {
    it('should generate platform-specific recommendations', async () => {
      const requirements = {
        computeNeeds: { level: 'high' },
        budget: { isConstrained: true }
      };

      const recommendations = await optimizer.getPlatformSpecificRecommendations(
        'akashNetwork',
        requirements
      );

      expect(recommendations).toBeInstanceOf(Array);
      expect(recommendations[0]).toHaveProperty('type', 'optimization');
      expect(recommendations[0]).toHaveProperty('steps');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid user input gracefully', async () => {
      const invalidInput = {
        workloadType: '',
        budget: null
      };

      await expect(optimizer.analyzeRequirements(invalidInput))
        .resolves
        .toHaveProperty('computeNeeds');
    });

    it('should handle missing platform data', async () => {
      const requirements = {
        computeNeeds: { level: 'high' }
      };

      const recommendations = await optimizer.getPlatformSpecificRecommendations(
        'nonexistentPlatform',
        requirements
      );

      expect(recommendations).toBeInstanceOf(Array);
      expect(recommendations).toHaveLength(0);
    });
  });

  describe('Performance Testing', () => {
    it('should process large datasets efficiently', async () => {
      const startTime = Date.now();
      
      // Generate large dataset
      const largeInput = Array(1000).fill().map(() => ({
        workloadType: 'machine learning training',
        budget: 'moderate',
        technicalExpertise: 'intermediate',
        performance: {
          highAvailability: true,
          scalability: true
        }
      }));

      // Process each input
      const results = await Promise.all(
        largeInput.map(input => optimizer.analyzeRequirements(input))
      );

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      expect(results).toHaveLength(1000);
      expect(processingTime).toBeLessThan(5000); // Should process in under 5 seconds
    });
  });

  describe('Data Consistency', () => {
    it('should maintain consistent recommendations across multiple runs', async () => {
      const input = {
        workloadType: 'machine learning training',
        budget: 'moderate',
        technicalExpertise: 'intermediate'
      };

      const firstRun = await optimizer.analyzeRequirements(input);
      const secondRun = await optimizer.analyzeRequirements(input);

      expect(firstRun).toEqual(secondRun);
    });
  });
});

// Mock data for testing
const mockData = {
  platforms: {
    netmindAI: {
      strengths: ['intuitive interface', 'competitive pricing'],
      weaknesses: ['limited support']
    },
    akashNetwork: {
      strengths: ['cost-effective', 'highly customizable'],
      weaknesses: ['technical complexity']
    }
  }
};