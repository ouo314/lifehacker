import { Checkbox } from "../../components/ui/checkbox";
import { MdDeleteForever } from "react-icons/md";
type Todo = {
  id: number;
  text: string;
  status: number;
};

interface TodoCardProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onRemove: (todo: Todo) => void;
}

export function TodoCard({ todo, onToggle, onRemove }: TodoCardProps) {
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
        <button className='ml-auto mr-4' onClick={() => {
          let yes = confirm('確認刪除?')
          if (yes) onRemove(todo)

        }}>
          <MdDeleteForever size={22} />
        </button>

      </div>
    </div>
  );
}
