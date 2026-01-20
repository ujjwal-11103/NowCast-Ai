import React, { useState } from 'react';
import { Award, Medal, Trophy, ChevronDown, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react';

interface LeaderEntry {
  id: string;
  name: string;
  avgRating: number;
  totalVisits: number;
  safetyScore: number;
  badge: 'gold' | 'silver' | 'bronze' | null;
  feedback: {
    strengths: string[];
    improvements: string[];
    recentAchievements: string[];
  };
}

const mockLeaderData: LeaderEntry[] = [
  { 
    id: '1', 
    name: 'Sarah Chen', 
    avgRating: 4.9, 
    totalVisits: 847, 
    safetyScore: 98, 
    badge: 'gold',
    feedback: {
      strengths: ['Exceptional safety protocol adherence', 'Outstanding team leadership', 'Consistent quality delivery'],
      improvements: ['Could improve documentation speed', 'Consider cross-training in new equipment'],
      recentAchievements: ['Led zero-incident month in Q4', 'Implemented new safety checklist system', 'Mentored 3 junior staff members']
    }
  },
  { 
    id: '2', 
    name: 'Michael Rodriguez', 
    avgRating: 4.8, 
    totalVisits: 792, 
    safetyScore: 96, 
    badge: 'silver',
    feedback: {
      strengths: ['Strong analytical skills', 'Excellent problem-solving abilities', 'Great attention to detail'],
      improvements: ['Enhance communication with other departments', 'Focus on time management during peak hours'],
      recentAchievements: ['Reduced chemical waste by 15%', 'Completed advanced safety certification', 'Improved process efficiency by 8%']
    }
  },
  { 
    id: '3', 
    name: 'Emily Johnson', 
    avgRating: 4.7, 
    totalVisits: 756, 
    safetyScore: 94, 
    badge: 'bronze',
    feedback: {
      strengths: ['Innovative approach to processes', 'Strong technical knowledge', 'Reliable performance'],
      improvements: ['Develop leadership skills', 'Increase participation in safety meetings'],
      recentAchievements: ['Designed new quality control procedure', 'Achieved 100% compliance rating', 'Completed professional development course']
    }
  },
  { 
    id: '4', 
    name: 'David Park', 
    avgRating: 4.6, 
    totalVisits: 678, 
    safetyScore: 92, 
    badge: null,
    feedback: {
      strengths: ['Consistent work quality', 'Good team collaboration', 'Punctual and reliable'],
      improvements: ['Enhance safety protocol knowledge', 'Improve incident reporting timeliness'],
      recentAchievements: ['Completed equipment training', 'Maintained clean safety record', 'Assisted in training new employees']
    }
  },
  { 
    id: '5', 
    name: 'Lisa Wang', 
    avgRating: 4.5, 
    totalVisits: 634, 
    safetyScore: 90, 
    badge: null,
    feedback: {
      strengths: ['Strong work ethic', 'Adaptable to changes', 'Good customer service skills'],
      improvements: ['Focus on safety score improvement', 'Increase site visit frequency'],
      recentAchievements: ['Improved customer satisfaction scores', 'Completed chemical handling certification', 'Reduced processing time by 5%']
    }
  }
];

const getBadgeIcon = (badge: string | null) => {
  switch (badge) {
    case 'gold': return <Trophy className="text-yellow-500 drop-shadow-sm" size={24} />;
    case 'silver': return <Medal className="text-gray-400 drop-shadow-sm" size={24} />;
    case 'bronze': return <Award className="text-orange-600 drop-shadow-sm" size={24} />;
    default: return null;
  }
};

export const LeaderBoard: React.FC = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-gray-200/60">
        <h3 className="text-xl font-semibold text-gray-800">Performance Leaderboard</h3>
        <p className="text-sm text-gray-600 mt-1">Top performers by safety rating, visits, and overall excellence</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Performance Score</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Rating</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Visits</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockLeaderData.map((entry, index) => (
              <React.Fragment key={entry.id}>
                <tr className="hover:bg-gray-50/50 transition-colors duration-150">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300">
                        <span className="text-lg font-bold text-slate-700">#{index + 1}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        {getBadgeIcon(entry.badge)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="text-base font-semibold text-gray-900">{entry.name}</div>
                      {entry.badge && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          entry.badge === 'gold' 
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                            : entry.badge === 'silver' 
                            ? 'bg-gray-100 text-gray-700 border border-gray-200' 
                            : 'bg-orange-100 text-orange-800 border border-orange-200'
                        }`}>
                          {entry.badge.charAt(0).toUpperCase() + entry.badge.slice(1)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-center">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                      entry.safetyScore >= 95 
                        ? 'bg-green-100 text-green-800' 
                        : entry.safetyScore >= 90 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {entry.safetyScore}%
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-center">
                    <span className="text-sm font-medium text-gray-900">{entry.avgRating.toFixed(1)}</span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-center">
                    <span className="text-sm font-medium text-gray-900">{entry.totalVisits.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-center">
                    <button
                      onClick={() => toggleRow(entry.id)}
                      className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors duration-200"
                    >
                      <MessageSquare size={14} className="mr-1" />
                      Feedback
                      <ChevronDown 
                        size={14} 
                        className={`ml-1 transition-transform duration-200 ${
                          expandedRows.has(entry.id) ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                  </td>
                </tr>
                
                {expandedRows.has(entry.id) && (
                  <tr>
                    <td colSpan={6} className="px-6 py-6 bg-gray-50/30">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Strengths */}
                        <div className="bg-white rounded-lg p-4 border border-green-200/60">
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <h4 className="text-sm font-semibold text-green-800">Strengths</h4>
                          </div>
                          <ul className="space-y-2">
                            {entry.feedback.strengths.map((strength, idx) => (
                              <li key={idx} className="text-xs text-gray-700 flex items-start">
                                <span className="w-1 h-1 bg-green-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Areas for Improvement */}
                        <div className="bg-white rounded-lg p-4 border border-orange-200/60">
                          <div className="flex items-center space-x-2 mb-3">
                            <TrendingUp size={12} className="text-orange-600" />
                            <h4 className="text-sm font-semibold text-orange-800">Areas for Improvement</h4>
                          </div>
                          <ul className="space-y-2">
                            {entry.feedback.improvements.map((improvement, idx) => (
                              <li key={idx} className="text-xs text-gray-700 flex items-start">
                                <span className="w-1 h-1 bg-orange-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Recent Achievements */}
                        <div className="bg-white rounded-lg p-4 border border-blue-200/60">
                          <div className="flex items-center space-x-2 mb-3">
                            <Award size={12} className="text-blue-600" />
                            <h4 className="text-sm font-semibold text-blue-800">Recent Achievements</h4>
                          </div>
                          <ul className="space-y-2">
                            {entry.feedback.recentAchievements.map((achievement, idx) => (
                              <li key={idx} className="text-xs text-gray-700 flex items-start">
                                <span className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};