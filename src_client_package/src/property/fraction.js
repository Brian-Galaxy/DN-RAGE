import Container from '../modules/data';
import methods from '../modules/methods';
import enums from '../enums';

let fraction = {};

fraction.getData = async function(id) {
    return await Container.Data.GetAll(enums.offsets.fraction + methods.parseInt(id));
};

export default fraction;