import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: "#0f1117",
        color: "white",
      },
    },
  },
  colors: {
    gray: {
      900: "#0f1117", // Darker background
      800: "#1a1d27", // Sidebar background
      700: "#2d303a", // Active button background
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
