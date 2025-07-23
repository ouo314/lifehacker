import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { TodoCard } from "./TodoCard";
import { useTodos } from "./useTodos";

export function TodoPage() {
  const { todos, add, toggle, remove } = useTodos();
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;
    await add(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">待辦清單</h1>

        <div className="flex gap-3">
          <Input
            className="input-enhanced flex-1"
            placeholder="新增待辦事項..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!inputValue.trim()}
          >
            新增
          </Button>
        </div>
      </div>

      <div className="space-y-2 no-scrollbar max-h-96 overflow-y-auto">
        {todos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            尚無待辦事項
          </div>
        ) : (
          todos.map(todo => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onToggle={toggle}
              onRemove={remove}
            />
          ))
        )}
      </div>
    </div>
  );
}
