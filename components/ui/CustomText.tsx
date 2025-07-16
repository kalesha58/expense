// import { Colors } from '@utils/Constants';
// import React from 'react';
// import { Platform, StyleSheet, TextStyle, Text } from 'react-native';
// import { RFValue } from 'react-native-responsive-fontsize';
// export type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h7' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'overline'
// export type PlatformType = 'ios' | 'android' | 'web'

// export interface CustomTextProps {
//     variant?: Variant
//     platform?: Platform
//     fontFamily?: 'Okra-Bold' | 'Okra-Regular' | 'Okra-Light' | 'Okra-Medium' | 'Okra-SemiBold' | 'Okra-ExtraBold' | 'Okra-Black'
//     fontSize?: number;
//     color?: string;
//     style?: TextStyle | TextStyle[];
//     children: React.ReactNode;
//     numberOfLines?: number;
//     onLayout?: (event: any) => void;
// }

// const fontSizeMap: Record<Variant, Record<PlatformType, number>> = {
//     h1: { ios: 96, android: 24, web: 96 },
//     h2: { ios: 60, android: 22, web: 60 },
//     h3: { ios: 48, android: 20, web: 48 },
//     h4: { ios: 34, android: 18, web: 34 },
//     h5: { ios: 24, android: 16, web: 24 },
//     h6: { ios: 20, android: 14, web: 20 },
//     h7: { ios: 16, android: 12, web: 16 },
//     subtitle1: { ios: 16, android: 16, web: 16 },
//     subtitle2: { ios: 14, android: 14, web: 14 },
//     body1: { ios: 16, android: 16, web: 16 },
//     body2: { ios: 14, android: 14, web: 14 },
//     caption: { ios: 12, android: 12, web: 12 },
//     overline: { ios: 10, android: 10, web: 10 },
// };


// const CustomText: React.FC<CustomTextProps> = ({ variant , fontFamily = 'Okra-Bold', fontSize, color, children, numberOfLines, onLayout, style, ...props }) => {
//     let computedFontSize: number = Platform.OS === 'android' ? RFValue(fontSize || 12) : RFValue(fontSize || 12);
//     if (variant && fontSizeMap[variant]) {
//         const defaultSize = fontSizeMap[variant][Platform.OS as PlatformType];
//         computedFontSize = RFValue(fontSize || defaultSize);
//     }

//     const fontFamilyStyle = { fontFamily };
//     return (
//         <Text onLayout={onLayout} style={[styles.text, { color: color || Colors.text, fontSize: computedFontSize }, fontFamilyStyle, style]} numberOfLines={numberOfLines !== undefined ? numberOfLines : undefined} {...props}>
//             {children}
//         </Text>
//     );
// };

// export default CustomText;
// const styles = StyleSheet.create({
//     text: {
//         textAlign: 'left',
//     },
// });

