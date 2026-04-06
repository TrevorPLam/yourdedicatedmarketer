'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@agency/ui-components/react';
import { Button } from '@agency/ui-components/react';
import { useProjectStore } from '@/store/projectStore';
import { useAnalytics } from '@agency/analytics';
import {
  Plus,
  Calendar,
  User,
  Clock,
  Trash2,
  CheckCircle,
  Circle,
  AlertCircle,
} from 'lucide-react';
import './TaskBoard.css';

// Types
interface TaskColumn {
  id: string;
  title: string;
  status: Task['status'];
  tasks: Task[];
}

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: string) => void;
}

// Sortable Task Card Component
function SortableTaskCard({ task, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case 'review':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className="task-card"
      whileHover={{ scale: 1.02 }}
      layout
    >
      <Card className={`p-4 cursor-pointer border-l-4 ${getPriorityColor(task.priority)}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getStatusIcon(task.status)}
            <h4 className="font-medium text-sm">{task.title}</h4>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-3">
            {task.assigneeId && (
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>Assigned</span>
              </div>
            )}
            {task.dueDate && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{task.estimatedHours}h</span>
          </div>
        </div>

        {task.tags.length > 0 && (
          <div className="flex items-center space-x-1 mt-2">
            {task.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 2 && (
              <span className="text-xs text-gray-500">+{task.tags.length - 2}</span>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
}

// Column Component
function TaskColumn({
  column,
  onDeleteTask,
}: {
  column: TaskColumn;
  onDeleteTask: (taskId: string) => void;
}) {
  const { addTask } = useProjectStore();
  const { trackEvent } = useAnalytics();

  const handleAddTask = () => {
    const newTask = {
      title: 'New Task',
      description: '',
      status: column.status,
      priority: 'medium' as const,
      estimatedHours: 4,
      actualHours: 0,
      dependencies: [],
      tags: [],
    };

    addTask('current-project', newTask);
    trackEvent({
      action: 'task_created',
      category: 'project_management',
      label: column.status,
    });
  };

  return (
    <div className="task-column">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-700">
          {column.title}
        </h3>
        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
          {column.tasks.length}
        </span>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleAddTask}
        className="w-full mb-4 border-dashed"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Task
      </Button>

      <SortableContext
        items={column.tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          <AnimatePresence>
            {column.tasks.map((task) => (
              <SortableTaskCard
                key={task.id}
                task={task}
                onDelete={onDeleteTask}
              />
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </div>
  );
}

// Main Task Board Component
export function TaskBoard() {
  const { projects, selectedProject, updateTask, deleteTask } = useProjectStore();
  const { trackEvent } = useAnalytics();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [deletedMockTaskIds, setDeletedMockTaskIds] = useState<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get tasks from selected project or use mock data
  const mockTasks: Task[] = [
    {
      id: 'task-1',
      projectId: 'project-1',
      title: 'Design homepage layout',
      description: 'Create wireframes and mockups for the new homepage design',
      status: 'in-progress',
      priority: 'high',
      estimatedHours: 8,
      actualHours: 5,
      dependencies: [],
      tags: ['design', 'ui'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task-2',
      projectId: 'project-1',
      title: 'Implement authentication',
      description: 'Set up user authentication with NextAuth.js',
      status: 'todo',
      priority: 'critical',
      estimatedHours: 12,
      actualHours: 0,
      dependencies: ['task-1'],
      tags: ['backend', 'security'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task-3',
      projectId: 'project-1',
      title: 'Write API documentation',
      description: 'Document all API endpoints with examples',
      status: 'completed',
      priority: 'low',
      estimatedHours: 4,
      actualHours: 3,
      dependencies: [],
      tags: ['documentation'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const tasks = selectedProject?.tasks || mockTasks.filter((t) => !deletedMockTaskIds.has(t.id));

  // Organize tasks into columns
  const columns: TaskColumn[] = [
    {
      id: 'todo',
      title: 'To Do',
      status: 'todo',
      tasks: tasks.filter((task) => task.status === 'todo'),
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      status: 'in-progress',
      tasks: tasks.filter((task) => task.status === 'in-progress'),
    },
    {
      id: 'review',
      title: 'Review',
      status: 'review',
      tasks: tasks.filter((task) => task.status === 'review'),
    },
    {
      id: 'completed',
      title: 'Completed',
      status: 'completed',
      tasks: tasks.filter((task) => task.status === 'completed'),
    },
  ];

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    if (!activeTask) return;

    const overColumnId = over.id as string;
    const newStatus = overColumnId as Task['status'];

    if (activeTask.status !== newStatus) {
      // Update task status
      updateTask(activeTask.projectId, activeTask.id, { status: newStatus });

      trackEvent({
        action: 'task_moved',
        category: 'project_management',
        label: `${activeTask.status}_to_${newStatus}`,
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
  };

  const handleDeleteTask = (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    if (selectedProject) {
      deleteTask(selectedProject.id, taskId);
    } else {
      setDeletedMockTaskIds((prev) => new Set([...prev, taskId]));
    }
    trackEvent({
      action: 'task_deleted',
      category: 'project_management',
    });
  };

  return (
    <div className="task-board">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <TaskColumn
              key={column.id}
              column={column}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="drag-overlay">
              <SortableTaskCard
                task={tasks.find((task) => task.id === activeId)!}
                onDelete={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
