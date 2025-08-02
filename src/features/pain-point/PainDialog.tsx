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
        label: "Not processed"
    },
    {
        id: 2,
        icon: GrStatusDisabled,
        color: "text-destructive",
        selectedColor: "text-yellow-700",
        label: "Pending"
    },
    {
        id: 3,
        icon: GrStatusGood,
        color: "text-destructive",
        selectedColor: "text-green-500",
        label: "Complete"
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
            <DialogContent className="dialog-content max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {isEdit ? "Edit Pain Point" : "Add Pain Point"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div>
                        <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                        <Input
                            id="title"
                            className="input-enhanced mt-1"
                            placeholder="Enter Title"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label htmlFor="tag" className="text-sm font-medium">Tag</Label>
                        <Input
                            id="tag"
                            className="input-enhanced mt-1"
                            placeholder="Choose Tag (Option)"
                            value={form.tag}
                            onChange={(e) => setForm({ ...form, tag: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label className="text-sm font-medium block mb-2">Status</Label>
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
                        <Label className="text-sm font-medium block mb-2">Severity</Label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(lvl => levelBtn(lvl as 1 | 2 | 3 | 4 | 5))}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                        <Textarea
                            id="description"
                            className="input-enhanced mt-1"
                            placeholder="Describe the problem in detail"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="solution-desc" className="text-sm font-medium">Solution (Description)</Label>
                        <Textarea
                            id="solution-desc"
                            className="input-enhanced mt-1"
                            placeholder="Possible Solution"
                            value={form.possible_solution_description}
                            onChange={(e) => setForm({ ...form, possible_solution_description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="solution-result" className="text-sm font-medium">Solution (Result)</Label>
                        <Textarea
                            id="solution-result"
                            className="input-enhanced mt-1"
                            placeholder="Does it works?"
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
                                Delete
                            </Button>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" className="btn-secondary">
                                Cancel
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
                            {isEdit ? "Update" : "Save"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
