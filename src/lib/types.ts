export type Request = {
  id: string;
  name: string;
  status: "pending" | "approved" | "rejected";
};

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "paid";
};

export type Commission = {
  paymentId: string;
  amount: number;
};

export type ProviderPayment = {
  id: string;
  paymentId: string;
  providerName: string;
  amount: number;
  status: "pending" | "paid";
};

export type Service = {
  id: string;
  companyId: string;
  name: string;
  status: "active" | "completed";
  price: number;
};
