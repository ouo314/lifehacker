import { IoFastFoodOutline } from "react-icons/io5"; //飲食
import { BiSolidBus } from "react-icons/bi";//交通
import { TbBooks } from "react-icons/tb";//教育
import { GiPartyPopper } from "react-icons/gi";//娛樂
import { GiWaterBottle } from "react-icons/gi";//日用
import { PiFirstAidKitBold } from "react-icons/pi";//醫療
import { MdOutlineAirplaneTicket } from "react-icons/md";//旅行
import { HiOutlineDotsHorizontal } from "react-icons/hi";//其他

import { FaRegMoneyBillAlt } from "react-icons/fa";//現金
import { ImCreditCard } from "react-icons/im";//信用卡/金融卡/轉帳
import { FaGooglePay } from "react-icons/fa";//電子支付
import { GrUserManager } from "react-icons/gr";//家人支付
import type { Expense } from "../../lib/demo";
import {
    TbHexagonNumber1Filled, TbHexagonNumber2Filled, TbHexagonNumber3Filled,
    TbHexagonNumber4Filled, TbHexagonNumber5Filled
} from "react-icons/tb";

const iconSize = 20;

const CategoryIcons = new Map<string, JSX.Element>([
    ["Food & Beverage", <IoFastFoodOutline size={iconSize} />],
    ["Transportation", <BiSolidBus size={iconSize} />],
    ["Education", <TbBooks size={iconSize} />],
    ["Entertainment", <GiPartyPopper size={iconSize} />],
    ["Daily Life", <GiWaterBottle size={iconSize} />],
    ["Healthcare", <PiFirstAidKitBold size={iconSize} />],
    ["Travel", <MdOutlineAirplaneTicket size={iconSize} />],
    ["Other", <HiOutlineDotsHorizontal size={iconSize} />]
]);

// 分類顏色配置
const CategoryColors = new Map<string, string>([
    ["Food & Beverage", "bg-orange-100 text-orange-700 border-orange-200"],
    ["Transportation", "bg-blue-100 text-blue-700 border-blue-200"],
    ["Education", "bg-green-100 text-green-700 border-green-200"],
    ["Entertainment", "bg-purple-100 text-purple-700 border-purple-200"],
    ["Daily Life", "bg-gray-100 text-gray-700 border-gray-200"],
    ["Healthcare", "bg-red-100 text-red-700 border-red-200"],
    ["Travel", "bg-indigo-100 text-indigo-700 border-indigo-200"],
    ["Other", "bg-slate-100 text-slate-700 border-slate-200"]
]);

const satisfactionIcons = [
    <TbHexagonNumber1Filled size={16} className="text-red-500" />,
    <TbHexagonNumber2Filled size={16} className="text-orange-500" />,
    <TbHexagonNumber3Filled size={16} className="text-yellow-500" />,
    <TbHexagonNumber4Filled size={16} className="text-lime-500" />,
    <TbHexagonNumber5Filled size={16} className="text-green-500" />
];

// 付款方式圖標
const PaymentMethodIcons = new Map<string, any>([
    ["Cash", <FaRegMoneyBillAlt size={iconSize} />],
    ["Credir/Debit Card", <ImCreditCard size={iconSize} />],
    ["Digital Payment", <FaGooglePay size={iconSize} />],
    ["Family Payment", <GrUserManager size={iconSize} />]
])


interface Props {
    data: Expense;
    onClick: () => void;
}

export function ExpenseCard({ data, onClick }: Props) {
    const formatAmount = (amount: number) => {
        return Math.abs(amount).toLocaleString();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
    };

    return (
        <div
            className="flex items-center p-4 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:bg-accent/50 space-x-4"
            onClick={onClick}
        >
            {/* 左側：分類圖標 */}
            <div className={`flex items-center justify-center w-12 h-12 rounded-full border ${CategoryColors.get(data.category) || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                {CategoryIcons.get(data.category) || <HiOutlineDotsHorizontal size={iconSize} />}
            </div>

            {/* 中間：詳細資訊 */}
            <div className="flex-1 min-w-0">
                {/* 主要資訊行 */}
                <div className="flex items-center justify-between mb-2">
                    <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-foreground truncate">
                            {data.category}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                            <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium">
                                {data.subCategory}
                            </span>
                            {data.area && (
                                <span className="text-xs text-muted-foreground">
                                    📍 {data.area}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* 次要資訊行 */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-3">
                        {/* 付款方式 */}
                        <div className="flex items-center space-x-1">
                            <span>{PaymentMethodIcons.get(data.paymentMethod) || '💰'}</span>
                            <span className="text-xs">{data.paymentMethod}</span>
                        </div>

                        {/* 時間 */}
                        <div className="text-xs">
                            {formatDate(data.date)} • {data.timeOfDay}
                        </div>
                    </div>
                </div>
            </div>

            {/* 右側：金額和評分 */}
            <div className="flex flex-col items-end space-y-2">
                {/* 金額 */}
                <div className="text-right">
                    <h3 className={`text-lg font-bold ${data.amount <= 0
                        ? 'text-red-500'
                        : 'text-green-500'
                        }`}>
                        {data.amount <= 0 ? '-' : '+'}NT${formatAmount(data.amount)}
                    </h3>
                </div>

                {/* 滿意度評分 */}
                {data.satisfication > 0 && (
                    <div className="flex items-center">
                        {satisfactionIcons[data.satisfication - 1]}
                    </div>
                )}
            </div>
        </div>
    );
}