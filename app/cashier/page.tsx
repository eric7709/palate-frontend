"use client"
import { useRouter } from 'next/navigation'

export default function page() {
  const router = useRouter()

  router.push("/cashier/orders")

  return <div />
}
