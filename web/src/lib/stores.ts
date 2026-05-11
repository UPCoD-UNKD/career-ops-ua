import { writable } from 'svelte/store';
import type { OfferDTO, MetaDTO, StateCountDTO, FileNodeDTO, ChatMessage } from './types';

export const activeState    = writable<string>('all');
export const activeId       = writable<number | null>(null);
export const view           = writable<'report' | 'files'>('report');
export const pipeMode       = writable<'full' | 'compact' | 'hidden'>('full');
export const statsCollapsed = writable<boolean>(false);
export const dockOpen       = writable<boolean>(true);
export const density        = writable<'comfortable' | 'compact'>('comfortable');
export const theme          = writable<'dark' | 'light'>('dark');
export const openPath       = writable<string>('config/profile.yml');
export const dirty          = writable<Record<string, boolean>>({});
export const fileContent    = writable<Record<string, string>>({});

export const offers     = writable<OfferDTO[]>([]);
export const meta       = writable<MetaDTO | null>(null);
export const states     = writable<StateCountDTO[]>([]);
export const files      = writable<FileNodeDTO[]>([]);
export const chatLog    = writable<ChatMessage[]>([
	{
		role: 'assistant',
		content: 'career-ops connected. I can evaluate job openings, generate CVs, or help you refine your pipeline. What would you like to do?'
	}
]);
