'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@agency/ui-components/react';
import { Button } from '@agency/ui-components/react';
import { useAnalytics } from '@agency/analytics';
import { useMonitoring } from '@agency/monitoring';
import {
  Users,
  FileText,
  MessageSquare,
  Calendar,
  Upload,
  Download,
  Search,
  Filter,
  Bell,
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  Share2,
  Lock,
  Clock,
  CheckCircle,
  AlertCircle,
  Paperclip,
  Send,
} from 'lucide-react';
import './ClientPortal.css';

// Types
interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  projects: string[];
  role: 'admin' | 'viewer' | 'editor';
}

interface ProjectUpdate {
  id: string;
  projectId: string;
  title: string;
  content: string;
  type: 'milestone' | 'progress' | 'issue' | 'announcement';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'published' | 'archived';
  author: string;
  createdAt: string;
  publishedAt?: string;
  attachments: Array<{ id: string; name: string; size: number; type: string }>;
  clients: string[]; // Client IDs who can see this
}

interface SharedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  project: string;
  clients: string[];
  permissions: 'view' | 'edit' | 'download';
  downloadCount: number;
  path: string;
}

interface Message {
  id: string;
  clientId: string;
  projectManagerId: string;
  content: string;
  type: 'text' | 'file' | 'system';
  timestamp: string;
  read: boolean;
  attachments?: Array<{ id: string; name: string; size: number }>;
}

// Mock data fetching
async function fetchClients(): Promise<Client[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  return [
    {
      id: 'client-1',
      name: 'Sarah Johnson',
      email: 'sarah@techcorp.com',
      company: 'Tech Corp',
      status: 'active',
      lastLogin: '2026-04-14T10:30:00Z',
      projects: ['project-1', 'project-2'],
      role: 'admin',
    },
    {
      id: 'client-2',
      name: 'Michael Chen',
      email: 'michael@startupxyz.com',
      company: 'StartupXYZ',
      status: 'active',
      lastLogin: '2026-04-13T15:45:00Z',
      projects: ['project-2'],
      role: 'viewer',
    },
    {
      id: 'client-3',
      name: 'Emily Davis',
      email: 'emily@retailco.com',
      company: 'Retail Co',
      status: 'pending',
      lastLogin: '2026-04-10T09:20:00Z',
      projects: ['project-3'],
      role: 'editor',
    },
  ];
}

async function fetchProjectUpdates(): Promise<ProjectUpdate[]> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  return [
    {
      id: 'update-1',
      projectId: 'project-1',
      title: 'Homepage Design Completed',
      content:
        'We are excited to announce that the homepage design has been completed and is ready for review. The design incorporates all the feedback from our initial meetings and follows the latest UI/UX best practices.',
      type: 'milestone',
      priority: 'high',
      status: 'published',
      author: 'John Doe',
      createdAt: '2026-04-14T09:00:00Z',
      publishedAt: '2026-04-14T09:30:00Z',
      attachments: [
        { id: 'file-1', name: 'homepage-mockup.png', size: 2457600, type: 'image/png' },
        { id: 'file-2', name: 'design-specifications.pdf', size: 1024000, type: 'application/pdf' },
      ],
      clients: ['client-1'],
    },
    {
      id: 'update-2',
      projectId: 'project-2',
      title: 'Development Progress Update',
      content:
        'Mobile app development is progressing well. We have completed the authentication module and are now working on the main dashboard. Expected completion by end of next week.',
      type: 'progress',
      priority: 'medium',
      status: 'published',
      author: 'Jane Smith',
      createdAt: '2026-04-13T14:00:00Z',
      publishedAt: '2026-04-13T14:15:00Z',
      attachments: [],
      clients: ['client-1', 'client-2'],
    },
  ];
}

async function fetchSharedFiles(): Promise<SharedFile[]> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  return [
    {
      id: 'file-1',
      name: 'Q1-2026-Report.pdf',
      type: 'application/pdf',
      size: 2048000,
      uploadedBy: 'John Doe',
      uploadedAt: '2026-04-12T11:00:00Z',
      project: 'project-1',
      clients: ['client-1'],
      permissions: 'download',
      downloadCount: 5,
      path: '/files/Q1-2026-Report.pdf',
    },
    {
      id: 'file-2',
      name: 'brand-assets.zip',
      type: 'application/zip',
      size: 5120000,
      uploadedBy: 'Jane Smith',
      uploadedAt: '2026-04-11T16:30:00Z',
      project: 'project-2',
      clients: ['client-1', 'client-2'],
      permissions: 'edit',
      downloadCount: 12,
      path: '/files/brand-assets.zip',
    },
  ];
}

async function fetchMessages(): Promise<Message[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    {
      id: 'msg-1',
      clientId: 'client-1',
      projectManagerId: 'pm-1',
      content: 'Hi John, could you please share the latest design mockups?',
      type: 'text',
      timestamp: '2026-04-14T08:30:00Z',
      read: false,
    },
    {
      id: 'msg-2',
      clientId: 'client-2',
      projectManagerId: 'pm-1',
      content: 'The mobile app looks great! Can we schedule a call to discuss the next features?',
      type: 'text',
      timestamp: '2026-04-13T16:45:00Z',
      read: true,
    },
  ];
}

// Client Card Component
function ClientCard({ client, onSelect }: { client: Client; onSelect: (client: Client) => void }) {
  const getStatusColor = (status: Client['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getRoleIcon = (role: Client['role']) => {
    switch (role) {
      case 'admin':
        return <Settings className="h-4 w-4" />;
      case 'editor':
        return <Edit className="h-4 w-4" />;
      case 'viewer':
        return <Eye className="h-4 w-4" />;
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} className="client-card">
      <Card className="p-6 cursor-pointer" onClick={() => onSelect(client)}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">{client.name}</h3>
              <p className="text-sm text-muted-foreground">{client.company}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {getRoleIcon(client.role)}
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}
            >
              {client.status}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span>{client.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Projects:</span>
            <span>{client.projects.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Login:</span>
            <span>{new Date(client.lastLogin).toLocaleDateString()}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Project Update Card
function ProjectUpdateCard({ update }: { update: ProjectUpdate }) {
  const getTypeIcon = (type: ProjectUpdate['type']) => {
    switch (type) {
      case 'milestone':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'issue':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'announcement':
        return <Bell className="h-4 w-4 text-purple-600" />;
    }
  };

  const getPriorityColor = (priority: ProjectUpdate['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="update-card"
    >
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getTypeIcon(update.type)}
            <div>
              <h3 className="font-medium">{update.title}</h3>
              <p className="text-sm text-muted-foreground">
                By {update.author} • {new Date(update.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(update.priority)}`}
          >
            {update.priority}
          </span>
        </div>

        <p className="text-sm text-gray-700 mb-4 line-clamp-3">{update.content}</p>

        {update.attachments.length > 0 && (
          <div className="flex items-center space-x-2 mb-4">
            <Paperclip className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {update.attachments.length} attachment{update.attachments.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                update.status === 'published'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {update.status}
            </span>
            <span className="text-xs text-muted-foreground">
              Shared with {update.clients.length} client{update.clients.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// File Sharing Component
function FileSharing({ files }: { files: SharedFile[] }) {
  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="h-4 w-4 text-red-600" />;
    if (type.includes('image')) return <Eye className="h-4 w-4 text-green-600" />;
    if (type.includes('zip') || type.includes('rar'))
      return <Lock className="h-4 w-4 text-blue-600" />;
    return <FileText className="h-4 w-4 text-gray-600" />;
  };

  return (
    <div className="space-y-3">
      {files.map((file) => (
        <motion.div
          key={file.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="file-item"
        >
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getFileIcon(file.type)}
                <div>
                  <h4 className="font-medium text-sm">{file.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)} • Uploaded by {file.uploadedBy}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">
                  {file.downloadCount} downloads
                </span>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// Main Client Portal Component
export function ClientPortal() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState<'updates' | 'files' | 'messages'>('updates');
  const { trackEvent } = useAnalytics();
  const { trackError } = useMonitoring();

  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
    refetchInterval: 30000,
  });

  const { data: updates, isLoading: updatesLoading } = useQuery({
    queryKey: ['project-updates'],
    queryFn: fetchProjectUpdates,
    refetchInterval: 30000,
  });

  const { data: files, isLoading: filesLoading } = useQuery({
    queryKey: ['shared-files'],
    queryFn: fetchSharedFiles,
    refetchInterval: 30000,
  });

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: fetchMessages,
    refetchInterval: 30000,
  });

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    trackEvent({
      action: 'client_selected',
      category: 'client_portal',
      label: client.id,
    });
  };

  const filteredUpdates = selectedClient
    ? updates?.filter((update) => update.clients.includes(selectedClient.id))
    : updates;

  const filteredFiles = selectedClient
    ? files?.filter((file) => file.clients.includes(selectedClient.id))
    : files;

  const filteredMessages = selectedClient
    ? messages?.filter((msg) => msg.clientId === selectedClient.id)
    : messages;

  if (clientsLoading || updatesLoading || filesLoading || messagesLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="client-portal">
      <div className="portal-header">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Portal</h1>
          <p className="text-muted-foreground mt-1">
            Manage client relationships, share updates, and collaborate on projects
          </p>
        </div>
        <div className="portal-actions">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="portal-content">
        {/* Client List */}
        <div className="client-list">
          <div className="client-list-header">
            <h2 className="text-lg font-semibold">Clients</h2>
            <div className="client-count">{clients?.length || 0} total</div>
          </div>

          <div className="client-cards">
            <AnimatePresence>
              {clients?.map((client) => (
                <ClientCard key={client.id} client={client} onSelect={handleClientSelect} />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Client Details */}
        <div className="client-details">
          {selectedClient ? (
            <div className="space-y-6">
              <div className="selected-client-header">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{selectedClient.name}</h2>
                    <p className="text-muted-foreground">{selectedClient.company}</p>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="tab-navigation">
                <button
                  className={`tab-button ${activeTab === 'updates' ? 'active' : ''}`}
                  onClick={() => setActiveTab('updates')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Updates
                </button>
                <button
                  className={`tab-button ${activeTab === 'files' ? 'active' : ''}`}
                  onClick={() => setActiveTab('files')}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Files
                </button>
                <button
                  className={`tab-button ${activeTab === 'messages' ? 'active' : ''}`}
                  onClick={() => setActiveTab('messages')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Messages
                </button>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === 'updates' && (
                  <div className="space-y-4">
                    <div className="tab-header">
                      <h3 className="text-lg font-medium">Project Updates</h3>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        New Update
                      </Button>
                    </div>
                    <div className="updates-list">
                      {filteredUpdates?.map((update) => (
                        <ProjectUpdateCard key={update.id} update={update} />
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'files' && (
                  <div className="space-y-4">
                    <div className="tab-header">
                      <h3 className="text-lg font-medium">Shared Files</h3>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload File
                      </Button>
                    </div>
                    <FileSharing files={filteredFiles || []} />
                  </div>
                )}

                {activeTab === 'messages' && (
                  <div className="space-y-4">
                    <div className="tab-header">
                      <h3 className="text-lg font-medium">Messages</h3>
                      <span className="text-sm text-muted-foreground">
                        {filteredMessages?.filter((m) => !m.read).length} unread
                      </span>
                    </div>
                    <div className="messages-list">
                      {filteredMessages?.map((message) => (
                        <Card
                          key={message.id}
                          className={`p-4 ${!message.read ? 'bg-blue-50 border-blue-200' : ''}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(message.timestamp).toLocaleString()}
                              </p>
                            </div>
                            {!message.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a Client</h3>
              <p className="text-muted-foreground text-center">
                Choose a client from the list to view their project updates, shared files, and
                messages.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
