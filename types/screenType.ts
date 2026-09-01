export const ScreenType = {
    pricingPlan: {
        key: "pricingPlan",
        url: "/pricing-plans"
    },
    upgradePricingPlan: {
        key: "upgradePricingPlan",
        url: "/pricing-plans"
    },
    intro: {
        key: "intro",
        url: "/"
    },
    pupilListing: {
        key: "pupilListing",
        url: "/pupil-listing"
    },
    paymentMethod: {
        key: "paymentMethod",
        url: "/payment-method"
    },
    paymentCardDetails: {
        key: "paymentCardDetails",
        url: "/payment-card-details"
    },
    creatPin:{
        key:"createPin",
        url:"/create-pin"
    }
}

export type ScreenTypeKey = keyof typeof ScreenType;