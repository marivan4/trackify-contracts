
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ManualFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const ManualFeatureCard: React.FC<ManualFeatureCardProps> = ({ 
  icon: Icon,
  title, 
  description 
}) => {
  return (
    <div className="p-4 border rounded-xl flex flex-col items-center text-center">
      <Icon size={24} className="text-blue-500 mb-2" />
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">
        {description}
      </p>
    </div>
  );
};

export default ManualFeatureCard;
