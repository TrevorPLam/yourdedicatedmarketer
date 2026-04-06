# Framer Motion Documentation

**Repository Version:** ^12.38.0  
**Official Documentation:** https://www.framer.com/motion/  
**Latest Release:** April 2026

## Overview

Framer Motion is a production-ready, open-source animation library for React. It provides a powerful, declarative API for creating smooth, performant animations and gestures with minimal code.

In this monorepo, Framer Motion serves as the primary animation solution, enabling rich interactions, smooth transitions, and engaging user experiences across all applications while maintaining excellent performance and accessibility.

## Key Features

### **Animation System**
- **Declarative Animations**: Simple, readable animation syntax
- **Gesture Support**: Built-in gesture recognition and handling
- **Physics-based Animations**: Spring physics and natural motion
- **SVG Animations**: First-class SVG animation support
- **Layout Animations**: Automatic layout transition animations

### **Performance**
- **Hardware Acceleration**: GPU-accelerated animations
- **Optimized Rendering**: Efficient DOM manipulation
- **Reduced Layout Thrashing**: Smart batching and optimization
- **Mobile Performance**: Optimized for mobile devices
- **Accessibility**: Respects prefers-reduced-motion

### **Developer Experience**
- **TypeScript Support**: Full TypeScript with excellent intellisense
- **Component API**: Easy-to-use component-based API
- **Variants System**: Organized animation states
- **Drag Gestures**: Built-in drag and drop functionality
- **Scroll Animations**: Scroll-linked animations

## Installation

### Core Dependencies

```bash
# Install Framer Motion
pnpm add framer-motion@^12.38.0

# Install Motion (lightweight alternative)
pnpm add motion@^11.0.0
```

### **Package.json Setup**

```json
{
  "dependencies": {
    "framer-motion": "^12.38.0",
    "motion": "^11.0.0"
  }
}
```

## Basic Usage

### **Simple Animation**

```typescript
// src/components/AnimatedBox.tsx
import { motion } from 'framer-motion';

export function AnimatedBox() {
  return (
    <motion.div
      className="w-20 h-20 bg-blue-500"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    />
  );
}
```

### **Hover Animation**

```typescript
// src/components/HoverButton.tsx
import { motion } from 'framer-motion';

export function HoverButton() {
  return (
    <motion.button
      className="px-4 py-2 bg-blue-500 text-white rounded"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      Hover me
    </motion.button>
  );
}
```

### **Variants System**

```typescript
// src/components/AnimatedCard.tsx
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    transition: {
      duration: 0.2,
      ease: 'easeInOut'
    }
  }
};

export function AnimatedCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-md"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      {children}
    </motion.div>
  );
}
```

## Advanced Patterns

### **Staggered Animations**

```typescript
// src/components/AnimatedList.tsx
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100
    }
  }
};

export function AnimatedList({ items }: { items: string[] }) {
  return (
    <motion.ul
      className="space-y-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => (
        <motion.li
          key={index}
          className="p-2 bg-gray-100 rounded"
          variants={itemVariants}
        >
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### **Layout Animations**

```typescript
// src/components/AnimatedGrid.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export function AnimatedGrid({ items }: { items: Array<{ id: number; content: string }> }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-3 gap-4">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            className="p-4 bg-white rounded-lg shadow-md cursor-pointer"
            onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ layout: { duration: 0.3 } }}
          >
            <motion.h3 layout="position">{item.content}</motion.h3>
            {selectedId === item.id && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-2 text-sm text-gray-600"
              >
                Expanded content for {item.content}
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
```

### **Drag Gestures**

```typescript
// src/components/DraggableCard.tsx
import { motion, useAnimation } from 'framer-motion';
import { useState } from 'react';

export function DraggableCard() {
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimation();

  return (
    <motion.div
      className="w-64 h-40 bg-purple-500 rounded-lg shadow-lg cursor-move"
      drag
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      dragElastic={0.2}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      whileDrag={{ scale: 1.1, rotate: 5 }}
      animate={controls}
      style={{ originX: 0.5, originY: 0.5 }}
    >
      <div className="flex items-center justify-center h-full text-white">
        {isDragging ? 'Dragging...' : 'Drag me!'}
      </div>
    </motion.div>
  );
}
```

### **Scroll Animations**

```typescript
// src/components/ScrollReveal.tsx
import { motion, useScroll, useTransform } from 'framer-motion';

export function ScrollReveal({ children }: { children: React.ReactNode }) {
  const { scrollYProgress } = useScroll();
  
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0]);

  return (
    <motion.div
      style={{ opacity, scale, y }}
      className="py-20"
    >
      {children}
    </motion.div>
  );
}

// Usage in a page
export function ScrollAnimatedPage() {
  return (
    <div>
      <ScrollReveal>
        <h1 className="text-4xl font-bold">Section 1</h1>
      </ScrollReveal>
      <ScrollReveal>
        <h2 className="text-3xl font-bold">Section 2</h2>
      </ScrollReveal>
      <ScrollReveal>
        <h3 className="text-2xl font-bold">Section 3</h3>
      </ScrollReveal>
    </div>
  );
}
```

## Animation Types

### **Spring Animation**

```typescript
// Spring physics for natural motion
export function SpringAnimation() {
  return (
    <motion.div
      className="w-20 h-20 bg-green-500 rounded"
      animate={{ x: 100 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 10,
        mass: 1
      }}
    />
  );
}
```

### **Tween Animation**

```typescript
// Tween for precise timing
export function TweenAnimation() {
  return (
    <motion.div
      className="w-20 h-20 bg-red-500 rounded"
      animate={{ rotate: 360 }}
      transition={{
        type: 'tween',
        duration: 2,
        ease: 'easeInOut'
      }}
    />
  );
}
```

### **Keyframes Animation**

```typescript
// Keyframes for complex animations
export function KeyframeAnimation() {
  return (
    <motion.div
      className="w-20 h-20 bg-yellow-500 rounded"
      animate={{
        scale: [1, 1.2, 1, 1.2, 1],
        rotate: [0, 0, 180, 180, 360],
        borderRadius: ['20%', '20%', '50%', '50%', '20%']
      }}
      transition={{
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatDelay: 1
      }}
    />
  );
}
```

## Gesture System

### **Pan Gesture**

```typescript
// src/components/PanGesture.tsx
import { motion, useAnimation } from 'framer-motion';
import { useState } from 'react';

export function PanGesture() {
  const [x, setX] = useState(0);
  const controls = useAnimation();

  const handlePan = (event: any, info: any) => {
    setX(x + info.delta.x);
  };

  const handlePanEnd = () => {
    controls.start({
      x: 0,
      transition: { type: 'spring', stiffness: 300 }
    });
    setX(0);
  };

  return (
    <motion.div
      className="w-32 h-32 bg-indigo-500 rounded-lg cursor-grab active:cursor-grabbing"
      style={{ x }}
      drag="x"
      dragConstraints={{ left: -200, right: 200 }}
      onPan={handlePan}
      onPanEnd={handlePanEnd}
      animate={controls}
    >
      <div className="flex items-center justify-center h-full text-white">
        Pan me
      </div>
    </motion.div>
  );
}
```

### **Tap Gesture**

```typescript
// src/components/TapGesture.tsx
import { motion } from 'framer-motion';

export function TapGesture() {
  return (
    <motion.div
      className="w-24 h-24 bg-pink-500 rounded-full cursor-pointer"
      whileTap={{
        scale: 0.9,
        rotate: -10,
        transition: { duration: 0.1 }
      }}
      onTap={() => console.log('Tapped!')}
    >
      <div className="flex items-center justify-center h-full text-white">
        Tap me
      </div>
    </motion.div>
  );
}
```

## SVG Animations

### **Path Animation**

```typescript
// src/components/AnimatedPath.tsx
import { motion } from 'framer-motion';

export function AnimatedPath() {
  const pathLength = useMotionValue(0);
  const opacity = useSpring(useTransform(pathLength, [0, 1], [0.2, 1]));

  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      <motion.path
        d="M 50 50 L 150 50 L 150 150 L 50 150 Z"
        stroke="#3b82f6"
        strokeWidth="4"
        fill="none"
        style={{ pathLength, opacity }}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
    </svg>
  );
}
```

### **Morphing Animation**

```typescript
// src/components/MorphingShape.tsx
import { motion } from 'framer-motion';

export function MorphingShape() {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      <motion.path
        d="M 100 50 L 150 100 L 100 150 L 50 100 Z"
        fill="#8b5cf6"
        animate={{
          d: [
            'M 100 50 L 150 100 L 100 150 L 50 100 Z', // Diamond
            'M 100 40 L 160 100 L 100 160 L 40 100 Z', // Larger diamond
            'M 100 30 L 170 100 L 100 170 L 30 100 Z', // Even larger
            'M 100 50 L 150 100 L 100 150 L 50 100 Z', // Back to original
          ]
        }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          repeat: Infinity
        }}
      />
    </svg>
  );
}
```

## Performance Optimization

### **GPU Acceleration**

```typescript
// Use transform and opacity for GPU acceleration
export function OptimizedAnimation() {
  return (
    <motion.div
      className="w-20 h-20 bg-blue-500"
      animate={{
        // Good: GPU-accelerated properties
        x: 100,
        y: 50,
        scale: 1.2,
        opacity: 0.8,
        rotate: 45,
        
        // Avoid: CPU-intensive properties
        // width: 200,  // Use scale instead
        // height: 200, // Use scale instead
        // backgroundColor: 'red', // Use sparingly
      }}
      transition={{ duration: 0.5 }}
    />
  );
}
```

### **Reduced Motion Support**

```typescript
// Respect user's motion preferences
export function AccessibleAnimation() {
  return (
    <motion.div
      className="w-20 h-20 bg-green-500"
      animate={{
        x: 100,
        opacity: 1
      }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 10
      }}
      whileHover={{
        scale: 1.05
      }}
      style={{
        // Framer Motion automatically handles prefers-reduced-motion
        // but you can customize the behavior
      }}
    />
  );
}
```

### **Animation Performance**

```typescript
// Use useReducedMotion for custom handling
import { useReducedMotion } from 'framer-motion';

export function PerformanceOptimized() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="w-20 h-20 bg-purple-500"
      animate={{
        x: shouldReduceMotion ? 0 : 100,
        scale: shouldReduceMotion ? 1 : 1.1
      }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: shouldReduceMotion ? 'linear' : 'easeInOut'
      }}
    />
  );
}
```

## Testing

### **Animation Testing**

```typescript
// src/components/AnimatedBox.test.tsx
import { render, screen } from '@testing-library/react';
import { AnimatedBox } from './AnimatedBox';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('AnimatedBox', () => {
  it('should render the box', () => {
    render(<AnimatedBox />);
    expect(screen.getByRole('generic')).toBeInTheDocument();
  });

  it('should apply initial styles', () => {
    render(<AnimatedBox />);
    const box = screen.getByRole('generic');
    expect(box).toHaveClass('w-20', 'h-20', 'bg-blue-500');
  });
});
```

### **Gesture Testing**

```typescript
// src/components/DraggableCard.test.tsx
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DraggableCard } from './DraggableCard';

describe('DraggableCard', () => {
  it('should handle drag start', async () => {
    render(<DraggableCard />);
    const card = screen.getByText(/drag me/i);
    
    await userEvent.pointer({ keys: '[MouseLeft]', target: card });
    
    expect(screen.getByText(/dragging/i)).toBeInTheDocument();
  });
});
```

## Integration Patterns

### **With React Router**

```typescript
// src/components/AnimatedPage.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0, x: -100 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 100 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

export function AnimatedPage({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

### **With State Management**

```typescript
// src/components/AnimatedNotification.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

const notificationVariants = {
  initial: { opacity: 0, y: -50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 }
};

export function AnimatedNotification() {
  const notifications = useSelector((state: any) => state.notifications);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification: any) => (
          <motion.div
            key={notification.id}
            className="p-4 bg-white rounded-lg shadow-lg"
            variants={notificationVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {notification.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
```

## Best Practices

### **Animation Principles**

1. **Purposeful Animations**: Every animation should have a purpose
2. **Performance First**: Use GPU-accelerated properties
3. **Accessibility**: Respect prefers-reduced-motion
4. **Consistency**: Maintain consistent timing and easing
5. **Subtlety**: Less is often more with animations

### **Code Organization**

```typescript
// Good: Organize animation logic
const animationConfig = {
  variants: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },
  transition: {
    duration: 0.3,
    ease: 'easeOut'
  }
};

export function OrganizedComponent() {
  return (
    <motion.div
      variants={animationConfig.variants}
      transition={animationConfig.transition}
      initial="hidden"
      animate="visible"
    >
      Content
    </motion.div>
  );
}
```

### **Performance Guidelines**

```typescript
// Good: Use transform and opacity
<motion.div
  animate={{ scale: 1.2, opacity: 0.8 }}
  transition={{ duration: 0.3 }}
/>

// Avoid: Expensive properties
<motion.div
  animate={{ width: 200, height: 200 }} // Use scale instead
  transition={{ duration: 0.3 }}
/>
```

## Troubleshooting

### **Common Issues**

#### **Animation Not Working**
```typescript
// Problem: Animation not triggering
// Solution: Ensure proper key prop and component structure
<AnimatePresence mode="wait">
  <motion.div
    key={item.id} // Ensure unique key
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {content}
  </motion.div>
</AnimatePresence>
```

#### **Performance Issues**
```typescript
// Problem: Janky animations
// Solution: Use GPU-accelerated properties
<motion.div
  animate={{ x: 100, scale: 1.2 }} // Good: transform properties
  // Avoid: width, height, backgroundColor
/>
```

#### **Layout Thrashing**
```typescript
// Problem: Layout shifts during animation
// Solution: Use layout prop for layout animations
<motion.div
  layout // Automatically handles layout changes
  className="card"
>
  {content}
</motion.div>
```

### **Debugging Tools**

```typescript
// Enable debug mode
<motion.div
  animate={{ x: 100 }}
  transition={{ duration: 0.5 }}
  style={{ originX: 0.5, originY: 0.5 }}
  // Add these for debugging
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  drag="x"
  onDragStart={() => console.log('Drag started')}
  onDragEnd={() => console.log('Drag ended')}
/>
```

## Migration Guide

### **From v11 to v12**

```typescript
// v11
import { motion } from 'framer-motion';

// v12 (same import, but new features)
import { motion } from 'framer-motion';

// New features in v12
const newFeatures = {
  // Improved performance
  // Better TypeScript support
  // New animation APIs
  // Enhanced gesture system
};
```

### **From CSS Animations**

```css
/* Before: CSS animations */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

```typescript
// After: Framer Motion
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3, ease: 'easeInOut' }}
/>
```

## Resources

### **Official Documentation**
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [API Reference](https://www.framer.com/motion/api/)
- [Examples](https://www.framer.com/motion/examples/)

### **Community Resources**
- [Framer Community](https://www.framer.com/community/)
- [GitHub Discussions](https://github.com/framer/motion/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/framer-motion)

### **Tools and Extensions**
- [Framer for Design](https://www.framer.com/)
- [Motion DevTools](https://chrome.google.com/webstore/detail/motion-devtools/)
- [React Spring](https://www.react-spring.dev/) (Alternative)
