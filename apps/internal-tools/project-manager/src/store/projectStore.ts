'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Types
export interface Project {
  id: string;
  name: string;
  client: string;
  status: 'planning' | 'in-progress' | 'review' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'critical';
  deadline: string;
  startDate: string;
  budget: number;
  actualCost: number;
  progress: number;
  team: TeamMember[];
  tasks: Task[];
  milestones: Milestone[];
  tags: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigneeId?: string;
  dueDate?: string;
  estimatedHours: number;
  actualHours: number;
  dependencies: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  capacity: number; // hours per week
  utilization: number; // current utilization percentage
  skills: string[];
  status: 'active' | 'away' | 'busy';
  hourlyRate: number;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  dueDate: string;
  status: 'upcoming' | 'in-progress' | 'completed' | 'overdue';
  progress: number;
  dependencies: string[];
}

export interface ProjectFilter {
  status?: Project['status'][];
  priority?: Project['priority'][];
  client?: string[];
  team?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ProjectMetrics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  overdueProjects: number;
  totalBudget: number;
  totalActualCost: number;
  averageCompletionRate: number;
  teamUtilization: number;
  upcomingDeadlines: number;
  monthlyRevenue: number;
  budgetVariance: number;
  scheduleVariance: number;
}

// Store interface
interface ProjectStore {
  // State
  projects: Project[];
  teamMembers: TeamMember[];
  selectedProject: Project | null;
  filters: ProjectFilter;
  isLoading: boolean;
  error: string | null;
  metrics: ProjectMetrics | null;

  // Actions
  setProjects: (projects: Project[]) => void;
  setTeamMembers: (teamMembers: TeamMember[]) => void;
  setSelectedProject: (project: Project | null) => void;
  setFilters: (filters: ProjectFilter) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setMetrics: (metrics: ProjectMetrics) => void;

  // Project operations
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Task operations
  addTask: (
    projectId: string,
    task: Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>
  ) => void;
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (projectId: string, taskId: string) => void;

  // Team operations
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;

  // Utility actions
  clearFilters: () => void;
  refreshData: () => Promise<void>;
}

// Create store
export const useProjectStore = create<ProjectStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    projects: [],
    teamMembers: [],
    selectedProject: null,
    filters: {},
    isLoading: false,
    error: null,
    metrics: null,

    // Basic setters
    setProjects: (projects) => set({ projects }),
    setTeamMembers: (teamMembers) => set({ teamMembers }),
    setSelectedProject: (selectedProject) => set({ selectedProject }),
    setFilters: (filters) => set({ filters }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    setMetrics: (metrics) => set({ metrics }),

    // Project operations
    addProject: (projectData) => {
      const newProject: Project = {
        ...projectData,
        id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({
        projects: [...state.projects, newProject],
      }));
    },

    updateProject: (id, updates) => {
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === id
            ? { ...project, ...updates, updatedAt: new Date().toISOString() }
            : project
        ),
        selectedProject:
          state.selectedProject?.id === id
            ? { ...state.selectedProject, ...updates, updatedAt: new Date().toISOString() }
            : state.selectedProject,
      }));
    },

    deleteProject: (id) => {
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== id),
        selectedProject: state.selectedProject?.id === id ? null : state.selectedProject,
      }));
    },

    // Task operations
    addTask: (projectId, taskData) => {
      const newTask: Task = {
        ...taskData,
        projectId,
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                tasks: [...project.tasks, newTask],
                updatedAt: new Date().toISOString(),
              }
            : project
        ),
      }));
    },

    updateTask: (projectId, taskId, updates) => {
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks.map((task) =>
                  task.id === taskId
                    ? { ...task, ...updates, updatedAt: new Date().toISOString() }
                    : task
                ),
                updatedAt: new Date().toISOString(),
              }
            : project
        ),
      }));
    },

    deleteTask: (projectId, taskId) => {
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks.filter((task) => task.id !== taskId),
                updatedAt: new Date().toISOString(),
              }
            : project
        ),
      }));
    },

    // Team operations
    addTeamMember: (memberData) => {
      const newMember: TeamMember = {
        ...memberData,
        id: `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      set((state) => ({
        teamMembers: [...state.teamMembers, newMember],
      }));
    },

    updateTeamMember: (id, updates) => {
      set((state) => ({
        teamMembers: state.teamMembers.map((member) =>
          member.id === id ? { ...member, ...updates } : member
        ),
      }));
    },

    deleteTeamMember: (id) => {
      set((state) => ({
        teamMembers: state.teamMembers.filter((member) => member.id !== id),
      }));
    },

    // Utility actions
    clearFilters: () => set({ filters: {} }),

    refreshData: async () => {
      set({ isLoading: true, error: null });

      try {
        // Simulate API calls
        const [projectsData, teamData, metricsData] = await Promise.all([
          fetchProjects(),
          fetchTeamMembers(),
          fetchMetrics(),
        ]);

        set({
          projects: projectsData,
          teamMembers: teamData,
          metrics: metricsData,
          isLoading: false,
        });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to refresh data',
          isLoading: false,
        });
      }
    },
  }))
);

// Mock API functions (replace with real API calls)
async function fetchProjects(): Promise<Project[]> {
  // Mock implementation
  return [];
}

async function fetchTeamMembers(): Promise<TeamMember[]> {
  // Mock implementation
  return [];
}

async function fetchMetrics(): Promise<ProjectMetrics> {
  // Mock implementation
  return {
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    overdueProjects: 0,
    totalBudget: 0,
    totalActualCost: 0,
    averageCompletionRate: 0,
    teamUtilization: 0,
    upcomingDeadlines: 0,
    monthlyRevenue: 0,
    budgetVariance: 0,
    scheduleVariance: 0,
  };
}
