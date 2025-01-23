import React from "react";
import { Box, VStack, HStack, Heading, Text, Divider, Switch, Avatar, Button, Icon, Input } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { FaUser, FaKey, FaShieldAlt, FaBell, FaPalette } from "react-icons/fa";

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 10px rgba(66, 153, 225, 0.3); }
  50% { box-shadow: 0 0 20px rgba(66, 153, 225, 0.5); }
  100% { box-shadow: 0 0 10px rgba(66, 153, 225, 0.3); }
`;

const SettingsSection = ({ icon, title, children }) => (
  <Box
    w="100%"
    bg="rgba(255, 255, 255, 0.02)"
    borderRadius="xl"
    p={6}
    backdropFilter="blur(16px)"
    border="1px solid"
    borderColor="whiteAlpha.100"
    position="relative"
    transition="all 0.3s"
    _hover={{
      bg: "rgba(255, 255, 255, 0.03)",
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
    <VStack align="start" spacing={4}>
      <HStack spacing={3}>
        <Icon as={icon} color="blue.400" w={5} h={5} />
        <Text color="white" fontSize="lg" fontWeight="semibold" textShadow="0 0 10px rgba(66, 153, 225, 0.3)">
          {title}
        </Text>
      </HStack>
      {children}
    </VStack>
  </Box>
);

const GlassInput = ({ ...props }) => (
  <Input
    variant="unstyled"
    bg="rgba(255, 255, 255, 0.03)"
    backdropFilter="blur(12px)"
    border="1px solid"
    borderColor="whiteAlpha.100"
    p={4}
    borderRadius="lg"
    color="white"
    transition="all 0.2s"
    _hover={{
      bg: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(16px)",
    }}
    _focus={{
      bg: "rgba(255, 255, 255, 0.06)",
      borderColor: "blue.400",
      boxShadow: "0 0 15px rgba(66, 153, 225, 0.3)",
      backdropFilter: "blur(20px)",
    }}
    {...props}
  />
);

const UserSettingsPage = () => {
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
        <Heading color="white" size="lg" textShadow="0 0 10px rgba(66, 153, 225, 0.3)">
          User Settings
        </Heading>

        <HStack spacing={8} align="start" w="100%">
          {/* Left Column */}
          <VStack flex={1} spacing={6} align="stretch">
            <SettingsSection icon={FaUser} title="Profile">
              <HStack spacing={6} align="start">
                <Avatar size="xl" name="John Doe" bg="blue.500" />
                <VStack align="start" spacing={4} flex={1}>
                  <GlassInput placeholder="Display Name" defaultValue="John Doe" />
                  <GlassInput placeholder="Email" defaultValue="john@example.com" />
                  <Button
                    bg="blue.500"
                    color="white"
                    px={6}
                    py={4}
                    _hover={{
                      bg: "blue.600",
                      transform: "translateY(-2px)",
                      boxShadow: "0 0 20px rgba(66, 153, 225, 0.4)",
                    }}
                    _active={{ transform: "translateY(0)" }}
                    transition="all 0.2s"
                  >
                    Save Changes
                  </Button>
                </VStack>
              </HStack>
            </SettingsSection>

            <SettingsSection icon={FaKey} title="Authentication">
              <VStack align="start" spacing={4} w="100%">
                <HStack justify="space-between" w="100%">
                  <VStack align="start" spacing={0}>
                    <Text color="white">Two-Factor Authentication</Text>
                    <Text color="whiteAlpha.600" fontSize="sm">
                      Add an extra layer of security to your account
                    </Text>
                  </VStack>
                  <Switch colorScheme="blue" />
                </HStack>
                <Divider borderColor="whiteAlpha.200" />
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
                  Change Password
                </Button>
              </VStack>
            </SettingsSection>
          </VStack>

          {/* Right Column */}
          <VStack flex={1} spacing={6} align="stretch">
            <SettingsSection icon={FaBell} title="Notifications">
              <VStack align="start" spacing={4} w="100%">
                <HStack justify="space-between" w="100%">
                  <VStack align="start" spacing={0}>
                    <Text color="white">Email Notifications</Text>
                    <Text color="whiteAlpha.600" fontSize="sm">
                      Receive updates about your account
                    </Text>
                  </VStack>
                  <Switch colorScheme="blue" defaultChecked />
                </HStack>
                <Divider borderColor="whiteAlpha.200" />
                <HStack justify="space-between" w="100%">
                  <VStack align="start" spacing={0}>
                    <Text color="white">Usage Alerts</Text>
                    <Text color="whiteAlpha.600" fontSize="sm">
                      Get notified about credit usage
                    </Text>
                  </VStack>
                  <Switch colorScheme="blue" defaultChecked />
                </HStack>
              </VStack>
            </SettingsSection>

            <SettingsSection icon={FaPalette} title="Appearance">
              <VStack align="start" spacing={4} w="100%">
                <HStack justify="space-between" w="100%">
                  <VStack align="start" spacing={0}>
                    <Text color="white">Dark Mode</Text>
                    <Text color="whiteAlpha.600" fontSize="sm">
                      Toggle dark/light theme
                    </Text>
                  </VStack>
                  <Switch colorScheme="blue" defaultChecked />
                </HStack>
              </VStack>
            </SettingsSection>

            <SettingsSection icon={FaShieldAlt} title="Privacy">
              <VStack align="start" spacing={4} w="100%">
                <HStack justify="space-between" w="100%">
                  <VStack align="start" spacing={0}>
                    <Text color="white">Data Collection</Text>
                    <Text color="whiteAlpha.600" fontSize="sm">
                      Help improve our services
                    </Text>
                  </VStack>
                  <Switch colorScheme="blue" />
                </HStack>
                <Divider borderColor="whiteAlpha.200" />
                <Button
                  variant="outline"
                  colorScheme="red"
                  borderWidth="2px"
                  px={6}
                  py={4}
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "0 0 20px rgba(239, 68, 68, 0.4)",
                    borderColor: "red.400",
                  }}
                  _active={{ transform: "translateY(0)" }}
                  transition="all 0.2s"
                >
                  Delete Account
                </Button>
              </VStack>
            </SettingsSection>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
};

export default UserSettingsPage;
