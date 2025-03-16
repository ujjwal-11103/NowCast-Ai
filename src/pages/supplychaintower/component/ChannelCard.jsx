import React from 'react';

const ChannelCard = ({ logo, state, doh, age, fillRate }) => {
  const getFillRateColor = (rate) => {
    if (rate >= 75) return 'text-emerald-600';
    if (rate >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg-hover transition-all p-5 border border-neutral-100">
      <img src={logo} alt="Channel logo" className="h-8 mb-4" />
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-neutral-600">State:</span>
          <span className="font-medium text-primary">{state}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-neutral-600">DOH:</span>
          <span className="font-medium text-primary-light">{doh}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-neutral-600">Age:</span>
          <span className="font-medium text-primary">{age}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-neutral-600">Fill Rate:</span>
          <span className={`font-medium ${getFillRateColor(fillRate)}`}>
            {fillRate}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChannelCard;
