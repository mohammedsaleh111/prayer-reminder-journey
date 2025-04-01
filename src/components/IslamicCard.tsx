
import React from 'react';
import { cn } from '@/lib/utils';

interface IslamicCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const IslamicCard: React.FC<IslamicCardProps> = ({ 
  children, 
  className,
  title
}) => {
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-md overflow-hidden",
      "border border-islamic-primary/10",
      "relative islamic-border",
      className
    )}>
      {title && (
        <div className="py-3 px-4 bg-islamic-primary/5 border-b border-islamic-primary/10">
          <h3 className="text-lg font-amiri text-islamic-primary">{title}</h3>
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default IslamicCard;
