
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {

	input: 'src/index.js',
	name: 'solaire',
	output: [{
		format: 'cjs',
		file: 'dist/solaire.js'
	}, {
		format: 'es',
		file: 'dist/solaire.module.js'
	}],
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
