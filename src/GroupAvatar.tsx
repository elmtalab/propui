import React from 'react';
import { getGroupCoverUrl } from './api';

interface GroupAvatarProps {
  groupId: string | number;
  className?: string;
  alt?: string;
}

const GroupAvatar: React.FC<GroupAvatarProps> = ({ groupId, className, alt }) => {
  const url = getGroupCoverUrl(String(groupId));
  return (
    <img
      src={url}
      className={className}
      style={{ borderRadius: '50%', objectFit: 'cover' }}
      alt={alt ?? String(groupId)}
    />
  );
};

export default GroupAvatar;
