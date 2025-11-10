import React, { useState, useMemo, useEffect } from "react";
import type { ReactNode } from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { LoanIcon } from "../icons";
import "./sidebar.css";
import { Logo } from "../icons/logo";
import { useResponsive } from "../../hooks/useResponsive";
import { MobileHeader } from "../header/MobileHeader";
import { RightCircleTwoTone } from "@ant-design/icons";
import { Avatar, Flex, Skeleton } from "@chakra-ui/react";
import {
  Home,
  Banknote,
  MailCheckIcon,
  Bell,
  LogOut,
  CircleDollarSign,
  Settings,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useNotificationStore } from "../../store/notification";
import { useMember } from "../../hooks/useMember";
const { Content, Sider } = Layout;

interface OverlayProps {
  show: boolean;
  onOverlayClick: () => void;
}

export const Overlay = ({ show, onOverlayClick }: OverlayProps) => {
  return (
    <div
      className={`fixed h-0 w-screen z-10 ${
        show ? "visible backdrop-blur-sm h-screen" : ""
      }`}
      onClick={onOverlayClick}
    ></div>
  );
};

const SideBar = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [collapsed, setCollapsed] = useState(false);
  const { user, loading } = useAuth();
  const { unreadCount, fetchUnreadCount } = useNotificationStore();
  const { member } = useMember()

  useEffect(() => {
    if (user?.id) {
      fetchUnreadCount(user.id);
    }
  }, [user?.id, fetchUnreadCount]);

  const menuItems = [
    {
      key: "/dashboard",
      icon: <Home className={`${collapsed ? "!mt-2" : ""}`} />,
      label: "Dashboard",
    },
    {
      key: "/loan",
      icon: <LoanIcon className={`${collapsed ? "!mt-2" : ""}`} />,
      label: "Loan",
      subLabel: [
        {
          key: "/loan",
          label: "My Loan",
        },
        {
          key: "/loan/enrollment",
          label: "Loan Enrollment",
        },
        {
          key: "/loan/history",
          label: "Loan History",
        },
        // {
        //   key: "/loan/upload-payment",
        //   label: "Upload Payment",
        // },
      ],
    },
    {
      key: "/savings",
      icon: (
        <Banknote color="white" className={`${collapsed ? "!mt-2" : ""}`} />
      ),
      label: "Savings",
      subLabel: [
        {
          key: "/savings",
          label: "My Savings",
        },
        {
          key: "/savings/personal",
          label: "Personal",
        },
        {
          key: "/savings/cooperative",
          label: "Cooperative",
        },
      ],
    },
    {
      key: "/withdrawal",
      icon: <MailCheckIcon className={`${collapsed ? "!mt-2" : ""}`} />,
      label: "Withdrawal",
    },
    {
      key: "/transactions",
      icon: <CircleDollarSign className={`${collapsed ? "!mt-2" : ""}`} />,
      label: "Transactions",
    },
    {
      key: "/notifications",
      icon: <Bell className={`${collapsed ? "!mt-2" : ""}`} />,
      label: "Notifications",
      hasNotificationCount: true,
    },
    {
      key: "/settings",
      icon: <Settings className={`${collapsed ? "!mt-2" : ""}`} />,
      label: "Settings",
    },
  ];

  const menuItemsWithSubmenus = menuItems.map((item) => {
    if (item.subLabel) {
      return {
        key: item.key,
        icon: React.cloneElement(item.icon, {
          isSelected: item.key === currentPath,
        }),
        label: item.label,
        children: item.subLabel.map((subItem) => ({
          key: subItem.key,
          label: (
            <Link color="white" to={subItem.key}>
              {subItem.label}
            </Link>
          ),
        })),
      };
    }

    return {
      key: item.key,
      icon: React.cloneElement(item.icon, {
        isSelected: item.key === currentPath,
      }),
      label: (
        <Link
          color="white"
          to={item.key}
          className="flex items-center justify-between w-full"
        >
          <span>{item.label}</span>
          {item.hasNotificationCount && unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-medium ml-2">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>
      ),
    };
  });

  const { isDesktop, mobileOnly, tabletOnly } = useResponsive();

  const isCollapsible = useMemo(
    () => mobileOnly && tabletOnly,
    [mobileOnly, tabletOnly]
  );

  return (
    <Layout hasSider className="h-screen">
      <Sider
        breakpoint="lg"
        trigger={null}
        collapsed={!isDesktop && collapsed}
        collapsedWidth={tabletOnly ? 80 : 0}
        onCollapse={() => setCollapsed(!collapsed)}
        collapsible={isCollapsible}
        style={{
          overflow: "auto",
          minHeight: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          background: "#982323",
          zIndex: 30,
          boxShadow: "-3px 0 5px 0 #555",
        }}
      >
        <div className="flex items-center justify-center relative">
          <Link to="/">
            <Logo className="mt-4 w-15" textClassName="pt-4 font-bold" />
          </Link>

          <div
            className="hidden md:block lg:hidden absolute right-4 z-20 cursor-pointer"
            onClick={() => setCollapsed(!collapsed)}
          >
            <RightCircleTwoTone
              twoToneColor="#9600ad"
              className={`text-2xl z-[50] fixed transition duration-200 ${
                !collapsed ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
        </div>
        <Flex justify="center" mt={4} mb={2}>
          <Avatar
            bg="grey"
            size="xl"
            name={`${member?.first_name} ${member?.last_name}`}
            src={`${member?.first_name} ${member?.last_name}`}
          />
        </Flex>
        <div className="flex flex-col justify-center items-center mb-4">
          {loading ? (
            <>
              <Skeleton height="20px" width="120px" mb={1} />
              <Skeleton height="14px" width="60px" />
            </>
          ) : (
            <>
              <p className="font-bold">
                {member?.first_name} {member?.last_name}
              </p>
              <p className="text-xs text-gray-500">Member</p>
            </>
          )}
        </div>
        <Menu
          theme="light"
          mode="inline"
          className="custom-menu"
          selectedKeys={[currentPath.startsWith("/post/") ? "/" : currentPath]}
          items={menuItemsWithSubmenus}
        />

        <div className="mt-20"></div>
        <hr className="my-4" />
        <Link
          to="/"
          className="flex items-center gap-4 w-[90%] mt-4 ml-2 pl-5 h-10 text-base text-white hover:text-[#474E67]"
        >
          <LogOut color="white" />
          {!collapsed && <span className="text-white">Log Out</span>}
        </Link>
        <p className="italic text-center pt-6 text-gray-50">Coop Link</p>
        {/* <Link
          to="/settings/profile"
          className={`${currentPath === "/settings/profile"
            ? "profile-link-active"
            : "profile-link"
            } flex items-center gap-4 w-[90%] ml-2 pl-5 h-10 absolute bottom-10 md:bottom-5 text-base text-[#474E67] p-4 hover:text-[#474E67]`}
        >
          <Logo />
          {!collapsed && <span>Profile</span>}
        </Link> */}
      </Sider>
      {mobileOnly && (
        <Overlay
          show={!collapsed}
          onOverlayClick={() => setCollapsed(!collapsed)}
        />
      )}

      <Layout className={`${!collapsed ? "overflow-hidden" : ""}`}>
        {mobileOnly && (
          <MobileHeader
            toggleSider={() => setCollapsed(!collapsed)}
            isSiderOpened={!collapsed}
          />
        )}
        <Content className="overflow-auto">
          <div className="p-2 md:p-6 md:ml-16 lg:ml-[200px] min-h-screen bg-white">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default SideBar;
