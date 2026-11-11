import { QueryFailedError } from "typeorm";

export function isDuplicateKey(error: unknown): boolean {
    if (!(error instanceof QueryFailedError)) {
        return false;
    }

    const driverError: unknown = error.driverError;
    return (
        typeof driverError === "object" &&
        driverError !== null &&
        "code" in driverError &&
        driverError.code === "ER_DUP_ENTRY"
    );
}
