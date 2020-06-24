import React, { useState } from 'react';

import { FundBadgesOverview } from './FundBadgesOverview';
import { FundBadgeDetails } from './FundBadgeDetails';
import { FundBadgeDirectory } from './FundBadgeDirectory';

export const FundBadges: React.FC = () => {
  const [badge, setBadge] = useState('overview');

  if (badge === 'directory') {
    return <FundBadgeDirectory setBadge={setBadge} />;
  }

  if (badge !== 'overview') {
    return <FundBadgeDetails badge={badge} setBadge={setBadge} />;
  }

  return <FundBadgesOverview setBadge={setBadge} />;
};
