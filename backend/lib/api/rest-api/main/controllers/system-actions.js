import chista         from '../../chista.js';
import { Activation } from '../../../../use-cases/main/system-actions/Activation.js';

export default {
    activation : chista.makeUseCaseRunner(Activation, req => req.params)
};
