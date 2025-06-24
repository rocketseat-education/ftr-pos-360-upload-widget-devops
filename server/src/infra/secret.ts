import Vault from 'node-vault'

const options: Vault. VaultOptions = {
    apiVersion: process.env.SECRET_API_VERSION,
    endpoint: process.env.SECRET_API_ENDPOINT,
    token: process.env.SECRET_API_TOKEN
}

export default Vault(options)