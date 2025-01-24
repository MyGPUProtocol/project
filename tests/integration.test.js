import { describe, it, expect, beforeEach, afterEach } from 'jest';
import GPUOptimizer from '../chatbot/core/optimizer';
import PlatformAnalyzer from '../chatbot/core/platformAnalyzer';
import ResponseGenerator from '../chatbot/core/responseGenerator';

// Constants for test data
const TEST_CONSTANTS = {
  TIMEOUT: 5000,
  LARGE_DATASET_SIZE: 1000,
  DEFAULT_USER_INPUT: {
    workloadType: 'machine learning training',
    budget: 'moderate',
    technicalExpertise: 'intermediate',
    performance: {
      highAvailability: true,
      scalability: true
    }
  }
};

// Test data factory
const createTestData = (overrides = {}) => ({
  ...TEST_CONSTANTS.DEFAULT_USER_INPUT,
  ...overrides
});

describe('Integration Tests', () => {
  let optimizer;
  let analyzer;
  let responseGenerator;
  let mockPlatformData;

  beforeEach(() => {
    // Initialize components
    optimizer = new GPUOptimizer();
    analyzer = new PlatformAnalyzer();
    responseGenerator = new ResponseGenerator();

    // Setup mock data
    mockPlatformData = {
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
  });

  afterEach(() => {
    // Clean up any test data or mocks
    jest.clearAllMocks();
  });

  describe('End-to-End Optimization Flow', () => {
    it('should handle complete optimization process', async () => {
      const userInput = createTestData();

      const results = await Promise.all([
        optimizer.analyzeRequirements(userInput),
        analyzer.analyzeUserRequirements(userInput),
        optimizer.generateOptimizationPlan(userInput)
      ]);

      const [requirements, platformAnalysis, optimizationPlan] = results;
      const response = responseGenerator.generatePlatformRecommendation(platformAnalysis);

      // Comprehensive assertions
      expect(response).toMatchObject({
        type: 'recommendation',
        content: {
          recommendations: expect.any(Array)
        }
      });
      expect(optimizationPlan).toBeDefined();
      expect(requirements).toBeDefined();
    });

    it('should generate accurate cost analysis with proper formatting', async () => {
      const costMetrics = {
        current: 1500,
        projected: 1000,
        timeline: '3 months',
        savings: {
          percentage: 33.33,
          amount: 500
        }
      };

      const response = responseGenerator.generateCostAnalysis(costMetrics);
      const formatted = responseGenerator.formatResponse(response);

      // Enhanced assertions for cost analysis
      expect(formatted).toMatch(/\$1,500/);
      expect(formatted).toMatch(/\$1,000/);
      expect(formatted).toMatch(/3 months/);
      expect(formatted).toMatch(/33.33%/);
      expect(formatted).toMatch(/\$500/);
    });
  });

  describe('Platform-Specific Optimizations', () => {
    it('should provide detailed platform recommendations with validation', async () => {
      const requirements = {
        computeNeeds: { level: 'high' },
        budget: { isConstrained: true },
        performance: { priority: 'high' }
      };

      const recommendations = await optimizer.getPlatformSpecificRecommendations(
        'akashNetwork',
        requirements
      );

      // Detailed validation of recommendations
      expect(recommendations).toBeInstanceOf(Array);
      recommendations.forEach(rec => {
        expect(rec).toMatchObject({
          type: expect.any(String),
          steps: expect.any(Array),
          priority: expect.any(String),
          impact: expect.any(String)
        });
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle missing or invalid input gracefully', async () => {
      const testCases = [
        { input: {}, expectedError: false },
        { input: { workloadType: '' }, expectedError: false },
        { input: null, expectedError: true }
      ];

      for (const testCase of testCases) {
        try {
          const result = await optimizer.analyzeRequirements(testCase.input);
          if (!testCase.expectedError) {
            expect(result).toHaveProperty('computeNeeds');
          }
        } catch (error) {
          if (!testCase.expectedError) {
            throw error;
          }
          expect(error).toBeDefined();
        }
      }
    });

    it('should handle platform data inconsistencies', async () => {
      const requirements = {
        computeNeeds: { level: 'high' }
      };

      const platforms = ['nonexistentPlatform', 'akashNetwork', ''];
      
      for (const platform of platforms) {
        const recommendations = await optimizer.getPlatformSpecificRecommendations(
          platform,
          requirements
        );

        expect(recommendations).toBeInstanceOf(Array);
        if (platform === 'akashNetwork') {
          expect(recommendations.length).toBeGreaterThan(0);
        } else {
          expect(recommendations).toHaveLength(0);
        }
      }
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle large datasets within performance constraints', async () => {
      const startTime = performance.now();
      
      const largeInput = Array(TEST_CONSTANTS.LARGE_DATASET_SIZE)
        .fill(null)
        .map(() => createTestData());

      const results = await Promise.all(
        largeInput.map(input => optimizer.analyzeRequirements(input))
      );

      const processingTime = performance.now() - startTime;

      expect(results).toHaveLength(TEST_CONSTANTS.LARGE_DATASET_SIZE);
      expect(processingTime).toBeLessThan(TEST_CONSTANTS.TIMEOUT);
      
      // Validate result consistency
      results.forEach(result => {
        expect(result).toMatchObject({
          computeNeeds: expect.any(Object),
          recommendations: expect.any(Array)
        });
      });
    });
  });

  describe('Data Consistency and Reliability', () => {
    it('should provide consistent recommendations across multiple runs', async () => {
      const input = createTestData();
      const numberOfRuns = 5;
      const results = [];

      for (let i = 0; i < numberOfRuns; i++) {
        results.push(await optimizer.analyzeRequirements(input));
      }

      // Compare all results with the first one
      const firstResult = results[0];
      results.slice(1).forEach(result => {
        expect(result).toEqual(firstResult);
      });
    });
  });
});