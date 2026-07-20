import { NextGenWorkspace } from "@/components/platform-next"

type WorkspacePlaceholderProps = {
  title: string
  description: string
  milestoneNote?: string
  comingSoon?: boolean
}

export function WorkspacePlaceholder({
  title,
  description,
  milestoneNote = "Coming in upcoming milestone",
  comingSoon = false,
}: WorkspacePlaceholderProps) {
  return (
    <NextGenWorkspace
      pageTitle={title}
      pageDescription={`${description} ${comingSoon ? "This center is staged for phased rollout." : milestoneNote}.`}
      centerLabel="AIOS Platform Center"
      emphasis={comingSoon ? "roadmap" : "standard"}
    />
  )
}
