const { describe, it, expect, beforeEach } = require('@jest/globals');
const { DePINManager } = require('../src/DePINManager');
const { AkashProvider } = require('../src/providers/AkashProvider');
const { RenderProvider } = require('../src/providers/RenderProvider');

describe('DePIN Infrastructure Integration Tests', () => {
    let depinManager;
    let akashProvider;
    let renderProvider;

    beforeEach(() => {
        akashProvider = new AkashProvider();
        renderProvider = new RenderProvider();
        depinManager = new DePINManager();
    });

    describe('Basic Infrastructure Integration', () => {
        it('should successfully connect to Akash network', async () => {
            const connection = await akashProvider.connect();
            expect(connection.status).toBe('connected');
            expect(connection.networkId).toBeDefined();
        });

        it('should deploy a basic workload to Render Network', async () => {
            const workload = {
                type: 'GPU',
                requirements: {
                    gpuModel: 'NVIDIA A100',
                    memory: '40GB'
                }
            };
            const deployment = await renderProvider.deployWorkload(workload);
            expect(deployment.success).toBe(true);
            expect(deployment.resourceId).toBeDefined();
        });
    });

    describe('Resource Management', () => {
        it('should properly allocate GPU resources', async () => {
            const allocation = await depinManager.allocateResources({
                gpu: true,
                cpuCores: 4,
                memory: '16GB'
            });
            expect(allocation.success).toBe(true);
            expect(allocation.resources).toHaveProperty('gpu');
        });

        it('should monitor resource usage', async () => {
            const metrics = await depinManager.getResourceMetrics('node-001');
            expect(metrics).toHaveProperty('gpuUtilization');
            expect(metrics).toHaveProperty('memoryUsage');
            expect(metrics.timestamp).toBeDefined();
        });
    });

    describe('Network Performance', () => {
        it('should maintain acceptable latency', async () => {
            const latencyTest = await depinManager.measureLatency();
            expect(latencyTest.averageLatency).toBeLessThan(100); // ms
            expect(latencyTest.packetLoss).toBeLessThan(0.1); // %
        });

        it('should handle concurrent deployments', async () => {
            const deployments = await Promise.all([
                depinManager.deploy({ id: 'test1' }),
                depinManager.deploy({ id: 'test2' }),
                depinManager.deploy({ id: 'test3' })
            ]);
            
            deployments.forEach(deployment => {
                expect(deployment.status).toBe('success');
            });
        });
    });
});