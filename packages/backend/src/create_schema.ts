import schema_generator from "./schema_generator";
import {models} from "./schemas.config";

models.forEach(schema_generator);

// schema_generator(models[1]);
