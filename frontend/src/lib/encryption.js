import CryptoJS from "crypto-js";

/**
 * Generate a conversation-specific encryption key
 * Both users in a conversation will generate the same key
 * @param {string} userId1 - First user ID
 * @param {string} userId2 - Second user ID
 * @param {string} secret - Application secret (should match backend)
 * @returns {string} - Encryption key for this conversation
 */
export const generateConversationKey = (userId1, userId2, secret = "YOUR_SECRET_KEY") => {
    // Sort IDs to ensure both users generate the same key
    const sortedIds = [userId1, userId2].sort();
    const combinedString = `${sortedIds[0]}-${sortedIds[1]}-${secret}`;

    // Generate SHA256 hash as the encryption key
    return CryptoJS.SHA256(combinedString).toString();
};

/**
 * Encrypt a message using AES encryption
 * @param {string} message - Plain text message to encrypt
 * @param {string} conversationKey - Encryption key for this conversation
 * @returns {object} - Object containing encrypted message and IV
 */
export const encryptMessage = (message, conversationKey) => {
    if (!message) return { encrypted: "", iv: "" };

    // Generate a random initialization vector
    const iv = CryptoJS.lib.WordArray.random(16);

    // Encrypt the message
    const encrypted = CryptoJS.AES.encrypt(message, conversationKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return {
        encrypted: encrypted.toString(),
        iv: iv.toString()
    };
};

/**
 * Decrypt a message using AES decryption
 * @param {string} encryptedMessage - Encrypted message
 * @param {string} conversationKey - Encryption key for this conversation
 * @param {string} ivString - Initialization vector used during encryption
 * @returns {string} - Decrypted plain text message
 */
export const decryptMessage = (encryptedMessage, conversationKey, ivString) => {
    if (!encryptedMessage || !ivString) return "";

    try {
        // Parse the IV from string
        const iv = CryptoJS.enc.Hex.parse(ivString);

        // Decrypt the message
        const decrypted = CryptoJS.AES.decrypt(encryptedMessage, conversationKey, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        // Convert to UTF-8 string
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error("Decryption error:", error);
        return "[Unable to decrypt message]";
    }
};
