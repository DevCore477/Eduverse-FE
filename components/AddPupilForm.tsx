import Button from "@/components/Button";
import RotatingDotsLoader from "@/components/RotatingDotsLoader";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { useGetAcademics } from "@/services/acdemics/AcdemicsQuery";
import { useAppSelector } from "@/store/hooks";
import { styles } from "@/styles/screens/AddPupil/AddPupilForm.style";
import { TPupil, TPupilCreate, TPupilUpdate } from "@/types/pupil";
import { PupilData, PupilSchema } from "@/types/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo } from "react";
import { Controller, useForm, UseFormSetError } from "react-hook-form";
import {
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import CustomDropdown from "./CustomDropDown"; // Import the custom dropdown component

interface AddPupilFormProps<T> {
  onFormSubmit: (data: T, setError: UseFormSetError<PupilData>) => void
  pupilData?: TPupil | undefined
}

export default function AddPupilForm<T extends TPupilCreate | TPupilUpdate>({
  onFormSubmit,
  pupilData,
}: AddPupilFormProps<T>) {
  const theme = useTheme();
  const { t, isRTL } = useTranslation();
  const themedStyles = styles(theme, isRTL);
  const user = useAppSelector((state) => state.parent.parent);

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<PupilData>({
    resolver: zodResolver(PupilSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      age: undefined,
      grade: "",
    },
  });

  const { data: academics, isPending, isError } = useGetAcademics({
    id: user?.user?.id || "",
    token: user?.token || "",
  });

  // Safe academics with validation
  const safeAcademics = useMemo(() => {
    if (!academics || !Array.isArray(academics)) return [];
    return academics
      .filter(acad => acad && acad.id && acad.name)
      .map(acad => ({
        ...acad,
        id: String(acad.id), // Ensure id is string for Picker
        name: acad.name?.replace("_", " ") || ""
      }));
  }, [academics]);

  const ageOptions = Array.from({ length: 6 }, (_, i) => i + 6);

  useEffect(() => {
    if (pupilData) {
      try {
        reset({
          firstName: pupilData.firstName || "",
          lastName: pupilData.lastName || "",
          age: pupilData.age || 6,
          grade: pupilData.currentYearId || "",
        });
      } catch (error) {
        console.warn('Failed to reset form data:', error);
      }
    }
  }, [pupilData, reset]);

  const onSubmit = (data: PupilData) => {
    console.log("pupil data ", data)
    try {
      const ageValue = data.age === null || data.age === undefined ? 6 : data.age;
      // EDIT case
      if (pupilData) {
        const updatedPupil: TPupilUpdate = {
          id: pupilData.id,
          ...data,
          age: ageValue,
          currentYearId: data.grade,
          token: user?.token,
        }

        onFormSubmit(updatedPupil as T, setError);
        return;
      }

      // CREATE case 
      const newPupil: TPupilCreate = {
        parentId: user?.user.id ?? "",
        ...data,
        age: ageValue,
        currentYearId: data.grade,
        token: user?.token,
      }

      onFormSubmit(newPupil as T, setError);

    } catch (error) {
      console.error('Form submission error:', error);
    }
  };


  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={{ flex: 1 }}>
        {/* First Name */}
        <Text style={themedStyles.label}>{t("pupilForm.firstName")}</Text>
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder={t("pupilForm.enterFirstName")}
              placeholderTextColor={theme.placeHolderText}
              value={value}
              onChangeText={onChange}
              style={themedStyles.input}
              autoCapitalize="words"
            />
          )}
        />
        {errors.firstName && <Text style={themedStyles.error}>{errors.firstName.message}</Text>}

        {/* Last Name */}
        <Text style={themedStyles.label}>{t("pupilForm.lastName")}</Text>
        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder={t("pupilForm.enterLastName")}
              placeholderTextColor={theme.placeHolderText}
              value={value}
              onChangeText={onChange}
              style={[themedStyles.input]}
              autoCapitalize="words"
            />
          )}
        />
        {errors.lastName && <Text style={themedStyles.error}>{errors.lastName.message}</Text>}

        {/* Age */}
        <Text style={themedStyles.label}>{t("pupilForm.age")}</Text>
        <Controller
          control={control}
          name="age"
          render={({ field: { onChange, value } }) => (
            <CustomDropdown
              options={ageOptions.map((age) => age.toString())}  // Pass options as strings
              selectedValue={value ? value.toString() : ""}  // Pass as string to match expected value
              onValueChange={(newValue) => {
                // Convert selected value to number before passing to form handler
                onChange(Number(newValue));
              }}
              theme={theme}
              dropDownTop={46}
              placeholder={t("pupilForm.selectAge")}
            />
          )}
        />
        {errors.age && <Text style={themedStyles.error}>{errors.age.message}</Text>}

        {/* Grade */}
        <Text style={themedStyles.label}>{t("pupilForm.grade")}</Text>
        {isPending ? (
          <View style={[themedStyles.input, { justifyContent: "center", alignItems: "center" }]}>
            <RotatingDotsLoader size={30} dotSize={6} color={theme.green} />
          </View>
        ) : (
          <Controller
            control={control}
            name="grade"
            render={({ field: { onChange, value } }) => (
              <CustomDropdown
                options={safeAcademics}  // Pass grade options
                selectedValue={safeAcademics.find((academics) => academics.id === value)?.name || ""}
                dropDownTop={56}
                onValueChange={onChange}  // Handle grade change
                theme={theme}
                placeholder={t("pupilForm.selectGrade")}
              />
            )}
          />
        )}
        {errors.grade && <Text style={themedStyles.error}>{errors.grade.message}</Text>}

        {!isPending && isError && (
          <Text style={themedStyles.error}>{t("pupilForm.notLoad")}</Text>
        )}

        <Button
          text={pupilData ? t("pupilForm.save") : t("pupilForm.confirm")}
          style={[themedStyles.button, { marginTop: 30 }]}
          textStyle={themedStyles.buttonText}
          onPress={handleSubmit(onSubmit)}
          isGradient={true}
        />
      </View>
    </ScrollView>
  );
}
