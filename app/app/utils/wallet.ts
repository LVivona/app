import {
  blake2AsHex,
  sr25519PairFromSeed,
  encodeAddress,
  sr25519Sign,
  sr25519Verify,
} from '@polkadot/util-crypto'
import { hexToU8a, u8aToHex } from '@polkadot/util'
import { secp256k1 } from '@noble/curves/secp256k1'

// Define the structure of a wallet object
export interface WalletType {
  address: string
  crypto_type: 'sr25519' | 'ecdsa'
  public_key: string
  private_key: string
}

// Define allowed signature types
type signature_t = 'sr25519' | 'ecdsa'

export class Wallet {
  private private_key: string // Stores the private key of the wallet
  public public_key: string // Stores the public key of the wallet
  public address: string // Stores the wallet's address
  public signiture: signature_t // Defines the signature type used by the wallet

  /**
   * Constructs a new Wallet instance using a password as the seed.
   * @param password - The password used to generate keys.
   * @param signiture - The cryptographic algorithm (default: 'sr25519').
   */
  constructor(password: string, signiture: signature_t = 'sr25519') {
    const { public_key, private_key, address } = this.fromPassword(
      password,
      signiture
    )
    this.public_key = public_key
    this.private_key = private_key
    this.address = address
    this.signiture = signiture
  }

  /**
   * Generates a wallet from a password.
   * @param password - The password used to derive the keypair.
   * @param crypto_type - The cryptographic algorithm (default: 'sr25519').
   * @returns A WalletType object containing address, public_key, and private_key.
   */
  private fromPassword(
    password: string,
    crypto_type: signature_t = 'sr25519'
  ): WalletType {
    if (!password || typeof password !== 'string') {
      throw new Error('Invalid password provided')
    }

    // Derive a seed from the password using Blake2 hashing
    const seedHex = blake2AsHex(password, 256)
    const seedBytes = hexToU8a(seedHex)
    let wallet: WalletType

    if (crypto_type === 'sr25519') {
      // Generate sr25519 keypair
      const keyPair = sr25519PairFromSeed(seedBytes)
      const address = encodeAddress(keyPair.publicKey, 42)

      wallet = {
        address,
        crypto_type: 'sr25519',
        public_key: u8aToHex(keyPair.publicKey),
        private_key: u8aToHex(keyPair.secretKey),
      }
    } else if (crypto_type === 'ecdsa') {
      // Generate ECDSA keypair using secp256k1
      const public_key = secp256k1.getPublicKey(seedHex)

      wallet = {
        address: u8aToHex(public_key),
        crypto_type: 'ecdsa',
        public_key : u8aToHex(public_key),
        private_key: seedHex,
      }
    } else {
      throw new Error('Unsupported crypto type')
    }

    return wallet
  }

  /**
   * Signs a message using the wallet's private key.
   * @param message - The message to sign.
   * @returns A signature string.
   */
  public async sign(message: string): Promise<string> {
    if (!message) {
      throw new Error('Empty message cannot be signed')
    }
    const messageBytes = this.encode(message)

    if (this.signiture === 'sr25519') {
      const signature = sr25519Sign(messageBytes, {
        publicKey: hexToU8a(this.public_key),
        secretKey: hexToU8a(this.private_key),
      })
      return this.decode(signature)
    } else if (this.signiture === 'ecdsa') {
      const messageHash = blake2AsHex(message)
      const signature = secp256k1.sign(
        hexToU8a(messageHash),
        hexToU8a(this.private_key)
      ).toDERRawBytes()
      return this.decode(signature)
    } else {
      throw new Error('Unsupported crypto type')
    }
  }

  /**
   * Verifies a signature against a message and public key.
   * @param message - The original message.
   * @param signature - The signature to verify.
   * @param public_key - The public key corresponding to the private key used for signing.
   * @returns A boolean indicating whether the signature is valid.
   */
  public async verify(
    message: string,
    signature: string,
    public_key: string
  ): Promise<boolean> {
    if (!message || !signature || !public_key) {
      throw new Error('Invalid verification parameters')
    }
    const sigType = this.signiture
    const messageBytes = new TextEncoder().encode(message)

    if (sigType === 'sr25519') {
      return sr25519Verify(
        messageBytes,
        hexToU8a(signature),
        hexToU8a(public_key)
      )
    } else if (sigType === 'ecdsa') {
      const messageHash = blake2AsHex(message)
      return secp256k1.verify(
        hexToU8a(signature),
        hexToU8a(messageHash),
        hexToU8a(public_key)
      )
    } else {
      throw new Error('Unsupported crypto type')
    }
  }

  /**
   * Encodes a string message into a Uint8Array.
   * @param message - The message to encode.
   * @returns A Uint8Array representation of the message.
   */
  encode(message: string): Uint8Array {
    return new Uint8Array(Buffer.from(message))
  }

  /**
   * Decodes a Uint8Array back into a string.
   * @param message - The Uint8Array to decode.
   * @returns A string representation of the message.
   */
  decode(message: Uint8Array): string {
    return Buffer.from(message).toString()
  }
}
