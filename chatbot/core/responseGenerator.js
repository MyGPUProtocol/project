class ResponseGenerator {
    constructor() {
      this.responseTemplates = {
        platformRecommendation: {
          intro: [
            "Based on your requirements, here are the most suitable platforms:",
            "I've analyzed your needs and found these optimal solutions:",
            "Here are my top recommendations for your use case:"
          ],
          detail: [
            "Platform: {platform}\nKey Benefits:\n- {benefits}",
            "{platform} stands out because:\n- {benefits}",
            "Consider {platform} for these advantages:\n- {benefits}"
          ],
          conclusion: [
            "Would you like more specific details about any of these platforms?",
            "I can provide more detailed information about any platform you're interested in.",
            "Let me know if you'd like to explore any of these options in depth."
          ]
        },
        optimizationSuggestion: {
          intro: [
            "I've identified several optimization opportunities:",
            "Here are some ways to improve your current setup:",
            "Consider these optimization strategies:"
          ],
          detail: [
            "• {suggestion}\nExpected impact: {impact}",
            "• {suggestion}\nPotential improvement: {impact}",
            "• {suggestion}\nProjected benefit: {impact}"
          ],
          conclusion: [
            "Would you like step-by-step guidance on implementing these optimizations?",
            "I can help you implement any of these suggestions. Which interests you most?",
            "Let me know which optimization you'd like to tackle first."
          ]
        },
        costAnalysis: {
          intro: [
            "Here's my cost analysis breakdown:",
            "I've analyzed the cost implications:",
            "Let's look at the financial aspects:"
          ],
          detail: [
            "Current costs: ${current}\nProjected savings: ${savings}\nROI timeline: {timeline}",
            "Monthly spend: ${current}\nPotential reduction: ${savings}\nBreakeven point: {timeline}",
            "Cost structure: ${current}/month\nOptimization potential: ${savings}\nTimeframe: {timeline}"
          ],
          conclusion: [
            "Would you like a detailed cost optimization plan?",
            "I can create a custom cost reduction strategy. Interested?",
            "Let me know if you'd like to explore more cost-saving opportunities."
          ]
        }
      };
    }
  
    generatePlatformRecommendation(analysis) {
      const response = {
        type: 'recommendation',
        content: {
          intro: this.getRandomTemplate('platformRecommendation', 'intro'),
          recommendations: [],
          conclusion: this.getRandomTemplate('platformRecommendation', 'conclusion')
        }
      };
  
      analysis.recommendedPlatforms.forEach(platform => {
        const detail = this.getRandomTemplate('platformRecommendation', 'detail')
          .replace('{platform}', platform.platform)
          .replace('{benefits}', platform.reasoning.join('\n- '));
        response.content.recommendations.push(detail);
      });
  
      return response;
    }
  
    generateOptimizationSuggestion(optimizations) {
      const response = {
        type: 'optimization',
        content: {
          intro: this.getRandomTemplate('optimizationSuggestion', 'intro'),
          suggestions: [],
          conclusion: this.getRandomTemplate('optimizationSuggestion', 'conclusion')
        }
      };
  
      optimizations.forEach(opt => {
        const detail = this.getRandomTemplate('optimizationSuggestion', 'detail')
          .replace('{suggestion}', opt.suggestion)
          .replace('{impact}', opt.impact);
        response.content.suggestions.push(detail);
      });
  
      return response;
    }
  
    generateCostAnalysis(costData) {
      return {
        type: 'cost',
        content: {
          intro: this.getRandomTemplate('costAnalysis', 'intro'),
          analysis: this.getRandomTemplate('costAnalysis', 'detail')
            .replace('${current}', costData.current)
            .replace('${savings}', costData.projected)
            .replace('{timeline}', costData.timeline),
          conclusion: this.getRandomTemplate('costAnalysis', 'conclusion')
        }
      };
    }
  
    getRandomTemplate(category, type) {
      const templates = this.responseTemplates[category][type];
      return templates[Math.floor(Math.random() * templates.length)];
    }
  
    formatResponse(responseObject) {
      let formattedResponse = '';
  
      // Add intro
      formattedResponse += responseObject.content.intro + '\n\n';
  
      // Add main content based on response type
      switch (responseObject.type) {
        case 'recommendation':
          formattedResponse += responseObject.content.recommendations.join('\n\n');
          break;
        case 'optimization':
          formattedResponse += responseObject.content.suggestions.join('\n');
          break;
        case 'cost':
          formattedResponse += responseObject.content.analysis;
          break;
      }
  
      // Add conclusion
      formattedResponse += '\n\n' + responseObject.content.conclusion;
  
      return formattedResponse;
    }
  }
  
  export default ResponseGenerator;