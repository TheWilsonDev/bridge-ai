import React from "react";
import { Box, VStack, HStack, Heading, Text, Icon, Button, Progress, Table, Thead, Tbody, Tr, Th, Td, Badge } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { FaBolt, FaClock, FaChartLine, FaCreditCard } from "react-icons/fa";

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 10px rgba(66, 153, 225, 0.3); }
  50% { box-shadow: 0 0 20px rgba(66, 153, 225, 0.5); }
  100% { box-shadow: 0 0 10px rgba(66, 153, 225, 0.3); }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const StatCard = ({ icon, title, value, subtext }) => (
  <Box
    bg="rgba(255, 255, 255, 0.03)"
    p={6}
    borderRadius="xl"
    flex={1}
    backdropFilter="blur(16px)"
    border="1px solid"
    borderColor="whiteAlpha.100"
    position="relative"
    transition="all 0.3s"
    _hover={{
      transform: "translateY(-2px)",
      bg: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(20px)",
      animation: `${glowAnimation} 2s infinite`,
    }}
    _before={{
      content: '""',
      position: "absolute",
      inset: "-1px",
      padding: "1px",
      borderRadius: "xl",
      background: "linear-gradient(45deg, rgba(66, 153, 225, 0.3), rgba(66, 153, 225, 0.1), rgba(66, 153, 225, 0.3))",
      backgroundSize: "200% 200%",
      animation: `${gradientAnimation} 3s linear infinite`,
      WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      WebkitMaskComposite: "xor",
      maskComposite: "exclude",
    }}
  >
    <VStack align="start" spacing={4}>
      <Icon as={icon} w={6} h={6} color="blue.400" />
      <VStack align="start" spacing={1}>
        <Text color="whiteAlpha.600" fontSize="sm">
          {title}
        </Text>
        <Text color="white" fontSize="2xl" fontWeight="bold" textShadow="0 0 10px rgba(66, 153, 225, 0.3)">
          {value}
        </Text>
        <Text color="whiteAlpha.600" fontSize="sm">
          {subtext}
        </Text>
      </VStack>
    </VStack>
  </Box>
);

const SectionBox = ({ children, title }) => (
  <Box
    w="100%"
    bg="rgba(255, 255, 255, 0.02)"
    p={6}
    borderRadius="xl"
    backdropFilter="blur(16px)"
    border="1px solid"
    borderColor="whiteAlpha.100"
    position="relative"
    transition="all 0.3s"
    _hover={{
      bg: "rgba(255, 255, 255, 0.04)",
      backdropFilter: "blur(20px)",
    }}
    _before={{
      content: '""',
      position: "absolute",
      inset: "-1px",
      padding: "1px",
      borderRadius: "xl",
      background: "linear-gradient(45deg, rgba(66, 153, 225, 0.2), rgba(66, 153, 225, 0.05))",
      WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      WebkitMaskComposite: "xor",
      maskComposite: "exclude",
    }}
  >
    <VStack align="start" spacing={4} w="100%">
      {title && (
        <Text color="white" fontSize="lg" fontWeight="semibold" textShadow="0 0 10px rgba(66, 153, 225, 0.3)">
          {title}
        </Text>
      )}
      {children}
    </VStack>
  </Box>
);

const UsagePage = () => {
  return (
    <Box
      h="100%"
      w="100%"
      p={8}
      bg="#0f1117"
      bgGradient="linear(to-br, #0f1117, #1a202c)"
      overflowY="auto"
      css={{
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          background: "rgba(255, 255, 255, 0.1)",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(66, 153, 225, 0.5)",
          borderRadius: "4px",
        },
      }}
    >
      <VStack align="start" spacing={8} w="100%" maxW="1200px" mx="auto">
        <Heading color="white" size="lg" textShadow="0 0 10px rgba(66, 153, 225, 0.3)" position="relative">
          Usage & Billing
        </Heading>

        <HStack w="100%" spacing={6} align="stretch">
          <StatCard icon={FaBolt} title="Credits Used" value="2,500" subtext="This billing cycle" />
          <StatCard icon={FaClock} title="Time Remaining" value="18 Days" subtext="Until next billing" />
          <StatCard icon={FaChartLine} title="Usage Trend" value="+15%" subtext="Compared to last month" />
          <StatCard icon={FaCreditCard} title="Estimated Cost" value="$25.00" subtext="Based on current usage" />
        </HStack>

        <SectionBox title="Current Usage">
          <Box w="100%">
            <HStack justify="space-between" mb={2}>
              <Text color="whiteAlpha.600" fontSize="sm">
                2,500 / 10,000 credits used
              </Text>
              <Text color="whiteAlpha.600" fontSize="sm">
                25%
              </Text>
            </HStack>
            <Progress
              value={25}
              h="6px"
              borderRadius="full"
              bg="whiteAlpha.100"
              sx={{
                "& > div": {
                  background: "linear-gradient(90deg, #4299E1, #2B6CB0)",
                  transition: "width 0.5s ease-in-out",
                },
              }}
            />
          </Box>
        </SectionBox>

        <SectionBox title="Usage History">
          <Box w="100%" overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th color="whiteAlpha.600" borderColor="whiteAlpha.100">
                    Date
                  </Th>
                  <Th color="whiteAlpha.600" borderColor="whiteAlpha.100">
                    Description
                  </Th>
                  <Th color="whiteAlpha.600" borderColor="whiteAlpha.100">
                    Credits
                  </Th>
                  <Th color="whiteAlpha.600" borderColor="whiteAlpha.100">
                    Status
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {[1, 2, 3].map((i) => (
                  <Tr key={i} transition="all 0.2s" _hover={{ bg: "rgba(255, 255, 255, 0.05)" }}>
                    <Td color="white" borderColor="whiteAlpha.100">
                      Today, 2:30 PM
                    </Td>
                    <Td color="white" borderColor="whiteAlpha.100">
                      API Usage
                    </Td>
                    <Td color="white" borderColor="whiteAlpha.100">
                      150
                    </Td>
                    <Td borderColor="whiteAlpha.100">
                      <Badge colorScheme="green" bg="green.400" color="white" px={3} py={1} borderRadius="full" textTransform="none" boxShadow="0 0 10px rgba(72, 187, 120, 0.3)">
                        Completed
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </SectionBox>

        <SectionBox title="API Configuration">
          <HStack spacing={4}>
            <Button
              colorScheme="blue"
              bg="blue.500"
              color="white"
              px={6}
              py={4}
              _hover={{
                transform: "translateY(-2px)",
                bg: "blue.600",
                boxShadow: "0 0 20px rgba(66, 153, 225, 0.4)",
              }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.2s"
            >
              Generate New API Key
            </Button>
            <Button
              variant="outline"
              colorScheme="blue"
              borderWidth="2px"
              px={6}
              py={4}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 0 20px rgba(66, 153, 225, 0.4)",
                borderColor: "blue.400",
              }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.2s"
            >
              View Documentation
            </Button>
          </HStack>
        </SectionBox>
      </VStack>
    </Box>
  );
};

export default UsagePage;
