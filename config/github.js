module.exports = {
    client_id: '9256f033c59516d93ef7',
    client_secret: '8023d969030a07dc07d69e1c55b1085eb8d887eb',
    scope: ['user', 'repo', 'admin:repo_hook'],
    webhookConfig: {
        url: 'http://approve-code.antipenko.pp.ua/webhook',
        content_type: 'json',
        insecure_ssl: 1
    }
};
