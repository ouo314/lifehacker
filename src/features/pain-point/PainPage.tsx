import { Button } from "../../components/ui/button";
import { BsPlusSquare } from "react-icons/bs";
import { useState } from "react";
import { PainCard } from "./PainCard";
import { PainDialog } from "./PainDialog";
import { usePainPoints } from "./usePainPoints";
import type { PainPoint } from '../../lib/demo';

export default function PainPage() {
    const { points, add, update, remove } = usePainPoints();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<PainPoint | null>(null);

    const handleSave = (data: PainPoint | Omit<PainPoint, "id">) => {
        if (editing) {
            // 編輯模式：data 包含 id
            update(data as PainPoint);
        } else {
            // 新增模式：data 不包含 id
            add(data as Omit<PainPoint, "id">);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">痛點紀錄</h1>
                <Button
                    className="btn-primary flex items-center gap-2"
                    onClick={() => {
                        setEditing(null);
                        setDialogOpen(true);
                    }}
                    aria-label="新增 Pain Point"
                >
                    <BsPlusSquare size={18} />
                    新增痛點
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {points.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        <BsPlusSquare size={48} className="mx-auto mb-4 opacity-50" />
                        <p>尚無痛點紀錄</p>
                        <p className="text-sm mt-2">點擊上方按鈕開始新增</p>
                    </div>
                ) : (
                    points.map(p => (
                        <PainCard
                            key={p.id}
                            data={p}
                            onClick={() => {
                                setEditing(p);
                                setDialogOpen(true);
                            }}
                        />
                    ))
                )}
            </div>

            <PainDialog
                open={dialogOpen}
                initial={editing}
                onOpenChange={setDialogOpen}
                onSave={handleSave}
                onDelete={editing ? () => {
                    remove(editing.id);
                    setDialogOpen(false);
                } : undefined}
            />
        </div>
    );
}
