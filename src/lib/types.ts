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
