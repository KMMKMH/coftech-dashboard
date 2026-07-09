import { createMultiStyleConfigHelpers, extendTheme } from "@chakra-ui/react";
import { modalAnatomy as parts } from "@chakra-ui/anatomy";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const coftechModal = definePartsStyle({
  dialog: {
    borderRadius: "md",
    bg: `#FFFFFF`,
    _dark: {
      bg: `#102A43`,
    },
  },
});

const modalTheme = defineMultiStyleConfig({
  variants: { coftechModal },
});

const theme = extendTheme({
  fonts: {
    heading: `'poppins', sans-serif`,
    body: `'poppins', sans-serif`,
  },

  colors: {
    gray: {
      700: "#17304F",
    },

    coftech: {
      primary: {
        lighter: "#E8F4FF",
        light: "#1B89E6",
        dark: "#3BA3F7",
      },

      primary_hover: {
        light: "#0F73C9",
        dark: "#5BB6FF",
      },

      description: {
        light: "#475569",
        dark: "#CBD5E1",
      },

      panel: {
        light: "#FFFFFF",
        dark: "#102A43",
      },

      background: {
        light: "#F8FBFF",
        dark: "#07111F",
      },

      border: {
        light: "#D9E2EC",
        dark: "#1E3A5F",
      },

      text: {
        light: "#0F172A",
        dark: "#F8FBFF",
      },

      inText: {
        light: "#FFFFFF",
        dark: "#07111F",
      },

      descriptionColor: {
        light: "#475569",
        dark: "#CBD5E1",
      },

      icon: {
        light: "#1B89E6",
        dark: "#3BA3F7",
      },

      inputBorder: {
        light: "#D9E2EC",
        dark: "#1E3A5F",
      },

      backgroundSoft: {
        light: "#E8F4FF",
        dark: "#12385C",
      },

      section: {
        dark: "#0B1B2E",
      },

      divider: {
        light: "#E5EEF7",
        dark: "#17304F",
      },

      secondary: {
        light: "#102A43",
        dark: "#0B4F9C",
      },

      textMuted: {
        light: "#64748B",
        dark: "#94A3B8",
      },

      accent: {
        cyan: "#2DD4FF",
        gold: "#F5B841",
      },

      status: {
        success: "#22C55E",
        successBg: "#ECFDF5",
        warning: "#F59E0B",
        warningBg: "#FFFBEB",
        error: "#EF4444",
        errorBg: "#FEF2F2",
        info: "#3BA3F7",
        infoBg: "#EFF6FF",
      },
    },
  },

  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "dark" ? "#07111F" : "#F8FBFF",
        color: props.colorMode === "dark" ? "#F8FBFF" : "#0F172A",
      },

      "@font-face": [
        {
          fontFamily: "Poppins",
          fontStyle: "normal",
          fontWeight: 300,
          src: `url('/fonts/poppins-light.woff2') format('woff2')`,
        },
        {
          fontFamily: "Poppins",
          fontStyle: "normal",
          fontWeight: 400,
          src: `url('/fonts/poppins-regular.woff2') format('woff2')`,
        },
        {
          fontFamily: "Poppins",
          fontStyle: "normal",
          fontWeight: 700,
          src: `url('/fonts/poppins-bold.woff2') format('woff2')`,
        },
      ],
    }),
  },

  components: {
    Modal: modalTheme,
  },
});

export default theme;
