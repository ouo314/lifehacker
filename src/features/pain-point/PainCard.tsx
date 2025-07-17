import { GrStatusCritical, GrStatusDisabled, GrStatusGood } from "react-icons/gr";
import {
    TbHexagonNumber1Filled, TbHexagonNumber2Filled, TbHexagonNumber3Filled,
    TbHexagonNumber4Filled, TbHexagonNumber5Filled
} from "react-icons/tb";
import type { PainPoint } from "../../lib/demo";

const iconSize = 20;

const statusIcons = [
    <GrStatusCritical size={iconSize} className="text-red-600" />,
    <GrStatusDisabled size={iconSize} className="text-yellow-600" />,
    <GrStatusGood size={iconSize} className="text-green-600" />
];

const levelIcons = [
    <TbHexagonNumber1Filled size={iconSize} className="text-blue-500" />,
    <TbHexagonNumber2Filled size={iconSize} className="text-green-500" />,
    <TbHexagonNumber3Filled size={iconSize} className="text-yellow-500" />,
    <TbHexagonNumber4Filled size={iconSize} className="text-orange-500" />,
    <TbHexagonNumber5Filled size={iconSize} className="text-red-500" />
];

interface Props {
    data: PainPoint;
    onClick: () => void;
}

export function PainCard({ data, onClick }: Props) {
    const LevelIcon = levelIcons[data.level - 1];

    return (
        <div className="card-enhanced p-4 cursor-pointer group" onClick={onClick}>
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                    {data.title}
                </h3>
                <div className="flex items-center gap-2">
                    {statusIcons[data.status - 1]}
                    {LevelIcon}
                </div>
            </div>

            {data.tag && (
                <span className="inline-block px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full mb-2">
                    {data.tag}
                </span>
            )}

            {data.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {data.description}
                </p>
            )}
        </div>
    );
}
