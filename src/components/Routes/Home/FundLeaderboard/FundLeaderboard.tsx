import React, { useState } from 'react';

import { FundBadgesOverview } from './FundBadgesOverview';
import { FundBadgeDirectory } from './FundBadgeDirectory';

export const FundLeaderboard: React.FC = () => {
  const [showDirectory, setShowDirectory] = useState(false);

  if (showDirectory) {
    return <FundBadgeDirectory setShowDirectory={setShowDirectory} />;
  }

  return <FundBadgesOverview setShowDirectory={setShowDirectory} />;
};
