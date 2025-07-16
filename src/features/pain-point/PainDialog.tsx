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
import type { PainPoint } from './usePainPoints';

interface Props {
    open: boolean;
    initial?: PainPoint | null;
    onSave: (data: Omit<PainPoint, 'id'> | PainPoint) => void;
    onDelete?: () => void;
    onOpenChange: (v: boolean) => void;
}

const statusBtns = [
    {
        id: 1,
        icon: GrStatusCritical,
        color: "text-destructive",
        selectedColor: "text-red-500",
        label: "未處理"
    },
    {
        id: 2,
        icon: GrStatusDisabled,
        color: "text-destructive",
        selectedColor: "text-yellow-700",
        label: "待處理"
    },
    {
        id: 3,
        icon: GrStatusGood,
        color: "text-destructive",
        selectedColor: "text-green-500",
        label: "已完成"
    },
];


export function PainDialog({ open, initial, onSave, onDelete, onOpenChange }: Props) {
    const isEdit = Boolean(initial);
    const [form, setForm] = useState<Omit<PainPoint, 'id'>>({
        tag: initial?.tag ?? "",
        title: initial?.title ?? "",
        status: initial?.status ?? 1,
        level: initial?.level ?? 1,
        description: initial?.description ?? "",
        possible_solution_description: initial?.possible_solution_description ?? "",
        possible_solution_result: initial?.possible_solution_result ?? "",
    });

    useEffect(() => {
        setForm({
            tag: initial?.tag ?? "",
            title: initial?.title ?? "",
            status: initial?.status ?? 1,
            level: initial?.level ?? 1,
            description: initial?.description ?? "",
            possible_solution_description: initial?.possible_solution_description ?? "",
            possible_solution_result: initial?.possible_solution_result ?? "",
        });
    }, [initial, open]);

    const levelBtn = (lvl: 1 | 2 | 3 | 4 | 5) => {
        const Icon = form.level === lvl
            ? [TbHexagonNumber1Filled, TbHexagonNumber2Filled, TbHexagonNumber3Filled,
                TbHexagonNumber4Filled, TbHexagonNumber5Filled][lvl - 1]
            : [TbHexagonNumber1, TbHexagonNumber2, TbHexagonNumber3,
                TbHexagonNumber4, TbHexagonNumber5][lvl - 1];

        return (
            <Button
                key={lvl}
                type="button"
                variant={form.level === lvl ? "default" : "outline"}
                size="sm"
                onClick={() => setForm({ ...form, level: lvl })}
                className="p-2 h-auto"
            >
                <Icon size={24} />
            </Button>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="dialog-content max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {isEdit ? "編輯 Pain Point" : "新增 Pain Point"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div>
                        <Label htmlFor="title" className="text-sm font-medium">標題</Label>
                        <Input
                            id="title"
                            className="input-enhanced mt-1"
                            placeholder="請輸入標題"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label htmlFor="tag" className="text-sm font-medium">標籤</Label>
                        <Input
                            id="tag"
                            className="input-enhanced mt-1"
                            placeholder="請輸入標籤（選填）"
                            value={form.tag}
                            onChange={(e) => setForm({ ...form, tag: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label className="text-sm font-medium block mb-2">狀態</Label>
                        <div className="flex gap-2">
                            {statusBtns.map(({ id, icon: Icon, color, selectedColor, label }) => (
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
                                    <span className="font-medium">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>


                    <div>
                        <Label className="text-sm font-medium block mb-2">嚴重程度</Label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(lvl => levelBtn(lvl as 1 | 2 | 3 | 4 | 5))}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description" className="text-sm font-medium">描述</Label>
                        <Textarea
                            id="description"
                            className="input-enhanced mt-1"
                            placeholder="請描述問題的詳細情況"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="solution-desc" className="text-sm font-medium">解法（描述）</Label>
                        <Textarea
                            id="solution-desc"
                            className="input-enhanced mt-1"
                            placeholder="請描述可能的解決方案"
                            value={form.possible_solution_description}
                            onChange={(e) => setForm({ ...form, possible_solution_description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="solution-result" className="text-sm font-medium">解法（結果）</Label>
                        <Textarea
                            id="solution-result"
                            className="input-enhanced mt-1"
                            placeholder="請描述解決方案的預期結果"
                            value={form.possible_solution_result}
                            onChange={(e) => setForm({ ...form, possible_solution_result: e.target.value })}
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter className="flex justify-between">
                    <div>
                        {isEdit && onDelete && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={onDelete}
                                className="btn-secondary bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                刪除
                            </Button>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" className="btn-secondary">
                                取消
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            className="btn-primary"
                            disabled={!form.title.trim()}
                            onClick={() => {
                                onSave(isEdit ? { ...initial!, ...form } : form);
                                onOpenChange(false);
                            }}
                        >
                            {isEdit ? "更新" : "儲存"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
