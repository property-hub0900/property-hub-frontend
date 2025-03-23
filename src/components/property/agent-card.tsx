import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/ui/user-avatar"

interface AgentCardProps {
    agent: {
        firstName: string
        lastName: string
        profilePhoto: string | null
    }
    company: {
        name: string
    }
    t: any
}

export function AgentCard({ agent, company, t }: AgentCardProps) {
    const agentName = `${agent.firstName} ${agent.lastName}`

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                    <UserAvatar
                        src={agent.profilePhoto}
                        firstName={agent.firstName}
                        lastName={agent.lastName}
                        size="lg"
                    />
                </div>
                <div>
                    <h3 className="font-semibold">{agentName}</h3>
                    <p className="text-sm text-muted-foreground">{company.name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
                <Button>{t("contact.call")}</Button>
                <Button variant="outline">{t("contact.whatsApp")}</Button>
                <Button variant="ghost">{t("contact.email")}</Button>
            </div>
        </div>
    )
}

