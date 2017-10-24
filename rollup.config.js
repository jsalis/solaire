
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {

	entry: 'src/index.js',
	targets: [{
		format: 'cjs',
		dest: 'dist/solaire.js'
	}, {
		format: 'es',
		dest: 'dist/solaire.module.js'
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
