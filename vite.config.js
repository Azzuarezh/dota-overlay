import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import {SocketIoServer} from './socketIo/socketIo'
export default defineConfig({
	plugins: [tailwindcss(), sveltekit(),SocketIoServer],
	server:{
		port:3000,
		strictPort:true,
	},
	preview:{
		port:3005,
		strictPort:true
	}
});
