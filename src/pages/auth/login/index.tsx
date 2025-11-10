import {
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { Logo } from "../../../components/icons/logo";
import { FacbookIcon, GoogleIcon, AppleIcon } from "../../../components/icons";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../lib/routes";
import { useState } from "react";
import api from "../../../api";
import { useAuth } from "../../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post("/api/auth/member/login", formData);
      const { id, email, role } = res.data.user;
      setUser({
        id,
        email,
        role,
      });

      toast({
        title: "Success",
        description: "Logged in successfully",
        status: "success",
      });
      window.location.href = routes.dashboard.index;
    } catch (err) {
      let errorMessage = "Login failed";
      if (typeof err === "object" && err !== null && "response" in err) {
        const response = (err as any).response;
        if (response && response.data && response.data.message) {
          errorMessage = response.data.message;
        }
      }
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isMobile = window.innerWidth < 668;

  return (
    <div className="mb-8">
      <div
        style={{
          background: "#982323",
          minHeight: isMobile ? "100vh" : "50vh",
          display: "flex",
          flexDirection: "column",
          padding: "30px",
          boxSizing: "border-box",
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <Logo
            className="w-[80px] sm:w-[100px] flex justify-center items-center"
            showText={false}
          />
          <div className="md:flex flex-col hidden mt-4">
            <p className="text-white text-center text-xl sm:w-[400px] font-bold">
              NAOWA COOPERATIVE MULTIPURPOSE SOCIETY LIMITED
            </p>
            <p className="text-xs text-center text-white sm:w-[400px] pt-6">
              Fast and Easy Cooperative NAOWA helps over 13 thousand members
              achieve their financial goals by helping them save and get loans
              with ease.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full sm:w-[500px] rounded-3xl text-sm mt-[-100px] bg-white p-6 shadow-lg mx-auto">
        <div className="flex justify-between text-xs">
          <p>
            Welcome to <span className="text-[#982323]">NAOWA</span>
          </p>
          <p>
            No Account <br />
            <span
              className="text-[#982323] cursor-pointer"
              onClick={() => navigate(routes.auth.register.index)}
            >
              Sign Up
            </span>
          </p>
        </div>
        <div>
          <p className="text-3xl font-bold">Sign In</p>
          <div className="mt-4 flex flex-row justify-between font-light">
            <Button
              color="blue"
              fontWeight="light"
              bg="#E9F1FF"
              leftIcon={<GoogleIcon />}
              width={["100%", "auto"]}
            >
              Sign In with Google
            </Button>
            <Button width={["30%", "auto"]}>
              <FacbookIcon />
            </Button>
            <Button width={["20%", "auto"]}>
              <AppleIcon />
            </Button>
          </div>
          <div className="mt-6">
            <FormControl fontWeight="light">
              <FormLabel fontWeight="light" fontSize={13}>
                Enter Username
              </FormLabel>
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
                fontSize={13}
                type="text"
                placeholder="Username"
              />
            </FormControl>
            <FormControl fontWeight="light" className="mt-4 mb-3">
              <FormLabel fontWeight="light" fontSize={13}>
                Enter Your Password
              </FormLabel>
              <Input
                name="password"
                value={formData.password}
                onChange={handleChange}
                fontSize={13}
                type="password"
                placeholder="Password"
              />
            </FormControl>
            <p
              className="flex justify-end mt-6 text-blue-500 cursor-pointer text-xs"
              onClick={() => navigate(routes.auth.forgotPassword)}
            >
              Forgot Password
            </p>
            <Button
              isLoading={isLoading}
              loadingText="Signing In"
              color="white"
              mt={5}
              width="full"
              style={{
                background: "#982323",
              }}
              onClick={handleSubmit}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
