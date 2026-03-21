interface AvatarProps {
  src: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const dotSizes = {
  xs: 'w-2 h-2',
  sm: 'w-2.5 h-2.5',
  md: 'w-3 h-3',
  lg: 'w-3.5 h-3.5',
  xl: 'w-4 h-4',
};

export default function Avatar({ src, alt, size = 'md', isOnline, className = '' }: AvatarProps) {
  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
      {isOnline !== undefined && (
        <div
          className={`absolute bottom-0 right-0 ${dotSizes[size]} rounded-full border-2 border-white ${
            isOnline ? 'bg-green-500' : 'bg-outline-variant'
          }`}
        />
      )}
    </div>
  );
}
