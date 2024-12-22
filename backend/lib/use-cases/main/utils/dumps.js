export function dumpContext(user, useragent) {
    return {
        userId : user.id,
        useragent
    };
}

export function dumpUser(user) {
    return {
        name           : user.name,
        email          : user.email,
        defaultAccount : user.defaultAccount,
        isTokenSaved   : user.isTokenSaved
    };
}
