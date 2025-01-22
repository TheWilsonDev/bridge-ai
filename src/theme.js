import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: "#000000",
        color: "white",
      },
    },
  },
  colors: {
    gray: {
      900: "#000000", // Darker background
      800: "#2c2c2c", // Sidebar background
      700: "#3a3a3a", // Active button background
    },
  },
  components: {
    Button: {
      baseStyle: {
        color: "white",
      },
      variants: {
        ghost: {
          color: "whiteAlpha.900",
          _hover: {
            bg: "whiteAlpha.100",
          },
        },
        solid: {
          color: "white",
          bg: "gray.700",
          _hover: {
            bg: "gray.600",
          },
        },
      },
    },
    Text: {
      baseStyle: {
        color: "white",
      },
    },
    Heading: {
      baseStyle: {
        color: "white",
      },
    },
  },
});

export default theme;
