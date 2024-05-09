import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { RootState } from "@/context/store/store";
import { Bell, EyeOff, User } from "lucide-react";
import { IoMaleFemale, IoMale, IoFemale } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import { hideLoader, showLoader } from "@/context/slices/loader";
import { Loader } from "@/components";
import customAxios from "@/utils/customAxios";
import { updateProfile } from "@/context/slices/auth";

const ProfileAdmin = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const loader = useSelector((state: RootState) => state.loader);
  const [isChangeAvatar, setIsChangeAvatar] = useState<boolean>(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);

  const dispatch = useDispatch();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      setIsChangeAvatar(true);
    }
  };

  const handleUpdateAvatar = async (formData: FormData) => {
    try {
      dispatch(showLoader());
      const res = await customAxios({
        url: "/user/updateMe",
        method: "PATCH",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      dispatch(hideLoader());
      if (res.data.status === "success") {
        dispatch(updateProfile({ user: res.data.user }));
        setIsChangeAvatar(false);
        toast.success("Avatar updated successfully");
      }
    } catch (error: any) {
      dispatch(hideLoader());
      toast.error(error.response.data.message);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const email = formData.get("email");
    const gender = formData.get("gender");
    const birthday = formData.get("birthday");
    try {
      dispatch(showLoader());
      const res = await customAxios.patch("/user/updateMe", {
        username,
        email,
        gender,
        birthday,
      });
      setTimeout(() => {
        dispatch(hideLoader());
      }, 1000);

      if (res.data.status === "success") {
        dispatch(updateProfile({ user: res.data.user }));
        toast.success("Profile updated successfully");
      }
    } catch (error: any) {
      dispatch(hideLoader());
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      {loader.isLoading ? (
        <Loader />
      ) : (
        <div className="grid xl:grid-cols-3 gap-4">
          <div className="col-span-1 space-y-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Profile Avatar</CardTitle>
                <CardDescription>
                  Your avatar will be shown in your profile.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-start xl:justify-center gap-x-4">
                <Label htmlFor="avatar" className="relative cursor-pointer">
                  <img
                    src={imagePreviewUrl ? imagePreviewUrl : user.photo}
                    alt=""
                    className="w-32 h-32 border rounded-lg shadow-sm"
                  />
                </Label>
                <Input
                  type="file"
                  id="avatar"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="flex flex-col gap-y-2">
                  <h1 className="text-2xl font-semibold">{user.username}</h1>
                  <p className="text-base font-medium text-muted-foreground">
                    {user.email}
                  </p>
                  {isChangeAvatar ? (
                    <div className="flex items-center justify-center gap-x-2">
                      <Button
                        onClick={() => {
                          const formData = new FormData();
                          if (avatar) {
                            formData.append("photo", avatar);
                          }
                          handleUpdateAvatar(formData);
                        }}
                      >
                        Confirm
                      </Button>
                      <Button
                        onClick={() => {
                          setIsChangeAvatar(false);
                          setAvatar(null);
                          setImagePreviewUrl(null);
                        }}
                        variant="destructive"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Label
                      htmlFor="avatar"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium cursor-pointer h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Change Avatar
                    </Label>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="">
              <CardHeader className="pb-3">
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Choose what you want to be notified about.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-1">
                <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                  <Bell className="mt-px h-5 w-5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Everything
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Email digest, mentions & all activity.
                    </p>
                  </div>
                </div>
                <div className="-mx-2 flex items-start space-x-4 rounded-md bg-accent p-2 text-accent-foreground transition-all">
                  <User className="mt-px h-5 w-5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Available
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Only mentions and comments.
                    </p>
                  </div>
                </div>
                <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                  <EyeOff className="mt-px h-5 w-5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Ignoring</p>
                    <p className="text-sm text-muted-foreground">
                      Turn off all notifications.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleUpdateProfile}>
                  <div className="flex items-center justify-center gap-x-2">
                    <div className="space-y-2 w-1/2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        type="text"
                        id="firstName"
                        placeholder="First Name"
                        defaultValue={"admin"}
                        className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                      />
                    </div>
                    <div className="space-y-2 w-1/2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        type="text"
                        id="lastName"
                        placeholder="Last Name"
                        defaultValue={"admin"}
                        className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      type="text"
                      id="username"
                      placeholder="Username"
                      name="username"
                      defaultValue={user.username}
                      className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      placeholder="Email"
                      name="email"
                      defaultValue={user.email}
                      className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <RadioGroup
                      name="gender"
                      defaultValue={user.gender}
                      className="flex items-center gap-x-10"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label
                          htmlFor="male"
                          className="flex items-center gap-x-1"
                        >
                          <IoMale className="h-5 w-5" /> Male
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label
                          htmlFor="female"
                          className="flex items-center gap-x-1"
                        >
                          <IoFemale className="h-5 w-5" /> Female
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label
                          htmlFor="other"
                          className="flex items-center gap-x-1"
                        >
                          <IoMaleFemale className="h-5 w-5" /> Other
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthday">Birthday</Label>
                    <Input
                      type="date"
                      id="birthday"
                      placeholder="Birthday"
                      name="birthday"
                      defaultValue={new Date(user.birthday)
                        .toISOString()
                        .substr(0, 10)}
                      className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                    />
                  </div>
                  <Button type="submit">Update Profile</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileAdmin;
