// ============================================================================
// Hashing & Encryption — built-in JS only (no external libs, no `node:crypto`).
//
// Everything below runs on `globalThis.crypto`, the Web Crypto API. It's a
// runtime built-in (all browsers, and Node.js 19+ exposes it globally) —
// unlike Node's `node:crypto` module, it needs no `import`/`require`.
// Node's `node:crypto` (e.g. `createHash`, `createCipheriv`) offers the same
// concepts and is also "built-in" to Node, but it's Node-specific rather than
// a cross-runtime standard, so it isn't used here.
// ============================================================================


// ----------------------------------------------------------------------------
// 1. What is hashing?
//
// A hash function takes input of any size and produces a fixed-size output
// (the "digest"). Key properties:
//   - Deterministic: same input always produces the same output.
//   - One-way: you cannot recover the input from the output.
//   - Avalanche effect: a 1-bit change in input flips ~half the output bits.
//   - Collision-resistant (crypto hashes only): hard to find two inputs that
//     hash to the same output.
//
// Hashing is NOT encryption — there is no key, and it is not meant to be
// reversed. Use cases: integrity checks, dedup, hash tables, password storage
// (with extra care — see section 3).
//
// Below is a tiny NON-cryptographic hash (djb2), the kind you'd write from
// scratch in an interview when asked to "design a hash function" for a hash
// table. It's fast and has decent distribution, but it's trivially reversible
// in spirit and not collision-resistant — never use it for security.
// ----------------------------------------------------------------------------

function djb2Hash(input: string): number {
    let hash = 5381;

    for (let i = 0; i < input.length; i++) {
        hash = (hash * 33) ^ input.charCodeAt(i);
    }

    return hash >>> 0; // force unsigned 32-bit output
}

// console.log(djb2Hash("hello"));
// console.log(djb2Hash("hellp")); // one char off -> wildly different output (avalanche)


// ----------------------------------------------------------------------------
// 2. Cryptographic hashing with the Web Crypto API
//
// `crypto.subtle.digest` only works on binary data (`ArrayBuffer`/typed
// array), so we encode the string first and hex-encode the digest for a
// readable result. This is the shape of code you'd use for "hash this string
// with SHA-256" in an interview.
// ----------------------------------------------------------------------------

function bufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}

async function sha256Hex(message: string): Promise<string> {
    const data = new TextEncoder().encode(message);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return bufferToHex(digest);
}

// console.log(await sha256Hex("hello"));
// console.log(await sha256Hex("hello")); // same input -> same digest (deterministic)


// ----------------------------------------------------------------------------
// 3. Why plain hashing isn't enough for passwords
//
// Two problems with `sha256Hex(password)` alone:
//   - Identical passwords produce identical hashes, so a leaked database
//     reveals which users share a password (and enables rainbow-table
//     lookups). Fix: add a random, per-user "salt" to the input before
//     hashing so the same password never hashes the same way twice.
//   - SHA-256 is FAST, which is great for integrity checks but bad for
//     passwords — attackers can brute-force billions of guesses per second.
//     Fix: use a deliberately slow, key-stretching algorithm. PBKDF2 (built
//     into Web Crypto) is the standard "no external lib" answer for this;
//     bcrypt/scrypt/Argon2 are the production-grade choices but need a lib.
// ----------------------------------------------------------------------------

async function hashPasswordPBKDF2(
    password: string,
    salt: Uint8Array<ArrayBuffer>,
    iterations = 100_000,
): Promise<string> {
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        "PBKDF2",
        false,
        ["deriveBits"],
    );

    const derivedBits = await crypto.subtle.deriveBits(
        { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
        keyMaterial,
        256, // output length in bits
    );

    return bufferToHex(derivedBits);
}

// const salt = crypto.getRandomValues(new Uint8Array(16));
// console.log(await hashPasswordPBKDF2("correct horse battery staple", salt));


// ----------------------------------------------------------------------------
// 4. Encoding is NOT encryption
//
// Base64 just re-represents bytes as text — it has no key and anyone can
// reverse it. It's for safely transporting binary data as text (e.g. over
// JSON), not for hiding data. Don't confuse "encoded" with "encrypted".
// ----------------------------------------------------------------------------

function base64Encode(text: string): string {
    return btoa(text);
}

function base64Decode(encoded: string): string {
    return atob(encoded);
}

// console.log(base64Encode("secret"));       // "c2VjcmV0" -- readable to anyone, no key needed
// console.log(base64Decode("c2VjcmV0"));      // "secret"


// ----------------------------------------------------------------------------
// 5. Symmetric encryption: AES-GCM
//
// Encryption is two-way and requires a secret key. AES-GCM is the standard
// built-in choice: it's symmetric (same key encrypts and decrypts) and
// "authenticated" — it produces a tag that detects tampering, so a corrupted
// or attacker-modified ciphertext fails to decrypt instead of silently
// returning garbage (unlike plain AES-CBC).
//
// The IV (initialization vector) must be unique per encryption with the same
// key, but it does NOT need to be secret — it's typically stored/sent
// alongside the ciphertext.
// ----------------------------------------------------------------------------

async function generateAesKey(): Promise<CryptoKey> {
    return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
        "encrypt",
        "decrypt",
    ]);
}

async function aesEncrypt(
    key: CryptoKey,
    plaintext: string,
): Promise<{ iv: Uint8Array<ArrayBuffer>; ciphertext: ArrayBuffer }> {
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV, standard for GCM
    const ciphertext = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        new TextEncoder().encode(plaintext),
    );
    return { iv, ciphertext };
}

async function aesDecrypt(
    key: CryptoKey,
    iv: Uint8Array<ArrayBuffer>,
    ciphertext: ArrayBuffer,
): Promise<string> {
    const plainBuffer = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
    return new TextDecoder().decode(plainBuffer);
}

// const aesKey = await generateAesKey();
// const { iv, ciphertext } = await aesEncrypt(aesKey, "attack at dawn");
// console.log(bufferToHex(ciphertext));                 // unreadable without the key
// console.log(await aesDecrypt(aesKey, iv, ciphertext)); // "attack at dawn"


// ----------------------------------------------------------------------------
// 6. Asymmetric encryption: RSA (brief)
//
// Asymmetric encryption uses a key PAIR: a public key (safe to share, used to
// encrypt) and a private key (kept secret, used to decrypt). This solves the
// symmetric-key problem of "how do two parties agree on a secret key without
// ever meeting" — you can publish your public key openly.
//
// Trade-off: RSA is much slower than AES and can only encrypt small messages
// (bounded by key size). In practice (e.g. TLS/HTTPS), it's used in a
// "hybrid" scheme: RSA encrypts a random AES key, then AES encrypts the
// actual data. This is why interview answers should mention hybrid
// encryption rather than "just use RSA for everything".
// ----------------------------------------------------------------------------

type RsaKeyPair = { publicKey: CryptoKey; privateKey: CryptoKey };

async function generateRsaKeyPair(): Promise<RsaKeyPair> {
    return crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"],
    );
}

// const { publicKey, privateKey } = await generateRsaKeyPair();
// const rsaCiphertext = await crypto.subtle.encrypt(
//     { name: "RSA-OAEP" },
//     publicKey,
//     new TextEncoder().encode("small secret"),
// );
// const rsaPlainBuffer = await crypto.subtle.decrypt({ name: "RSA-OAEP" }, privateKey, rsaCiphertext);
// console.log(new TextDecoder().decode(rsaPlainBuffer)); // "small secret"


// ----------------------------------------------------------------------------
// 7. Quick comparison
//
// | Technique            | Reversible?        | Key needed?         | Typical use                          |
// |-----------------------|---------------------|-----------------------|----------------------------------------|
// | Hashing (SHA-256)     | No                  | No                    | Integrity checks, dedup, hash tables    |
// | Salted+slow (PBKDF2)  | No                  | No (uses salt, not key)| Password storage                        |
// | Encoding (Base64)     | Yes, by anyone      | No                    | Safely transport binary data as text    |
// | Symmetric (AES-GCM)   | Yes, with the key   | One shared secret key | Bulk data encryption                    |
// | Asymmetric (RSA)      | Yes, with priv. key | Public/private pair   | Key exchange, signatures, small payloads|
// ----------------------------------------------------------------------------


// ----------------------------------------------------------------------------
// 8. Interview crib notes
//
// Q: Difference between hashing and encryption?
// A: Hashing is one-way and keyless (verify/compare, never recover). Encryption
//    is two-way and keyed (recover the original with the right key).
//
// Q: Why not store passwords as SHA-256(password)?
// A: Fast + unsalted -> vulnerable to rainbow tables and brute force. Use a
//    per-user salt plus a slow, key-stretching hash (PBKDF2/bcrypt/scrypt).
//
// Q: What is a salt, exactly?
// A: Random data mixed into the input before hashing, stored alongside the
//    hash (not secret). It guarantees identical inputs produce different
//    hashes, defeating precomputed rainbow-table attacks.
//
// Q: Symmetric vs asymmetric encryption?
// A: Symmetric: one shared key, fast, used for bulk data (AES). Asymmetric:
//    public/private key pair, slower, used for key exchange and signatures
//    (RSA). Real systems (TLS) combine both: asymmetric to exchange a key,
//    symmetric to encrypt the actual data.
//
// Q: Why AES-GCM over AES-CBC?
// A: GCM is "authenticated encryption" — it detects tampering via a built-in
//    auth tag. CBC alone provides no integrity check, so a modified
//    ciphertext can decrypt to corrupted data without any error.
// ----------------------------------------------------------------------------


async function demo() {
    console.log("djb2('hello') =", djb2Hash("hello"));
    console.log("sha256('hello') =", await sha256Hex("hello"));

    const salt = crypto.getRandomValues(new Uint8Array(16));
    console.log("pbkdf2(password) =", await hashPasswordPBKDF2("correct horse battery staple", salt));

    console.log("base64 =", base64Encode("secret"), "->", base64Decode(base64Encode("secret")));

    const aesKey = await generateAesKey();
    const { iv, ciphertext } = await aesEncrypt(aesKey, "attack at dawn");
    console.log("aes ciphertext (hex) =", bufferToHex(ciphertext));
    console.log("aes decrypted =", await aesDecrypt(aesKey, iv, ciphertext));

    const { publicKey, privateKey } = await generateRsaKeyPair();
    const rsaCiphertext = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        new TextEncoder().encode("small secret"),
    );
    const rsaPlainBuffer = await crypto.subtle.decrypt({ name: "RSA-OAEP" }, privateKey, rsaCiphertext);
    console.log("rsa decrypted =", new TextDecoder().decode(rsaPlainBuffer));
}

// await demo();
