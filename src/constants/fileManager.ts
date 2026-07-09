import { As, PlacementWithLogical, ResponsiveValue, TextProps } from "@chakra-ui/react";
import { TIMEOUT } from "dns";

type Mode = "normal" | "small";

type TextAlign = TextProps["textAlign"];

export const FILEMANAGER = {
    COMMON: "common",
    MOBILE_BREAKPOINT: { base: true, md: false },
    SOURCE: {
        FILEMANAGER: "filemanager",
        RAG: "rag"
    },
    STATUS: {
        ALT: {
            ENABLED: "enabled",
            DISABLED: "disabled"
        },
        ENABLED: 1,
        DISABLED: 0
    },
    TAB: {
        MYFILES: 1,
        LEARNING: 2
    },
    PANEL: {
        BORDER: {
            RADIUS: "20px"
        },
        SHADOW: "md",
    },
    SEARCH_BAR: {
        WIDTH: "450px",
        BORDER: {
            VALUE: "1px solid",
            RADIUS: "md"
        },
        POINTER: {
            EVENTS: "none" as ResponsiveValue<any>
        },
        PADDING_L: 10,
        PLACE_HOLDER: { color: "gray.500" }
    },
    EXTENSION: {
        CONFIG: {
            GEMINI_STATUS: "GEMINI_STATUS",
            PINECONE_STATUS: "PINECONE_STATUS",
            TRUE: "true"
        },
        GEMINI: "GEMINI",
        PINECONE: "PINECONE"
    },
    FILTER: {
        MAXWIDTH: "400px",
        DIPLAY: "flex",
        FLEX_DIRECTION: { base: "column", md: "column", lg: "row" } as ResponsiveValue<any>,
        GAP: "15px",
        WIDTH: "500px"
    },
    WIDTH: {
        FULL: "full",
        AUTO: "auto",
        HUNDRED: "100%",
        SEVENTY: "70%",
        INHERIT: "inherit"
    },
    PADDING: {
        ZERO: 0,
        SMALLEST: 1,
        XSMALL: 2,
        NORMAL: 4,
        XLARGE: 6
    },
    OVERFLOW: {
        AUTO: "auto" as ResponsiveValue<any>
    },
    UPLOAD_TOOLTIP: {
        PADDING: 3,
        PLACEMANT: "bottom-start" as PlacementWithLogical,
        HAS_ARROW: true
    },
    SPACING: {
        ZERO: 0,
        SMALLEST: 1,
        XSMALL: 2,
        NORMAL: 4,
        LARGE: 5,
        XLARGE: 6,
        LARGER: 10
    },
    FLEX: {
        NORMAL: "1"
    },
    SIZE: {
        LARGE: "lg",
        MEDIUM: "md",
        SMALL: "sm"
    },
    MARGIN: {
        ZERO: 0,
        SMALLEST: 1,
        XSMALL: 2,
        NORMAL: 4,
        AUTO: "auto"
    },
    JUSTIFY: {
        SPACE_BETWEEN: "space-between",
        CENTER: "center"
    },
    ALIGN: {
        CENTER: "center",
        START: "start"
    },
    TEXT: {
        END: "end" as TextAlign,
        START: "start" as TextAlign,
        CENTER: "center" as TextAlign,
    },
    SELECT: {
        IS_SEARCHABLE: false,
        IS_CLEARABLE: true,
        CONTAINER: {
            BORDER: {
                TRANSPARENT: "1px transparent",
                RADIUS: 20
            },
            WIDTH: "100%",
            CURSOR: "pointer",
        },
        DROPDOWN: {
            WIDTH: "20px"
        },
        CONTROL: {
            BORDER: {
                RADIUS: 20
            },
        },
        MENU: {
            BG: "none",
            DARK: {
                SHADOW: "shadows.dark-lg"
            },
            COLOR: null,
            PADDING_Y: 0,
            BORDER: {
                RADIUS: 10
            },
            SCROLL_BAR: {
                WEBKIT: { display: "none" },
                MS_OVERFLOW: "none",
                WIDTH: "none"
            }
        },
    },
    UPLOAD_BUTTON: {
        COLOR: "white",
        BORDER: {
            RADIUS: "full"
        }
    },
    DELETE_BUTTON: {
        COLOR: "white",
        BORDER: {
            RADIUS: "full"
        },
        WIDTH: "full",
        VARIANT: "solid",
        MARGIN_Y: 1,
        PADDING_X: 10,
        ALIGN_SELF: "flex-end",
    },
    FILES_GRID: {
        EMPTY: [1],
        COLUMNS: [1, 2, 3, 4, 5],
        GAP: 6,
        WIDTH: "full",
        LOADING_MODE: "normal" as Mode
    },
    COLOR: {
        RED: "red"
    },
    FILE: {
        MAX_DESCRIPTION: 40
    },
    EVENT: {
        UPLOAD_COMPLETED_VALUE: -1,
        ERROR: "ERROR",
        LEAVE: "leave",
        NOTIFICATION: "notification",
        JOIN_FILE: "join_file",
        JOIN: "join",
        UPLOAD_PROGRESS: "upload_progress",
        UPLOAD_COMPLETE: "upload_complete"
    },
    TOAST: {
        SUCCESS: "success" as "success",
        ERROR: "error" as "error",
        DURATION: 2000,
        IS_CLOSABLE: true
    },
    TIMEOUT: {
        REFETCH: 500,
        RESPONSE: 500
    },
    MIME_TYPE: {
        PDF: "application/pdf",
        DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        TXT: "text/plain",
    },
    FETCH_PUT: "PUT",
    MODAL: {
        PROGRESS_BAR: {
            BG: {
                LIGHT: "gray.100",
                DARK: "gray.700"
            },
            HEIGHT: 4,
            DISPLAY: "grid",
            GRID: 1,
            BORDER_RADIUS: 20,
            GRID_HEIGHT: 2,
            PROGRESS_COMPLETED_WIDTH: 100,
            PROGRESS_GRID_Z_INDEX: 1,
            TEXT: {
                SIZE: "15px",
                MARGIN_T: 2,
                WEIGHT: "bold"
            },
            PROGRESS_TEXT: {
                COMPLETE_SIZE: 12,
                SIZE: 10,
                WEIGHT: "bold"
            }
        },
        BORDER: {
            VALUE: "1px solid",
            COLOR: {
                LIGHT: "#E5EEF7",
                DARK: "#07111F"
            }
        },
        VARIANT: "coftechModal",
        MAX_WIDTH: "320px",
        FILE_UPLOAD: {
            BORDER: {
                VALUE: "2px dashed",
                RADIUS: "md",
            },
            HEIGHT: "300px",
            CURSOR: "pointer",
            ICON: {
                WIDTH: 12,
                HEIGHT: 12,
            },
            FILE_MAX_SIZE: "50MB"
        },
        SCROLL_BAR: {
            WEBKIT: { display: "none" },
            MS_OVERFLOW: "none",
            WIDTH: "none"
        },
        FONT: {
            SIZE: {
                LARGE: "lg",
                MEDIUM: "15.5px"
            },
            WEIGHT: "bold"
        },
        TRASH: {
            COLOR: {
                ACTIVE: "red",
                INACTIVE: "gray"
            }
        },
        INPUT: {
            TYPE: "file",
            STYLE: { display: "none" }
        },
        DESCRIPTION: {
            SHADOW: "0 0 5px 1px",
            BORDER: "1px solid",
            MAXHEIGHT: "80px",
            ERROR: {
                FONT_SIZE: "12px",
                HEIGHT: "12px"
            }
        },
        ACCEPT_BUTTON: {
            COLOR: "white"
        },
        CANCEL_BUTTON: {
            VARIANT: "outline"
        },
        FILE_VIEW: {
            WIDTH: "fit_content",
            PADDING: {
                PC: "20px",
                MOBILE: "20px 0px"
            },
            FILE_VIWER: {
                VALUE: "iframe" as As,
                WIDTH: {
                    PC: "600px",
                    MOBILE: "280px"
                },
                HEIGHT: {
                    PC: "550px",
                    MOBILE: "400px"
                }
            }
        },
        FILE_EDIT: {
            SIZE: "md",
            WIDTH: {
                MAX: {
                    MOBILE: "320px",
                    PC: null
                }
            },
            TITLE: {
                TEXT: {
                    WEIGHT: "bold",
                    SIZE: "large"
                }
            },
            FILE_NAME: {
                PADDING_T: 12
            },
            INPUT: {
                SHADOW: "0 0 5px 1px",
                BORDER: "1px solid",
                DESCRIPTION: {
                    MAXHEIGHT: "80px",
                    ERROR: {
                        SIZE: "12px",
                        HEIGHT: "12px"
                    }
                }
            }
        },
        FILE_ENABLE_DISABLE: {
            SIZE: "md",
            WIDTH: {
                MAX: {
                    MOBILE: "320px",
                    PC: null
                }
            },
            BODY_PADDING_T: 12,
            ICON: {
                SIZE: 10
            },
            TITLE: {
                SIZE: "large",
                WEIGHT: "bold"
            },
            CONFIRMATION: {
                PADDING: 1,
                SIZE: "medium",
                WEIGHT: "300"
            },
            SCROLL_BAR: {
                WEBKIT: { display: "none" },
                MS_OVERFLOW: "none",
                WIDTH: "none"
            },
        },
        FILE_DELETE: {
            SIZE: "md",
            WIDTH: {
                MAX: {
                    MOBILE: "320px",
                    PC: null
                }
            },
            BODY_PADDING_T: 12,
            ICON: {
                SIZE: 10
            },
            TITLE: {
                SIZE: "large",
                WEIGHT: "bold"
            },
            CONFIRMATION: {
                PADDING: 1,
                SIZE: "medium",
                WEIGHT: "300"
            },
            SCROLL_BAR: {
                WEBKIT: { display: "none" },
                MS_OVERFLOW: "none",
                WIDTH: "none"
            },
        },
    },
    FILE_CARD: {
        DESCRIPTION_LENGTH: 25,
        DOCUMENT_EXTENSION: ".docx",
        DOCUMENT_URL: "https://docs.google.com/gview?url=",
        DOCUMENT_URL_EMBEDDED: "&embedded=true",
        CHECK_BOX: {
            FOCUS: {
                boxShadow: "none !important",
                outline: "none !important",
            }
        },
        GAP: 0,
        CURSOR: "pointer",
        SCROLL_BAR: {
            WEBKIT: { display: "none" },
            MS_OVERFLOW: "none",
            WIDTH: "none"
        },
        BORDER: {
            RADIUS: "md",
            WIDTH: 2
        },
        POSITION: "relative" as ResponsiveValue<any>,
        DISPLAY: {
            VALUE: "flex",
            DIRECTION: "column" as ResponsiveValue<any>
        },
        MENU_BUTTON: {
            VARIANT: "ghost"
        },
        ICON: {
            WIDTH: "40px",
            HEIGHT: "40px"
        },
        NAME: {
            HEIGHT: "full",
            WIDTH: "inherit",
            FONT_WEIGHT: "bold"
        },
        FEATURES: {
            TEXT: {
                SIZE: 12
            },
            MARGIN_T: "10px",
            FILE_SIZE: {
                TEXT: {
                    SIZE: "0.7em",
                    WEIGHT: "bold"
                },
                MARGIN_T: "5px",
            },
            DOWNLOAD_BUTTON: {
                SIZE: "35px",
                CURSOR: "pointer"
            }
        }
    },
    TAB_BUTTON: {
        HEIGHT: "50px",
        WIDTH: "300px",
        PADDING_Y: 3,
        CURSOR: "pointer",
        BORDER: {
            RADIUS_T: "20px"
        }
    }
};
