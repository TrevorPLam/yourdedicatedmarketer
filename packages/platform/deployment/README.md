# @agency/deployment

Platform deployment package supporting Vercel, Netlify, Cloudflare Pages with
zero-downtime deployments, environment management, and real-time monitoring.

## Features

- **Multi-Platform Support**: Vercel, Netlify, Cloudflare Pages, and custom
  providers
- **Zero-Downtime Deployments**: Blue-green, canary, and rolling deployment
  strategies
- **Environment Management**: Centralized configuration with validation and
  secrets management
- **Real-time Monitoring**: Health checks, alerts, and deployment metrics
- **Type-Safe**: Full TypeScript support with comprehensive type definitions
- **Extensible**: Plugin architecture for custom deployment adapters

## Installation

```bash
pnpm add @agency/deployment
```

## Quick Start

### Basic Deployment

```typescript
import { quickDeploy } from '@agency/deployment';

// Deploy to Vercel
const result = await quickDeploy('vercel', {
  provider: 'vercel',
  projectId: 'your-project-id',
  environment: 'production',
  buildCommand: 'npm run build',
  outputDirectory: 'dist',
});

console.log(`Deployment ready at: ${result.url}`);
```

### Using the Deployment Manager

```typescript
import { createDeploymentManager } from '@agency/deployment';

const manager = createDeploymentManager({
  environments: {
    environments: {
      production: {
        name: 'production',
        branch: 'main',
        variables: {
          NODE_ENV: 'production',
          API_URL: 'https://api.example.com',
        },
        secrets: {
          DATABASE_URL: 'your-database-url',
        },
        protected: true,
        deploymentConfig: {
          provider: 'vercel',
          projectId: 'your-project-id',
        },
      },
    },
  },
  monitoring: {
    alertThresholds: {
      errorRate: 5,
      responseTime: 5000,
    },
    healthCheckInterval: 30000,
    enableRealTimeMonitoring: true,
  },
});

// Deploy to production
const deployment = await manager.deploy('production', {
  message: 'Deploy new features',
});

// Monitor deployment
manager.subscribe(['deployment.ready', 'deployment.failed'], (event) => {
  console.log(`Deployment ${event.type}: ${event.deploymentId}`);
});
```

## Architecture

### Core Components

1. **DeploymentAdapter Interface**: Provider-agnostic deployment operations
2. **Platform Adapters**: Vercel, Netlify, Cloudflare Pages implementations
3. **Environment Manager**: Configuration and secrets management
4. **Deployment Monitor**: Real-time monitoring and alerting
5. **Factory Pattern**: Adapter creation and validation

### Deployment Flow

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Deployment      │    │ Environment      │    │ Platform        │
│ Manager         │───▶│ Manager          │───▶│ Adapter         │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │ Secrets         │    │ Provider API    │
                       │ Manager         │    │ (Vercel/Netlify)│
                       └─────────────────┘    └─────────────────┘
```

## Configuration

### Environment Configuration

```typescript
interface EnvironmentDefinition {
  name: string;
  branch: string;
  url?: string;
  variables: Record<string, EnvironmentVariable>;
  secrets: Record<string, EnvironmentVariable>;
  protected?: boolean;
  deploymentConfig?: Partial<DeploymentConfig>;
  providers?: Record<string, ProviderConfig>;
}
```

### Provider Configuration

#### Vercel

```typescript
const vercelConfig: VercelConfig = {
  provider: 'vercel',
  projectId: 'your-project-id',
  teamId: 'your-team-id', // optional
  framework: 'nextjs',
  buildCommand: 'npm run build',
  outputDirectory: '.next',
  environmentVariables: {
    NODE_ENV: 'production',
  },
  functions: {
    'api/hello': {
      runtime: 'nodejs20.x',
      memory: 1024,
      maxDuration: 10,
    },
  },
};
```

#### Netlify

```typescript
const netlifyConfig: NetlifyConfig = {
  provider: 'netlify',
  siteId: 'your-site-id',
  buildCommand: 'npm run build',
  publishDir: 'dist',
  functionsDir: 'netlify/functions',
  environmentVariables: {
    NODE_ENV: 'production',
  },
};
```

#### Cloudflare Pages

```typescript
const cloudflareConfig: CloudflareConfig = {
  provider: 'cloudflare',
  accountId: 'your-account-id',
  projectName: 'your-project-name',
  buildCommand: 'npm run build',
  outputDir: 'dist',
  compatibilityDate: '2024-01-01',
  environmentVariables: {
    NODE_ENV: 'production',
  },
};
```

## Monitoring and Alerting

### Health Checks

```typescript
// Add health check to deployment
await manager.addHealthCheck(deploymentId, {
  url: 'https://your-app.com',
  expectedStatus: 200,
  timeout: 30000,
  retries: 3,
});

// Perform manual health check
const isHealthy = await manager.healthCheck('production');
```

### Dashboard Data

```typescript
const dashboard = await manager.getDashboardData();
console.log({
  totalDeployments: dashboard.summary.totalDeployments,
  activeDeployments: dashboard.summary.activeDeployments,
  successRate: dashboard.summary.overallHealth,
  averageBuildTime: dashboard.summary.averageBuildTime,
});
```

### Alert Configuration

```typescript
const manager = createDeploymentManager({
  monitoring: {
    alertThresholds: {
      errorRate: 5, // 5%
      responseTime: 5000, // 5 seconds
      buildTime: 10, // 10 minutes
      deploymentTime: 5, // 5 minutes
      costThreshold: 100, // $100
    },
    alertChannels: [
      {
        type: 'webhook',
        config: {
          url: 'https://hooks.slack.com/your-webhook',
        },
        enabled: true,
        severity: 'high',
      },
    ],
  },
});
```

## Advanced Usage

### Custom Deployment Adapter

```typescript
import { BaseDeploymentAdapter } from '@agency/deployment';

class CustomAdapter extends BaseDeploymentAdapter {
  protected async setupProvider(): Promise<void> {
    // Custom provider setup
  }

  protected async executeDeployment(
    deploymentId: string,
    options: DeploymentOptions
  ): Promise<DeploymentResult> {
    // Custom deployment logic
  }

  // Implement other required methods...
}

// Register custom adapter
const factory = DeploymentAdapterFactoryImpl.getInstance();
factory.registerProvider('custom', CustomAdapter);
```

### Rollback Strategies

```typescript
// Automatic rollback on failure
const deployment = await manager.deploy('production', {
  rollbackStrategy: {
    type: 'automatic',
    threshold: 10, // 10% error rate
    timeout: 300000, // 5 minutes
  },
});

// Manual rollback
await manager.rollback('production', previousDeploymentId, {
  type: 'manual',
});
```

### Environment Variables Management

```typescript
// Set variables
await manager.setVariable('production', 'API_URL', 'https://api.example.com');
await manager.setVariable('production', 'DATABASE_URL', 'secret-url', true);

// Get variables
const apiUrl = await manager.getVariable('production', 'API_URL');
const dbUrl = await manager.getVariable('production', 'DATABASE_URL', true);

// Export/import environment configuration
const config = manager.exportEnvironment('production', true); // include secrets
await manager.importEnvironment(config);
```

## Zero-Downtime Deployment Patterns

### Blue-Green Deployment

```typescript
// Blue-green deployment with instant rollback
const deployment = await manager.deploy('production', {
  deploymentStrategy: 'blue-green',
  rollbackStrategy: {
    type: 'automatic',
    threshold: 5,
  },
});
```

### Canary Deployment

```typescript
// Gradual rollout with monitoring
const deployment = await manager.deploy('production', {
  deploymentStrategy: 'canary',
  canaryConfig: {
    initialPercentage: 10,
    incrementPercentage: 10,
    interval: 300000, // 5 minutes
  },
});
```

## Error Handling

```typescript
try {
  const deployment = await manager.deploy('production');
  console.log(`Deployment successful: ${deployment.url}`);
} catch (error) {
  if (error.code === 'VALIDATION_ERROR') {
    console.error('Configuration error:', error.message);
  } else if (error.code === 'DEPLOYMENT_ERROR') {
    console.error('Deployment failed:', error.message);
    // Attempt rollback
    await manager.rollback('production', lastGoodDeployment);
  }
}
```

## API Reference

### Core Interfaces

- `DeploymentAdapter`: Provider-agnostic deployment interface
- `DeploymentConfig`: Configuration for deployment operations
- `DeploymentResult`: Result of deployment operations
- `EnvironmentConfig`: Environment configuration
- `DeploymentMonitor`: Monitoring and alerting interface

### Utility Classes

- `ConfigValidator`: Configuration validation utilities
- `DeploymentResultUtils`: Deployment result utilities
- `EnvironmentUtils`: Environment management utilities
- `PerformanceUtils`: Performance analysis utilities
- `RetryUtils`: Retry logic with exponential backoff

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © Agency Team
