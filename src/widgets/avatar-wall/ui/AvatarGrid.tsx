import type { AvatarListItem } from '@/shared/api'
import { AvatarCard } from '@/entities/avatar'

interface AvatarGridProps {
  avatars: AvatarListItem[]
}

export function AvatarGrid({ avatars }: AvatarGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {avatars.map((avatar, i) => (
        <AvatarCard key={avatar.id ?? `avatar-${i}`} avatar={avatar} index={i} />
      ))}
    </div>
  )
}
