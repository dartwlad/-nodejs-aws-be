export const basicAuthorizer = async (event, _ctx, cb) => {
    console.log('about to authorize', event);

    if (event['type'] !== 'TOKEN') {
        cb('Unauthorized');
    }

    try {
        const authorizationToken = event.authorizationToken;
        const encodedCredentials = authorizationToken.split(' ')[1];
        const buff = Buffer.from(encodedCredentials, 'base64');
        const plainCredentials = buff.toString('utf-8').split(':');
        const username = plainCredentials[0];
        const password = plainCredentials[1];

        console.log(`username: ${username}, password: ${password}`);

        const storedPassword = process.env[username];
        const effect = !storedPassword || storedPassword !== password
            ? 'Deny'
            : 'Allow';
        const policy = generatePolicy(encodedCredentials, event.methodArn, effect);

        console.log('policy', policy);
        cb(null, policy);
    } catch (error) {
        console.log('error', error);
        cb('Unauthorized');
    }
}

const generatePolicy = (principalId, Resource, Effect = 'Allow') => {
    return {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect,
                Resource
            }]
        }
    };
}
