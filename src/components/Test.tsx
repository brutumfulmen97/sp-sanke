import { SledContext } from "@/context/sled-context";
import { useContext } from "react";

const Test = ({}) => {
    const { sleds, setSleds } = useContext(SledContext);

    console.log(sleds);

    return <div>test</div>;
};

export default Test;
