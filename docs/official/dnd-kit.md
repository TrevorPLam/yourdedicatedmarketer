# @dnd-kit

@dnd-kit is a modern, lightweight, performant, accessible, and extensible drag and drop toolkit for React. It provides the building blocks to create drag and drop interfaces with a focus on accessibility, performance, and developer experience.

---

## Overview

@dnd-kit is a **composable drag and drop library** for React that prioritizes accessibility, performance, and customization. Unlike many drag and drop libraries, it uses the native HTML5 Drag and Drop API while providing a modern React API on top.

### Key Features

- **Composable** - Build complex drag and drop experiences with modular components
- **Accessible** - Full keyboard and screen reader support
- **Performant** - Optimized for smooth interactions at 60fps
- **Customizable** - Extensive customization options
- **TypeScript** - Full TypeScript support
- **Unstyled** - Bring your own styling
- **Touch Support** - Works on all devices

### Packages

| Package | Purpose |
|---------|---------|
| `@dnd-kit/core` | Core building blocks |
| `@dnd-kit/sortable` | Sortable lists and grids |
| `@dnd-kit/utilities` | Helper functions and utilities |
| `@dnd-kit/modifiers` | Constraint and snap modifiers |
| `@dnd-kit/accessibility` | Accessibility components |

---

## Getting Started

### Installation

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
# or
yarn add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
# or
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Quick Start

```tsx
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

function DraggableItem() {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable',
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      Drag me!
    </div>
  );
}
```

---

## Core Concepts

### DndContext

The `DndContext` is the root component that manages the drag and drop state.

```tsx
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { useState } from 'react';

function App() {
  const [isDropped, setIsDropped] = useState(false);

  const handleDragEnd = (event) => {
    if (event.over && event.over.id === 'droppable') {
      setIsDropped(true);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Draggable />
      <Droppable isDropped={isDropped} />
    </DndContext>
  );
}
```

### Sensors

Sensors detect drag operations from different input sources:

```tsx
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';

function App() {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 5 },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  return (
    <DndContext sensors={sensors}>
      {/* Components */}
    </DndContext>
  );
}
```

**Available Sensors:**
- `MouseSensor` - Desktop mouse interactions
- `TouchSensor` - Mobile touch interactions
- `KeyboardSensor` - Keyboard accessibility
- `PointerSensor` - Unified pointer API (mouse + touch)

---

## useDraggable Hook

The `useDraggable` hook provides drag functionality to elements.

### Basic Usage

```tsx
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface DraggableProps {
  id: string;
  children: React.ReactNode;
}

function Draggable({ id, children }: DraggableProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}
```

### Advanced Configuration

```tsx
const {
  attributes,
  listeners,
  setNodeRef,
  transform,
  transition,
  isDragging,
  active,
} = useDraggable({
  id: 'draggable-id',
  data: { type: 'card', index: 0 },
  disabled: false,
  attributes: {
    role: 'button',
    'aria-describedby': 'draggable-description',
  },
});
```

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `attributes` | `DOMAttributes` | Accessibility attributes |
| `listeners` | `DOMAttributes` | Event handlers |
| `setNodeRef` | `RefCallback` | Ref for the draggable element |
| `transform` | `Transform` | Current transform values |
| `transition` | `string` | CSS transition value |
| `isDragging` | `boolean` | Whether currently dragging |
| `active` | `Active` | Current active drag operation |

---

## useDroppable Hook

The `useDroppable` hook makes elements accept drops.

### Basic Usage

```tsx
import { useDroppable } from '@dnd-kit/core';

interface DroppableProps {
  id: string;
  children: React.ReactNode;
}

function Droppable({ id, children }: DroppableProps) {
  const { isOver, setNodeRef } = useDroppable({ id });

  const style = {
    backgroundColor: isOver ? '#e5e7eb' : 'transparent',
    border: isOver ? '2px dashed #3b82f6' : '2px solid transparent',
    transition: 'all 0.2s ease',
  };

  return (
    <div ref={setNodeRef} style={style} className="p-4 rounded-lg">
      {children}
    </div>
  );
}
```

### Advanced Configuration

```tsx
const { isOver, setNodeRef, over } = useDroppable({
  id: 'droppable-id',
  data: { accepts: ['card', 'folder'] },
  disabled: false,
  resizeObserverConfig: {},
});
```

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `isOver` | `boolean` | Whether a draggable is over this element |
| `setNodeRef` | `RefCallback` | Ref for the droppable element |
| `over` | `Over` | Current over state |

---

## Sortable Lists

@dnd-kit/sortable provides components for creating sortable lists.

### Basic Sortable List

```tsx
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

interface Item {
  id: string;
  content: string;
}

function SortableItem({ id, content }: Item) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 mb-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
    >
      {content}
    </div>
  );
}

function SortableList() {
  const [items, setItems] = useState<Item[]>([
    { id: '1', content: 'Item 1' },
    { id: '2', content: 'Item 2' },
    { id: '3', content: 'Item 3' },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        {items.map((item) => (
          <SortableItem key={item.id} {...item} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
```

### Sortable Grid

```tsx
import { rectSortingStrategy } from '@dnd-kit/sortable';

function SortableGrid() {
  const [items, setItems] = useState(['1', '2', '3', '4', '5', '6']);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-3 gap-4">
          {items.map((id) => (
            <SortableGridItem key={id} id={id} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
```

### useSortable Hook

```tsx
const {
  attributes,
  listeners,
  setNodeRef,
  setActivatorNodeRef,
  transform,
  transition,
  isDragging,
  isSorting,
} = useSortable({
  id: 'sortable-id',
  data: { type: 'item' },
  disabled: false,
  animateLayoutChanges: () => true,
  transition: {
    duration: 250,
    easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
  },
});
```

---

## Collision Detection

Collision detection determines which droppable is being hovered over.

### Built-in Strategies

```tsx
import {
  closestCenter,
  closestCorners,
  rectIntersection,
  pointerWithin,
} from '@dnd-kit/core';

<DndContext collisionDetection={closestCenter}>
  {/* Components */}
</DndContext>

<DndContext collisionDetection={closestCorners}>
  {/* Components */}
</DndContext>
```

### Custom Collision Detection

```tsx
import { CollisionDetection } from '@dnd-kit/core';

const customCollisionDetection: CollisionDetection = ({
  droppableContainers,
  pointerCoordinates,
}) => {
  if (!pointerCoordinates) return [];

  const { x, y } = pointerCoordinates;

  const collisions = droppableContainers
    .filter((container) => {
      const rect = container.rect.current;
      if (!rect) return false;

      return (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      );
    })
    .map((container) => ({
      id: container.id,
      data: { droppableContainer: container, value: 1 },
    }));

  return collisions;
};

<DndContext collisionDetection={customCollisionDetection}>
  {/* Components */}
</DndContext>
```

---

## Modifiers

Modifiers transform the movement of draggable elements.

### Built-in Modifiers

```tsx
import {
  restrictToVerticalAxis,
  restrictToHorizontalAxis,
  restrictToParentElement,
  restrictToWindowEdges,
  snapCenterToCursor,
} from '@dnd-kit/modifiers';

<DndContext modifiers={[restrictToVerticalAxis]}>
  {/* Vertical only */}
</DndContext>

<DndContext modifiers={[restrictToHorizontalAxis]}>
  {/* Horizontal only */}
</DndContext>

<DndContext modifiers={[restrictToParentElement]}>
  {/* Stay within parent */}
</DndContext>

<DndContext modifiers={[snapCenterToCursor]}>
  {/* Snap to cursor center */}
</DndContext>

<DndContext modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
  {/* Multiple modifiers */}
</DndContext>
```

### Custom Modifier

```tsx
import { Modifier } from '@dnd-kit/core';

const customModifier: Modifier = ({
  transform,
  activeNodeRect,
  containerNodeRect,
  draggingNodeRect,
}) => {
  if (!draggingNodeRect || !activeNodeRect) {
    return transform;
  }

  return {
    ...transform,
    x: Math.round(transform.x / 10) * 10,
    y: Math.round(transform.y / 10) * 10,
  };
};

<DndContext modifiers={[customModifier]}>
  {/* Components */}
</DndContext>
```

---

## Drag Overlay

DragOverlay creates a visual representation that follows the cursor.

### Basic Usage

```tsx
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useState } from 'react';

function App() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <DndContext
      onDragStart={(event) => setActiveId(event.active.id)}
      onDragEnd={() => setActiveId(null)}
    >
      {/* Your draggable items */}
      
      <DragOverlay>
        {activeId ? (
          <div className="p-4 bg-white rounded-lg shadow-lg">
            Dragging: {activeId}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
```

### With Sortable

```tsx
import { DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';

function SortableList() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: { opacity: '0.5' },
      },
    }),
  };

  return (
    <DndContext
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragEnd={() => setActiveId(null)}
    >
      <SortableContext items={items}>
        {items.map((item) => (
          <SortableItem key={item.id} {...item} />
        ))}
      </SortableContext>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeId ? (
          <SortableItem
            id={activeId}
            content={items.find((i) => i.id === activeId)?.content}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
```

---

## Accessibility

### Keyboard Support

```tsx
import { KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';

const sensors = useSensors(
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
);
```

### Screen Reader Announcements

```tsx
import { DndContext, Announcements } from '@dnd-kit/core';

const announcements: Announcements = {
  onDragStart({ active }) {
    return `Picked up ${active.data.current?.label}`;
  },
  onDragOver({ active, over }) {
    if (over) {
      return `Dragging ${active.data.current?.label} over ${over.data.current?.label}`;
    }
    return `Dragging ${active.data.current?.label}`;
  },
  onDragEnd({ active, over }) {
    if (over) {
      return `Dropped ${active.data.current?.label} over ${over.data.current?.label}`;
    }
    return `Dropped ${active.data.current?.label}`;
  },
  onDragCancel({ active }) {
    return `Dragging was cancelled. ${active.data.current?.label} was dropped.`;
  },
};

<DndContext announcements={announcements}>
  {/* Components */}
</DndContext>
```

### Focus Management

```tsx
function SortableItem({ id, content }) {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      tabIndex={0}
      className="p-4 bg-white rounded-lg"
      aria-describedby={`sortable-${id}-description`}
    >
      {content}
      <span id={`sortable-${id}-description`} className="sr-only">
        Press space to lift, arrow keys to move, space to drop
      </span>
    </div>
  );
}
```

---

## Common Patterns

### Multiple Containers

```tsx
import { useDroppable } from '@dnd-kit/core';

interface ContainerProps {
  id: string;
  title: string;
  items: Item[];
}

function Container({ id, title, items }: ContainerProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-lg min-h-[200px] ${
        isOver ? 'bg-blue-100' : 'bg-gray-100'
      }`}
    >
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <SortableItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}

function MultiContainerBoard() {
  const [containers, setContainers] = useState({
    todo: [{ id: '1', content: 'Task 1' }],
    inProgress: [{ id: '2', content: 'Task 2' }],
    done: [],
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = over.id;

    if (activeContainer !== overContainer) {
      setContainers((prev) => {
        const activeItems = prev[activeContainer].filter(
          (item) => item.id !== active.id
        );
        const overItems = [...prev[overContainer], active.data.current?.item];

        return {
          ...prev,
          [activeContainer]: activeItems,
          [overContainer]: overItems,
        };
      });
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        <Container id="todo" title="To Do" items={containers.todo} />
        <Container id="inProgress" title="In Progress" items={containers.inProgress} />
        <Container id="done" title="Done" items={containers.done} />
      </div>
    </DndContext>
  );
}
```

### Nested Sortables

```tsx
function NestedSortable() {
  const [items, setItems] = useState([
    {
      id: 'section-1',
      title: 'Section 1',
      children: [
        { id: 'item-1', content: 'Item 1' },
        { id: 'item-2', content: 'Item 2' },
      ],
    },
  ]);

  return (
    <DndContext>
      <SortableContext items={items.map((i) => i.id)}>
        {items.map((section) => (
          <div key={section.id}>
            <h3>{section.title}</h3>
            <DndContext>
              <SortableContext items={section.children.map((c) => c.id)}>
                {section.children.map((child) => (
                  <SortableItem key={child.id} {...child} />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        ))}
      </SortableContext>
    </DndContext>
  );
}
```

### Tree Structure

```tsx
interface TreeItem {
  id: string;
  content: string;
  children?: TreeItem[];
}

function TreeSortable() {
  const [items, setItems] = useState<TreeItem[]>([
    {
      id: '1',
      content: 'Parent',
      children: [
        { id: '2', content: 'Child 1' },
        { id: '3', content: 'Child 2' },
      ],
    },
  ]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    // Logic to handle tree reordering and nesting
    // This involves updating parent-child relationships
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Tree items={items} />
    </DndContext>
  );
}
```

---

## Integration with UI Libraries

### Tailwind CSS

```tsx
function SortableItem({ id, content }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        p-4 mb-2 bg-white rounded-lg shadow
        hover:shadow-md transition-shadow
        ${isDragging ? 'opacity-30 shadow-lg ring-2 ring-blue-500' : ''}
        cursor-grab active:cursor-grabbing
      `}
    >
      <div className="flex items-center gap-3">
        <GripVertical className="w-5 h-5 text-gray-400" />
        <span>{content}</span>
      </div>
    </div>
  );
}
```

### With Framer Motion

```tsx
import { motion, AnimatePresence } from 'framer-motion';

function AnimatedSortableList({ items }) {
  return (
    <DndContext>
      <SortableContext items={items}>
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <SortableItem {...item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </SortableContext>
    </DndContext>
  );
}
```

---

## Performance Optimization

### Memoization

```tsx
import { memo } from 'react';

const SortableItem = memo(function SortableItem({ id, content }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-4 mb-2 bg-white rounded-lg ${isDragging ? 'opacity-30' : ''}`}
    >
      {content}
    </div>
  );
});
```

### Virtualization

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualizedSortableList({ items }) {
  const parentRef = useRef();
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
  });

  return (
    <DndContext>
      <SortableContext items={items}>
        <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
          <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
            {virtualizer.getVirtualItems().map((virtualItem) => (
              <div
                key={virtualItem.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <SortableItem {...items[virtualItem.index]} />
              </div>
            ))}
          </div>
        </div>
      </SortableContext>
    </DndContext>
  );
}
```

---

## Testing

### Unit Tests with Jest

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('SortableList', () => {
  it('renders all items', () => {
    const items = [
      { id: '1', content: 'Item 1' },
      { id: '2', content: 'Item 2' },
    ];

    render(<SortableList items={items} />);

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('handles keyboard interaction', async () => {
    const user = userEvent.setup();
    const items = [{ id: '1', content: 'Item 1' }];

    render(<SortableList items={items} />);

    const item = screen.getByText('Item 1');
    await user.tab();
    await user.keyboard(' ');

    expect(item).toHaveAttribute('aria-pressed', 'true');
  });
});
```

### E2E Tests with Playwright

```tsx
import { test, expect } from '@playwright/test';

test('draggable interaction', async ({ page }) => {
  await page.goto('/sortable');

  const item1 = page.locator('[data-testid="sortable-item-1"]').first();
  const item2 = page.locator('[data-testid="sortable-item-2"]').first();

  await item1.dragTo(item2);

  await expect(page.locator('[data-testid="sortable-list"]')).toContainText(
    ['Item 2', 'Item 1']
  );
});
```

---

## Best Practices

### State Management

```tsx
// Keep drag state separate from application state
function App() {
  const [items, setItems] = useState(initialItems);
  const [activeId, setActiveId] = useState(null);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  return (
    <DndContext
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragEnd={handleDragEnd}
    >
      {/* Components */}
    </DndContext>
  );
}
```

### Error Handling

```tsx
function SafeDndContext({ children, onError }) {
  const [hasError, setHasError] = useState(false);

  const handleDragEnd = (event) => {
    try {
      // Drag logic
    } catch (error) {
      setHasError(true);
      onError?.(error);
    }
  };

  if (hasError) {
    return <div>Error loading drag and drop</div>;
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {children}
    </DndContext>
  );
}
```

### Loading States

```tsx
function LoadingSortableItem() {
  return (
    <div className="p-4 mb-2 bg-gray-100 rounded-lg animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-3/4" />
    </div>
  );
}

function SortableListWithLoading({ items, isLoading }) {
  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 5 }).map((_, i) => (
          <LoadingSortableItem key={i} />
        ))}
      </div>
    );
  }

  return <SortableList items={items} />;
}
```

---

## Troubleshooting

### Common Issues

**Items not sorting:**
- Ensure `SortableContext` has correct `items` array
- Check that `arrayMove` is imported from `@dnd-kit/sortable`
- Verify item IDs are unique and stable

**Drag overlay not appearing:**
- Ensure `DragOverlay` is inside `DndContext`
- Check that `activeId` state is being set correctly
- Verify children are conditionally rendered based on `activeId`

**Performance issues:**
- Use `memo` for sortable items
- Implement virtualization for large lists
- Disable animations during rapid updates

### Debug Helpers

```tsx
import { DndContext } from '@dnd-kit/core';

function DebugDndContext({ children }) {
  return (
    <DndContext
      onDragStart={(event) => console.log('Drag Start:', event)}
      onDragMove={(event) => console.log('Drag Move:', event)}
      onDragOver={(event) => console.log('Drag Over:', event)}
      onDragEnd={(event) => console.log('Drag End:', event)}
      onDragCancel={(event) => console.log('Drag Cancel:', event)}
    >
      {children}
    </DndContext>
  );
}
```

---

## Resources

- [Official Documentation](https://docs.dndkit.com/)
- [GitHub Repository](https://github.com/clauderic/dnd-kit)
- [Storybook Examples](https://master--5fc05e08a4a65d0021ae0bf2.chromatic.com/)
- [API Reference](https://docs.dndkit.com/api-documentation)

---

## Version Information

- **Current Version:** 6.x (core), 8.x (sortable)
- **License:** MIT
- **React Support:** 16.8+
- **TypeScript:** Full support
- **Bundle Size:** ~15KB (core) + ~5KB (sortable)
