import type { Metadata } from "next";
import { OrdersView } from "@/components/orders-view";

export const metadata: Metadata = { title: "คำสั่งซื้อ" };

export default function OrdersPage() { return <OrdersView />; }
