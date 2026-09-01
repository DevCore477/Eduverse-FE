import { ThemeType } from "@/types/global";
import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { Dimensions, Modal, Pressable, Text, View } from "react-native";

interface OptionType {
    id: string;
    name: string;
    grade: number;
    description: string;
}

interface CustomDropdownProps {
    options: string[] | OptionType[]; 
    selectedValue: string;
    onValueChange: (value: string) => void;
    theme: ThemeType;
    placeholder: string;
    dropDownTop: number;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
    options,
    selectedValue,
    onValueChange,
    theme,
    placeholder,
    dropDownTop
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const { width: screenWidth } = Dimensions.get("window");

    const handleSelect = (value: string) => {
        onValueChange(value);  
        setIsOpen(false);
    };

    const isObjectArray = Array.isArray(options) && typeof options[0] === 'object';
    return (
        <View style={{ position: "relative", marginBottom: 3 }}>
            <Pressable
                onPress={toggleDropdown}
                style={{
                    padding: 12,
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: theme.borderSecondary,
                }}
            >
                <Text style={{ color: selectedValue ? theme.text : theme.placeHolderText }}>
                    {selectedValue || placeholder}
                </Text>

                <AntDesign
                    name={isOpen ? "caret-up" : "caret-down"}  // Toggle icon based on `open` state
                    size={12}
                    color={theme.green}
                    style={{
                        position: "absolute",
                        right: 25,
                        top: "65%",
                    }}
                />
            </Pressable>

            {isOpen && (
                <Modal
                    transparent
                    animationType="fade"
                    visible={isOpen}
                    onRequestClose={toggleDropdown}
                >
                    <Pressable
                        style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.3)" }}
                        onPress={toggleDropdown}
                    >
                        <View
                            style={{
                                position: "absolute",
                                top: `${dropDownTop}%`,
                                backgroundColor: theme.dropdownBg,
                                padding: 16,
                                alignSelf: "center",
                                width: screenWidth * 0.9,
                                borderRadius: 10,
                            }}
                        >
                            {isObjectArray ? (
                                (options as OptionType[]).map((option) => (
                                    <Pressable
                                        key={option.id}
                                        onPress={() =>{ 
                                            console.log("id is ",option)
                                            handleSelect(option.id)}} // Pass the `id` for object options
                                        style={{ paddingVertical: 10 }}
                                    >
                                        <Text style={{ color: theme.text, fontSize: 16 }}>
                                            {option.name}
                                        </Text>
                                    </Pressable>
                                ))
                            ) : (
                                (options as string[]).map((option) => (
                                    <Pressable
                                        key={option}
                                        onPress={() => handleSelect(option)} // Pass the option as a string
                                        style={{ paddingVertical: 10 }}
                                    >
                                        <Text style={{ color: theme.text, fontSize: 16 }}>{option}</Text>
                                    </Pressable>
                                ))
                            )}
                        </View>
                    </Pressable>
                </Modal>
            )}
        </View>
    );
};

export default CustomDropdown;
