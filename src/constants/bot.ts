import { As, BoxProps, ResponsiveValue, TextProps } from "@chakra-ui/react";
import { SizeProp } from "chakra-react-select";

type TextAlign = TextProps["textAlign"];

type Mode = "normal" | "small";

type OverFlow = "visible" | "hidden" | "clip" | "scroll" | "auto"

type AlertStatus = "success" | "error" | "info" | "warning" | "loading"

type AvatarStatus = "suspended" | "active"

type SpinnerPlacement = "start" | "end"

type ButtonType = "button" | "submit" | "reset"

type Position = BoxProps["position"]

type ToastStatus = "success" | "error" | "info" | "warning" | "loading"


export const BOT = {
    COMMON: "common",
    EVENT: {
        CANCEL_INIT: "canceled_initialization",
        SUSPEND: "suspended",
        DELETE: "unlinked"
    },
    AVATAR_ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    ACTION: {
        ACTIVATE: "activate",
        DEACTIVATE: "deactivate",
        START: "start",
        RESTART: "restart",
        DELETE: "delete",
    },
    GAP: {
        REGULAR: 4,
        FILTERS_DASH: {
            MOBILE: 5,
            PC: null
        },
        COMPANY_FILTER: {
            MOBILE: 2,
            PC: 5
        }
    },
    JUSTIFY: {
        CONTENT: {
            CENTER: "center",
            END: "end",
            SPACE_BETWEEN: "space-between"
        }
    },
    ALIGN: {
        ITEMS: {
            CENTER: "center",
            END: "end"
        }
    },
    DISPLAY: {
        FLEX: "flex",
        WRAP: {
            FILTERS_DASH: {
                MOBILE: { base: "wrap" },
                PC: null
            },
            COMPANY_FILTER: {
                MOBILE: { base: "wrap" },
                PC: null
            }
        },
        DIRECTION: {
            COLUMN: "column" as ResponsiveValue<any>,
        }
    },
    MAX_WIDTH: {
        FULL: "full"
    },
    WIDTH: {
        FULL: "full",
        AUTO: "auto"
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
    },
    MARGIN: {
        ZERO: 0,
        SMALL: "4px",
        REGULAR: 4,
        LARGE: "15px",
        AUTO: "auto"
    },
    PADDING: {
        ZERO: 0,
        SMALL: "4px",
        REGULAR: "8px"
    },
    COLOR: {
        LIGHT_BLUE: "#E8F4FF",
        BLACK: "black"
    },
    SORT: {
        ASCENDING: {
            TEXT: "ascending",
            VALUE: -1
        },
        DESCENDING: {
            TEXT: "descending",
            VALUE: 1
        },
        CONFIG: {
            IDENTIFIER: "identifier",
            NAME: "name",
            CREATION_DATE: "created_at",
            STATUS: "status"
        }
    },
    STATUS: {
        SUSPENDED: 1,
        NOT_SUSPENDED: 0,
        ACTIVATED: 0,
        PAUSED: 1,
        DEACTIVATED: 2
    },
    TOAST: {
        ID: {
            A: "12"
        },
        DURATION: 2000,
        STATUS: {
            SUCCESS: "success" as ToastStatus,
            ERROR: "error"
        },
        IS_CLOSABLE: true
    },
    QR_RESOLVE_TIMEOUT: 3000,
    LOADING_MODE: "normal" as Mode,
    DATA_PER_PAGE: {
        JUSTIFY: "end",
        MARGIN_B: {
            MOBILE: 4,
            PC: null
        },
        ALIGN: "center",
        POSITION: "absolute" as ResponsiveValue<any>,
        TOP: 145,
        SIZE: {
            MOBILE: 12,
            PC: 10
        },
        WEIGHT: 500,
        LITTLE: {
            VALUE: 20,
            LABEL: "20",
        },
        MEDIUM: {
            VALUE: 50,
            LABEL: "50",
        },
        LARGE: {
            VALUE: 100,
            LABEL: "100",
        }
    },
    SELECT: {
        SIZE: "sm" as SizeProp,
        SEARCHABLE: false,
        CONTAINER: {
            BORDER: {
                RADIUS: 20,
                TRANSPARENT: "1px transparent"
            },
            CURSOR: "pointer"
        },
        DROPDOWN: {
            WIDTH: "20px"
        },
        CONTROL: {
            BORDER: {
                RADIUS: 20
            }
        },
        MENU: {
            BACKGROUND: "none",
            COLOR: null,
            PADDING_Y: 0,
            BORDER: {
                RADIUS: 10
            },
            SHADOW: "shadows.dark-lg",
            SCROLL_BAR: {
                WEBKIT: { display: 'none' },
                MS_OVERFLOW: "none",
                WIDTH: "none"
            }
        }
    },
    SEARCH_BAR: {
        SIZE: "sm" as SizeProp,
        BORDER: {
            RADIUS: "20px",
            TRANSPARENT: "1px transparent"
        },
        WIDTH: { base: "100%", md: "230px" },
        ICON: {
            POINTER_EVENTS: "none" as ResponsiveValue<any>
        },
        TEXT_FIELD: {
            BORDER: {
                RADIUS: 20,
            },
        }
    },
    BUY_BOT_BUTTON: {
        SIZE: "sm",
        DISPLAY: "none",
        FONT_SIZE: "12px",
        VARIANT: "solid",
        BACKGROUND: "transparent",
        BORDER: {
            VALUE: "2px solid",
            RADIUS: 20
        }
    },
    TABLE: {
        OVERFLOW_Y: "auto" as OverFlow,
        ALERT: {
            STATUS: "info" as AlertStatus,
            BORDER: {
                RADIUS: 20
            }
        },
        VARIANT: "simple",
        WIDTH: "full",
        CSS_CLASS: "responsiveTable",
        TABLE_HEAD: {
            WEIGHT: "normal",

        },
        HEADERS: {
            WEIGHT: "normal",
            SORT: {
                SIZE: "xs",
                VARIANT: "ghost"
            }
        },
        IDENTIFIER: {
            DISPLAY: "flex",
            ALIGN: {
                ITEMS: "center",
            },
            GAP: "12px",
            AVATAR: {
                POSITION: "relative" as ResponsiveValue<any>,
                NAME: "photo",
                SUSPENDED: "suspended" as AvatarStatus,
                ACTIVATED: "active" as AvatarStatus,
                BORDER: {
                    RADIUS: "50%"
                },
                SIZE: "48px",
                MARGIN: "1px",
                NO_PICTURE: {
                    SIZE: "md"
                },
                NETWORK_ICON: {
                    POSITION: "absolute" as ResponsiveValue<any>,
                    BOTTOM: "0",
                    RIGHT: "0",
                    BACKGROUND: "white",
                    BORDER: {
                        RADIUS: "full"
                    },
                    PADDING: 0.5,
                    ALTERNATIVE: "WHATSAPP"
                }
            }
        },
        STATUS: {
            DISPLAY: "flex"
        },
        ACTIONS: {
            DISPLAY: "flex",
            GAP: 1,
            ICON: {
                PAUSE: "PauseCircle",
                START_ACTIVATE: "PlayCircle",
                RESTART: "RefreshCw05",
                EDIT: "Edit05",
                CONFIGURE: "Settings01",
                DELETE: "Trash03"
            }
        }
    },
    PAGINATION: {
        DISPLAY: "flex",
        JUSTIFY: {
            CONTENT: "space-between",
        },
        MARGIN_T: 4,
        WRAP: "wrap" as ResponsiveValue<any>,
        GAP: "8px",
        SIZE: 16,
        WEIGHT: 500,
        FIRST_PAGE: 1,
        VARIANT: {
            ACTIVE: "solid",
            INACTIVE: "outline"
        }
    },
    MODAL: {
        SIZE: "sm",
        VARIANT: "coftechModal",
        JUSTIFY: {
            CONTENT: "center"
        },
        DISPLAY: "flex",
        EXPIRED: {
            FLEX_DIRECTION: "column" as ResponsiveValue<any>,
            GAP: "1rem",
            ICON: {
                SIZE: "60px"
            }
        },
        FOOTER: {
            MARGIN_B: "10px"
        },
        ICON: {
            SIZE: "60px",
            MARGIN_B: 2
        },
        TITLE: {
            SIZE: "xl",
            WEIGHT: 600
        },
        DESCRIPTION: {
            SIZE: "md",
            MARGIN_B: 4
        },
        BUTTON: {
            COLOR: "white",
            BORDER: {
                RADIUS: "md"
            },
            WIDTH: "100%"
        },
        CANVAS: {
            ERROR_CORRECTION_LEVEL: "M",
            MARGIN: 3,
            SCALE: 4,
            WIDTH: 200
        },
        LOADING_MODE: "small" as Mode,
        OPEN_AI: {
            BACK_DROP: "blur(4px)",
            BORDER: {
                RADIUS: 20
            },
            FALLBACK: "rgba(0, 0, 0, 0.5)",
            TRANSITION: "backdrop-filter 0.3s ease, -webkit-backdrop-filter 0.3s ease, background-color 0.3s ease",
            Z_INDEX: 1400
        }
    },
    EDIT: {
        FALLBACK: "blocking",
        BACK_BUTTON: true,
        MAX_WIDTH: "full",
        PADDING: "0px 32px",
        DISPLAY: "flex",
        DIRECTION: "column" as ResponsiveValue<any>,
        GAP: "40px",
        INVALID: {
            ALIGN: {
                ITEMS: "center"
            },
            JUSTIFY: {
                CONTENT: "center"
            },
            HEIGHT: "70vh"
        },
        PANEL: {
            MARGIN_Y: 4,
            PADDING: "60px",
            GAP: "40px",
            ALIGN: "flex-start",
            JUSTIFY: {
                CONTENT: "space-between",
            },
            BORDER: {
                RADIUS: 50
            },
            WIDTH: "full",
            FLEX: 1,
            MIN_HEIGHT: "full"
        },
        CHOOSE_AVATAR: {
            WIDTH: "100%",
            JUSTIFY: {
                CONTENT: { base: "center", md: "start" }
            },
            AVATAR: {
                NAME: "photo",
                SUSPENDED: "suspended" as AvatarStatus,
                ACTIVATED: "active" as AvatarStatus,
                SIZE: "xl",
            },
            BUTTON: {
                DISPLAY: "flex",
                ALIGN: {
                    ITEMS: "center"
                },
                JUSTIFY: {
                    CONTENT: "center",
                },
                BACKGROUND: "white",
                POSITION: "relative" as ResponsiveValue<any>,
                TOP: "90px",
                WIDTH: "0px",
                BORDER: {
                    RADIUS: "6px"
                },
                ICON: {
                    ARIA_LABEL: "Edit image",
                    POSITION: "absolute" as ResponsiveValue<any>,
                    BOTTOM: 0,
                    RIGHT: 0,
                    HEIGHT: "24px",
                    WIDTH: "10px",
                    MIN_WIDTH: "24px",
                },
                UPLOAD_ELEMENT: {
                    WIDTH: "24px",
                    NAME: "photo",
                    TYPE: "file",
                    ID: "file-upload",
                    ACCEPTED_FILES: "image/*",
                    STYLE: { display: "none" }
                }
            }
        },
        FIELDS: {
            DISPLAY: "flex",
            DIRECTION: "column" as ResponsiveValue<any>,
            WIDTH: "100%",
            GAP: "1.5rem",
            FIELD: {
                DISPLAY: "flex",
                DIRECTION: { base: "column", md: "row" } as ResponsiveValue<any>,
                GAP: "1.5rem",
                TYPE: "form" as As,
                WIDTH: "100%",
                FORM: {
                    WIDTH: "100%",
                    DISPLAY: "flex",
                    DIRECTION: "column" as ResponsiveValue<any>,
                    GAP: 4
                },
                INPUT: {
                    VARIANT: "filled",
                    SHADOW: `0px 2px 4px -2px #0F172A0F; box-shadow: 0px 4px 8px -2px #0F172A1A;`,
                    BORDER: {
                        VALUE: `2px solid transparent`,
                        RADIUS: "md"
                    },
                    FOCUSED: {
                        BORDER: {
                            VALUE: `2px solid`,
                        },
                    }
                },
                NAME: {
                    MAX_LENGTH: 50,
                    NAME: "name",
                },
                DESCRIPTION: {
                    MAX_LENGTH: 500,
                    RESIZE: "none" as ResponsiveValue<any>,
                    NAME: "description",
                    HEIGHT: "180px"
                }
            }
        },
        BUTTONS: {
            WIDTH: "100%",
            DISPLAY: "flex",
            DIRECTION: { base: "column", md: "row" } as ResponsiveValue<any>,
            JUSTIFY: {
                CONTENT: "space-between"
            },
            GAP: "16px",
            DEFAULT: {
                WIDTH: { base: "100%", md: "250px" },
                BORDER: {
                    RADIUS: 50
                },
                COLOR_SCHEME: "teal",
                SPINNER_PLACEMENT: "start" as SpinnerPlacement
            },
            SAVE: {
                TYPE: "submit" as ButtonType
            },
            CANCEL: {
                VARIANT: "outline",
                BORDER: {
                    VALUE: "1px"
                }
            }
        }
    },
    CONFIG: {
        INTERNAL: 1,
        EDITABLE: 0,
        FALL_BACK: "blocking",
        BACK_BUTTON: true,
        MAX_WIDTH: "full",
        PADDING: "0px 32px",
        DISPLAY: "flex",
        DIRECTION: "column" as ResponsiveValue<any>,
        GAP: "40px",
        INVALID: {
            ALIGN: {
                ITEMS: "center"
            },
            JUSTIFY: {
                CONTENT: "center"
            },
            HEIGHT: "70vh"
        },
        PANEL: {
            MARGIN_Y: 4,
            PADDING: "60px",
            GAP: "40px",
            ALIGN: "flex-start",
            JUSTIFY: {
                CONTENT: "space-between"
            },
            BORDER: {
                RADIUS: 50,
            },
            WIDTH: "full",
            FLEX: 1,
            MIN_HEIGHT: "full",
            TITLE: {
                SIZE: "22px",
                WEIGHT: "bold"
            }
        },
        SOCIAL_NETWORKS: {
            WIDTH: "full",
            OVERFLOW_X: "auto" as ResponsiveValue<any>,
            GAP: "20px",
            SCROLL_BAR: {
                WEBKIT: { display: 'none' },
                MS_OVERFLOW: 'none',
                WIDTH: 'none'
            },
            AMOUNT: {
                MARGIN_L: "auto",
                MARGIN_Y: 0
            },
            CONFIGS: {
                WIDTH: "full",
                TITLE: {
                    MARGIN_R: "auto"
                },
                SELECT: {
                    SIZE: "sm" as SizeProp,
                    IS_SEARCHABLE: false,
                    CONTAINER: {
                        WIDTH: "full",
                        CURSOR: "pointer",
                    },
                    DROPDOWN: {
                        WIDTH: "20px",
                    },
                    CONTROL: {
                        BORDER: {
                            RADIUS: 20
                        },
                    },
                    MENU: {
                        BACKGROUND: "none",
                        COLOR: null,
                        PADDING_Y: 0,
                        BORDER: {
                            RADIUS: 10,
                        },
                        SHADOW: "shadows.dark-lg",
                        SCROLL_BAR: {
                            WEBKIT: { display: 'none' },
                            MS_OVERFLOW: 'none',
                            WIDTH: 'none'
                        },
                    },
                },
                DESCRIPTION: {
                    MARGIN_Y: "20px",
                    MARGIN_R: "auto"
                },
                CONFIG: {
                    WIDTH: "full",
                    MARGIN_B: "20px",
                    TITLE: {
                        MARGIN_R: "auto"
                    },
                    JUSTIFY: {
                        CONTENT: "space-between"
                    },
                    INPUT: {
                        MARGIN_Y: "auto"
                    },
                    REQUIRED_CONFIG: 1,
                },
                SAVE_TO_DISPLAY: {
                    MARGIN_R: "auto"
                }
            },
            NETWORK: {
                DISPLAY: 'flex',
                DIRECTION: "row" as ResponsiveValue<any>,
                ICON: {
                    SIZE: "40px",
                    TYPE: "Fa"
                },
                TEXT: {
                    MARGIN_X: "10px",
                    MARGIN_Y: "auto",
                    SIZE: "20px"
                },
                PADDING: "10px",
                PADDING_X: "50px",
                CURSOR: "pointer",
                BORDER: {
                    RADIUS: 50,
                    SELECTED: `1px solid`,
                    UNSELECTED: `1px solid transparent`
                }
            }
        },
        BUTTONS: {
            WIDTH: "100%",
            DISPLAY: "flex",
            MARGIN_T: "50px",
            DIRECTION: { base: "column", md: "row" } as ResponsiveValue<any>,
            JUSTIFY: {
                CONTENT: "space-between"
            },
            GAP: "16px",
            DEFAULT: {
                WIDTH: { base: "100%", md: "250px" },
                BORDER: {
                    RADIUS: 50,
                },
                COLOR_SCHEME: "teal",
                SPINNER_PLACEMENT: "start" as SpinnerPlacement,
            },
            SAVE: {
                TYPE: "submit" as ButtonType,
                LOADING_STATE: "saveChanges",
                BOT_LOADING_STATE: "saveBotChanges"
            },
            CANCEL: {
                VARIANT: "outline",
                BORDER: {
                    VALUE: "1px"
                }
            }
        },
        INPUT_FIELD: {
            TIME: {
                KEY: 'time',
                DIRECTION: 'column' as ResponsiveValue<any>,
                FORMAT: "HH:mm",
                HOUR: {
                    ARIA_LABLE: "Hour",
                    PLACE_HOLDER: "00"
                },
                MINUTE: {
                    PLACE_HOLDER: "00"
                },
                DEFAULT: ''
            },
            CRON: {
                KEY: 'cron',
                ALIGN: {
                    ITEMS: "center"
                },
                DEFAULT: ''
            },
            FLOAT: {
                KEY: 'float',
                TEXT: {
                    ALIGN: "center" as ResponsiveValue<any>,
                },
                SIZE: "md",
                MIN_WIDTH: "50px",
                BORDER: {
                    RADIUS: "10px",
                    VALUE: "1px solid grey"
                },
                ALIGN: {
                    ITEMS: "center"
                },
                TYPE: "range",
                STEP: 0.1,
                DEFAULT: 0,
                INPUT_DEFAULT: "",
                VARIANT: "outline",
                MAX_WIDTH: "200px"
            },
            ENUM: {
                KEY: 'enum',
                GAP: "1rem",
                TARGET: "_blank",
                DEFAULT: "",
                MAX_WIDTH: "200px",
                PADDING_X: 3,
                HEIGHT: 10,
                LINE_HEIGHT: 10,
                BACKGROUND: "green.100",
                COLOR: "green.700",
                BORDER: {
                    WIDTH: "1px",
                    GRAY: 200,
                },
                TEXT: {
                    WEIGHT: "medium",
                    SIZE: "sm",
                },
                DISPLAY: "inline-flex",
                ALIGN: {
                    VALUE: "center",
                    ITEMS: "center"
                },
                HOVER: {
                    BACKGROUND: "green.200",
                    TEXT_DECORATION: "none",
                    BORDER: {
                        GRAY: 300,
                    },
                },
                FOCUS: {
                    BLUE: 500,
                }
            },
            BOOLEAN: {
                KEY: 'boolean',
                ALIGN: {
                    ITEMS: "center"
                },
                ACTIVATED: "true",
                TEXT: {
                    MARGIN_L: 2
                }
            },
            INT: {
                KEY: 'integer',
                TYPE: "number",
                INPUT_DEFAULT: ""
            },
            ENUM_ARRAY: {
                KEY: 'enum_array',
                DEFAULT: "",
                ALIGN: "start",
                SPACING: 2,
                WRAP: "wrap" as ResponsiveValue<any>,
                VALUES_STACK: {
                    PADDING_X: 2,
                    PADDING_Y: 1,
                    BORDER: {
                        RADIUS: "md"
                    },
                    SPACING: 1,
                    ICON: {
                        SIZE: 6,
                        COLOR: "black",
                        CURSOR: "pointer"
                    }
                },
            },
            STRING_COMMAS: {
                VALUE: 'string_commas',
                DEFAULT: "",
                ALIGN: "start",
                WIDTH: "full",
                INPUT: {
                    TYPE: "text",
                    BUTTON: {
                        SIZE: "40px",
                        ICON_SIZE: "24px"
                    }
                }
            },
            JSON_ARRAY: {
                KEY: 'json_array',
                DEFAULT: "",
                ALIGN: "start",
                PADDING: 7,
                GAP: 5,
                BORDER: {
                    RADIUS: "10px"
                },
                JSON: {
                    RESTRICTIONS_KEY: "restrictions",
                    WIDTH: "full",
                    PADDING: {
                        HORIZONTAl_STACK: 5,
                        VERTICAL_STACK: "10px"
                    },
                    BORDER: {
                        RADIUS: "10px"
                    },
                    GAP: 10,
                    CLOSED: {
                        WIDTH: "full",
                        GAP: "50px",
                    },
                    NAME: {
                        KEY: "name",
                        TEXT: {
                            WIDTH: "full",
                            ALIGN: "start" as TextAlign
                        },
                        INPUT: {
                            TYPE: "text",
                            WIDTH: "full",
                            MAX_LENGTH: 1024,
                            FOCUS: {
                                SHADOW: "none"
                            },
                            TOAST: {
                                STATUS: "warning" as ToastStatus,
                                DURATION: 3000,
                                IS_CLOSABLE: true
                            }
                        }
                    },
                    STATUS: {
                        TEXT: {
                            WIDTH: "full",
                            ALIGN: "start" as TextAlign
                        },
                        ACTIVATED: {
                            VALUE: "true",
                            TEXT: {
                                MARGIN_L: 2
                            }
                        },
                        KEY: "status",
                        MARGIN_R: "auto",
                        PADDING_L: 4,
                        WIDTH: "full",
                        HEIGHT: "40px",
                        BORDER: {
                            RADIUS: "5px"
                        }
                    },
                    OPEN_BUTTON: {
                        WIDTH: "30px",
                        HEIGHT: "30px",
                        MARGIN_B: "auto",
                        BORDER: {
                            RADIUS: "50%"
                        },
                        JUSTIFY: {
                            ITEMS: "center",
                        },
                        HOVER: {
                            CURSOR: "pointer"
                        },
                        ICON: {
                            MARGIN_T: "5px",
                            SIZE: "19px"
                        }
                    },
                    REMOVE_BUTTON: {
                        MIN_ITEMS: 1,
                        WIDTH: "30px",
                        HEIGHT: "30px",
                        MARGIN_B: "auto",
                        BACKGROUND: {
                            DISABLED: "#17304F"
                        },
                        COLOR: {
                            DISABLED: "#94A3B8"
                        },
                        BORDER: {
                            RADIUS: "50%"
                        },
                        JUSTIFY: {
                            ITEMS: "center",
                        },
                        HOVER: {
                            CURSOR: {
                                ACTIVE: "pointer",
                                DISABLED: "not-allowed"
                            }
                        },
                        ICON: {
                            MARGIN_T: "5px",
                            SIZE: "19px"
                        }
                    },
                    FIELDS: {
                        KEY: "fields",
                        WDITH: "full",
                        GAP: 6,
                        DEFAULT: "",
                        TITLE: {
                            WIDTH: "full",
                            SIZE: "25px",
                            WEIGHT: "bold"
                        },
                        BODY: {
                            ALIGN: "start",
                            WIDTH: "full",
                            PADDING: "10px"
                        },
                        GRID: {
                            COLUMNS: [1, 2],
                            GAP: 6,
                            WIDTH: "full",
                            MARGIN_B: 4
                        },
                        INPUT: {
                            WIDTH: "full",
                            TYPE: "text",
                            SHADOW: "none"
                        },
                        REMOVE_BUTTON: {
                            SIZE: "25px",
                            BORDER: {
                                RADIUS: "3px"
                            },
                            MARGIN_R: 3,
                            HOVER: {
                                CURSOR: "pointer"
                            },
                            ICON: {
                                SIZE: "25px"
                            }
                        },
                        ADD_BUTTON: {
                            BACKGROUND: "transparent",
                            BORDER: `1px solid`,
                            HOVER: {
                                COLOR: "white",
                            }
                        }
                    },
                    PROMPT: {
                        KEY: "prompt",
                        WDITH: "full",
                        TITLE: {
                            WIDTH: "full",
                            SIZE: "25px",
                            WEIGHT: "bold"
                        },
                        TEXT_AREA: {
                            MAX_HEIGHT: "200px",
                            WIDTH: "full",
                            FOCUS: {
                                SHADOW: "none",
                            },
                            MAX_LENGTH: 1024,
                            TOAST: {
                                STATUS: "warning" as ToastStatus,
                                DURATION: 3000,
                                IS_CLOSABLE: true
                            }
                        }
                    },
                    GROUP: {
                        KEY: "group",
                        WDITH: "full",
                        TITLE: {
                            WIDTH: "full",
                        },
                        INPUT: {
                            TYPE: "text",
                            WIDTH: "full",
                            FOCUS: {
                                SHADOW: "none",
                            },
                            MAX_LENGTH: 1024,
                            TOAST: {
                                STATUS: "warning" as ToastStatus,
                                DURATION: 3000,
                                IS_CLOSABLE: true
                            }
                        }
                    }
                },
                ADD_BUTTON: {
                    MARGIN_L: "auto"
                }
            },
            STRING: {
                KEY: 'string',
                DEFAULT: "",
                INPUT: {
                    TYPE: "text"
                }
            }
        },
        COPY: {
            ICON: "Clipboard",
            SUCCESS_TOAST: {
                ID: "222",
                STATUS: "success" as ToastStatus,
                DURATION: 2000,
                IS_CLOSABLE: true
            },
            ERROR_TOAST: {
                ID: "333",
                STATUS: "error" as ToastStatus,
                DURATION: 2000,
                IS_CLOSABLE: true,
            }
        },
        SAVE: {
            INFO_TOAST: {
                STATUS: "info" as ToastStatus,
                DURATION: 3000,
                IS_CLOSABLE: true,
            },
            SUCCESS_TOAST: {
                STATUS: "success" as ToastStatus,
                DURATION: 3000,
                IS_CLOSABLE: true,
            }
        }
    },
};
