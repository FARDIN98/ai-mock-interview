/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Health check endpoint for Docker container monitoring
export async function GET(request: NextRequest) {
  try {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        database: await checkDatabase(),
        filesystem: await checkFilesystem(),
        memory: checkMemory(),
        volumes: await checkVolumes()
      }
    };

    // Determine overall health status
    const allChecksHealthy = Object.values(healthData.checks).every(
      check => check.status === 'healthy'
    );

    if (!allChecksHealthy) {
      healthData.status = 'unhealthy';
      return NextResponse.json(healthData, { status: 503 });
    }

    return NextResponse.json(healthData, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Check database connectivity (Firebase)
async function checkDatabase() {
  try {
    // Simple check - verify Firebase environment variables
    const requiredEnvVars = [
      'FIREBASE_PROJECT_ID',
      'FIREBASE_CLIENT_EMAIL',
      'FIREBASE_PRIVATE_KEY'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return {
        status: 'unhealthy',
        message: `Missing environment variables: ${missingVars.join(', ')}`,
        timestamp: new Date().toISOString()
      };
    }

    return {
      status: 'healthy',
      message: 'Firebase configuration present',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Database check failed',
      timestamp: new Date().toISOString()
    };
  }
}

// Check filesystem access
async function checkFilesystem() {
  try {
    const testPaths = [
      '/app/data',
      '/app/logs',
      '/app/public/uploads'
    ];

    const checks = await Promise.all(
      testPaths.map(async (testPath) => {
        try {
          await fs.access(testPath);
          return { path: testPath, accessible: true };
        } catch {
          // Try to create directory if it doesn't exist
          try {
            await fs.mkdir(testPath, { recursive: true });
            return { path: testPath, accessible: true, created: true };
          } catch {
            return { path: testPath, accessible: false };
          }
        }
      })
    );

    const inaccessiblePaths = checks.filter(check => !check.accessible);
    
    if (inaccessiblePaths.length > 0) {
      return {
        status: 'unhealthy',
        message: `Inaccessible paths: ${inaccessiblePaths.map(p => p.path).join(', ')}`,
        details: checks,
        timestamp: new Date().toISOString()
      };
    }

    return {
      status: 'healthy',
      message: 'All filesystem paths accessible',
      details: checks,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Filesystem check failed',
      timestamp: new Date().toISOString()
    };
  }
}

// Check memory usage
function checkMemory() {
  try {
    const memUsage = process.memoryUsage();
    const totalMemory = memUsage.heapTotal;
    const usedMemory = memUsage.heapUsed;
    const memoryUsagePercent = (usedMemory / totalMemory) * 100;

    // Consider unhealthy if memory usage > 90%
    const isHealthy = memoryUsagePercent < 90;

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      message: `Memory usage: ${memoryUsagePercent.toFixed(2)}%`,
      details: {
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
        external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
        rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Memory check failed',
      timestamp: new Date().toISOString()
    };
  }
}

// Check Docker volumes
async function checkVolumes() {
  try {
    const volumePaths = [
      '/app/data',
      '/app/logs',
      '/app/public/uploads',
      '/app/backups',
      '/app/ssl'
    ];

    const volumeChecks = await Promise.all(
      volumePaths.map(async (volumePath) => {
        try {
          const stats = await fs.stat(volumePath);
          return {
            path: volumePath,
            exists: true,
            isDirectory: stats.isDirectory(),
            size: stats.size
          };
        } catch {
          return {
            path: volumePath,
            exists: false,
            isDirectory: false,
            size: 0
          };
        }
      })
    );

    const missingVolumes = volumeChecks.filter(check => !check.exists);
    
    if (missingVolumes.length > 0) {
      return {
        status: 'warning',
        message: `Missing volume directories: ${missingVolumes.map(v => v.path).join(', ')}`,
        details: volumeChecks,
        timestamp: new Date().toISOString()
      };
    }

    return {
      status: 'healthy',
      message: 'All volume directories accessible',
      details: volumeChecks,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Volume check failed',
      timestamp: new Date().toISOString()
    };
  }
}

// Simple ping endpoint
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { status: 200 });
}