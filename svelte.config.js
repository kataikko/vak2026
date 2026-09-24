import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'vak_dev',
			assets: 'vak_dev',
			fallback: undefined,
			precompress: false,
			strict: true
		})
	}
};

export default config;