import { Box, Flex, Heading, Text, Button, Icon, VStack } from '@chakra-ui/react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StatusPageProps {
    status: 'success' | 'error';
    title: string;
    description?: string;
    primaryAction?: {
        label: string;
        onClick?: () => void;
        href?: string;
    };
    secondaryAction?: {
        label: string;
        onClick?: () => void;
        href?: string;
    };
}

export const StatusPage = ({
    status,
    title,
    description,
    primaryAction,
    secondaryAction
}: StatusPageProps) => {
    const navigate = useNavigate();

    const statusConfig = {
        success: {
            icon: CheckCircle,
            color: 'green.500',
            bgColor: 'green.50',
        },
        error: {
            icon: XCircle,
            color: 'red.500',
            bgColor: 'red.50',
        },
    };

    const currentStatus = statusConfig[status];

    const handleAction = (action?: { onClick?: () => void; href?: string }) => {
        if (action?.onClick) {
            action.onClick();
        } else if (action?.href) {
            navigate(action.href);
        }
    };

    return (
        <Flex
            minH="100vh"
            align="center"
            justify="center"
            p={4}
            bg={currentStatus.bgColor}
        >
            <Box
                maxW="md"
                w="full"
                bg="white"
                p={8}
                borderRadius="lg"
                boxShadow="md"
                textAlign="center"
            >
                <VStack spacing={6}>
                    <Icon
                        as={currentStatus.icon}
                        boxSize={12}
                        color={currentStatus.color}
                    />

                    <Heading size="lg" color="gray.800">
                        {title}
                    </Heading>

                    {description && (
                        <Text color="gray.600" fontSize="lg">
                            {description}
                        </Text>
                    )}

                    <VStack spacing={4} w="full" pt={4}>
                        {primaryAction && (
                            <Button
                                colorScheme={status === 'success' ? 'green' : 'red'}
                                size="lg"
                                w="full"
                                onClick={() => handleAction(primaryAction)}
                            >
                                {primaryAction.label}
                            </Button>
                        )}

                        {secondaryAction && (
                            <Button
                                variant="outline"
                                size="lg"
                                w="full"
                                onClick={() => handleAction(secondaryAction)}
                            >
                                {secondaryAction.label}
                            </Button>
                        )}
                    </VStack>
                </VStack>
            </Box>
        </Flex>
    );
};