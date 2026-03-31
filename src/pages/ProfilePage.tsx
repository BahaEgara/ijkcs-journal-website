import { useAuth } from "@/hooks/useAuth";
import ProfileCard from "@/components/profile/ProfileCard";

const ProfilePage = () => {
  const { user, loading } = useAuth();
  return <ProfileCard user={user} loading={loading} />;
};

export default ProfilePage;
