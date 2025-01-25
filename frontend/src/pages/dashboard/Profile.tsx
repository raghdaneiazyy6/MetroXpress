// src/pages/Profile.tsx
import { useState, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { toast } from "react-hot-toast";
import {
  CameraIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    bio: user?.bio || "",
  });

  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setLoading(true);
        // Convert file to base64 string
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            await updateProfile({
              ...user,
              profilePicture: reader.result as string,
            });
            toast.success("Profile picture updated successfully");
          } catch (error) {
            console.error("Update error:", error);
            toast.error("Failed to update profile picture");
          } finally {
            setLoading(false);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("File reading error:", error);
        toast.error("Failed to process image");
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await updateProfile({ ...user, ...formData });

      // Check if the update was successful
      if (result.type === "auth/updateProfile/fulfilled") {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "block w-full rounded-md border border-gray-300 dark:border-gray-600 pl-10 pr-3 py-2 bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400";
  const labelClasses =
    "block text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center";
  const iconClasses = "h-4 w-4 mr-2 text-gray-400 dark:text-gray-500";
  const textClasses =
    "mt-1 text-sm text-gray-900 dark:text-white flex items-center";

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Profile
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your personal information
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
          disabled={loading}
          className="flex flex-row-reverse items-center"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
          <PencilIcon className="h-4 w-4 mr-2" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture Section */}
        <Card className="p-6 lg:col-span-1">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="w-full h-full text-gray-400 dark:text-gray-600" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-white dark:bg-dark-bg-secondary rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors"
              >
                <CameraIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleProfilePictureChange}
              />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {user?.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.role}
              </p>
            </div>
          </div>
        </Card>

        {/* Profile Information */}
        <Card className="p-6 lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className={labelClasses}>
                  <UserCircleIcon className={iconClasses} />
                  Full Name
                </label>
                {isEditing ? (
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={inputClasses}
                    />
                    <UserCircleIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                ) : (
                  <p className={textClasses}>{user?.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className={labelClasses}>
                  <EnvelopeIcon className={iconClasses} />
                  Email
                </label>
                <div className="mt-1 relative">
                  <input
                    type="email"
                    value={user?.email}
                    readOnly
                    className={`${inputClasses} cursor-not-allowed bg-gray-50 dark:bg-dark-bg-tertiary`}
                  />
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className={labelClasses}>
                  <PhoneIcon className={iconClasses} />
                  Phone Number
                </label>
                {isEditing ? (
                  <div className="mt-1 relative">
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className={inputClasses}
                    />
                    <PhoneIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                ) : (
                  <p className={textClasses}>{user?.phone || "Not provided"}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className={labelClasses}>
                  <MapPinIcon className={iconClasses} />
                  Location
                </label>
                {isEditing ? (
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className={inputClasses}
                    />
                    <MapPinIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                ) : (
                  <p className={textClasses}>
                    {user?.location || "Not provided"}
                  </p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className={labelClasses}>
                <DocumentTextIcon className={iconClasses} />
                Bio
              </label>
              {isEditing ? (
                <div className="mt-1 relative">
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows={4}
                    className={inputClasses}
                  />
                  <DocumentTextIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute left-3 top-3" />
                </div>
              ) : (
                <p className={textClasses}>{user?.bio || "No bio provided"}</p>
              )}
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </form>
        </Card>

        {/* Activity Section */}
        <Card className="p-6 lg:col-span-3">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No recent activity
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
