import React from 'react';

import RightArrow from "../../../../public/icons/arrow-right.svg";
import lamp from "../../../../public/icons/lamp-charge.svg";
import cup from "../../../../public/icons/cup.svg"
import dot from "../../../../public/icons/dot.svg"

interface IconProps {
    icon: 'RightArrow' | 'lamp' | 'cup' | 'dot'; // Add more icon names as needed
    width?: number;
    height?: number;
    className?: string;
}

const Icon = ({ icon, width = 24, height = 24, className }: IconProps) => {
    const icons = {
        RightArrow: RightArrow,
        lamp: lamp,
        cup: cup,
        dot: dot
    };

    const SelectedIcon = icons[icon];

    if (!SelectedIcon) {
        console.warn(`Icon "${icon}" not found`);
        return null;
    }

    return (
        <SelectedIcon width={width} height={height} className={className} />
    );
};

export default Icon;
