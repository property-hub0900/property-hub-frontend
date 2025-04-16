interface Transaction {
    id: string
    subscriptionId?: string
    points?: number
    date: string
    amount: number
    status: "successful" | "pending" | "failed" | "active" | "expired"
    paymentMethod: string
    invoiceUrl?: string
    method?: string
    type?: string
    endDate?: string
    createdAt?: string
}