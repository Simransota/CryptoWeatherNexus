import { CryptoDetail } from "@/components/crypto/crypto-detail"
import { use } from "react"

export default function CryptoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  return <CryptoDetail cryptoId={resolvedParams.id} />
}
