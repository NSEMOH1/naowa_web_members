import React from 'react';

interface GradientButtonProps {
    children: React.ReactNode;
    color?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    className?: string;
}

const GradientButton: React.FC<GradientButtonProps> = ({
    children,
    color = 'white',
    onClick,
    type = 'button',
    disabled = false,
    className = ''
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`px- py-3 rounded-md font-medium transition-all hover:opacity-90 ${className}`}
            style={{
                color: color,
                background: '#982323',
                border: 'none',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1,
                padding: 10
            }}
        >
            {children}
        </button>
    );
};

export default GradientButton;