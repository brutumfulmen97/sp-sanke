import { DndContext } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import Draggable from "@/components/Draggable";
import Droppable from "@/components/Droppable";
import { SledContext } from "@/context/sled-context";
import { useContext, useEffect, useState } from "react";
import { TotalContext } from "@/context/total-context";
import Image from "next/image";
import { CharityPopupTexts } from "@/constants";

const Charity = ({ title, image, link, id, parent, value }: TCharityProps) => {
    const containers = Array.from({ length: 13 }, (_, i) => i.toString());
    const { sleds, setSleds } = useContext(SledContext);
    const { total, setTotal } = useContext(TotalContext);
    const [style, setStyle] = useState({
        cursor: "grab",
    });
    const [popupOpen, setPopupOpen] = useState(false);

    const draggableMarkup = (
        <Draggable id={id}>
            <div className="draggable-markup" style={style}>
                <div>
                    <Image
                        src="/sanke.png"
                        width={600}
                        height={300}
                        alt="snake"
                        className="sled-image"
                    />
                </div>
            </div>
        </Draggable>
    );

    useEffect(() => {
        if (+total < 3_000_000 || value !== 0) {
            setStyle({
                cursor: "grab",
            });
        } else {
            setStyle({
                cursor: "not-allowed",
            });
        }
    }, [total, value]);

    return (
        <div className="charity__content">
            <h2 className="fontExtraBold">
                {new Intl.NumberFormat("hu-HU", {
                    currency: "HUF",
                    maximumFractionDigits: 0,
                }).format(+parent * 250000)}{" "}
                <span className="fontDemiBoldItalic">Ft</span>
            </h2>
            <Image
                src={image}
                alt={title}
                width={1000}
                height={1000}
                style={{
                    width: "100%",
                    height: "auto",
                }}
            />
            <div className="charity__content-main">
                <div className="dnd-context">
                    <DndContext
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToHorizontalAxis]}
                    >
                        {containers.map((id: string) => (
                            <Droppable key={id} id={id} className="droppable">
                                {parent === id ? draggableMarkup : ""}
                            </Droppable>
                        ))}
                    </DndContext>
                </div>
                <div className="charity__content-main-info">
                    <Image
                        src="/info.png"
                        width={70}
                        height={70}
                        alt="info"
                        onClick={() => setPopupOpen(true)}
                    />
                    <a href={`https://${link}`} target="_blank">
                        <Image
                            src="/link.png"
                            width={70}
                            height={70}
                            style={{
                                width: "100%",
                                height: "auto",
                            }}
                            alt="info"
                        />
                    </a>

                    <p className="fontMedium">{title.toUpperCase()}</p>
                </div>
            </div>
            {popupOpen && (
                <div className="popup">
                    <div className="popup__content">
                        <button
                            className="popup__content-close-btn"
                            onClick={() => {
                                setPopupOpen(false);
                            }}
                        >
                            <Image
                                src="/closeBtn.png"
                                width={35}
                                height={35}
                                alt="close btn"
                            />
                        </button>
                        <h1 className="fontBold">{title.toUpperCase()}</h1>
                        <p className="fontMedium text-sm mobile:text-lg">
                            {CharityPopupTexts[id]}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );

    function handleDragEnd(event: any) {
        const { over } = event;

        let newSleds;
        const newTotal = +total - +parent * 250000;

        let newValue;
        if (!over || !over?.id) return;
        newSleds = sleds.map((sled: TSled) => {
            if (id === sled.id) {
                if (newTotal + over.id * 250000 > 3_000_000) {
                    const maxParent = Math.floor(
                        (3_000_000 - newTotal) / 250000
                    );
                    newValue = maxParent * 250000;
                    return {
                        ...sled,
                        parent: over ? maxParent.toString() : null,
                        value: newValue,
                    };
                }
                return {
                    ...sled,
                    parent: over ? over.id : null,
                    value: over ? +over.id * 250000 : 0,
                };
            }
            return sled;
        });

        setSleds(newSleds);
        setTotal(newTotal + (newValue ?? over.id * 250000));
    }
};

export default Charity;
