import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { User } from "lucide-react";

export function UserAvatar() {
  const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar");

  return (
    <Avatar>
      {userAvatar && (
        <AvatarImage
          src={userAvatar.imageUrl}
          alt={userAvatar.description}
          data-ai-hint={userAvatar.imageHint}
        />
      )}
      <AvatarFallback>
        <User />
      </AvatarFallback>
    </Avatar>
  );
}
