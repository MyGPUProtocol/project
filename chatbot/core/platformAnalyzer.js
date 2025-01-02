import _ from 'lodash';

class PlatformAnalyzer {
  constructor() {
    this.platformProfiles = {
      netmindAI: {
        strengths: ['intuitive interface', 'competitive pricing', 'easy to use'],
        weaknesses: ['limited support', 'incomplete documentation', 'variable performance'],
        idealWorkloads: ['startups', 'simple AI projects', 'academic research'],
        costStructure: {
          base: 'low',
          scaling: 'linear',
          minimumCommitment: 'none'
        }
      },
      akashNetwork: {
        strengths: ['cost-effective', 'highly customizable', 'robust infrastructure'],
        weaknesses: ['technical complexity', 'difficult CLI', 'storage issues'],
        idealWorkloads: ['expert developers', 'kubernetes deployments', 'scalable solutions'],
        costStructure: {
          base: 'very low',
          scaling: 'flexible',
          minimumCommitment: 'none'
        }
      }
      // Additional platforms...
    };
  }

  analyzeUserRequirements(requirements) {
    const analysis = {
      recommendedPlatforms: [],
      reasoning: {},
      costProjections: {}
    };

    for (const [platform, profile] of Object.entries(this.platformProfiles)) {
      const score = this.calculatePlatformScore(requirements, profile);
      analysis.recommendedPlatforms.push({
        platform,
        score,
        reasoning: this.generateReasoning(requirements, profile)
      });
    }

    // Sort platforms by score
    analysis.recommendedPlatforms = _.orderBy(analysis.recommendedPlatforms, ['score'], ['desc']);

    return analysis;
  }

  calculatePlatformScore(requirements, profile) {
    let score = 0;
    
    // Workload compatibility
    if (profile.idealWorkloads.some(workload => 
      requirements.workloadType.toLowerCase().includes(workload.toLowerCase()))) {
      score += 30;
    }

    // Budget alignment
    if (requirements.budget) {
      score += this.calculateBudgetScore(requirements.budget, profile.costStructure);
    }

    // Technical requirements
    if (requirements.technicalExpertise) {
      score += this.calculateTechnicalScore(requirements.technicalExpertise, profile);
    }

    // Performance needs
    if (requirements.performance) {
      score += this.calculatePerformanceScore(requirements.performance, profile);
    }

    return score;
  }

  calculateBudgetScore(budget, costStructure) {
    const scores = {
      'very low': 25,
      'low': 20,
      'moderate': 15,
      'high': 10
    };
    return scores[costStructure.base] || 0;
  }

  calculateTechnicalScore(expertise, profile) {
    const expertiseScores = {
      'beginner': profile.strengths.includes('easy to use') ? 20 : 5,
      'intermediate': 15,
      'expert': profile.strengths.includes('highly customizable') ? 20 : 10
    };
    return expertiseScores[expertise.toLowerCase()] || 10;
  }

  calculatePerformanceScore(requirements, profile) {
    let score = 0;
    if (requirements.highAvailability && profile.strengths.includes('robust infrastructure')) {
      score += 15;
    }
    if (requirements.scalability && profile.strengths.includes('highly customizable')) {
      score += 15;
    }
    return score;
  }

  generateReasoning(requirements, profile) {
    const reasoning = [];

    // Strength alignment
    const matchingStrengths = profile.strengths.filter(strength =>
      this.matchesRequirement(strength, requirements)
    );
    if (matchingStrengths.length > 0) {
      reasoning.push(`Aligns with needs: ${matchingStrengths.join(', ')}`);
    }

    // Potential concerns
    const relevantWeaknesses = profile.weaknesses.filter(weakness =>
      this.isRelevantWeakness(weakness, requirements)
    );
    if (relevantWeaknesses.length > 0) {
      reasoning.push(`Consider these aspects: ${relevantWeaknesses.join(', ')}`);
    }

    return reasoning;
  }

  matchesRequirement(strength, requirements) {
    // Implementation for matching strengths to requirements
    const strengthKeywords = {
      'cost-effective': ['budget', 'cost', 'pricing'],
      'easy to use': ['beginner', 'simple', 'user-friendly'],
      'highly customizable': ['complex', 'custom', 'flexible']
    };

    const keywords = strengthKeywords[strength] || [strength];
    return keywords.some(keyword => 
      JSON.stringify(requirements).toLowerCase().includes(keyword.toLowerCase())
    );
  }

  isRelevantWeakness(weakness, requirements) {
    // Implementation for determining if a weakness is relevant
    const criticalAreas = {
      'limited support': ['production', 'enterprise'],
      'technical complexity': ['beginner', 'simple'],
      'storage issues': ['data', 'storage', 'database']
    };

    const areas = criticalAreas[weakness] || [weakness];
    return areas.some(area =>
      JSON.stringify(requirements).toLowerCase().includes(area.toLowerCase())
    );
  }
}

export default PlatformAnalyzer;