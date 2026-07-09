import dynamic from "next/dynamic";

export const getIconComponent = (iconName: any) => {
    try {
        const IconComponent = dynamic(() =>
            import(`react-icons/fa`).then((icons) => icons[iconName])
        );
        return IconComponent;
    } catch (error) {
        console.error("Icon not found:", iconName);
        return null;
    }
};

export const getReactIconComponent = (iconName: any) => {
    try {
        const IconComponent = dynamic(() =>
            import(`@untitled-ui/icons-react`).then((icons) => icons[iconName])
        );
        return IconComponent;
    } catch (error) {
        console.error("Icon not found:", iconName);
        return null;
    }
};