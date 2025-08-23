"use client";

import {useParams, useRouter} from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { id: patientId } = useParams<{ id: string }>();
  return <div>Statistics Page for patient {patientId}</div>;
}