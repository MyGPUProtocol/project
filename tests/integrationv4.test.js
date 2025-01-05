import { describe, it, expect, beforeEach } from 'jest';
import TEEManager from '../services/teeManager';
import SecurityAuditor from '../services/securityAuditor';

describe('Tests de Sécurité TEE', () => {
  let teeManager;
  let auditor;

  beforeEach(() => {
    teeManager = new TEEManager();
    auditor = new SecurityAuditor();
  });

  describe('Initialisation Enclave', () => {
    it('devrait initialiser un environnement TEE sécurisé', async () => {
      const enclaveConfig = {
        type: 'SGX',
        securityLevel: 'EAL5+',
        memorySize: '1GB'
      };

      const enclave = await teeManager.initializeEnclave(enclaveConfig);
      const attestation = await teeManager.performAttestation(enclave.id);

      expect(attestation.verified).toBe(true);
      expect(attestation.securityLevel).toEqual('EAL5+');
    });

    it('devrait détecter les tentatives de manipulation', async () => {
      const maliciousCode = {
        type: 'memory_access_violation',
        target: 'enclave_boundary'
      };

      const detectionResult = await auditor.detectTampering(maliciousCode);
      
      expect(detectionResult.detected).toBe(true);
      expect(detectionResult.mitigationApplied).toBe(true);
    });
  });

  describe('Gestion des Secrets', () => {
    it('devrait gérer les clés de manière sécurisée', async () => {
      const keyMaterial = {
        type: 'AES-256',
        usage: 'data_encryption',
        rotation: 'weekly'
      };

      const keyManagement = await teeManager.manageKeys(keyMaterial);
      
      expect(keyManagement.keyGenerated).toBe(true);
      expect(keyManagement.keyStorage).toBe('secure_enclave');
    });
  });
});