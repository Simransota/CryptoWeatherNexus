import { CryptoDetail } from "@/components/crypto/crypto-detail"

export default function CryptoDetailPage({ params }: { params: { id: string } }) {
  return <CryptoDetail cryptoId={params.id} />
}
