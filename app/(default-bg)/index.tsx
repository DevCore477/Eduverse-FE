    import IntroScreen from "@/screens/Intro";

export default function NedjmatiApp() {
    return <IntroScreen />
}


// import { JourneyBg2PNG } from "@/assets/images";
// import { Image } from "expo-image";
// import { useEffect, useRef, useState } from "react";
// import {
//     Dimensions,
//     NativeScrollEvent,
//     NativeSyntheticEvent,
//     ScrollView,
//     Text,
//     TextStyle,
//     View,
//     ViewStyle
// } from "react-native";

// // Define types for level mapping
// type LevelPosition = {
//   index: number;
//   left: number;  // Percentage from 0 to 1
//   top: number;   // Percentage from 0 to 1
// };

// // Define types for grouped levels
// type LevelGroup = number[];

// // Define LEVEL_MAPPING with position details as percentages (0-1) for better scaling
// const LEVEL_MAPPING: LevelPosition[] = [
//   { index: 1, left: 0.05, top: 0.1 },    // 5% from left, 10% from top
//   { index: 2, left: 0.37, top: 0.1 },    // 37% from left, 10% from top
//   { index: 3, left: 0.69, top: 0.1 },    // 69% from left, 10% from top
//   { index: 4, left: 0.05, top: 0.4 },    // 5% from left, 40% from top
//   { index: 5, left: 0.37, top: 0.4 },    // 37% from left, 40% from top
//   { index: 6, left: 0.69, top: 0.4 },    // 69% from left, 40% from top
//   { index: 7, left: 0.05, top: 0.7 },    // 5% from left, 70% from top
//   { index: 8, left: 0.37, top: 0.7 },    // 37% from left, 70% from top
// ];

// export default function NedjmatiApp() {
//   const scrollViewRef = useRef<ScrollView>(null);
//   const [currentPage, setCurrentPage] = useState<number>(0);
  
//   // Full screen dimensions
//   const [containerHeight, setContainerHeight] = useState<number>(0);
//   const [containerWidth, setContainerWidth] = useState<number>(0);
  
//   // Array of levels
//   const level: number[] = Array.from({ length: 16 }, (_, i) => i + 1);
//   const levelPerImage: number = 8;

//   // Group the levels into chunks
//   const groupedLevels: LevelGroup[] = [];
//   for (let i = 0; i < level.length; i += levelPerImage) {
//     groupedLevels.push(level.slice(i, i + levelPerImage));
//   }

//   // Calculate full screen dimensions
//   useEffect(() => {
//     const { width, height } = Dimensions.get('window');
//     setContainerHeight(height+80);
//     setContainerWidth(width);
//   }, []);

//   // Handle scroll to detect current page
//   const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
//     const offsetY = event.nativeEvent.contentOffset.y;
//     const pageIndex = Math.round(offsetY / containerHeight);
//     setCurrentPage(pageIndex);
//   };

//   // Define styles
//   const scrollViewContentStyle: ViewStyle = { 
//     flexGrow: 1,
//   };

//   const pageContainerStyle: ViewStyle = { 
//     height: containerHeight,
//     width: containerWidth,
//     position: 'relative' as const,
//   };

//   const imageContainerStyle: ViewStyle = { 
//     flex: 1,
//     justifyContent: 'center' as const,
//     alignItems: 'center' as const,
//   };

//   const imageStyle: ViewStyle = { 
//     width: containerWidth, 
//     height: containerHeight,
//     resizeMode: 'cover' as const, // Changed to cover for full screen
//   };

//   const levelContainerStyle = (top: number, left: number): ViewStyle => ({
//     position: 'absolute' as const,
//     top,
//     left,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 20,
//     paddingHorizontal: 12,
//     // paddingVertical: 6,
//     zIndex: 1,
//   });

//   const levelTextStyle: TextStyle = {
//     color: 'white',
//     fontWeight: 'bold' as const,
//     fontSize: 14,
//     textAlign: 'center' as const,
//   };

//   // Loading state
//   if (containerHeight === 0 || containerWidth === 0) {
//     const loadingContainerStyle: ViewStyle = { 
//       flex: 1, 
//       justifyContent: 'center' as const, 
//       alignItems: 'center' as const 
//     };
    
//     return (
//       <View style={loadingContainerStyle}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       <ScrollView
//         ref={scrollViewRef}
//         contentContainerStyle={scrollViewContentStyle}
//         showsVerticalScrollIndicator={false}
//         pagingEnabled={true}
//         snapToInterval={containerHeight}
//         snapToAlignment="start"
//         decelerationRate="fast"
//         onScroll={handleScroll}
//         scrollEventThrottle={16}
//         bounces={false} // Disable bounce effect for cleaner paging
//       >
//         {groupedLevels.map((levelGroup: LevelGroup, groupIndex: number) => (
//           <View 
//             key={groupIndex} 
//             style={pageContainerStyle}
//           >
//             <Image
//               source={JourneyBg2PNG}
//               style={imageStyle}
//             />
            
//             {/* Render levels for this page */}
//             {levelGroup.map((lvl: number, idx: number) => {
//               const levelData: LevelPosition = LEVEL_MAPPING[idx];
//               // Calculate positions based on full screen
//               const absoluteLeft: number = levelData.left * containerWidth;
//               const absoluteTop: number = levelData.top * containerHeight;

//               return (
//                 <View
//                   key={lvl}
//                   style={levelContainerStyle(absoluteTop, absoluteLeft)}
//                 >
//                   <Text style={levelTextStyle}>
//                     Level {lvl}
//                   </Text>
//                 </View>
//               );
//             })}
//           </View>
//         ))}
//       </ScrollView>

//       {/* Current page indicator */}
//       <View style={{
//         position: 'absolute' as const,
//         top: 50,
//         alignSelf: 'center' as const,
//         backgroundColor: 'rgba(0,0,0,0.7)',
//         paddingHorizontal: 20,
//         // paddingVertical: 10,
//         borderRadius: 20,
//         zIndex: 2,
//       }}>
//         <Text style={{
//           color: 'white',
//           fontWeight: 'bold' as const,
//           fontSize: 16,
//         }}>
//           Page {currentPage + 1} of {groupedLevels.length}
//         </Text>
//       </View>
//     </View>
//   );
// }
