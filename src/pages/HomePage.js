import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import AgentGrid from "../components/AgentGrid";

const HomePage = () => {
  return (
    <Box p={10} bg="hsl(225, 21%, 7%)" height="100%" overflow="hidden">
      <Heading size="2xl" mb={4} color="white">
        Let's get started!
      </Heading>
      <Text fontSize="xl" color="white" mb={4}>
        Select a tutor agent.
      </Text>
      <Box height="calc(100vh - 200px)">
        <AgentGrid />
      </Box>
    </Box>
  );
};

export default HomePage;
