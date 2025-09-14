export function calculateMaintenanceCalories({ age, weightLbs, heightFt, heightIn, gender, activityLevel }) {
  
    // Convert weight & height to metric
    const weightKg = weightLbs / 2.20462;
    const heightCm = (heightFt * 12 + heightIn) * 2.54;

    // BMR calculations
    const bmrMale = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    const bmrFemale = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

    // Activity multipliers
    const activityMultipliers = {
        bmr: 1.0,
        sedentary: 1.2,
        light_exercise: 1.375,
        moderate_exercise: 1.55,
        active: 1.725,
        very_active: 1.9,
        extra_active: 2.0 
    };

    const multiplier = activityMultipliers[activityLevel];
    if (!multiplier) {
        throw new Error("Invalid activity level");
    }

    // Handle gender options
    if (gender.toLowerCase() === "male") {
        return Math.round(bmrMale * multiplier);
    } else if (gender.toLowerCase() === "female") {
        return Math.round(bmrFemale * multiplier);
    } else if (gender.toLowerCase() === "non-binary") {
        // midpoint between male & female
        const bmrMid = (bmrMale + bmrFemale) / 2;
        return Math.round(bmrMid * multiplier);
    } else {
        throw new Error("Gender must be 'male', 'female', or 'non-binary'");
    }
}