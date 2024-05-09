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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Icons } from "@/utils/icon";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/context/store/store";
import { toast } from "react-toastify";
import { hideLoader, showLoader } from "@/context/slices/loader";
import customAxios from "@/utils/customAxios";
import { login } from "@/context/slices/auth";
import { Loader } from "@/components";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const defaultValues: Partial<LoginFormValues> = {
  email: "",
  password: "",
};

const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const dispatch = useDispatch();
  const loader = useSelector((state: RootState) => state.loader);
  const user = useSelector((state: RootState) => state.auth);
  const navigate: NavigateFunction = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      dispatch(showLoader());
      const response = await customAxios.post("/user/login", data);
      setTimeout(() => {
        dispatch(hideLoader());
      }, 1000);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        dispatch(
          login({
            user: response.data.user,
            token: response.data.token,
            timeExpire: response.data.timeExpire,
          })
        );
        navigate("/");
      }
    } catch (error: any) {
      setTimeout(() => {
        dispatch(hideLoader());
      }, 1000);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const checkIsLoggedIn = () => {
      if (user.token) {
        navigate("/");
      }
    };
    checkIsLoggedIn();

    return () => {
      checkIsLoggedIn();
    };
  }, [user, navigate]);
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
                Sign in to your account
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
                              type={showPassword ? "text" : "password"}
                              placeholder="Your password"
                              autoComplete=""
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2">
                      <input
                        type="checkbox"
                        id="agreement"
                        className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                      />

                      <label
                        htmlFor="agreement"
                        className="text-gray-600 cursor-pointer"
                      >
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="text-primary">
                      Forgot password ?
                    </a>
                  </div>
                  <Button className="w-full">Sign In</Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="grid gap-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <Button variant="outline">
                  <Icons.gitHub className="mr-2 h-4 w-4" />
                  Github
                </Button>
                <Button variant="outline">
                  <Icons.google className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </div>
              <div className="text-center space-x-1">
                <p>
                  Don’t have any account?{" "}
                  <Link
                    to="/auth/register"
                    className="text-primary hover:text-gray-500 duration-100 ease-linear"
                  >
                    Sign Up
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

export default Login;
