import { AVMKeyChain, AVMKeyPair } from '@slopes/avm/keychain';
import { Buffer } from 'buffer/';
import createHash from "create-hash";

describe('AVMKeyPair', () => {
    test('repeatable 1', () => {
        let kp:AVMKeyPair = new AVMKeyPair();
        kp.importKey(Buffer.from("ef9bf2d4436491c153967c9709dd8e82795bdb9b5ad44ee22c2903005d1cf676", "hex"));
        expect(kp.getPublicKey().toString("hex")).toBe("033fad3644deb20d7a210d12757092312451c112d04773cee2699fbb59dc8bb2ef");

        let msg:Buffer = Buffer.from(createHash("sha256").update(Buffer.from("09090909", "hex")).digest("hex"), "hex");
        let sig:Buffer = kp.sign(msg);

        expect(sig.length).toBe(65);
        expect(kp.verify(msg, sig)).toBe(true);
        expect(kp.recover(msg, sig).toString("hex")).toBe(kp.getPublicKey().toString("hex"));

    });

    test('repeatable 2', () => {
        let kp:AVMKeyPair = new AVMKeyPair();
        kp.importKey(Buffer.from("17c692d4a99d12f629d9f0ff92ec0dba15c9a83e85487b085c1a3018286995c6", "hex"));
        expect(kp.getPublicKey().toString("hex")).toBe("02486553b276cfe7abf0efbcd8d173e55db9c03da020c33d0b219df24124da18ee");

        let msg:Buffer = Buffer.from(createHash("sha256").update(Buffer.from("09090909", "hex")).digest("hex"), "hex");
        let sig:Buffer = kp.sign(msg);

        expect(sig.length).toBe(65);
        expect(kp.verify(msg, sig)).toBe(true);
        expect(kp.recover(msg, sig).toString("hex")).toBe(kp.getPublicKey().toString("hex"));

    });

    test('repeatable 3', () => {
        let kp:AVMKeyPair = new AVMKeyPair();
        kp.importKey(Buffer.from("d0e17d4b31380f96a42b3e9ffc4c1b2a93589a1e51d86d7edc107f602fbc7475", "hex"));
        expect(kp.getPublicKey().toString("hex")).toBe("031475b91d4fcf52979f1cf107f058088cc2bea6edd51915790f27185a7586e2f2");

        let msg:Buffer = Buffer.from(createHash("sha256").update(Buffer.from("09090909", "hex")).digest("hex"), "hex");
        let sig:Buffer = kp.sign(msg);

        expect(sig.length).toBe(65);
        expect(kp.verify(msg, sig)).toBe(true);
        expect(kp.recover(msg, sig).toString("hex")).toBe(kp.getPublicKey().toString("hex"));

    });

    test('Creation Empty', () => {
        let kp:AVMKeyPair = new AVMKeyPair();
        expect(kp.getPrivateKey()).not.toBeUndefined();
        expect(kp.getAddress()).not.toBeUndefined();
        expect(kp.getPrivateKeyString()).not.toBeUndefined();
        expect(kp.getPublicKey()).not.toBeUndefined();
        expect(kp.getPublicKeyString()).not.toBeUndefined();
        let msg:Buffer = Buffer.from(createHash("sha256").update(Buffer.from("09090909", "hex")).digest("hex"), "hex");
        let sig:Buffer = kp.sign(msg);

        expect(sig.length).toBe(65);
        expect(kp.verify(msg, sig)).toBe(true);
        expect(kp.recover(msg, sig).toString("hex")).toBe(kp.getPublicKey().toString("hex"));
    });
    
});

describe('AVMKeyChain', () => {
    test('importKey', () => {
        let keybuff:Buffer = Buffer.from("d0e17d4b31380f96a42b3e9ffc4c1b2a93589a1e51d86d7edc107f602fbc7475", "hex");
        let kc:AVMKeyChain = new AVMKeyChain();
        let kp2:AVMKeyPair = new AVMKeyPair();
        let addr1:string = kc.importKey(keybuff);
        let kp1:AVMKeyPair = kc.getKey(addr1);
        kp2.importKey(keybuff);
        let addr2 = kp1.getAddress();
        expect(addr1).toBe(addr2);
        expect(kp1.getPrivateKeyString()).toBe(kp2.getPrivateKeyString());
        expect(kp1.getPublicKeyString()).toBe(kp2.getPublicKeyString());
    });
});