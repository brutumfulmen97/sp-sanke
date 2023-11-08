type TSled = {
    id: string;
    parent: string;
    value: number;
};

type TCharityProps = {
    image: string;
    title: string;
    link: string;
    id: string;
    parent: string;
    value: number;
};

type TDraggableProps = {
    id: string;
    children: React.ReactNode;
};

type TDroppableProps = {
    id: string;
    children: React.ReactNode;
    className?: string;
};

type TSledContext = {
    sleds: TSled[];
    setSleds: (sleds: TSled[]) => void;
};

type TTotalContext = {
    total: number;
    setTotal: (total: number) => void;
};

const API_URL_DEVELOPMENT = "/api/sheets";
const API_URL_STAGING = "/giveaway";
const API_URL_PRODUCTION = "/giveaway";
