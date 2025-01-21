import React from "react";
import { Box, VStack, Heading, Text, Divider, Switch, HStack, Select, FormControl, FormLabel } from "@chakra-ui/react";

const SettingsPage = () => {
  return (
    <Box>
      <Heading size="2xl" mb={4} color="white">
        Settings
      </Heading>
      <Text fontSize="xl" color="white" mb={8}>
        Customize your experience.
      </Text>

      <VStack spacing={8} align="stretch">
        {/* Appearance Section */}
        <Box bg="#1a1d27" p={6} borderRadius="lg">
          <Heading size="md" color="white" mb={4}>
            Appearance
          </Heading>
          <VStack spacing={6} align="stretch">
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel color="white" mb={0}>
                Dark Mode
              </FormLabel>
              <Switch colorScheme="cyan" defaultChecked />
            </FormControl>
            <FormControl>
              <FormLabel color="white">Theme Color</FormLabel>
              <Select bg="#2d303a" color="white" borderColor="whiteAlpha.200">
                <option value="cyan">Cyan</option>
                <option value="purple">Purple</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
              </Select>
            </FormControl>
          </VStack>
        </Box>

        {/* Notifications Section */}
        <Box bg="#1a1d27" p={6} borderRadius="lg">
          <Heading size="md" color="white" mb={4}>
            Notifications
          </Heading>
          <VStack spacing={4} align="stretch">
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel color="white" mb={0}>
                Email Notifications
              </FormLabel>
              <Switch colorScheme="cyan" defaultChecked />
            </FormControl>
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel color="white" mb={0}>
                Desktop Notifications
              </FormLabel>
              <Switch colorScheme="cyan" defaultChecked />
            </FormControl>
          </VStack>
        </Box>

        {/* Privacy Section */}
        <Box bg="#1a1d27" p={6} borderRadius="lg">
          <Heading size="md" color="white" mb={4}>
            Privacy
          </Heading>
          <VStack spacing={4} align="stretch">
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel color="white" mb={0}>
                Share Usage Data
              </FormLabel>
              <Switch colorScheme="cyan" />
            </FormControl>
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel color="white" mb={0}>
                Show Online Status
              </FormLabel>
              <Switch colorScheme="cyan" defaultChecked />
            </FormControl>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default SettingsPage;
