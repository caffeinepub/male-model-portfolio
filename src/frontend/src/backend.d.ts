import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ModelStats {
    height: number;
    hips: number;
    chest: number;
    experience: bigint;
    shoes: number;
    agencyName: string;
    agencyUrl: string;
    waist: number;
}
export interface ContactInfo {
    instagram: string;
    email: string;
    phone: string;
    location: string;
}
export interface Photo {
    id: string;
    blob: ExternalBlob;
    displayOrder: bigint;
    createdAt: bigint;
    caption: string;
    category: PhotoCategory;
}
export enum PhotoCategory {
    commercial = "commercial",
    editorial = "editorial",
    runway = "runway",
    lifestyle = "lifestyle"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addPhoto(photo: Photo): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deletePhoto(id: string): Promise<void>;
    getAllPhotos(): Promise<Array<Photo>>;
    getBio(): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    getContactInfo(): Promise<ContactInfo | null>;
    getModelStats(): Promise<ModelStats | null>;
    getPhoto(id: string): Promise<Photo>;
    getPhotosByCategory(category: PhotoCategory): Promise<Array<Photo>>;
    getSectionOrder(): Promise<Array<string>>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    reorderPhotos(newOrder: Array<string>): Promise<void>;
    updateBio(newBio: string): Promise<void>;
    updateContactInfo(contact: ContactInfo): Promise<void>;
    updateModelStats(stats: ModelStats): Promise<void>;
    updatePhoto(photo: Photo): Promise<void>;
    updateSectionOrder(newOrder: Array<string>): Promise<void>;
}
