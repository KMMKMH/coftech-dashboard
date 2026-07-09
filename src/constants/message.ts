import { BoxProps, TextProps } from "@chakra-ui/react";
import { PointTuple } from "leaflet";

type TextAlign = TextProps["textAlign"];

type Width = BoxProps["width"]

type FlexDirection = BoxProps["flexDirection"]

type AlignItems = BoxProps["alignItems"]

type TextTransform = TextProps["textTransform"]

type Hover = BoxProps["_hover"]

type Position = BoxProps["position"]


export const MESSAGE = {
    WIDTH: {
        FULL: "full",
        AUTO: "auto",
        PERCENT_100: "100%"
    },
    HEIGHT: {
        AUTO: "auto"
    },
    TEXT: {
        SMALL: "10px",
        REGULAR: "14px",
        LARGE: "17px",
        END: "end" as TextAlign,
        START: "start" as TextAlign,
        CENTER: "center" as TextAlign,
        MEDIUM_WEIGHT: "md",
        NORMAL_WEIGHT: "normal",
        BOLD: "bold",
        WHITE_SPACE: "pre-line"
    },
    MARGIN: {
        ZERO: 0,
        SMALL: "4px",
        REGULAR: "8px",
        LARGE: "15px",
        AUTO: "auto"
    },
    PADDING: {
        ZERO: 0,
        SMALL: "4px",
        REGULAR: "8px"
    },
    DEFAULT: {
        WIDTH: { base: "200px", md: "200px", lg: "400px" } as Width
    },
    VIDEO: {
        WIDTH: { base: "150px", md: "200px", lg: "300px" } as Width
    },
    IMAGE: {
        WIDTH: { base: "150px", md: "200px", lg: "300px" } as Width,
        MAX_HEIGHT_1: "200px",
        MAX_HEIGHT_2: "300px"
    },
    STICKER: {
        WIDTH: { base: "50px", md: "100px", lg: "200px" } as Width,
        BORDER: "md",
        OVERFLOW: "hidden",
        SHADOW: "sm"

    },
    LOCATION: {
        WIDTH: { base: "200px", md: "350px", lg: "450px" } as Width
    },
    AUDIO: {
        MIN_WIDTH: "200px",
        HEIGHT: 10,
        AVATAR_BORDER_RADIUS: "100px",
        DEFAULT_AVATAR_SIZE: "md",
        PLAY_BUTTON: "plain",
        AVATAR_SIZE: 48,
        TIME_STAMP_BOTTOM: 6,
        TIME_STAMP_POSITION: "relative" as Position,
        TRACK_BOTTOM: 7,
        TRACK_POSITION: "relative" as Position,
        TRACK_ZINDEX: 0,
        TRACK_HEIGHT: 1,
        TRACK_ROUNDED: "full",
        TRACK_X_MARGIN: 1,
        SLIDER_TOP: 0,
        SLIDER_POSITION: "relative" as Position,
        SLIDER_ZINDEX: 1,
        SLIDER_BORDER: "none",
        SLIDER_DIRECTION: "ltr",
        SLIDER_TYPE: "range",
        SLIDER_MINIMUM: 0,
        IMAGE: "image/jpeg"
    },
    DOCUMENT: {
        OVERFLOW: "clip",
        THEME: "teal",
        SIZE: "lg",
        VARIANT: "solid",
        BORDER_RADIUS: "full",
        SHADOW: "md",
        HOVER: { filter: "brightness(70%)" } as Hover,
        SPLITTING_TOKEN: "/",
        FORMAT_TRANSFOME: "uppercase" as TextTransform,
        NAME_MAX_LENGTH: 20,
        ICON_HEIGHT: "40px",
        BUTTON_VARIANT: "none"
    },
    EVENT: {
        WIDTH: { base: "400px", md: "450px", lg: "550px" } as Width,
        COLOR: "teal.500",
        BUTTON_COLOR: "teal.100",
        BUTTON_HOVER_COLOR: "teal.200",
        BUTTON_DISPLAY: "block",
        BUTTON_BORDER_RADIUS: "md",
        NAME_BORDER_RADIUS: "md",
        DESCRIPTION_DISPLAY: "flex",
        DESCRIPTION_FLEX_DIRECTION: "column" as FlexDirection,
        DESCRIPTION_ALIGNMENT: "center" as AlignItems,
        TITLE_LETTER_SPACING: "wide",
        TITLE_TEXT_TRANSFORM: "uppercase" as TextTransform,
        BACKGROUND_COLOR: "white",
        BORDER_RADIUS: "lg",
        SHADOW: "md",
        BORDER: "1px solid",
        BORDER_COLOR: "gray.300",
    },
    CONTACT: {
        WIDTH: { base: "400px", md: "450px", lg: "550px" } as Width,
        COLOR: "teal.500",
        BUTTON_COLOR: "teal.100",
        BUTTON_HOVER_COLOR: "teal.200",
        BUTTON_DISPLAY: "block",
        BUTTON_BORDER_RADIUS: "md",
        NAME_BORDER_RADIUS: "md",
        DESCRIPTION_DISPLAY: "flex",
        DESCRIPTION_FLEX_DIRECTION: "column" as FlexDirection,
        DESCRIPTION_ALIGNMENT: "center" as AlignItems,
        TITLE_LETTER_SPACING: "wide",
        TITLE_TEXT_TRANSFORM: "uppercase" as TextTransform,
        BACKGROUND_COLOR: "white",
        BORDER_RADIUS: "lg",
        SHADOW: "md",
        BORDER: "1px solid",
        BORDER_COLOR: "gray.300",
    },
    COLOR: {
        GRAY: "gray.100",
        DARK_GRAY: "gray.500",
        BLACK: "black",
        TITLE_COLOR: "white",
        URL_COLOR: "teal.500",
        RED: "red"
    },
    AVATAR: {
        BORDER_RADIUS: "100px"
    },
    LEAFLETMAP: {
        ICON_URL: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        SHADOW_URL: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        TILE_LAYER_URL: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        ICON_SIZE: [25, 41] as PointTuple,
        ICON_ANCHOR: [12, 41] as PointTuple,
        POPUP_ANCHOR: [1, -34] as PointTuple,
        SHADOW_SIZE: [41, 41] as PointTuple,
        STYLE: { height: "100%", width: "100%", borderRadius: "10px" },
        ZOOM: 13,
        HEIGHT: "200px",
        INTERVAL: 100,
        ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    SEND: "send",
    RECEIVE: "receive",
    DATE_FORMAT: "PPP",
    SPANISH: "es",
};