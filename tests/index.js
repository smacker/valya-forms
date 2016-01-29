import './form';
import './validator';

if (typeof window === 'undefined') {
    /* eslint no-console: 0 */
    console.log('!!! Integration tests could be run only in browser');
    console.log('----');
} else {
    require('./integration');
}
