import Button from "@/components/Button";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { useAppSelector } from "@/store/hooks";
import { styles } from "@/styles/screens/AddPupil/AddPupilForm.style";
import { TParent, TUpdateParent } from "@/types/parent";
import { ParentData, ParentSchema } from "@/types/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef } from "react";
import { Controller, useForm, UseFormSetError } from "react-hook-form";
import {
    KeyboardAvoidingView,
    ScrollView,
    Text,
    TextInput,
    View
} from "react-native";

interface EditParentFormProps {
    onFormSubmit: (data: TUpdateParent, setError: UseFormSetError<ParentData>) => void;
    parentData: TParent | undefined
}

export default function EditParentForm({ onFormSubmit, parentData }: EditParentFormProps) {
    const theme = useTheme();
    const { t, isRTL } = useTranslation()
    const themedStyles = styles(theme, isRTL);
    const hasInitialized = useRef(false);
    const user = useAppSelector((state) => state.parent.parent);

    // get the data 
    const {
        control,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm<ParentData>({
        resolver: zodResolver(ParentSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            identifier: "",
            pinCode: "",
        },
    });

    useEffect(() => {
        if (parentData && !hasInitialized.current) {
            reset({
                firstName: parentData.firstName ?? "",
                lastName: parentData.lastName ?? "",
                identifier: parentData.identifier ?? "",
                pinCode: parentData.pinCode ?? "",
            });
            hasInitialized.current = true;
        }
    }, [parentData, reset]);

    const onSubmit = (data: ParentData) => {
        // onFormSubmit(data, setError);
        // console.log(data)
        const updatedData: TUpdateParent = {
            ...data,
            token: user?.token
        }
        onFormSubmit(updatedData, setError)
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="height"
            keyboardVerticalOffset={400}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 14, width: "100%" }}>
                        {/* First Name */}
                        <View style={{ flex: 1, gap: 8 }}>
                            <Text style={themedStyles.label}>{t("parentProfileEdit.firstName")}</Text>
                            <Controller
                                control={control}
                                name="firstName"
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        placeholder={t("parentProfileEdit.enterFirstName")}
                                        placeholderTextColor={theme.placeHolderText}
                                        value={value}
                                        onChangeText={onChange}
                                        style={themedStyles.input}
                                    />
                                )}
                            />
                            {errors.firstName && <Text style={themedStyles.error}>{errors.firstName.message}</Text>}
                        </View>

                        {/* Last Name */}
                        <View style={{ flex: 1, gap: 8 }}>
                            <Text style={themedStyles.label}>{t("parentProfileEdit.lastName")}</Text>
                            <Controller
                                control={control}
                                name="lastName"
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        placeholder={t("parentProfileEdit.enterLastName")}
                                        placeholderTextColor={theme.placeHolderText}
                                        value={value}
                                        onChangeText={onChange}
                                        style={themedStyles.input}
                                    />
                                )}
                            />
                            {errors.lastName && <Text style={themedStyles.error}>{errors.lastName.message}</Text>}
                        </View>
                    </View>

                    {/* Email */}
                    <View style={{ gap: 8 }}>

                        <Text style={themedStyles.label}>{t("parentProfileEdit.email")}</Text>
                        <Controller
                            control={control}
                            name="identifier"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    placeholder={t("parentProfileEdit.enterEmail")}
                                    placeholderTextColor={theme.placeHolderText}
                                    value={value}
                                    editable={false}
                                    onChangeText={onChange}
                                    autoCapitalize="none"
                                    style={[themedStyles.input, { color: theme.placeHolderText }]}
                                />
                            )}
                        />
                        {errors.identifier && <Text style={themedStyles.error}>{errors.identifier.message}</Text>}
                    </View>

                    {/* Pin Code */}
                    <Text style={themedStyles.label}>{t("parentProfileEdit.pinCode")}</Text>
                    <Controller
                        control={control}
                        name="pinCode"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                placeholder={t("parentProfileEdit.enterPin")}
                                placeholderTextColor={theme.placeHolderText}
                                value={value}
                                onChangeText={onChange}
                                style={themedStyles.input}
                            />
                        )}
                    />
                    {errors.pinCode && <Text style={themedStyles.error}>{errors.pinCode.message}</Text>}

                    <Button
                        text={t("parentProfileEdit.btnText")}
                        style={[themedStyles.button]}
                        textStyle={themedStyles.buttonText}
                        onPress={handleSubmit(onSubmit)}
                        isGradient={true}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
