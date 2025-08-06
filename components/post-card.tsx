import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface PostCardProps {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string | null
    email: string
  }
}

export function PostCard({ id, content, createdAt, author }: PostCardProps) {
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true })

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar>
          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${author.name || author.email}`} />
          <AvatarFallback>{author.name ? author.name[0] : author.email[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <Link href={`/profile/${author.id}`} className="font-semibold hover:underline">
            {author.name || author.email}
          </Link>
          <span className="text-sm text-muted-foreground">{timeAgo}</span>
        </div>
      </CardHeader>
      <CardContent className="text-base">
        <p>{content}</p>
      </CardContent>
    </Card>
  )
}
