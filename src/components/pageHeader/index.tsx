import { BreadcrumbItem, Breadcrumb, BreadcrumbLink } from "@chakra-ui/react";
import { Input } from "antd";
import { Search } from "lucide-react";
import { Logo } from "../icons/logo";
import { useNavigate } from "react-router-dom";
import { routes } from "../../lib/routes";

interface IHeader {
  title: string;
  showBreadcrumb?: boolean;
  showSearch?: boolean;
}

export const PageHeader = ({
  title,
  showBreadcrumb = true,
  showSearch = true,
}: IHeader) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between gap-8 mb-8">
      <p className="font-bold text-xl whitespace-nowrap text-ellipsis max-w-xs hidden md:block">
        {title}
      </p>

      {showBreadcrumb && (
        <div className="md:flex items-center gap-2 hidden">
          <Breadcrumb w="400px">
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate(routes.dashboard.index)}>
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink className="font-bold" href="#">
                {title}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
      )}

      {showSearch && (
        <div className="md:flex items-center gap-2 hidden">
          <Input
            variant="filled"
            size="large"
            placeholder="Search"
            prefix={<Search />}
          />
        </div>
      )}

      <div className="md:flex items-center gap-2 hidden">
        <p className="font-bold text-[#0692DE] w-[150px]">NAOWA</p>
        <Logo showText={false} />
      </div>
    </div>
  );
};
