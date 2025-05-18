import sql from "alasql";
import { bankDataSmall } from "../data/bank-data-small";

sql(`
CREATE TABLE IF NOT EXISTS banks
 (
    age number,
    job string,
    balance number,
    education string,
    marital string,
    _default string,
    housing string,
    loan string,
    contact string,
    day number,
    month string,
    duration number,
    campaign number,
    pdays number,
    previous number,
    poutcome string,
    y string
 )
`);

sql.tables.banks.data = bankDataSmall;

export { sql };
