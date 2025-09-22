import { Header } from "@/components/header";
import { ProfileForm } from "@/components/profile-form";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Your Profile" />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <ProfileForm />
      </main>
    </div>
  );
}
