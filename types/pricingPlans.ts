import { TAuthResponse } from "./auth";

export type TPlan = {
  id: string;
  planCode: string;
  name: string;
  price: number;
  maxDevices: number;
  maxProfiles: number;
  allowedYears: string;
  description: string;
  createdAt: Date;
};

export type TPurchasePlanQueryBody = {
  parentId: string,
  planId: string,
  user: TAuthResponse | null
}

export type TRequestManualPayment = {
  planId: string
  screenshotBase64?:string
  requestType?: string
}