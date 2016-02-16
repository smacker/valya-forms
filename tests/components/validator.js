import Valya from 'valya';
import { ValidatorWrapper } from '../../src/index';

export default ValidatorWrapper(Valya(function(props) {
    return props.children;
}));
