'use client'
import ModulePage from '@/app/components/module/ModulePage'
export default function Page({ params }: { params: { module: string } }) {
  return <ModulePage params={params} />
}
