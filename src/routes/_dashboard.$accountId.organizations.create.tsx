// src/routes/_dashboard.organizations.new.tsx
import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/contexts/AuthContext'
import { Spinner } from '@/components/Spinner'
import { OrganizationCreateSuccessScreen } from '@/components/organizations/OrganizationCreateSuccessScreen'
import { OrganizationForm } from '@/components/organizations/OrganizationForm'
import { PremiumRequiredScreen } from '@/components/organizations/PremiumRequiredScreen'

export const Route = createFileRoute(
  '/_dashboard/$accountId/organizations/create',
)({
  head: () => ({
    meta: [{ title: `Jedwal -- Create Organization` }],
  }),
  component: NewOrganizationPage,
})

function NewOrganizationPage() {
  const [createSuccess, setCreateSuccess] = useState(false)
  const [createdOrgName, setCreatedOrgName] = useState('')
  const { user, error, isLoading } = useAuth()

  const handleSuccess = (orgName: string) => {
    setCreatedOrgName(orgName)
    setCreateSuccess(true)
  }

  if (isLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] w-full p-6">
        <Spinner srText="loading org page" />
      </div>
    )
  }

  if (user.account_status === "free") {
    return <PremiumRequiredScreen/>
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] w-full p-6">
        <span>Something went wrong</span>
      </div>
    )
  }

  if (createSuccess) {
    return <OrganizationCreateSuccessScreen orgName={createdOrgName} />
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] w-full p-6">
      <OrganizationForm userId={user.id} onSuccess={handleSuccess} />
    </div>
  )
}
