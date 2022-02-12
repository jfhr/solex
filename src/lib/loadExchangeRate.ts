export async function loadExchangeRate() {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=eur', {
        headers: {
            accept: 'application/json'
        }
    })
    if (response.ok) {
        const body = await response.json()
        return body.solana?.eur
    }
}