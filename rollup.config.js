
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {

	input: 'src/index.js',
	output: [{
		name: 'solaire',
		format: 'cjs',
		file: 'dist/solaire.js'
	}, {
		name: 'solaire',
		format: 'es',
		file: 'dist/solaire.module.js'
	}],
	// external: ['crypto'],
	plugins: [
		nodeResolve({
			browser: true
		}),
		commonjs(),
		babel()
	]
};
