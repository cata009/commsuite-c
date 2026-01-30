import { Announcement } from '../types';
import { announcementsData } from '../data/announcementsData';

const NETWORK_DELAY = 500;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const announcementService = {
    getAllAnnouncements: async (): Promise<Announcement[]> => {
        await delay(NETWORK_DELAY);
        return announcementsData;
    },

    getAnnouncements: async (folder: string = 'Inbox', searchQuery?: string): Promise<Announcement[]> => {
        await delay(NETWORK_DELAY);

        let results = announcementsData.filter(a => a.folder === folder);

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            results = results.filter(a =>
                (a.title || '').toLowerCase().includes(query) ||
                (a.preview || '').toLowerCase().includes(query) ||
                (a.content || '').toLowerCase().includes(query)
            );
        }

        return results;
    },

    getAnnouncementById: async (id: string): Promise<Announcement | undefined> => {
        await delay(NETWORK_DELAY);
        return announcementsData.find(a => a.id === id);
    }
};
