import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogFooter, DialogClose
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { GrStatusCritical, GrStatusDisabled, GrStatusGood } from "react-icons/gr";
import {
    TbHexagonNumber1, TbHexagonNumber1Filled,
    TbHexagonNumber2, TbHexagonNumber2Filled,
    TbHexagonNumber3, TbHexagonNumber3Filled,
    TbHexagonNumber4, TbHexagonNumber4Filled,
    TbHexagonNumber5, TbHexagonNumber5Filled
} from "react-icons/tb";
import { useState, useEffect } from "react";
import type { PainPoint } from '../../lib/demo';

import { IoFastFoodOutline } from "react-icons/io5"; //飲食
import { BiSolidBus } from "react-icons/bi";//交通
import { TbBooks } from "react-icons/tb";//教育
import { GiPartyPopper } from "react-icons/gi";//娛樂
import { GiWaterBottle } from "react-icons/gi";//日用
import { PiFirstAidKitBold } from "react-icons/pi";//醫療
import { MdOutlineAirplaneTicket } from "react-icons/md";//旅行

import { FaRegMoneyBillAlt } from "react-icons/fa";//現金
import { ImCreditCard } from "react-icons/im";//信用卡/金融卡/轉帳
import { FaGooglePay } from "react-icons/fa";//電子支付
import { GrUserManager } from "react-icons/gr";//家人支付
import { HiOutlineDotsHorizontal } from "react-icons/hi";//其他
import { Expense } from "../../lib/demo";

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

const MethodIcons = new Map<string, any>([
    ["Cash", <FaRegMoneyBillAlt size={iconSize} />],
    ["Credir/Debit Card", <ImCreditCard size={iconSize} />],
    ["Digital Payment", <FaGooglePay size={iconSize} />],
    ["Family Payment", <GrUserManager size={iconSize} />]
])

interface Props {
    open: boolean;
    initial?: Expense | null;
    onSave: (data: Omit<Expense, 'id'> | Expense) => void;
    onDelete?: () => void;
    onOpenChange: (v: boolean) => void;
}

export function PainDialog({ open, initial, onSave, onDelete, onOpenChange }: Props) {
    const isEdit = Boolean(initial);
    const today = new Date();
    const [form, setForm] = useState<Omit<Expense, 'id'>>({
        amount: initial?.amount ?? 0,
        category: initial?.category ?? "",
        subCategory: initial?.subCategory ?? "",
        paymentMethod: initial?.paymentMethod ?? "",
        date: initial?.date ?? today.toDateString(),
        timeOfDay: initial?.timeOfDay ?? "",
        area: initial?.area ?? "",
        satisfication: initial?.satisfication ?? 0
    });

    useEffect(() => {
        setForm({
            amount: initial?.amount ?? 0,
            category: initial?.category ?? "",
            subCategory: initial?.subCategory ?? "",
            paymentMethod: initial?.paymentMethod ?? "",
            date: initial?.date ?? today.toDateString(),
            timeOfDay: initial?.timeOfDay ?? "",
            area: initial?.area ?? "",
            satisfication: initial?.satisfication ?? 0
        });
    }, [initial, open]);

    const satisficationBtn = (lvl: 1 | 2 | 3 | 4 | 5) => {
        const Icon = form.satisfication === lvl
            ? [TbHexagonNumber1Filled, TbHexagonNumber2Filled, TbHexagonNumber3Filled,
                TbHexagonNumber4Filled, TbHexagonNumber5Filled][lvl - 1]
            : [TbHexagonNumber1, TbHexagonNumber2, TbHexagonNumber3,
                TbHexagonNumber4, TbHexagonNumber5][lvl - 1];

        return (
            <Button
                key={lvl}
                type="button"
                variant={form.satisfication === lvl ? "default" : "outline"}
                size="sm"
                onClick={() => setForm({ ...form, satisfication: lvl })
                }
                className="p-2 h-auto"
            >
                <Icon size={24} />
            </Button>
        );
    };
    const categoryBtn = (type: string) => {
        return (
            <Button
                key={type}
                type="button"
                variant={form.category === type ? "default" : "outline"}
                size="sm"
                onClick={() => setForm({ ...form, category: type })
                }
                className="p-2 h-auto"
            >
                {CategoryIcons.get(type) || <HiOutlineDotsHorizontal size={iconSize} />}
            </Button>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange} >
            <DialogContent className="dialog-content max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar" >
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold" >
                        {isEdit ? "Edit Record" : "Add Record"}
                    </DialogTitle>
                </DialogHeader>

                < div className="space-y-6 py-4" >
                    <div>
                        <Label htmlFor="amount" className="text-sm font-medium" > Amount </Label>
                        < Input
                            id="amount"
                            className="input-enhanced mt-1"
                            placeholder="Enter Amount"
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: e.target.valueAsNumber })}
                        />
                    </div>

                    < div >
                        <Label htmlFor="category" className="text-sm font-medium" > Category </Label>
                        < Input
                            id="category"
                            className="input-enhanced mt-1"
                            placeholder="Choose Category"
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                        />
                    </div>

                    < div >
                        <Label className="text-sm font-medium block mb-2" > Status </Label>
                        < div className="flex gap-2" >
                            {
                                statusBtns.map(({ id, icon: Icon, color, selectedColor, label }) => (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => setForm({ ...form, status: id })}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${form.status === id
                                            ? 'bg-secondary text-secondary-foreground shadow-md border-2 border-primary'
                                            : 'bg-background text-foreground hover:bg-secondary/50 border border-border'
                                            }`}
                                    >
                                        <Icon
                                            size={16}
                                            className={`transition-colors duration-200 ${form.status === id
                                                ? selectedColor
                                                : color
                                                }`}
                                        />
                                        < span className="font-medium" > {label} </span>
                                    </button>
                                ))}
                        </div>
                    </div>


                    < div >
                        <Label className="text-sm font-medium block mb-2" > Severity </Label>
                        < div className="flex gap-2" >
                            {[1, 2, 3, 4, 5].map(lvl => levelBtn(lvl as 1 | 2 | 3 | 4 | 5))}
                        </div>
                    </div>

                    < div >
                        <Label htmlFor="description" className="text-sm font-medium" > Description </Label>
                        < Textarea
                            id="description"
                            className="input-enhanced mt-1"
                            placeholder="Describe the problem in detail"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    < div >
                        <Label htmlFor="solution-desc" className="text-sm font-medium" > Solution(Description) </Label>
                        < Textarea
                            id="solution-desc"
                            className="input-enhanced mt-1"
                            placeholder="Possible Solution"
                            value={form.possible_solution_description}
                            onChange={(e) => setForm({ ...form, possible_solution_description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    < div >
                        <Label htmlFor="solution-result" className="text-sm font-medium" > Solution(Result) </Label>
                        < Textarea
                            id="solution-result"
                            className="input-enhanced mt-1"
                            placeholder="Does it works?"
                            value={form.possible_solution_result}
                            onChange={(e) => setForm({ ...form, possible_solution_result: e.target.value })}
                            rows={3}
                        />
                    </div>
                </div>

                < DialogFooter className="flex justify-between" >
                    <div>
                        {isEdit && onDelete && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={onDelete}
                                className="btn-secondary bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Delete
                            </Button>
                        )}
                    </div>

                    < div className="flex gap-2" >
                        <DialogClose asChild >
                            <Button type="button" variant="outline" className="btn-secondary" >
                                Cancel
                            </Button>
                        </DialogClose>
                        < Button
                            type="submit"
                            className="btn-primary"
                            disabled={!form.title.trim()}
                            onClick={() => {
                                onSave(isEdit ? { ...initial!, ...form } : form);
                                onOpenChange(false);
                            }}
                        >
                            {isEdit ? "Update" : "Save"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
