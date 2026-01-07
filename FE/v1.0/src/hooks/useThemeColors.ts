import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const useThemeColors = () => {
    const isNightMode = useSelector((state: RootState) => state.theme.isNightMode);

    const colors = {
        background: isNightMode ? '#121212' : '#FDFDFD',
        card: isNightMode ? '#1E1E1E' : '#FFFFFF',
        text: isNightMode ? '#FFFFFF' : '#000000',
        subText: isNightMode ? '#AAAAAA' : '#666666',
        border: isNightMode ? '#333333' : '#E0E0E0',
        primary: '#60A5FA', // Blue remains standard
        icon: isNightMode ? '#FFFFFF' : '#2D2D2D',
        iconBg: isNightMode ? '#333333' : '#F5F6FA',
        inputBg: isNightMode ? '#2C2C2C' : '#FFFFFF',
        placeholder: isNightMode ? '#888888' : '#999999',
    };

    return { isNightMode, colors };
};
