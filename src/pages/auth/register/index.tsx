import { useNavigate } from "react-router-dom";
import { routes } from "../../../lib/routes";
import { Logo } from "../../../components/icons/logo";
import { ListItem, OrderedList } from "@chakra-ui/react";
import GradientButton from "../../../components/gradientBtn";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black  h-[100%] md:h-[100vh] text-white p-8">
      <div className="flex justify-end">
        <Logo className="w-30" showText={false} />
      </div>
      <div className="flex flex-col md:flex-row gap-10 md:justify-between mt-6">
        <div
          style={{ border: "1px solid white" }}
          className="p-10 w-full md:w-[35vw] bg-[#1a1a1a] rounded-lg h-[450px]"
        >
          <p className="text-white text-xl font-semibold pt-8">Sign Up</p>
          <div className="flex flex-col gap-4 mt-10 mb-[70px]">
            <GradientButton onClick={() => navigate(routes.auth.register.personnel)}>Sign Up</GradientButton>
          </div>
          <div className="font-thin text-sm flex flex-col gap-3">
            <p className="text-center">
              Already have an account?{" "}
              <span
                className="cursor-pointer"
                onClick={() => navigate(routes.index)}
              >
                Sign In
              </span>
            </p>
            <div className="flex justify-between">
              <p>Terms & Conditions</p>
              <p>Support</p>
              <p>Customer Care</p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-[40vw]">
          <div className="flex flex-col items-center">
            <p>Welcome To</p>
            <p className="text-[#982323] font-bold">
              NAOWA Corporative Multipurpose Society
            </p>
          </div>
          <p className="pt-4">
            A cooperative society is an organization owned and operated by a
            group of individuals for their mutual benefit. Members come together
            to meet common economic, social, and cultural needs, pooling
            resources to achieve goals that might be difficult to attain
            individually.
          </p>
          <p>Key Features of Cooperative Societies</p>
          <OrderedList mt={4}>
            <ListItem>
              <span className="font-bold">Member Ownership:</span> Each member
              has an equal stake in the cooperative, regardless of their
              financial investment. This promotes a sense of community and
              shared responsibility.
            </ListItem>
            <ListItem>
              <span className="font-bold">Democratic Control:</span> Decisions
              are made collectively, usually following the principle of “one
              member, one vote.” This ensures that all voices are heard and
              valued.
            </ListItem>
            <ListItem>
              <span className="font-bold">Focus on Community Needs:</span>{" "}
              Cooperatives often prioritize local needs, whether through
              providing affordable goods and services, supporting local
              agriculture, or creating jobs.
            </ListItem>
            <ListItem>
              <span className="font-bold">Profit Distribution:</span>
              Profits are typically reinvested in the cooperative or distributed
              among members based on their participation, rather than solely on
              capital investment.
            </ListItem>
            <ListItem>
              <span className="font-bold">Education and Training:</span> Many
              cooperatives emphasize the importance of education, offering
              training to members to enhance their skills and knowledge, which
              benefits the cooperative as a whole.
            </ListItem>
          </OrderedList>
        </div>
      </div>
    </div>
  );
};

export default Register;
