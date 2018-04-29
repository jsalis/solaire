
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
			jsnext: true,
			browser: true
		}),
		commonjs(),
		babel({
			presets: [['es2015', { 'modules': false }]],
			plugins: ['external-helpers']
		})
	]
};
