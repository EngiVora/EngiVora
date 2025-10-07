import type { Metadata } from "next"
import React from "react"
import DiscountsClient from "./DiscountsClient"

export const metadata: Metadata = {
  title: "Engivora - Discounts & Offers",
  description: "Exclusive deals, coupon codes, affiliate offers, and referrals for students.",
}

export default function DiscountsPage() {
  return <DiscountsClient />
}


