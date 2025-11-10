import { useEffect } from "react";
import { PageHeader } from "../../components/pageHeader";
import { Bell, ChevronRight, User } from "lucide-react";
import { Avatar, Button, Input, Box, Flex, Text } from "@chakra-ui/react";
import { useAuth } from "../../hooks/useAuth";
import { useNotificationStore } from "../../store/notification";
import { useNotificationSocket } from "../../hooks/useNotification";

const Notifications = () => {
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    isLoading,
    selectedNotification,
    setSelectedNotification,
    markAsRead,
    fetchNotifications,
  } = useNotificationStore();

  useNotificationSocket();

  useEffect(() => {
    if (user?.id) {
      fetchNotifications(user.id);
    }
  }, [user?.id, fetchNotifications]);

  const handleNotificationClick = (notification: any) => {
    setSelectedNotification(notification);

    // Auto-mark as read when clicked (if unread)
    if (notification.status === "UNREAD") {
      markAsRead(notification.id).catch(console.error);
    }
  };

  return (
    <div>
      <PageHeader
        title={`Notifications ${unreadCount > 0 ? `(${unreadCount})` : ""}`}
      />
      <Flex direction={{ base: "column", md: "row" }} height="100vh">
        {/* Notification List */}
        <Box
          width={{ base: "100%", md: "50vw" }}
          bg="white"
          rounded-lg
          shadow-xl
          mr={{ base: 0, md: 6 }}
        >
          <Box p={4} borderBottom="1px" borderColor="gray.200" bg="gray.50">
            <Flex align="center">
              <Bell className="mr-2" size={20} />
              <Text fontSize="lg" fontWeight="bold">
                Inbox
              </Text>
            </Flex>
          </Box>

          <Box overflowY="auto" maxHeight="calc(100vh - 140px)">
            {isLoading ? (
              <Flex justify="center" align="center" height="64">
                <Text color="gray.500">Loading notifications...</Text>
              </Flex>
            ) : notifications.length === 0 ? (
              <Flex
                flexDirection="column"
                align="center"
                justify="center"
                height="64"
                textAlign="center"
                p={8}
              >
                <Bell className="text-gray-400 mb-4" size={48} />
                <Text fontSize="lg" fontWeight="medium" color="gray.900">
                  No notifications yet
                </Text>
                <Text color="gray.500" mt={1}>
                  You'll see notifications here when you receive them
                </Text>
              </Flex>
            ) : (
              notifications.map((notification) => (
                <Flex
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  p={4}
                  borderBottom="1px"
                  borderColor="gray.100"
                  cursor="pointer"
                  _hover={{ bg: "gray.50" }}
                  className={`${
                    selectedNotification?.id === notification.id
                      ? "bg-blue-50"
                      : ""
                  } ${notification.status === "UNREAD" ? "bg-blue-25" : ""}`}
                >
                  <Box mr={3} position="relative">
                    <Avatar
                      size="sm"
                      name={notification.member?.first_name}
                      src={notification.member?.avatar}
                    />
                    {notification.status === "UNREAD" && (
                      <Box
                        position="absolute"
                        top="-1"
                        right="-1"
                        width="3"
                        height="3"
                        bg="blue.500"
                        borderRadius="full"
                      ></Box>
                    )}
                  </Box>

                  <Flex flexDirection="column" flex="1">
                    <Flex justify="space-between" align="start">
                      <Text
                        fontWeight="medium"
                        color={
                          notification.status === "UNREAD"
                            ? "black"
                            : "gray.700"
                        }
                      >
                        {notification.title}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {new Date(notification.createdAt).toLocaleTimeString()}
                      </Text>
                    </Flex>
                    <Text
                      fontSize="sm"
                      mt={1}
                      color={
                        notification.status === "UNREAD" ? "black" : "gray.600"
                      }
                    >
                      {notification.message}
                    </Text>
                  </Flex>

                  <ChevronRight size={16} className="text-gray-400 mt-2" />
                </Flex>
              ))
            )}
          </Box>
        </Box>

        {/* Notification Detail View */}
        <Box width={{ base: "100%", md: "80vw" }} ml={{ base: 0, md: 4 }}>
          <Box bg="white" rounded-lg shadow-xl mb={7} p={4}>
            <Text fontWeight="semibold" pb={4}>
              Search Notifications
            </Text>
            <Flex gap={4}>
              <Input placeholder="Search by keyword" />
              <Button>Search</Button>
            </Flex>
          </Box>

          <Box flex="1" bg="white" rounded-lg shadow-xl>
            {selectedNotification ? (
              <>
                <Box
                  p={4}
                  borderBottom="1px"
                  borderColor="gray.200"
                  bg="gray.50"
                >
                  <Flex align="center">
                    <User className="mr-2" size={20} />
                    <Text fontSize="lg" fontWeight="semibold">
                      Notification Details
                    </Text>
                  </Flex>
                </Box>

                <Box p={6}>
                  <Flex align="center" mb={6}>
                    <Box mr={4}>
                      <Avatar
                        size="md"
                        name={selectedNotification.member?.first_name}
                        src={selectedNotification.member?.first_name}
                      />
                    </Box>
                    <Flex flexDirection="column">
                      <Text fontWeight="semibold" fontSize="lg">
                        {selectedNotification.title}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {new Date(
                          selectedNotification.createdAt
                        ).toLocaleString()}
                      </Text>
                    </Flex>
                  </Flex>

                  <Box bg="gray.50" p={4} rounded="lg">
                    <Text color="gray.800">{selectedNotification.message}</Text>
                  </Box>
                </Box>
              </>
            ) : (
              <Flex
                flexDirection="column"
                align="center"
                justify="center"
                height="full"
                color="gray.500"
                p={8}
              >
                <User className="text-gray-400 mb-4" size={48} />
                <Text fontSize="lg" fontWeight="medium" color="gray.900">
                  {notifications.length === 0
                    ? "No notifications to display"
                    : "Select a notification"}
                </Text>
                <Text color="gray.500" mt={1}>
                  {notifications.length === 0
                    ? "When you receive notifications, they will appear here"
                    : "Click on a notification to view details"}
                </Text>
              </Flex>
            )}
          </Box>
        </Box>
      </Flex>
    </div>
  );
};

export default Notifications;
