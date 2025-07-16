import { Checkbox } from "../../components/ui/checkbox";

type Todo = {
  id: number;
  text: string;
  status: number;
};

interface TodoCardProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
}

export function TodoCard({ todo, onToggle }: TodoCardProps) {
  return (
    <div className="card-enhanced p-4 m-2">
      <div className="flex items-center space-x-3">
        <Checkbox
          checked={todo.status === 1}
          onCheckedChange={() => onToggle(todo)}
          className="checkbox-enhanced"
        />
        <span
          className={`text-sm font-medium transition-colors ${todo.status === 1
            ? 'text-muted-foreground line-through'
            : 'text-card-foreground'
            }`}
        >
          {todo.text}
        </span>
      </div>
    </div>
  );
}
