import sql from "$lib/sql";
import {findTransactionSignature, validateTransactionSignature} from "@solana/pay";

import {clusterApiUrl, Connection, PublicKey} from '@solana/web3.js';

export async function post({params}) {
    const [transaction] = await sql`
        select recipient, amount, reference, status, signature 
        from transactions 
        where id = ${params.id} and is_deleted = false`
    if (!transaction) {
        return {status: 404}
    }
    let status = transaction.status
    if (status === 'verified') {
        return {status: 200, body: {status: 'verified', signature: transaction.signature}}
    }

    const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed')
    try {
        const reference = new PublicKey(transaction.reference)
        const recipient = new PublicKey(transaction.recipient)
        const {signature} = await findTransactionSignature(connection, reference)
        status = 'confirmed'
        await sql`
            update transactions 
            set status = 'confirmed', confirmed_by = now(), signature = ${signature} 
            where id = ${params.id}`
        await validateTransactionSignature(connection, signature, recipient, transaction.amount, undefined, reference)
        status = 'verified'
        await sql`
            update transactions 
            set status = 'verified', finalized_by = now() 
            where id = ${params.id}`
        return {status: 200, body: {status, signature}}
    } catch (error) {
        return {status: 200, body: {status}}
    }
}
