import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    children?: React.ReactNode;
    isLoading?: boolean;
}

const variantStyles = {
    primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50',
    ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
};

const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        variant = 'secondary',
        size = 'md',
        icon,
        iconPosition = 'left',
        children,
        isLoading = false,
        className = '',
        disabled,
        ...props
    }, ref) => {
        const baseStyles = 'inline-flex items-center gap-2 rounded transition rounded disabled:opacity-50 disabled:cursor-not-allowed';
        const variantStyle = variantStyles[variant];
        const sizeStyle = sizeStyles[size];
        const combinedClassName = `${baseStyles} ${variantStyle} ${sizeStyle} ${className}`;

        const content = (
            <>
                {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
                {children && <span>{children}</span>}
                {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
            </>
        );

        return (
            <button
                ref={ref}
                className={combinedClassName}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {children && <span>{children}</span>}
                    </span>
                ) : (
                    content
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';
