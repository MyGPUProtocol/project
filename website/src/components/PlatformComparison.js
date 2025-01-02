import React, { useState, useEffect } from 'react';

const PlatformComparison = () => {
  const [platforms, setPlatforms] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState('performance');
  const [comparisonData, setComparisonData] = useState(null);

  useEffect(() => {
    // In real implementation, this would fetch from your API
    const fetchPlatformData = async () => {
      const data = {
        performance: {
          netmindAI: { score: 85, details: ['Intuitive interface', 'Fast deployment'] },
          akashNetwork: { score: 88, details: ['High customization', 'Robust infrastructure'] }
        },
        cost: {
          netmindAI: { score: 80, details: ['Competitive pricing', 'Flexible plans'] },
          akashNetwork: { score: 92, details: ['Cost-effective', 'Pay-as-you-go'] }
        },
        scalability: {
          netmindAI: { score: 82, details: ['Auto-scaling', 'Load balancing'] },
          akashNetwork: { score: 90, details: ['Kubernetes native', 'Distributed scaling'] }
        }
      };
      
      setComparisonData(data);
      setPlatforms(Object.keys(data[selectedFeature]));
    };

    fetchPlatformData();
  }, [selectedFeature]);

  const renderScoreCard = (platform, category) => {
    if (!comparisonData || !comparisonData[category] || !comparisonData[category][platform]) {
      return null;
    }

    const data = comparisonData[category][platform];
    
    return (
      <div className="bg-white rounded-lg shadow-md w-full mb-4 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{platform}</h3>
            <span className={`px-2 py-1 rounded-full text-sm ${
              data.score >= 85 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {data.score}/100
            </span>
          </div>
        </div>
        <div className="p-4">
          <ul className="list-disc pl-4">
            {data.details.map((detail, index) => (
              <li key={index} className="text-gray-600">{detail}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Platform Comparison</h2>
        <div className="flex gap-4 mb-6">
          {['performance', 'cost', 'scalability'].map((feature) => (
            <button
              key={feature}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedFeature === feature 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedFeature(feature)}
            >
              {feature.charAt(0).toUpperCase() + feature.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {platforms.map(platform => (
          <div key={platform}>
            {renderScoreCard(platform, selectedFeature)}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Detailed Comparison</h3>
          </div>
          <div className="p-4 overflow-x-auto">
            <div className="min-w-full">
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-3 bg-gray-50 border-b">
                  <div className="p-4 font-semibold">Feature</div>
                  {platforms.map(platform => (
                    <div key={platform} className="p-4 font-semibold">{platform}</div>
                  ))}
                </div>
                <div className="divide-y">
                  <div className="grid grid-cols-3">
                    <div className="p-4">Score</div>
                    {platforms.map(platform => (
                      <div key={platform} className="p-4">
                        {comparisonData?.[selectedFeature]?.[platform]?.score}/100
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3">
                    <div className="p-4">Key Benefits</div>
                    {platforms.map(platform => (
                      <div key={platform} className="p-4">
                        <ul className="list-disc pl-4">
                          {comparisonData?.[selectedFeature]?.[platform]?.details.map((detail, index) => (
                            <li key={index} className="text-gray-600">{detail}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformComparison;