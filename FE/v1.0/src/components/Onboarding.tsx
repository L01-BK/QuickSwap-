import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Animated, TouchableOpacity, Image, useWindowDimensions } from 'react-native';

const slides = [
    {
        id: '1',
        title: '"ĐAU VÍ" VÌ GIÁO TRÌNH MỚI?',
        description: 'Chào mừng đến với QuickSwap! Chúng tôi hiểu rằng mỗi học kỳ mới là một "cuộc chiến" với chi phí tài liệu. Đừng lo, đây là nơi giúp bạn tìm và trao đổi giáo trình, dụng cụ học tập với chi phí tiết kiệm nhất.',
        image: require('../../assets/images/slide1.png'),
    },
    {
        id: '2',
        title: 'TÌM THỨ BẠN CẦN.\nNGAY & LUÔN!',
        description: 'Bạn cần tài liệu "Giải tích 1" hay một chiếc máy tính cho kỳ thi? Dễ dàng tìm kiếm, lọc theo trường, khoa, hoặc môn học. Thấy là "swap" ngay với cộng đồng sinh viên đã được xác thực.',
        image: require('../../assets/images/slide2.png'),
    },
    {
        id: '3',
        title: 'ĐỒ CŨ LÀ "KHO BÁU"',
        description: 'Đừng để giáo trình cũ "bám bụi" trong góc. Hãy đăng, tặng, hoặc trao đổi chúng trên QuickSwap. Vừa giúp bạn bè, vừa lại "dọn kho"!',
        image: require('../../assets/images/slide3.png'),
    },
];

interface OnboardingItemProps {
    item: typeof slides[0];
}

function OnboardingItem({ item }: OnboardingItemProps) {
    const { width } = useWindowDimensions();

    return (
        <View style={[styles.itemContainer, { width }]}>
            <View style={styles.imageContainer}>
                <Image source={item.image} style={[styles.image, { width: width * 0.8, resizeMode: 'contain' }]} />
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    );
}

interface PaginatorProps {
    data: any[];
    scrollX: Animated.Value;
}

function Paginator({ data, scrollX }: PaginatorProps) {
    const { width } = useWindowDimensions();

    return (
        <View style={styles.paginatorContainer}>
            {data.map((_, i) => {
                const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [10, 20, 10],
                    extrapolate: 'clamp',
                });

                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                });

                return (
                    <Animated.View
                        style={[styles.dot, { width: dotWidth, opacity }]}
                        key={i.toString()}
                    />
                );
            })}
        </View>
    );
}

interface OnboardingProps {
    onFinish: () => void;
    onLogin: () => void;
    onRegister: () => void;
}

export default function Onboarding({ onFinish, onLogin, onRegister }: OnboardingProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef<FlatList>(null);

    const viewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems && viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollTo = () => {
        if (currentIndex < slides.length - 1) {
            slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            onFinish();
        }
    };

    const skip = () => {
        onFinish();
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 3 }}>
                <FlatList
                    data={slides}
                    renderItem={({ item }) => <OnboardingItem item={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                        useNativeDriver: false,
                    })}
                    scrollEventThrottle={32}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                />
            </View>

            <View style={styles.footer}>
                <Paginator data={slides} scrollX={scrollX} />

                <View style={styles.buttonContainer}>
                    {currentIndex === slides.length - 1 ? (
                        <View style={{ width: '100%', paddingHorizontal: 40 }}>
                            <TouchableOpacity style={[styles.button, { marginBottom: 10 }]} onPress={onLogin}>
                                <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={onRegister}>
                                <Text style={[styles.buttonText, styles.buttonTextOutline]}>ĐĂNG KÍ</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ width: '100%', paddingHorizontal: 40 }}>
                            <TouchableOpacity style={[styles.button, { marginBottom: 10 }]} onPress={scrollTo}>
                                <Text style={styles.buttonText}>TIẾP THEO</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={skip}>
                                <Text style={[styles.buttonText, styles.buttonTextOutline]}>BỎ QUA</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingTop: 50,
    },
    // OnboardingItem styles
    itemContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        flex: 0.6,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    image: {
        flex: 0.8,
        justifyContent: 'center',
    },
    content: {
        flex: 0.4,
        paddingHorizontal: 40,
        alignItems: 'center',
    },
    title: {
        fontWeight: '800',
        fontSize: 24,
        marginBottom: 10,
        color: '#3B4161',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    description: {
        fontWeight: '400',
        fontSize: 15,
        lineHeight: 22,
        color: '#000000',
        textAlign: 'center',
    },
    // Paginator styles
    paginatorContainer: {
        flexDirection: 'row',
        height: 64,
    },
    dot: {
        height: 6,
        borderRadius: 3,
        backgroundColor: '#60A5FA',
        marginHorizontal: 8,
    },
    // Main footer styles
    footer: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 40,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#60A5FA',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
    },
    buttonOutline: {
        backgroundColor: 'transparent',
        borderColor: '#DDDDDD',
        borderWidth: 1,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    buttonTextOutline: {
        color: '#000000',
    }
});
