import { Link, useNavigate, NavigateFunction } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/utils/icon";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/context/store/store";
import { hideLoader, showLoader } from "@/context/slices/loader";
import { Loader } from "@/components";
import customAxios from "@/utils/customAxios";
import { toast } from "react-toastify";

const signUpSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  passwordConfirm: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const defaultValues: Partial<SignUpFormValues> = {
  username: "",
  email: "",
  password: "",
  passwordConfirm: "",
};

const Register = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const dispatch = useDispatch();
  const loader = useSelector((state: RootState) => state.loader);
  const navigate: NavigateFunction = useNavigate();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues,
  });

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      dispatch(showLoader());
      const res = await customAxios.post("/user/register", data);
      setTimeout(() => {
        dispatch(hideLoader());
      }, 1000);

      if (res.data.status === "success") {
        toast.success(res.data.message);
        navigate("/auth/login");
      }
    } catch (error: any) {
      setTimeout(() => {
        dispatch(hideLoader());
      }, 1000);
      toast.error(error.response.data.message);
    }
  };
  return (
    <>
      {loader.isLoading ? (
        <Loader />
      ) : (
        <div className="w-full flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
          <Card className="sm:mx-auto sm:w-full sm:max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">
                <Icons.logo className="mx-auto w-12" />
              </CardTitle>
              <CardDescription className="text-center text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Sign up to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete=""
                            placeholder="Your username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete=""
                            placeholder="Your email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              autoComplete=""
                              type={showPassword ? "text" : "password"}
                              placeholder="Your password"
                              {...field}
                            />

                            <div
                              onClick={() => setShowPassword(!showPassword)}
                              className=" absolute right-2 top-2.5 text-gray-400 cursor-pointer"
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="passwordConfirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              autoComplete=""
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Your password"
                              {...field}
                            />
                            <div
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className=" absolute right-2 top-2.5 text-gray-400 cursor-pointer"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button className="w-full">Create account</Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="grid">
              <div className="text-center space-x-1">
                <p>
                  Already have an account ?{" "}
                  <Link
                    to="/auth/login"
                    className="text-primary hover:text-gray-500 duration-100 ease-linear"
                  >
                    Login now
                  </Link>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default Register;
