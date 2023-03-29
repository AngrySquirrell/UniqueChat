import { Record as pRecord } from "pocketbase";

export interface messageFormat extends pRecord {
    authorName: string;
    authorID: string;
    content: string;
};
export interface UserAgent {
    username: string;
    id: string;
}
export interface messageData {
    id: string;
    collectionId: string;
    collectionName: string;
    created: string;
    updated: string;
    authorName: string;
    authorID: string;
    content: string;
}