import * as React from "react";
import { IInputs } from "../generated/ManifestTypes";
import { ThreeDot } from "react-loading-indicators";

export interface IncidentProp {
    context: ComponentFramework.Context<IInputs>,
    id: string | undefined
}

export interface htmlComponentProp {
    incidentType: string,
    color: string
}

const IncidentTypes = (props: IncidentProp): JSX.Element => {
    const [data, setData] = React.useState<htmlComponentProp[]>([]);
    const scrollRef = React.useRef<HTMLDivElement>(null); // Reference for the scroll container
    const [isDragging, setIsDragging] = React.useState(false);
    const [startX, setStartX] = React.useState(0);
    const [scrollLeft, setScrollLeft] = React.useState(0);
    const [loader, setLoader] = React.useState(true);
    React.useEffect(() => {
        setLoader(true);
        const fetchData = async () => {
            try {
                const data = await fetchDataFromAPI(props.context, props.id);
                setData(data);
                setLoader(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoader(false);
            }
        };
        fetchData();
    }, [props.context]);

    // Handle mouse down event
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.pageX);
        if (scrollRef.current) {
            setScrollLeft(scrollRef.current.scrollLeft);
        }
    };

    // Handle mouse up and leave events
    const stopDragging = () => {
        setIsDragging(false);
    };

    // Handle mouse move event
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        const walk = e.pageX - startX;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <>
            {loader ? <ThreeDot color="#115ea3" size="small" text="" textColor="#115ea3" /> : <div
                ref={scrollRef}
                style={{
                    display: "flex",
                    overflowX: "auto",
                    overflowY: "hidden",
                    whiteSpace: "nowrap",
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                    height: "38px",
                    cursor: isDragging ? "grabbing" : "grab"
                }}
                onMouseDown={handleMouseDown}
                onMouseLeave={stopDragging}
                onMouseUp={stopDragging}
                onMouseMove={handleMouseMove}
            >
                {data.map((item: htmlComponentProp, index: number) => (
                    <div
                        key={index}
                        style={{
                            background: item.color,
                            minWidth: "100px",
                            margin: "auto 4px auto 0px",
                            color: "white",
                            textAlign: "center",
                            fontWeight: "600",
                            height: "28px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {item.incidentType}
                    </div>
                ))}
            </div>}
        </>
    );
};

async function fetchDataFromAPI(context: ComponentFramework.Context<IInputs>, id: string | undefined): Promise<htmlComponentProp[]> {
    let data: htmlComponentProp[] = [];
    var workorderincidents = await context.webAPI.retrieveMultipleRecords(
        "msdyn_workorderincident",
        `?$filter=_msdyn_workorder_value eq ${id}&$orderby=msdyn_name&$select=msdyn_name,msdyn_taskspercentcompleted,gits_incidentstatus`
    );

    for (var i = 0; i < workorderincidents.entities.length; i++) {

        var obj: htmlComponentProp = {
            incidentType: workorderincidents.entities[i].msdyn_name,
            color: (workorderincidents.entities[i].gits_incidentstatus == 0 || workorderincidents.entities[i].gits_incidentstatus == null) ? "#e31212" : workorderincidents.entities[i].gits_incidentstatus == 1 ? "#50bd00" : "#ff7211"
        };

        data.push(obj);
    }
    return data;
}

export default IncidentTypes;
