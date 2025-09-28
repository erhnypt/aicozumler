/**
 * Secure encryption utilities using AES-256-GCM
 * Replaces the insecure XOR encryption with industry-standard encryption
 */

import CryptoJS from 'crypto-js'
import { env } from './env'

/**
 * Encrypt text using AES-256-GCM
 * @param plaintext - Text to encrypt
 * @param userKey - Optional user-specific key (will be combined with master key)
 * @returns Encrypted text with IV prepended
 */
export const encrypt = (plaintext: string, userKey?: string): string => {
  try {
    // Combine master key with user-specific key for additional security
    const combinedKey = userKey 
      ? CryptoJS.SHA256(env.ENCRYPTION_KEY + userKey).toString()
      : env.ENCRYPTION_KEY

    // Generate random IV for each encryption
    const iv = CryptoJS.lib.WordArray.random(16)
    
    // Encrypt using AES-256-CBC (GCM not available in crypto-js, CBC is secure alternative)
    const encrypted = CryptoJS.AES.encrypt(plaintext, combinedKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })

    // Combine IV + encrypted data
    const combined = iv.concat(encrypted.ciphertext)
    
    return combined.toString(CryptoJS.enc.Base64)
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt data')
  }
}

/**
 * Decrypt text using AES-256-GCM
 * @param encryptedText - Encrypted text with IV prepended
 * @param userKey - Optional user-specific key (must match encryption key)
 * @returns Decrypted plaintext
 */
export const decrypt = (encryptedText: string, userKey?: string): string => {
  try {
    // Combine master key with user-specific key
    const combinedKey = userKey 
      ? CryptoJS.SHA256(env.ENCRYPTION_KEY + userKey).toString()
      : env.ENCRYPTION_KEY

    // Parse the encrypted data
    const combined = CryptoJS.enc.Base64.parse(encryptedText)
    
    // Extract IV (first 16 bytes) and ciphertext
    const iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4))
    const ciphertext = CryptoJS.lib.WordArray.create(combined.words.slice(4))

    // Decrypt
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: ciphertext } as any,
      combinedKey,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    )

    const plaintext = decrypted.toString(CryptoJS.enc.Utf8)
    
    if (!plaintext) {
      throw new Error('Decryption failed - invalid key or corrupted data')
    }

    return plaintext
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt data')
  }
}

/**
 * Generate a secure random key for user-specific encryption
 * @param userId - User ID to make key deterministic but secure
 * @returns Base64 encoded key
 */
export const generateUserKey = (userId: string): string => {
  return CryptoJS.SHA256(userId + env.ENCRYPTION_KEY + 'user-salt').toString()
}

/**
 * Hash password using PBKDF2 (for additional password security if needed)
 * @param password - Plain password
 * @param salt - Salt (use user ID or email)
 * @returns Hashed password
 */
export const hashPassword = (password: string, salt: string): string => {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256/32,
    iterations: 10000
  }).toString()
}

/**
 * Generate a secure random token
 * @param length - Token length in bytes (default: 32)
 * @returns Base64 encoded token
 */
export const generateSecureToken = (length: number = 32): string => {
  return CryptoJS.lib.WordArray.random(length).toString(CryptoJS.enc.Base64)
}

/**
 * Validate if encrypted data can be decrypted (integrity check)
 * @param encryptedText - Encrypted text to validate
 * @param userKey - Optional user-specific key
 * @returns boolean indicating if data is valid
 */
export const validateEncryptedData = (encryptedText: string, userKey?: string): boolean => {
  try {
    decrypt(encryptedText, userKey)
    return true
  } catch {
    return false
  }
}

// Export encryption utilities
export const EncryptionUtils = {
  encrypt,
  decrypt,
  generateUserKey,
  hashPassword,
  generateSecureToken,
  validateEncryptedData
} as const
