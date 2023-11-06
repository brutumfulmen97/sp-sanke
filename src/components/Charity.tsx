import { DndContext } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import Draggable from "@/components/Draggable";
import Droppable from "@/components/Droppable";
import { SledContext } from "@/context/sled-context";
import { useContext, useEffect, useState } from "react";
import { TotalContext } from "@/context/total-context";
import Image from "next/image";

const popupTexts = [
    `Az idei támogatást a Szent István Filharmonikusok Felfedezőúton címmel néhány éve elindított, egyedi szerkesztésű ifjúsági előadás-sorozatára szeretnénk fordítani. 45 perces műsorunkat általános iskolákba visszük el, ahol a diákok iskolaidőben, ingyenesen tekinthetik meg.

    2023-ban Petőfi évforduló lesz, az ő költészetére építve mutatunk be tavasszal az alsótagozatos és óvodás korosztály számára egy vetítéssel, tánccal egybekötött, magával ragadó művészeti programot, amit Budapest minél több kerületére szeretnénk kiterjeszteni. Köszönjük az ifjúság művészeti nevelésére adott szavazataikat!`,
    `A NOÉ Állatotthon Alapítvány Magyarország legnagyobb menhelyeként 1300 állat ideiglenes, vagy sok esetben végleges otthona. Nem csak hagyományos kutya és cicamenhely vagyunk, hanem élnek nálunk gazdasági állatok, vadászható fajok egyedei és egzotikus állatok is. Egy közös mindannyiukban, hogy valamikor az életük során bajba kerültek és segítségre, mentésre szorultak. Bár közhasznú alapítványként nonprofit szervezet vagyunk, sajnos a recessziós intézkedések minket is érintenek. Magas rezsit fizetünk, piaci áron tankolunk, állami támogatásban nem részesülünk. Így talán még sosem volt akkora szükség a nagylelkű adományozókra, támogatókra, mint napjainkban.

  A gondozásunkba kerülő állatok túlnyomó többsége súlyosan sérült, vagy beteg. A sok beteg és sérült állat állatorvosi költsége, speciális ellátásuk, a gyógyszereik havonta 4-5 millió forintba kerülnek. A NEXON felajánlását is erre szeretnénk fordítani, köszönjük ránk adott szavazataikat.`,
    `Az Autizmus Alapítvány 1989 óta működik országos hatáskörrel. Fő célja, hogy a teljes autizmus spektrumot lefedve, olyan világszínvonalú eljárásokat adaptáljon, dolgozzon ki és terjesszen el, amelyek a diagnosztikus folyamattól kezdve a felnőttkori gondozásig lehetővé teszik a szakszerű ellátást. Az eltelt több, mint 30 év alatt közel tízezer személynek nyújtottunk támogatást intézményegységeinken keresztül. ​Az alapítvány szakmai munkáját a szervezet tulajdonában lévő két ingatlanban valósítja meg, melyek fenntartása az utóbbi időszakban bekövetkezett drámai változások miatt nagyon nehézzé vált. Civil fenntartóként kedvezményt, segítséget a jelenlegi szabályozás szerint sajnos nem kaphatunk. Ezért ebben az évben ahhoz kérjük nagylelkű segítségüket, hogy átvészeljük az energiaárak robbanása okozta súlyos nehézségeket.`,
    `A Lámpás ’92 Közhasznú Alapítvány immár 30 éve azért dolgozik, hogy lehetővé tegye több száz fogyatékossággal élő embertársunk családias környezetben történő lakhatását, foglalkoztatását, művészeti képzését, valamint rászoruló gyermekek, családok ellátását.

  Valkói központi otthonunkban - melyben 11 értelmi fogyatékossággal élő ellátottunk lakik – megújuló energiarendszer kialakítását és a teljes elektronikai rendszer korszerűsítését indítottuk el.
  
  A projekt teljes költsége közel 8 millió forint. Ezen központi otthonunk fejlesztése azért is nélkülözhetetlen, mert részben ez látja el a néhány házzal odébb elhelyezkedő 9 fős otthonunkat is, valamint a tavasszal megnyíló, harmadik családias otthonunkat értelmi sérült embertársaink számára.
  
  Köszönjük, ha szavazatukkal támogatják otthonunk megújuló energetikai rendszerének kiépítését.`,
];

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
                            onClick={() => {
                                setPopupOpen(false);
                            }}
                        >
                            <Image
                                src="/closeBtn.png"
                                width={30}
                                height={30}
                                alt="close btn"
                            />
                        </button>
                        <h1 className="fontBold">{title.toUpperCase()}</h1>
                        <p className="fontMedium text-sm mobile:text-lg">
                            {popupTexts[id - 1]}
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
