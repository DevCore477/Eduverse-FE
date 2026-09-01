import {
    LockIcon,
    NetworkErrorIcon,
    SuccessTick,
    TryAgainIcon,
} from "@/assets/images";

export const ToastConfig = {
  userNotFound: {
    text: "User Not Found",
    icon: TryAgainIcon,
  },
  invalid: {
    text: "Invalid Credentials",
    icon: NetworkErrorIcon,
  },
  passwordUpdated: {
    text: "Password Updated Successfully",
    icon: SuccessTick,
  },
  network: {
    text: "Kindly check your internet connection and try again",
    icon: NetworkErrorIcon,
  },
  retry: {
    text: "Try Again Later",
    icon: TryAgainIcon,
  },
  paymentFail: {
    text: "Payment Failed",
    icon: TryAgainIcon,
  },
  paymentSucces: {
    text: "Payment Succes",
    icon: TryAgainIcon,
  },
  invalidPin: {
    text: "Invalid PIN",
    icon: TryAgainIcon,
  },
  forgotEmailSuccess: {
    text: "Email Sent Successfully",
    icon: SuccessTick,
  },
  updatePassSuccess: {
    text: "Password updated Successfully",
    icon: SuccessTick,
  },
  emailNotRegistered: {
    text: "Email not registered",
    icon: TryAgainIcon,
  },
  ratingSuccess: {
    text: "Thank you for your feedback",
    icon: SuccessTick,
  },
  JourneyLock: {
    text: "Complete Lesson Intro and Video First",
    icon: LockIcon,
  },
  freeTrailOfferAvailed: {
    text: "You have already availed this offer",
    icon: TryAgainIcon,
  },
  manualPaymentReview: {
    text: "Account will be activated with-in 24 hours",
    icon: LockIcon,
  },
  sessionExpired: {
    text: "Session expired. Please login again",
    icon: TryAgainIcon,
  },
  unauthorized: {
    text: "Unauthorized access. Please login again",
    icon: TryAgainIcon,
  },
};

export type ToastType = keyof typeof ToastConfig;
