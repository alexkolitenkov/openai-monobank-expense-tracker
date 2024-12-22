import chista      from '../../chista.js';
import { List }    from '../../../../use-cases/main/transactions/List.js';
import { ListAll } from '../../../../use-cases/main/transactions/ListAll.js';

export default {
    list    : chista.makeUseCaseRunner(List, req => ({ ...req.params, ...req.query })),
    listAll : chista.makeUseCaseRunner(ListAll, req => ({ ...req.params, ...req.query }))
};
